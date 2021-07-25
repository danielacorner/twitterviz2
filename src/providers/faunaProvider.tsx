import faunadb from "faunadb";
import { useMount } from "utils/utils";
import { useSetTweets } from "./store/useSelectors";
import { query as q } from "faunadb";

export const faunaClient = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNA_KEY || "",
});

/** retrieve posts from faunadb
 *
 * [docs](https://docs.fauna.com/fauna/current/tutorials/crud?lang=javascript#retrieve)
 */
export function useFetchTweetsOnMount() {
  const setTweets = useSetTweets();

  // fetch tweets from DB on mount
  useMount(() => {
    if (process.env.NODE_ENV === "development") {
      return;
    }

    faunaClient
      .query(
        q.Map(
          q.Paginate(q.Documents(q.Collection("Tweet"))),
          q.Lambda((x) => q.Get(x))
        )
      )
      .then((ret: { data: any[] } | any) => {
        if (ret.data) {
          console.log("🌟🚨 ~ .then ~ ret.data", ret.data);
          setTweets(ret.data.map((d) => d.data));
        }
      })
      .catch((err) => {
        console.error(err);
        setTweets([]);
      });
  });
}
