import faunadb from "faunadb";
import { useMount } from "utils/utils";
import { useSetTweets } from "./store/useSelectors";
import { query as q } from "faunadb";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const faunaClient = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNA_KEY || "",
});

const userIdAtom = atomWithStorage(
  "userId",
  (Math.random() * 10 ** 16).toFixed()
);
/** retrieve posts from faunadb
 *
 * [docs](https://docs.fauna.com/fauna/current/tutorials/crud?lang=javascript#retrieve)
 */
export function useFetchTweetsOnMount() {
  const setTweets = useSetTweets();

  const [userId] = useAtom(userIdAtom);

  // fetch tweets from DB on mount
  useMount(() => {
    // if (process.env.NODE_ENV === "development") {
    //   return;
    // }
    console.log("🌟🚨 ~ useMount ~ faunaClient", faunaClient);

    faunaClient
      .query(q.Get(q.Ref(q.Collection("nodes_by_userid"), userId)))
      .then((ret: { data: any[] } | any) => {
        console.log("🌟🚨 ~ .then ~ ret", ret);
        // just grab the whole db ok
        if (ret.data) {
          // then find the user's nodes
          console.log("🌟🚨 ~ .then ~ ret.data", ret.data);
          const nodesInDb = ret.data[userId] || [];
          console.log("🌟🚨 ~ .then ~ nodesInDb", nodesInDb);
          setTweets(nodesInDb.map((d) => d.data));
        }
      })
      .catch((err) => {
        if (err.name === "NotFound") {
          console.log("🌟 no nodes for this user yet");
          return;
        }
        console.error(err);
        setTweets([]);
      });
  });
}
