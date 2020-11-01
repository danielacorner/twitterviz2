import React, { useEffect, useRef } from "react";
import "./App.css";
import styled from "styled-components/macro";
import BottomDrawer from "./components/BottomDrawer/BottomDrawer";
import { useMount } from "./utils/utils";
import { useFetchTweetsByIds } from "./utils/hooks";
import {
  useSetTweets,
  useLoading,
  useTweets,
  useSetLoading,
} from "./providers/store";
import { query as q } from "faunadb";
import { faunaClient } from "./providers/faunaProvider";
import { useIsLight } from "./providers/ThemeManager";
import "./video-react.css"; // import video-react css
import LeftDrawer, { LEFT_DRAWER_WIDTH } from "./components/LeftDrawer";
import qs from "query-string";
import { useLocation } from "react-router";
import NavAndViz from "components/NavAndViz/NavAndViz";

const AppStyles = styled.div`
  transition: background 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  display: grid;
  grid-template-columns: ${LEFT_DRAWER_WIDTH}px 1fr;
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
      <LeftDrawer />
      <NavAndViz />
      <BottomDrawer />
      <AppStylesHooks />
      <InitializeAppHooks />
    </AppStyles>
  );
}

function InitializeAppHooks() {
  useFetchTweetsOnMount();
  useFetchQueryTweetsOnMount();
  useStopLoadingEventually();

  return null;
}

const MAX_LOADING_TIME = 2 * 1000;

/** stop loading after MAX_LOADING_TIME */
function useStopLoadingEventually() {
  const loading = useLoading();
  const setLoading = useSetLoading();
  const tweets = useTweets();
  const prevTweets = useRef(tweets);

  // when loading starts, start a timer to stop loading
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, MAX_LOADING_TIME);

    return () => {
      clearTimeout(timer);
    };
  }, [loading, setLoading, tweets]);

  // when tweets length changes, stop loading
  useEffect(() => {
    if (prevTweets.current.length !== tweets.length) {
      setLoading(false);
      const app = document.querySelector(".App");
      if (!app) {
        return;
      }
      (app as HTMLElement).style.cursor = "unset";
    }
  }, [tweets, setLoading]);
}

function AppStylesHooks() {
  const loading = useLoading();
  const isLight = useIsLight();

  useEffect(() => {
    const app = document.querySelector(".App");
    if (!app) {
      return;
    }
    if (loading) {
      (app as HTMLElement).style.cursor = "wait";
    }
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
      .then((ret: { data: any[] } | any) => {
        if (ret.data) {
          setTweets(ret.data.map((d) => d.data));
        }
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
  const qTweets = query.tweets;
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

function useQueryString() {
  const location = useLocation();
  return qs.parse(location.search);
}
