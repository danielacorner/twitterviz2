import React from "react";
import "./App.css";
import { CONTROLS_WIDTH } from "./utils/constants";
import { CONTROLS_PADDING_INNER } from "./components/Controls/ControlsStyles";
import styled from "styled-components/macro";
import BottomDrawer from "./components/BottomDrawer/BottomDrawer";
import { useMount } from "./utils/utils";
import { useSetTweets, useLoading } from "./providers/store";
import { query as q } from "faunadb";
import { faunaClient } from "./providers/faunaProvider";
import VisualizationTabs from "./components/VisualizationTabs";
import Controls from "./components/Controls/Controls";
import { useIsLight } from "./providers/ThemeManager";

const AppStyles = styled.div`
  ${(props) => (props.isLoading ? "cursor: wait;" : "")}
  transition: background 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  background: ${(props) => (props.isLight ? "white" : "hsl(0,0%,10%)")};
  display: grid;
  grid-template-columns: ${CONTROLS_WIDTH + CONTROLS_PADDING_INNER * 2}px 1fr;
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
  const isLight = useIsLight();
  const { loading } = useLoading();
  return (
    <AppStyles isLoading={loading} isLight={isLight} className="App">
      <Controls />
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
