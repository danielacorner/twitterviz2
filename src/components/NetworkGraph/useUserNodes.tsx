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
  return tweets.filter(Boolean).map(getUserNodeFromTweet);
}

// map new api to old api (compatibly with nodes from old api)
export function getUserNodeFromTweet(t: Tweet): UserNode {
  const userId = t.user.id_str || String(t.user?.id);

  return {
    user: t.user,
    id_str: userId,
    tweets: [t],
  };
}
