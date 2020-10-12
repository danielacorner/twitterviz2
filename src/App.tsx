import React, { useEffect } from "react";
import "./App.css";
import styled from "styled-components/macro";
import BottomDrawer from "./components/BottomDrawer/BottomDrawer";
import { useMount } from "./utils/utils";
import { useFetchTweetsByIds } from "./utils/hooks";
import { useSetTweets, useLoading, useTweets } from "./providers/store";
import { query as q } from "faunadb";
import { faunaClient } from "./providers/faunaProvider";
import VisualizationTabs from "./components/VisualizationTabs";
import { useIsLight } from "./providers/ThemeManager";
import "./video-react.css"; // import video-react css
import LeftDrawer from "./components/LeftDrawer";
import qs from "query-string";
import { useLocation, useHistory } from "react-router";

const AppStyles = styled.div`
  transition: background 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  display: grid;
  grid-template-columns: auto 1fr;
  min-height: 100vh;
  * {
    margin: 0;
    box-sizing: border-box;
  }
  a {
    color: cornflowerblue;
    &:visited {
      color: hsl(250, 50%, 60%);
    }
  }
`;

function App() {
  return (
    <AppStyles className="App">
      <AppStylesHooks />
      <InitializeAppHooks />
      <LeftDrawer />
      <VisualizationTabs />
      <BottomDrawer />
    </AppStyles>
  );
}

function InitializeAppHooks() {
  useFetchTweetsOnMount();
  useFetchQueryTweetsOnMount();
  useSyncTweetsWithQuery();
  return null;
}

function AppStylesHooks() {
  const loading = useLoading();
  const isLight = useIsLight();

  useEffect(() => {
    const app = document.querySelector(".App");
    if (!app) {
      return;
    }
    (app as HTMLElement).style.cursor = loading ? "wait" : "unset";
    (app as HTMLElement).style.background = isLight ? "white" : "hsl(0,0%,10%)";
  }, [loading, isLight]);

  return null;
}

export default App;

/** retrieve posts from faunadb
 *
 * [docs](https://docs.fauna.com/fauna/current/tutorials/crud?lang=javascript#retrieve)
 */
function useFetchTweetsOnMount() {
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
      .then((ret: { data: any[] }) => {
        setTweets(ret.data.map((d) => d.data));
      })
      .catch((err) => {
        console.error(err);
        setTweets([]);
      });
  });
}

/** fetch tweets if there's a query string like /?t=12345,12346
 *
 * [docs](https://docs.fauna.com/fauna/current/tutorials/crud?lang=javascript#retrieve)
 */
function useFetchQueryTweetsOnMount() {
  const query = useQueryString();
  const qTweets = query.t;
  const fetchTweetsByIds = useFetchTweetsByIds();
  const tweets = useTweets();
  // fetch tweets from DB on mount
  useMount(() => {
    if (
      // skip if we already have tweets,
      tweets.length > 0 ||
      // or if the query is empty
      !qTweets ||
      qTweets.length === 0
    ) {
      return;
    }

    const tweetIds = Array.isArray(qTweets) ? qTweets : qTweets.split(",");
    fetchTweetsByIds(tweetIds);
  });
}

/** when the tweets change, update the url */
function useSyncTweetsWithQuery() {
  const tweets = useTweets();
  const history = useHistory();
  const { pathname } = useLocation();
  useEffect(() => {
    // debugger;
    const newPath = `/?t=${tweets.map((t) => t.id_str).join(",")}`;
    const shouldNavigate =
      tweets && tweets.length !== 0 && pathname !== newPath;
    if (shouldNavigate) {
      history.push(newPath);
    }
    // eslint-disable-next-line
  }, [tweets]);
}

function useQueryString() {
  const location = useLocation();
  return qs.parse(location.search);
}
