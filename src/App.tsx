import React, { useEffect } from "react";
import "./App.css";
import NetworkGraph from "./components/NetworkGraph/NetworkGraph";
import { CONTROLS_WIDTH } from "./utils/constants";
import Controls from "./components/Controls/Controls";
import styled from "styled-components/macro";
import BottomDrawer from "./components/BottomDrawer/BottomDrawer";
import useStore, { useConfig } from "./providers/store";
import { useMount } from "./utils/utils";
import { useSetTweets } from "./providers/store";
import { query as q } from "faunadb";
import { faunaClient } from "./providers/faunaProvider";
import Wordcloud from "./components/Wordcloud/Wordcloud";

const AppStyles = styled.div`
  display: grid;
  grid-template-columns: ${CONTROLS_WIDTH}px 1fr;
  min-height: 100vh;
  * {
    margin: 0;
    box-sizing: border-box;
  }
`;

function App() {
  useFetchTweetsOnMount();

  useDeselectNodeOnBackspace();

  return (
    <AppStyles className="App">
      <Controls />
      <Visualization />
      <BottomDrawer />
    </AppStyles>
  );
}

function Visualization() {
  const { isWordcloud } = useConfig();
  return isWordcloud ? <Wordcloud /> : <NetworkGraph />;
}

export default App;

function useDeselectNodeOnBackspace() {
  const setSelectedNode = useStore((state) => state.setSelectedNode);
  useEffect(() => {
    function handleKeydown(event) {
      if (event.key === "Backspace") {
        setSelectedNode(null);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [setSelectedNode]);
}

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
