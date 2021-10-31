import { useAtom } from "jotai";
import { dbRefAtom } from "providers/faunaProvider";
import { appUserIdAtom, serverErrorAtom } from "providers/store/store";
import { useSetTweets, useTweets } from "providers/store/useSelectors";
import { BotScore, Tweet } from "types";
import { SERVER_URL } from "utils/constants";
import { EMPTY_TWEET } from "utils/emptyTweet";

/** fetch one bot score and send to store>tweets
 *
 * 500 per day https://rapidapi.com/OSoMe/api/botometer-pro/pricing
 */
export function useFetchBotScoreForTweet() {
  const tweets = useTweets();
  const setTweets = useSetTweets();
  const [appUserId] = useAtom(appUserIdAtom);
  const [, setServerError] = useAtom(serverErrorAtom);
  const [dbRef] = useAtom(dbRefAtom);

  return async (tweet: Tweet): Promise<BotScore | null> => {
    try {
      console.log("🌟🚨 ~ fetching bot score for tweet", tweet);
      if (!tweet) {
        console.log("🌟🚨 ~ !tweet", tweet);
        return null;
      }
      let resp = null as any;
      try {
        resp = await fetch(`${SERVER_URL}/api/generate_bot_score`, {
          headers: { "content-type": "application/json" },
          method: "POST",
          body: JSON.stringify([{ ...EMPTY_TWEET, ...tweet }]),
        });
      } catch (error) {
        console.log("🌟🚨 ~ return ~ error", error);
        setServerError(error as any);
        return null;
      }

      console.log("🤖 ~ fetched bot score ~ resp", resp);
      const { data: botScore, error: botScoreError } = await resp.json();
      console.log("🤖🤖 ~ botScore", botScore);
      if (botScoreError) {
        console.log("!🤖🤖 ~ botScoreError", botScoreError);
        setServerError(botScoreError);
      }

      // save the bot score to the tweet
      const tweetWithBotScore = {
        ...tweet,
        botScore,
        user: { ...tweet.user, botScore },
      };

      const tweetIndex = tweets.findIndex((t) => t.id_str === tweet.id_str);

      const allTweetsWithBotScore = [
        ...tweets.slice(0, tweetIndex),
        tweetWithBotScore,
        ...tweets.slice(tweetIndex + 1),
      ];

      if (!dbRef?.value) {
        console.log("🚨🚨 ~ no dbRef", dbRef);
      } else {
        fetch(`${SERVER_URL}/api/save_bot_score_for_current_app_user`, {
          headers: { "content-type": "application/json" },
          method: "POST",
          body: JSON.stringify({
            appUserId,
            allTweetsWithBotScore,
            refId: dbRef?.value?.id,
          }),
        });
      }

      setTweets(allTweetsWithBotScore);

      return botScore;
    } catch (error) {
      setServerError(error as any);
      return null;
    }
  };
}
