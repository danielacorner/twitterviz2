import { useEffect } from "react";
import "./App.css";
import styled from "styled-components/macro";
import { useLoading } from "./providers/store/useSelectors";
import { useIsLight } from "./providers/ThemeManager";
import "./video-react.css"; // import video-react css
import AppFunctionalHooks from "./AppFunctionalHooks";
import LeftDrawerCollapsible from "components/LeftDrawer";
import { RowDiv } from "components/common/styledComponents";
// import { NavBar } from "components/NavBar/NavBar";
import NetworkGraph from "components/NetworkGraph/NetworkGraph";
import { RightDrawer } from "./components/RightDrawer/RightDrawer";
import { Game } from "./components/Game/Game";
import { LoadingIndicator } from "./LoadingIndicator";
import { BotScorePopupNode } from "./components/NetworkGraph/Scene/Node/BotScorePopupNode";
// import { useDeleteAllTweets } from "components/common/useDeleteAllTweets";
// import { useMount } from "utils/utils";

function App() {
  // useRecordSelectedNodeHistory();
  return (
    <AppStyles className="App">
      {/* {process.env.NODE_ENV !== "production" && <NavBar />} */}
      <RowDiv>
        <NetworkGraph />
      </RowDiv>
      {process.env.NODE_ENV !== "production" && <LeftDrawerCollapsible />}
      {/* <SelectedTweetModal /> */}
      <AppStylesHooks />
      <AppFunctionalHooks />
      {/* <SelectedTweetHistory /> */}
      <RightDrawer />
      <Game />
      <LoadingIndicator />
      <BotScorePopupNode />
    </AppStyles>
  );
}

const AppStyles = styled.div`
  transition: background 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  min-height: 100vh;
  &,
  * {
    color: white;
  }
  * {
    margin: 0;
    box-sizing: border-box;
  }
  a {
    color: #91b6ff;
    &:visited {
      color: hsl(250, 50%, 60%);
    }
  }
`;

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
    } else {
      (app as HTMLElement).style.cursor = "unset";
    }
    (app as HTMLElement).style.background = isLight ? "white" : "hsl(0,0%,10%)";
  }, [loading, isLight]);

  return null;
}

export default App;
