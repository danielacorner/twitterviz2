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
import { useMount } from "utils/utils";
import { useMachine } from "@xstate/react";
import { createMachine } from "xstate";
import { Button } from "@material-ui/core";

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

const gameMachine = createMachine({
  id: "toggle",
  initial: "inactive",
  states: {
    inactive: {
      on: { TOGGLE: "active" },
    },
    active: {
      on: { TOGGLE: "inactive" },
    },
  },
});
// The context (extended state) of the machine
interface LightContext {
  elapsed: number;
}

// The events that the machine handles
type LightEvent =
  | { type: "TIMER" }
  | { type: "POWER_OUTAGE" }
  | { type: "PED_COUNTDOWN"; duration: number };

const lightMachine = createMachine<LightContext, LightEvent>({
  key: "light",
  initial: "green",
  context: { elapsed: 0 },
  states: {
    green: {
      on: {
        TIMER: { target: "yellow" },
        POWER_OUTAGE: { target: "red" },
      },
    },
    yellow: {
      on: {
        TIMER: { target: "red" },
        POWER_OUTAGE: { target: "red" },
      },
    },
    red: {
      on: {
        TIMER: { target: "green" },
        POWER_OUTAGE: { target: "red" },
      },
      initial: "walk",
      states: {
        walk: {
          on: {
            PED_COUNTDOWN: { target: "wait" },
          },
        },
        wait: {
          on: {
            PED_COUNTDOWN: {
              target: "stop",
              cond: (context, event) => {
                return event.duration === 0 && context.elapsed > 0;
              },
            },
          },
        },
        stop: {
          // Transient transition
          always: {
            target: "#light.green",
          },
        },
      },
    },
  },
});

/** renders controls and instructions to play the game */
function Game() {
  const [gameStep, setGameStep] = useState(0);
  const [state, send] = useMachine(gameMachine);
  useMount(() => {
    console.log("🌟🚨 ~ Game ~ state", state);
    setGameStep(1);
  });
  console.log("🌟🚨 ~ Game ~ state", state);

  return (
    <GameStyles>
      {gameStep === 1 ? (
        <>
          <h3>Twitter Botsketball 🤖🏀</h3>
          <p>
            1. look at 10 twitter accounts and their bot scores from Botometer
            API
          </p>
          <p>
            2. look at 10 more twitter accounts, and guess which one is a bot!
          </p>
          <p style={{ textAlign: "center" }}>
            compete with others to get the highest bot score!
          </p>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setGameStep((p) => p + 1)}
          >
            Go
          </Button>
        </>
      ) : null}
      <div className="stuff">{JSON.stringify(state)}</div>
    </GameStyles>
  );
}

const GameStyles = styled.div`
  position: fixed;
  inset: calc(50vh - 200px) calc(50vw - 200px);
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
  .stuff {
    font-size: 0.8em;
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
