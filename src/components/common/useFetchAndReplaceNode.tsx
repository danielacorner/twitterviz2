import { useAtom } from "jotai";
import {
  isTwitterApiUsageExceededAtom,
  serverErrorAtom,
} from "providers/store/store";
import { useSetTweets, useTweets } from "providers/store/useSelectors";
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
  const setTweets = useSetTweets();
  // const [selectedNodeId] = useAtom(selectedNodeIdAtom);
  const [isTwitterApiUsageExceeded] = useAtom(isTwitterApiUsageExceededAtom);
  const [, setServerError] = useAtom(serverErrorAtom);

  return async (
    tweet: Tweet
  ): Promise<{
    data: Tweet[];
    error: any;
    msUntilRateLimitReset: number | null;
  }> => {
    if (!tweet) {
      return {
        data: [],
        error: "no tweet passed!",
        msUntilRateLimitReset: null,
      };
    }
    // set the tweet to "not a bot" immediately
    setTweets((p) =>
      p.map((t) => (t.id_str === tweet.id_str ? { ...t, isNotABot: true } : t))
    );

    // replace with N new tweets

    // if we still have stream API usage remaining
    if (!isTwitterApiUsageExceeded) {
      const resp = await fetch(
        `${SERVER_URL}/api/stream?num=${numNewTweets}&filterLevel=${FILTER_LEVELS.low}`
      );
      const {
        data: responseTweets,
        error,
        msUntilRateLimitReset,
      } = await resp.json();
      setTweets((p) =>
        p
          .map((t) => (t.id_str === tweet.id_str ? (null as any) : t))
          .filter(Boolean)
          .concat(responseTweets)
      );
      console.log("🌟🚨 ~ return ~ error", error);
      console.log(
        "🌟🚨 ~ return ~ msUntilRateLimitReset",
        msUntilRateLimitReset
      );
      setServerError(error);
      return { data: responseTweets, error, msUntilRateLimitReset };
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
        setTweets((p) =>
          p
            .map((t) => (t.id_str === tweet.id_str ? (null as any) : t))
            .filter(Boolean)
            .concat(randomDedupedTweets)
        );
      }, 350);

      return {
        data: tweetsWithBotScores,
        error: null,
        msUntilRateLimitReset: null,
      };
    }
  };
}
