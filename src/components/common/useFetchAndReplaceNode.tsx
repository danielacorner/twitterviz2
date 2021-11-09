import { useAtom } from "jotai";
import {
  isTwitterApiUsageExceededAtom,
  serverErrorAtom,
} from "providers/store/store";
import { tweetsFromServerAtom, useTweets } from "providers/store/useSelectors";
import { Tweet } from "types";
import { FILTER_LEVELS, SERVER_URL } from "utils/constants";
import {
  getAllNodesWithBotScoresFromDB,
  shuffle,
} from "components/NavBar/useStreamNewTweets";
import { uniqBy } from "lodash";

/** replace one tweet with a new one from the stream
 *
 * 500 per day https://rapidapi.com/OSoMe/api/botometer-pro/pricing
 */
export function useFetchAndReplaceNode() {
  const numNewTweets = 1;
  // const numNewTweets = Math.round(Math.random() * 2);
  const tweets = useTweets();
  const [tweetsFromServer, setTweetsFromServer] = useAtom(tweetsFromServerAtom);
  // const [selectedNodeId] = useAtom(selectedNodeIdAtom);
  const [isTwitterApiUsageExceeded] = useAtom(isTwitterApiUsageExceededAtom);
  const [, setServerError] = useAtom(serverErrorAtom);

  function setNotABot(node: Tweet) {
    setTweetsFromServer((prev) => {
      console.log("🌟🚨 ~ setNotABot ~ prev", prev);
      return prev
        .filter(Boolean)
        .map((t) =>
          (node.id_str && t.id_str && t.id_str === node.id_str) ||
          (t.id && node.id && t.id === node.id)
            ? {
                ...node,
                isNotABot: true,
                user: { ...node.user, isNotABot: true },
              }
            : t
        )
        .filter(Boolean);
    });
  }

  return async (
    tweet: Tweet
  ): Promise<{
    data: Tweet[];
    error: any;
    msUntilRateLimitReset: number | null;
  }> => {
    console.log("🤖 checking if it's a human 👪");

    if (!tweet) {
      console.log({ error: "no tweet passed!" });
      return {
        data: [],
        error: "no tweet passed!",
        msUntilRateLimitReset: null,
      };
    }
    // set the tweet to "not a bot" immediately
    if (!tweet) {
      console.log("🌟🚨 ~ useFetchAndReplaceNode ~ tweet", tweet);
      return {
        data: tweetsFromServer,
        error: null,
        msUntilRateLimitReset: null,
      };
    }
    const nextTweets = tweetsFromServer
      .filter(Boolean)
      .map((t) =>
        (t.id_str && tweet.id_str && t.id_str === tweet.id_str) ||
        (t.id && tweet.id && t.id === tweet.id)
          ? { ...t, isNotABot: true }
          : t
      )
      .filter(Boolean);
    console.log(
      "🌟🚨 ~ useFetchAndReplaceNode ~ tweetsFromServer",
      tweetsFromServer
    );
    console.log("🌟🚨 ~ useFetchAndReplaceNode ~ nextTweets", nextTweets);
    setTweetsFromServer(nextTweets);

    // replace with N new tweets

    // if we still have stream API usage remaining
    if (!isTwitterApiUsageExceeded) {
      try {
        // first, remove the tweet
        setNotABot(tweet);
        // const filteredTweets = tweetsFromServer.filter(
        //   (t) => !((t.id_str || t.id) === (tweet.id_str || tweet.id))
        // );
        // setTweetsFromServer(filteredTweets);

        const resp = await fetch(
          `${SERVER_URL}/api/stream?num=${numNewTweets}&filterLevel=${FILTER_LEVELS.low}`
        );
        console.log("🌟🚨 ~ useFetchAndReplaceNode ~ resp", resp);
        const {
          data: responseTweets,
          error,
          msUntilRateLimitReset,
        } = await resp.json();
        if (responseTweets.length > numNewTweets) {
          console.warn("⏰🔔⏰🔔 hey! too many nodes received");
          console.log(
            "🌟🚨 ~ useFetchAndReplaceNode ~ responseTweets",
            responseTweets
          );
        }
        console.log(
          "🌟🚨 ~ useFetchAndReplaceNode ~ tweetsFromServer",
          tweetsFromServer
        );
        console.log(
          "🌟🚨🌟🚨🌟🚨🌟🚨🌟🚨🌟🚨🌟🚨🌟🚨🌟🚨🌟🚨🌟🚨🌟🚨🌟🚨🌟🚨🌟🚨🌟🚨 ~ useFetchAndReplaceNode ~ tweet",
          tweet
        );

        const nextTweets = tweetsFromServer.map((t) =>
          (t.id_str || t.id) === (tweet.id_str || tweet.id)
            ? {
                ...(responseTweets[0] as any),
                id_str: String(responseTweets[0].id),
              }
            : t
        ); /* .filter(Boolean); */
        // responseTweets[0],
        console.log("🌟🚨 ~ useFetchAndReplaceNode ~ nextTweets", nextTweets);
        setTweetsFromServer(nextTweets);
        if (msUntilRateLimitReset) {
          console.log(
            "🌟🚨 ~ return ~ msUntilRateLimitReset",
            msUntilRateLimitReset
          );
        }
        if (error) {
          console.log("🌟🚨 ~ return ~ error", error);
          setServerError(error);
        }
        return { data: responseTweets, error, msUntilRateLimitReset };
      } catch (err) {
        console.log(
          "🌟🚨 ~ file: useFetchAndReplaceNode.tsx ~ line 54 ~ useFetchAndReplaceNode ~ err",
          err
        );
        setServerError(err as any);
        return { data: [], error: err, msUntilRateLimitReset: null };
      }
    } else {
      // else fetch from the DB

      const resp = await getAllNodesWithBotScoresFromDB();
      // pick N at random
      const tweetsWithBotScores =
        (resp as any)?.data?.map((d) => d?.data?.nodeWithBotScore) || [];
      const tweetsWithHiddenBotScores: Tweet[] = tweetsWithBotScores.map(
        (t) => ({
          ...t,
          botScore: undefined,
          hiddenBotScore: t.botScore,
          user: { ...t.user, botScore: undefined, hiddenBotScore: t.botScore },
        })
      );

      const dedupedTweets = uniqBy(tweetsWithHiddenBotScores, (t) => t.id_str);
      const currentTweetIds = tweets.map((t) => t.id_str);
      const dedupedWithCurrentTweets = dedupedTweets.filter(
        (t) => !currentTweetIds.includes(t.id_str)
      );
      const randomDedupedTweets = shuffle([...dedupedWithCurrentTweets]).slice(
        0,
        numNewTweets
      );

      // ? wait for animation
      setTimeout(() => {
        const nextTweets = tweetsFromServer
          .map((t) => (t.id_str === tweet.id_str ? (null as any) : t))
          .filter(Boolean)
          .concat(randomDedupedTweets);
        console.log("🌟🚨 ~ setTimeout ~ nextTweets", nextTweets);
        setTweetsFromServer(nextTweets);
      }, 350);

      return {
        data: tweetsWithBotScores,
        error: null,
        msUntilRateLimitReset: null,
      };
    }
  };
}
