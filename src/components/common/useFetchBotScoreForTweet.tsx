import { useSetTweets, useTweets } from "providers/store/useSelectors";
import { BotScore, Tweet } from "types";

/** fetch one bot score and send to store>tweets
 *
 * 500 per day https://rapidapi.com/OSoMe/api/botometer-pro/pricing
 */
export function useFetchBotScoreForTweet() {
  const tweets = useTweets();
  const setTweets = useSetTweets();

  function setBotScoreForTweet(botScore: BotScore, tweet: Tweet) {
    const tweetWithBotScore = { ...tweet, botScore };
    const tweetIndex = tweets.findIndex((t) => t.id_str === tweet.id_str);

    setTweets([
      ...tweets.slice(0, tweetIndex),
      tweetWithBotScore,
      ...tweets.slice(tweetIndex + 1),
    ]);
  }

  return async (tweetOrUserNode: Tweet) => {
    if (!tweetOrUserNode) {
      return;
    }
    const tweetsByUser = tweets.filter(
      (t) => t.user.id_str === tweetOrUserNode.user.id_str
    );
    const resp = await fetch("/api/generate_bot_score", {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(tweetsByUser.slice(0, 10)),
    });
    const botScore = await resp.json();
    setBotScoreForTweet(botScore, tweetOrUserNode);
  };
}
