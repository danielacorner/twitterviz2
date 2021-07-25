import faunadb from "faunadb";
import { useMount } from "utils/utils";
import { useSetTweets, useTweets } from "./store/useSelectors";
import { query as q } from "faunadb";
import { useAtom } from "jotai";
import { Tweet } from "types";
import { userIdAtom } from "./store/store";
import { useEffect, useRef } from "react";
import { isEqual } from "lodash";
import { atomWithStorage } from "jotai/utils";
const dbRefIdAtom = atomWithStorage("atoms:dbRefId", "");
export const faunaClient = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNA_KEY || "",
});

/** retrieve posts from faunadb
 *
 * [docs](https://docs.fauna.com/fauna/current/tutorials/crud?lang=javascript#retrieve)
 */
export function useFetchTweetsOnMount() {
  // * one-time op
  //   faunaClient
  //     .query(
  //       q.CreateIndex({
  //         name: "nodes_by_userid",
  //         source: q.Collection("Nodes"),
  //         terms: [{ field: ["data", "userId"] }],
  //       })
  //     )
  //     .then((ret) => console.log(ret))
  //     .catch((err) => {
  //       console.log("🌟🚨 ~ createIndex ~ err", err);
  //       console.error("Error: %s", err);
  //     });
  // * one-time op
  // faunaClient
  // .query(
  //   q.CreateIndex({
  //     name: "nodes_by_userid_with_node",
  //     source: q.Collection("Nodes"),
  //     terms: [{ field: ["data", "userId"] }],
  //     values: [{ field: ["data", "nodes"] }],
  //   })
  // )
  // .then((ret) => console.log(ret))
  // .catch((err) => console.error("Error: %s", err));

  const getTweetsFromDb = useGetTweetsFromDb();

  // sync tweets to DB
  const lastTweetsFromDb = useRef<Tweet[]>([]);
  const tweets = useTweets();
  const replaceNodesInDbForUser = useReplaceNodesInDbForUser();
  useEffect(() => {
    if (tweets.length > 1 && !isEqual(tweets, lastTweetsFromDb.current)) {
      replaceNodesInDbForUser(tweets);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tweets]);

  const [, setDbRefId] = useAtom(dbRefIdAtom);
  const setTweets = useSetTweets();
  const [userId, setUserId] = useAtom(userIdAtom);
  // fetch tweets from DB on mount
  useMount(() => {
    if (userId === "") {
      // create userid and empty nodes in db
      const newUserId = (Math.random() * 10 ** 16).toFixed();
      setUserId(newUserId);
      initEmptyNodesForUser(newUserId).then((ret) => {
        console.log("🌟🚨 ~ initEmptyNodesForUser ~ ret", ret);
        const newTweets = (ret as any).data.nodes as Tweet[];
        console.log(
          "🌟🚨🚨🚨🚨 ~ initEmptyNodesForUser ~ newTweets",
          newTweets
        );
        setTweets(newTweets);
        setDbRefId((ret as any)?.value?.id);
      });
    } else {
      getTweetsFromDb().then((newTweets) => {
        console.log("🌟🚨 ~ getTweetsFromDb ~ newTweets", newTweets);
        setTweets(newTweets as Tweet[]);
        lastTweetsFromDb.current = newTweets as Tweet[];
      });
    }
  });
}

function useGetTweetsFromDb() {
  const [userId] = useAtom(userIdAtom);

  return () =>
    new Promise((resolve, reject) => {
      faunaClient
        .query(q.Get(q.Match(q.Index("nodes_by_userid"), userId)))
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
            console.log("🌟🌟 no nodes for this user yet");
            // initialize the user's nodes as empty array to avoid this error next time
            resolve([]);
            return;
          }
          console.log("🌟🚨 ~ newPromise ~ err", err);
          reject(err);
        });
    });
}

function initEmptyNodesForUser(userId: string) {
  return new Promise((resolve, reject) => {
    faunaClient
      .query(
        q.Create(q.Collection("Nodes"), {
          title: userId,
          data: { userId, nodes: [] },
        })
      )
      .then((ret) => {
        console.log("🌟🌟 Created empty nodes for user", userId);
        console.log("🌟🚨 ~ .then ~ ret", ret);
        console.log(ret);
        resolve(ret);
      })
      .catch((err) => {
        console.log("🌟🚨 ~ returnnewPromise ~ err", err);
        console.error("Error: %s", err);
      });
  });
}

function useReplaceNodesInDbForUser() {
  const [userId] = useAtom(userIdAtom);
  console.log("🌟🚨 ~ useReplaceNodesInDbForUser ~ userId", userId);
  const [dbRefId] = useAtom(dbRefIdAtom);

  return (nodes: Tweet[]) => {
    faunaClient
      .query(
        q.Replace(q.Ref(q.Collection("Nodes"), dbRefId), {
          data: { userId, nodes },
        })
      )
      .then((ret) => console.log(ret))
      .catch((err) => {
        console.log("🌟🚨 ~ return ~ err", err);
        console.error("Error: %s", err);
      });
  };
}
