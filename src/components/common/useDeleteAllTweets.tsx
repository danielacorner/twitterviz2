import {
  useDeleteUser,
  useSetEmptyNodesForUser,
} from "providers/faunaProvider";
import { useSetTweets } from "providers/store/useSelectors";

export function useDeleteAllTweets() {
  const setTweets = useSetTweets();
  const setEmptyNodesForUser = useSetEmptyNodesForUser();
  const deleteUser = useDeleteUser();
  return () => {
    // delete all tweets from the store
    setTweets([], true);
    // delete all tweets for this user in the db
    deleteUser().then(() => {
      setEmptyNodesForUser();
    });
  };
}
