import React, { useEffect } from "react";
import "./App.css";
import styled from "styled-components/macro";
import { useLoading } from "./providers/store";
import { useIsLight } from "./providers/ThemeManager";
import "./video-react.css"; // import video-react css
import NavAndViz from "components/NavAndViz/NavAndViz";
import AppFunctionalHooks from "./AppFunctionalHooks";
import SelectedTweetModal from "components/SelectedTweetModal/SelectedTweetModal";
import LeftDrawerCollapsible from "components/LeftDrawer";

const AppStyles = styled.div`
  transition: background 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
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
      <NavAndViz />
      <LeftDrawerCollapsible />
      <SelectedTweetModal />
      {/* <BottomDrawer /> */}
      <AppStylesHooks />
      <AppFunctionalHooks />
    </AppStyles>
  );
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
