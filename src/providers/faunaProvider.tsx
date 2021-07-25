import faunadb from "faunadb";
import { useMount } from "utils/utils";
import { useSetTweets } from "./store/useSelectors";
import { query as q } from "faunadb";
import { useAtom } from "jotai";
import { Tweet } from "types";
import { userIdAtom } from "./store/store";

export const faunaClient = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNA_KEY || "",
});

/** retrieve posts from faunadb
 *
 * [docs](https://docs.fauna.com/fauna/current/tutorials/crud?lang=javascript#retrieve)
 */
export function useFetchTweetsOnMount() {
  const getTweetsFromDb = useGetTweetsFromDb();
  const setNodesForUser = useSetNodesForUser();
  const setTweets = useSetTweets();
  const [userId, setUserId] = useAtom(userIdAtom);
  // fetch tweets from DB on mount
  useMount(() => {
    if (userId === "") {
      const newUserId = (Math.random() * 10 ** 16).toFixed();
      setUserId(newUserId);
      initEmptyNodesForUser(newUserId).then((newTweets) => {
        setTweets(newTweets as Tweet[]);
      });
    }
  });
}

function useGetTweetsFromDb() {
  const [userId] = useAtom(userIdAtom);

  return () =>
    new Promise((resolve, reject) => {
      faunaClient
        .query(q.Get(q.Ref(q.Collection("nodes_by_userid"), userId)))
        .then((ret: { data: any[] } | any) => {
          console.log("🌟🚨 ~ useGetTweetsFromDb ~ userId", userId);
          console.log("🌟🚨 ~ .then ~ ret", ret);
          // just grab the whole db ok
          if (ret.data) {
            // then find the user's nodes
            console.log("🌟🚨 ~ .then ~ ret.data", ret.data);
            const nodesInDb = ret.data[userId] || [];
            console.log("🌟🚨 ~ .then ~ nodesInDb", nodesInDb);
            const newTweets = nodesInDb.map((d) => d.data);
            console.log("🌟🚨 ~ .then ~ newTweets", newTweets);
            resolve(newTweets as Tweet[]);
          }
        })
        .catch((err) => {
          if (err.name === "NotFound") {
            console.log("🌟 no nodes for this user yet");
            // initialize the user's nodes as empty array to avoid this error next time
            resolve([]);
            return;
          }
          console.error(err);
          reject(err);
        });
    });
}

function initEmptyNodesForUser(userId: string) {
  return new Promise((resolve, reject) => {
    faunaClient
      .query(
        q.Create(q.Collection("nodes_by_userid"), {
          data: { userId, nodes: [] },
        })
      )
      .then((ret) => {
        console.log("🌟 created empty nodes for user", userId);
        console.log(ret);
        resolve(ret);
      })
      .catch((err) => console.error("Error: %s", err));
  });
}

function useSetNodesForUser() {
  const [userId] = useAtom(userIdAtom);
  console.log("🌟🚨 ~ useSetNodesForUser ~ userId", userId);

  return (nodes: Tweet[]) => {
    faunaClient
      .query(
        q.Lambda(
          userId,
          q.Create(q.Collection("nodes_by_userid"), {
            data: { userId, nodes },
          })
        )
      )
      .then((ret) => console.log(ret))
      .catch((err) => console.error("Error: %s", err));
  };
}
