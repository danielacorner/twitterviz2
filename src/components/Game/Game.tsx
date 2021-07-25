import { useState } from "react";
import { Button } from "@material-ui/core";
import { useAtom } from "jotai";
import { gameStateAtom, GameStepsEnum } from "providers/store/store";
import { useInterval } from "utils/useInterval";
import { Step1Styles, Step2Styles } from "../../App";
import TagTheBotButton from "./TagTheBotButton";

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
const COUNTDOWN_TIME_S = 5 * 60;
/** renders controls and instructions to play the game */
export function Game() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [timeRemainingS, setTimeRemainingS] = useState(Infinity);
  const minutes = Math.floor(timeRemainingS / 60);
  const seconds = timeRemainingS % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const isGameOver = timeRemainingS <= 0;
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
          setTimeRemainingS(COUNTDOWN_TIME_S);
          setGameState((p) => ({
            step: GameStepsEnum.lookingAtTweetsWithBotScores,
            startTime: Date.now(),
          }));
        }}
      >
        Go
      </Button>
    </Step1Styles>
  ) : isGameOver ? (
    <Step2Styles>whoopesie</Step2Styles>
  ) : gameState.step === GameStepsEnum.lookingAtTweetsWithBotScores ? (
    <>
      <Step2Styles>
        <h3>You have {formattedTime} seconds left to find a bot</h3>
        <h4>botsketball score = bot score / num tweets viewed</h4>
      </Step2Styles>
      <TagTheBotButton />
    </>
  ) : null;
}
