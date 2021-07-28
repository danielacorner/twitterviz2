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
const dbRefAtom = atomWithStorage("dbRefId", {} as any);
export const faunaClient = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNA_KEY || "",
});

/** retrieve posts from faunadb
 *
 * [docs](https://docs.fauna.com/fauna/current/tutorials/crud?lang=javascript#retrieve)
 */
export function useFetchTweetsOnMount() {
  // * one-time op
  // ? create an index to be able to easily find nodes by userid
  useMount(() => {
    faunaClient
      .query(
        q.CreateIndex({
          name: "nodes_by_userid",
          source: q.Collection("Nodes"),
          terms: [{ field: ["data", "userId"] }],
        })
      )
      .then((ret) => console.log(ret))
      .catch((err) => {
        if (err.message === "instance already exists") {
          console.log("🌟🌟 ~ ", err.message);
          return;
        }
        console.log("🌟🚨 ~ createIndex ~ err", err);
      });
  });

  const getTweetsFromDb = useGetTweetsFromDb();

  // sync tweets to DB
  const lastTweetsFromDb = useRef<Tweet[]>([]);
  const tweets = useTweets();
  const replaceNodesInDbForUser = useReplaceNodesInDbForUser();
  useEffect(() => {
    if (tweets.length > 0 && !isEqual(tweets, lastTweetsFromDb.current)) {
      replaceNodesInDbForUser(tweets);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tweets]);

  const [, setDbRef] = useAtom(dbRefAtom);
  const setTweets = useSetTweets();
  const [userId, setUserId] = useAtom(userIdAtom);
  // fetch tweets from DB on mount
  useMount(() => {
    if (userId === "") {
      // create userid and empty nodes in db
      const newUserId = (Math.random() * 10 ** 16).toFixed();
      setUserId(newUserId);
      initEmptyNodesForUser(newUserId).then((ret) => {
        const newTweets = (ret as any).data.nodes as Tweet[];
        setTweets(newTweets);
        setDbRef((ret as any)?.ref);
      });
    } else {
      getTweetsFromDb().then((newTweets) => {
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
      if (!userId) {
        reject("no userId");
      }
      faunaClient
        .query(q.Get(q.Match(q.Index("nodes_by_userid"), userId)))
        // .query(q.Get(q.Match(q.Index("nodes_by_userid"), userId)))
        .then((ret: { data: any[] } | any) => {
          // just grab the whole db ok
          if (ret.data) {
            // then find the user's nodes
            const nodesInDb = ret.data.nodes || [];
            console.log("🌟🚨 ~ .then ~ nodesInDb", nodesInDb);
            resolve(nodesInDb as Tweet[]);
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
        resolve(ret);
      })
      .catch((err) => {
        console.log("🌟🚨 ~ returnnewPromise ~ err", err);
      });
  });
}

function useReplaceNodesInDbForUser() {
  const [userId] = useAtom(userIdAtom);
  const [dbRef] = useAtom(dbRefAtom);

  return (nodes: Tweet[]) => {
    if (!dbRef["@ref"]) {
      return;
    }
    faunaClient
      .query(
        q.Replace(q.Ref(q.Collection("Nodes"), dbRef["@ref"]?.id), {
          // q.Replace(q.Match(q.Index("nodes_by_userid"), userId), {
          data: { userId, nodes },
        })
      )
      .then((ret) => console.log(ret))
      .catch((err) => {
        console.log("🌟🚨 ~ return ~ err", err);
      });
  };
}
