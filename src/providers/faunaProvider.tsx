import faunadb from "faunadb";
import { useMount } from "utils/utils";
import { useSetTweets, useTweets } from "./store/useSelectors";
import { query as q } from "faunadb";
import { useAtom } from "jotai";
import { Tweet } from "types";
import { appUserIdAtom } from "./store/store";
import { useEffect, useRef } from "react";
import { isEqual } from "lodash";
import { atomWithStorage } from "jotai/utils";
export const dbRefAtom = atomWithStorage("dbRefId", {} as any);
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
  // useMount(() => {
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
  //       if (err.message === "instance already exists") {
  //         console.log("🌟🌟 ~ ", err.message);
  //         return;
  //       }
  //       console.log("🚨🚨 ~ createIndex ~ err", err);
  //     });
  // });

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

  // fetch tweets from DB on mount

  const setTweets = useSetTweets();
  const setNodesInDb = useSetNodesInDbForUser();
  const [, /* userId */ setUserId] = useAtom(appUserIdAtom);
  // const getTweetsFromDb = useGetTweetsFromDb();
  useMount(() => {
    // if (userId === "") {
    // create userid and empty nodes in db
    const newUserId = (Math.random() * 10 ** 16).toFixed();
    setUserId(newUserId);
    setNodesInDb([]).then((ret) => {
      const newTweets = (ret as any).data.nodes as Tweet[];
      setTweets(newTweets);
    });
    // } else {
    //   getTweetsFromDb().then((newTweets) => {
    //     setTweets(newTweets as Tweet[]);
    //     lastTweetsFromDb.current = newTweets as Tweet[];
    //   });
    // }
  });
}

// function useGetTweetsFromDb() {
//   const [dbRef] = useAtom(dbRefAtom);
//   const setNodesInDb = useSetNodesInDbForUser();

//   return () =>
//     new Promise((resolve, reject) => {
//       const dbRefId = dbRef?.value?.id || dbRef?.["@ref"]?.id;

//       if (!dbRefId) {
//         console.log("🚨🚨 ~ no dbRefId", dbRef);
//         reject("no dbRef");
//       }
//       faunaClient
//         .query(q.Get(q.Ref(q.Collection("Nodes"), dbRefId)))
//         .then((ret: { data: any[] } | any) => {
//           // just grab the whole db ok
//           if (ret.data) {
//             // then find the user's nodes
//             const nodesInDb = ret.data.nodes || [];
//             resolve(nodesInDb as Tweet[]);
//           }
//         })
//         .catch((err) => {
//           if (err.name === "NotFound") {
//             console.log("🌟🌟 no nodes for this user yet");
//             // initialize the user's nodes as empty array to avoid this error next time
//             setNodesInDb([]);
//             resolve([]);
//             return;
//           } else if (err.name === "BadRequest") {
//             console.log("🚨🚨 bad request", err);
//             setNodesInDb([]);
//             resolve([]);
//             return;
//           }
//           console.log("🚨🚨 ~ newPromise ~ err", err);
//           reject(err);
//         });
//     });
// }

export function useSetNodesInDbForUser() {
  const [, setDbRef] = useAtom(dbRefAtom);
  const [userId] = useAtom(appUserIdAtom);

  return (nodes: Tweet[]) =>
    new Promise((resolve, reject) => {
      faunaClient
        .query(
          q.Create(q.Collection("Nodes"), {
            title: userId,
            data: { userId, nodes },
          })
        )
        .then((ret) => {
          console.log("🌟🌟 Created empty nodes for user", userId);
          setDbRef((ret as any)?.ref);
          resolve(ret);
        })
        .catch((err) => {
          console.log("🚨🚨 ~ faunaProvider ~ err", err);
        });
    });
}

export function useReplaceNodesInDbForUser() {
  const [userId] = useAtom(appUserIdAtom);
  const [dbRef, setDbRef] = useAtom(dbRefAtom);

  const dbRefId = dbRef?.value?.id || dbRef?.["@ref"]?.id;
  return (nodes: Tweet[]) => {
    if (!dbRefId) {
      console.log("🚨🚨 ~ return ~ !dbRef id", dbRef);
      return;
    }
    faunaClient
      .query(
        q.Replace(q.Ref(q.Collection("Nodes"), dbRefId), {
          data: { userId, nodes },
        })
      )
      .then((ret) => {
        return ret;
      })
      .catch((err) => {
        if (err.name === "NotFound") {
          faunaClient
            .query(
              q.Create(q.Collection("Nodes"), {
                title: userId,
                data: { userId, nodes },
              })
            )
            .then((ret) => {
              console.log("🌟🌟 Added nodes for user", userId);
              setDbRef((ret as any)?.ref);
            })
            .catch((err) => {
              console.log("🚨🚨 ~ faunaProvider ~ err", err);
            });
        } else {
          console.log("🚨🚨 ~ return ~ err", err);
        }
      });
  };
}
