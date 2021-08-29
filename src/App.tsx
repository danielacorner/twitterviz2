import React, { useEffect } from "react";
import "./App.css";
import styled from "styled-components/macro";
import { useLoading } from "./providers/store/useSelectors";
import { useIsLight } from "./providers/ThemeManager";
import "./video-react.css"; // import video-react css
import AppFunctionalHooks from "./components/AppFunctionalHooks";
import LeftDrawerCollapsible from "components/LeftDrawer";
// import { NavBar } from "components/NavBar/NavBar";
import NetworkGraph from "components/NetworkGraph/NetworkGraph";
import { RightDrawer } from "./components/RightDrawer/RightDrawer";
import { Game } from "./components/Game/Game";
import { LoadingIndicator } from "./components/LoadingIndicator";
import { Leva } from "leva";

function App() {
  return (
    <AppStyles className="App">
      {/* {process.env.NODE_ENV !== "production" && <NavBar />} */}
      <NetworkGraph />
      {process.env.NODE_ENV !== "production" && <LeftDrawerCollapsible />}
      {/* <SelectedTweetModal /> */}
      <AppStylesHooks />
      <AppFunctionalHooks />
      {/* <SelectedTweetHistory /> */}
      <RightDrawer />
      <Game />
      <LoadingIndicator />
      {/* <BotScorePopupNode /> */}
      <Leva
        // fill             // default = false,  true makes the pane fill the parent dom node it's rendered in
        // flat             // default = false,  true removes border radius and shadow
        // oneLineLabels    // default = false, alternative layout for labels, with labels and fields on separate rows
        // hideTitleBar     // default = false, hides the GUI header
        // collapsed        // default = false, when true the GUI is collpased
        // hidden={true}
        hidden={process.env.NODE_ENV === "production"} // default = false, when true the GUI is hidden
      />
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
