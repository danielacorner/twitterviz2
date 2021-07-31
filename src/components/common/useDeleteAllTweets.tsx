import { useAtom } from "jotai";
import {
  useDeleteUser,
  useSetEmptyNodesForUser,
} from "providers/faunaProvider";
import {
  tweetsFromServerAtom,
  useSetTweets,
} from "providers/store/useSelectors";

export function useDeleteAllTweets() {
  const [, setTweetsFromServer] = useAtom(tweetsFromServerAtom);
  const setTweets = useSetTweets();
  const setEmptyNodesForUser = useSetEmptyNodesForUser();
  const deleteUser = useDeleteUser();
  return () =>
    new Promise((resolve, reject) => {
      // delete all tweets from the store
      setTweetsFromServer([]);
      setTweets([]);
      // delete all tweets for this user in the db
      deleteUser().then(() => {
        setEmptyNodesForUser().then(() => {
          resolve(true);
        });
      });
    });
}
