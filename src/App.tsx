import React, { useEffect } from "react";
import "./App.css";
import styled from "styled-components/macro";
import BottomDrawer from "./components/BottomDrawer/BottomDrawer";
import { useMount } from "./utils/utils";
import { useSetTweets, useLoading, useTweets } from "./providers/store";
import { query as q } from "faunadb";
import { faunaClient } from "./providers/faunaProvider";
import VisualizationTabs from "./components/VisualizationTabs";
import { useIsLight } from "./providers/ThemeManager";
import "./video-react.css"; // import video-react css
import LeftDrawer from "./components/LeftDrawer";
import qs from "query-string";
import { useFetchTweetsByIds } from "./components/Controls/Buttons";
import { useLocation, useHistory } from "react-router";

const AppStyles = styled.div`
  ${(props) => (props.isLoading ? "cursor: wait;" : "")}
  transition: background 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  background: ${(props) => (props.isLight ? "white" : "hsl(0,0%,10%)")};
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
  useFetchTweetsOnMount();
  useFetchQueryTweetsOnMount();
  useSyncTweetsWithQuery();
  const isLight = useIsLight();
  const { loading } = useLoading();
  return (
    <AppStyles isLoading={loading} isLight={isLight} className="App">
      <LeftDrawer />
      <VisualizationTabs />
      <BottomDrawer />
    </AppStyles>
  );
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

/** fetch posts if there's a query string
 *
 * [docs](https://docs.fauna.com/fauna/current/tutorials/crud?lang=javascript#retrieve)
 */
function useFetchQueryTweetsOnMount() {
  const query = useQueryString();
  const qTweets = query.t;
  const fetchTweetsByIds = useFetchTweetsByIds();
  // fetch tweets from DB on mount
  useMount(() => {
    if (!qTweets || qTweets.length === 0) {
      return;
    }

    fetchTweetsByIds(Array.isArray(qTweets) ? qTweets : qTweets.split(","));
  });
}

function useSyncTweetsWithQuery() {
  const tweets = useTweets();
  const history = useHistory();
  useEffect(() => {
    if (tweets && tweets.length !== 0) {
      const path = `/?t=${tweets.map((t) => t.id_str).join(",")})}`;
      history.push(path);
    }
    // eslint-disable-next-line
  }, [tweets]);
}

function useQueryString() {
  const location = useLocation();
  return qs.parse(location.search);
}
