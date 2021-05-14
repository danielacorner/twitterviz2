import { useEffect, useRef } from "react";
import { useTweets } from "../../providers/store/useSelectors";
import { useFetchBotScoreForTweet } from "components/common/useFetchBotScoreForTweet";

/** when tweets change, fetch bot scores for each */
export function useGenerateBotScoresOnNewTweets() {
  const tweets = useTweets();
  const fetchBotScoreForTweet = useFetchBotScoreForTweet();

  // faily rate limit of 500 so just fetch 1 per load
  const foundOne = useRef(false);

  // fetch only every 1s due to RapidAPI free tier rate limit
  useEffect(() => {
    // TODO: disabled while testing
    if (process.env.NODE_ENV === "production") {
      return;
    }
    // fetch the first one only
    // use a for loop to force synchronous (forEach is parallel)
    for (let index = 0; index < tweets.length; index++) {
      const tweet = tweets[index];
      if (!foundOne.current && !tweet.botScore) {
        foundOne.current = true;
        setTimeout(() => {
          fetchBotScoreForTweet(tweet);
        }, 1001);
      }
    }
  }, [tweets, fetchBotScoreForTweet]);
}
