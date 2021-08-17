import { useAtom } from "jotai";
import {
  lastTimeMonthlyTwitterApiUsageWasExceededAtom,
  selectedNodeIdAtom,
} from "providers/store/store";
import { useSetTweets, useTweets } from "providers/store/useSelectors";
import { Tweet } from "types";
import { FILTER_LEVELS, SERVER_URL } from "utils/constants";
import {
  getAllNodesWithBotScoresFromDB,
  shuffle,
} from "components/NavBar/useStreamNewTweets";
import { uniqBy } from "lodash";

const NUM_NEW_TWEETS = 3;

/** replace one tweet with a new one from the stream
 *
 * 500 per day https://rapidapi.com/OSoMe/api/botometer-pro/pricing
 */
export function useFetchAndReplaceNode() {
  const tweets = useTweets();
  const setTweets = useSetTweets();
  const [selectedNodeId] = useAtom(selectedNodeIdAtom);
  const [lastTimeMonthlyTwitterApiUsageWasExceeded] = useAtom(
    lastTimeMonthlyTwitterApiUsageWasExceededAtom
  );

  return async (tweet: Tweet): Promise<Tweet[] | null> => {
    if (!tweet) {
      return null;
    }
    // replace with N new tweets
    const filteredTweets = tweets.filter((t) => t.id_str !== tweet.id_str);

    // if we still have stream API usage remaining
    if (!lastTimeMonthlyTwitterApiUsageWasExceeded) {
      const resp = await fetch(
        `${SERVER_URL}/api/stream?num=${NUM_NEW_TWEETS}&filterLevel=${FILTER_LEVELS.low}`
      );
      const responseTweets = await resp.json();
      const newTweets = [...filteredTweets, ...responseTweets];
      setTweets(newTweets);
      return newTweets;
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
        NUM_NEW_TWEETS
      );
      const newTweets = [...filteredTweets, ...randomDedupedTweets];
      setTweets(newTweets);

      return randomDedupedTweets;
    }
  };
}
