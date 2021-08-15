import { useTweets } from "../../providers/store/useSelectors";
import { Tweet, User } from "../../types";

export type UserNode = {
  id_str: string;
  user: User;
  tweets: Tweet[];
};
/** preprocess tweets to add links & user nodes */
export function useUserNodes(): UserNode[] {
  const tweets = useTweets();
  // TODO: map new api to old api (compatibly with nodes from old api)
  return tweets.map(getUserNodeFromTweet);
}

export function getUserNodeFromTweet(t: Tweet): UserNode {
  const userId = t.user.id_str || String(t.user.id);

  return {
    user: t.user,
    id_str: userId,
    tweets: [t],
  };
}
