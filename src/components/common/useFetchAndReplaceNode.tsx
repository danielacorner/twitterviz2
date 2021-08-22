import { useAtom } from "jotai";
import { lastTimeMonthlyTwitterApiUsageWasExceededAtom } from "providers/store/store";
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
  const numNewTweets = shuffle([1, 2, 3])[0];
  const tweets = useTweets();
  const setTweets = useSetTweets();
  // const [selectedNodeId] = useAtom(selectedNodeIdAtom);
  const [lastTimeMonthlyTwitterApiUsageWasExceeded] = useAtom(
    lastTimeMonthlyTwitterApiUsageWasExceededAtom
  );

  return async (tweet: Tweet): Promise<void> => {
    if (!tweet) {
      return;
    }
    // replace with N new tweets

    // if we still have stream API usage remaining
    if (!lastTimeMonthlyTwitterApiUsageWasExceeded) {
      const resp = await fetch(
        `${SERVER_URL}/api/stream?num=${numNewTweets}&filterLevel=${FILTER_LEVELS.low}`
      );
      const responseTweets = await resp.json();
      setTweets((p) =>
        p
          .map((t) => (t.id_str === tweet.id_str ? (null as any) : t))
          .filter(Boolean)
          .concat(responseTweets)
      );
      return;
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
      setTweets((p) =>
        p
          .map((t) => (t.id_str === tweet.id_str ? (null as any) : t))
          .filter(Boolean)
          .concat(randomDedupedTweets)
      );

      return;
    }
  };
}
