import { useTweets } from "../../providers/store/useSelectors";
import { Tweet, User } from "../../types";

export type UserNode = {
  id_str: string;
  user: User;
  tweets: Tweet[];
};
/** preprocess tweets to add links & user nodes */
export function useNodes(): UserNode[] {
  const tweets = useTweets();
  // const tweetsGroupedByUserId = groupBy(tweets, (tweet: Tweet) =>
  //   tweet ? getOriginalPoster(tweet)?.id_str : ""
  // );
  return tweets.map((t) => ({
    ...t,
    tweets: [t],
  }));
}
