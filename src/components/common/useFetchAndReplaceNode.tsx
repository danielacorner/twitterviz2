import { useAtom } from "jotai";
import { selectedNodeIdAtom } from "providers/store/store";
import { useSetTweets, useTweets } from "providers/store/useSelectors";
import { Tweet } from "types";
import { FILTER_LEVELS, SERVER_URL } from "utils/constants";

const NEW_TWEETS = 3;

/** replace one tweet with a new one from the stream
 *
 * 500 per day https://rapidapi.com/OSoMe/api/botometer-pro/pricing
 */
export function useFetchAndReplaceNode() {
  const tweets = useTweets();
  const setTweets = useSetTweets();
  const [selectedNodeId] = useAtom(selectedNodeIdAtom);
  return async (tweet: Tweet): Promise<Tweet[] | null> => {
    if (!tweet) {
      return null;
    }
    // replace with N new tweets
    const resp = await fetch(
      `${SERVER_URL}/api/stream?num=${NEW_TWEETS}&filterLevel=${FILTER_LEVELS.low}`
    );
    const responseTweets = await resp.json();
    const filteredTweets = tweets.filter((t) => t.id_str !== selectedNodeId);
    const newTweets = [...filteredTweets, ...responseTweets];
    setTweets(newTweets);
    // const newTweets =
    // setTweets(allTweetsWithBotScore);
    return newTweets;
  };
}
