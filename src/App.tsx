import { useEffect, useState } from "react";
import "./App.css";
import styled from "styled-components/macro";
import { useLoading } from "./providers/store/useSelectors";
import { useIsLight } from "./providers/ThemeManager";
import "./video-react.css"; // import video-react css
import AppFunctionalHooks from "./AppFunctionalHooks";
import LeftDrawerCollapsible from "components/LeftDrawer";
import { RowDiv } from "components/common/styledComponents";
import { NavBar } from "components/NavBar/NavBar";
import NetworkGraph from "components/NetworkGraph/NetworkGraph";
import { useRecordSelectedNodeHistory } from "./components/useRecordSelectedNodeHistory";
import { SelectedTweetDrawer } from "./components/SelectedTweetDrawer";
import { Button } from "@material-ui/core";
import { useAtom } from "jotai";
import { gameStateAtom, GameStepsEnum } from "providers/store/store";
import { useInterval } from "utils/useInterval";
// import { useDeleteAllTweets } from "components/common/useDeleteAllTweets";
// import { useMount } from "utils/utils";

function App() {
  useRecordSelectedNodeHistory();
  return (
    <AppStyles className="App">
      <NavBar />
      <RowDiv>
        <NetworkGraph />
      </RowDiv>
      {process.env.NODE_ENV !== "production" && <LeftDrawerCollapsible />}
      {/* <SelectedTweetModal /> */}
      <AppStylesHooks />
      <AppFunctionalHooks />
      {/* <SelectedTweetHistory /> */}
      <SelectedTweetDrawer />
      <Game />
    </AppStyles>
  );
}

// const gameMachine = createMachine({
//   id: "game",
//   initial: 0,
//   states: {
//     inactive: {
//       on: { TOGGLE: "active" },
//     },
//     active: {
//       on: { TOGGLE: "inactive" },
//     },
//   },
// });
/** renders controls and instructions to play the game */
function Game() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [timeRemainingS, setTimeRemainingS] = useState(Infinity);
  const [running, setRunning] = useState(false);

  useInterval({
    callback: () => {
      if (running) {
        setTimeRemainingS((p) => Math.max(0, p - 1));
      }
    },
    delay: 1000,
    immediate: false,
  });
  // const [state, send] = useMachine(gameMachine);
  // const deleteAllTweets = useDeleteAllTweets();
  // useMount(() => {
  // 	deleteAllTweets()
  // });
  return gameState.step === GameStepsEnum.welcome ? (
    <Step1Styles>
      <h3>Twitter Botsketball 🤖🏀</h3>
      <p>
        1. look at 10 twitter accounts and their bot scores from Botometer API
      </p>
      <p>2. look at 10 more twitter accounts, and guess which one is a bot!</p>
      <p style={{ textAlign: "center" }}>
        compete with others to get the highest bot score!
      </p>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setRunning(true);
          setTimeRemainingS(100);
          setGameState((p) => ({
            step: GameStepsEnum.lookingAtTweetsWithBotScores,
            startTime: Date.now(),
          }));
        }}
      >
        Go
      </Button>
    </Step1Styles>
  ) : gameState.step === GameStepsEnum.lookingAtTweetsWithBotScores ? (
    <Step2Styles>
      <h3>You have {timeRemainingS} seconds left to find a bot</h3>
      <h4>botsketball score = bot score / num tweets viewed</h4>
    </Step2Styles>
  ) : null;
}

const Step2Styles = styled.div`
  position: fixed;
  inset: 80px calc(50vw - 200px);
  height: fit-content;
  color: white;
  opacity: 0.7;
  background: hsla(0, 0%, 100%, 0.05);
  border-radius: 16px;
  padding: 16px;
  h4 {
    font-size: 0.8em;
  }
`;
const Step1Styles = styled.div`
  position: fixed;
  inset: calc(50vh - 200px) calc(50vw - 200px);
  height: fit-content;
  background: hsla(0, 0%, 0%, 0.8);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0px 2px 30px 8px hsla(0, 0%, 0%, 0.3);
  p {
    text-align: left;
    margin-bottom: 0.8em;
  }
  h3 {
    margin-bottom: 1em;
  }
  button {
    margin-top: 1em;
  }
`;

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
