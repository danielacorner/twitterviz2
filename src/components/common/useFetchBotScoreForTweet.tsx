import { useAtom } from "jotai";
import { dbRefAtom } from "providers/faunaProvider";
import { appUserIdAtom } from "providers/store/store";
import { useSetTweets, useTweets } from "providers/store/useSelectors";
import { BotScore, Tweet } from "types";
import { SERVER_URL } from "utils/constants";

/** fetch one bot score and send to store>tweets
 *
 * 500 per day https://rapidapi.com/OSoMe/api/botometer-pro/pricing
 */
export function useFetchBotScoreForTweet() {
  const tweets = useTweets();
  const setTweets = useSetTweets();
  const [appUserId] = useAtom(appUserIdAtom);
  const [dbRef] = useAtom(dbRefAtom);

  return async (tweet: Tweet): Promise<BotScore | null> => {
    if (!tweet) {
      return null;
    }
    const tweetsByUser = tweets.filter(
      (t) => t.user.id_str === tweet.user.id_str
    );
    const resp = await fetch(`${SERVER_URL}/api/generate_bot_score`, {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(tweetsByUser),
    });
    const botScore = await resp.json();

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

    fetch(`${SERVER_URL}/api/save_bot_score_for_current_app_user`, {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        appUserId,
        allTweetsWithBotScore,
        refId: dbRef["@ref"]?.id,
      }),
    });

    setTweets(allTweetsWithBotScore);

    return botScore;
  };
}
