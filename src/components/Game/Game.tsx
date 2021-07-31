import { Button } from "@material-ui/core";
import { useAtom } from "jotai";
import {
  gameStateAtom,
  GameStepsEnum,
  shotsRemainingAtom,
  SHOTS_REMAINING,
} from "providers/store/store";
import TagTheBotButton from "./TagTheBotButton";
import { useStreamNewTweets } from "components/NavBar/useStreamNewTweets";
import { useDeleteAllTweets } from "components/common/useDeleteAllTweets";
import { useLoading, useTweets } from "providers/store/useSelectors";
import styled from "styled-components/macro";
import {
  useReplaceNodesInDbForUser,
  useSetNodesInDbForUser,
} from "providers/faunaProvider";
import { Canvas } from "@react-three/fiber";
import { BotScoreLegend } from "components/NetworkGraph/Scene/BotScoreLegend";
import { IconButton, Tooltip } from "@material-ui/core";
import { Replay } from "@material-ui/icons";
import { DeviceOrientationOrbitControls } from "./DeviceOrientationOrbitControls";
import { OrbitControls } from "@react-three/drei";
import { useEffect } from "react";
/** renders controls and instructions to play the game */
export function Game() {
  const [shotsRemaining] = useAtom(shotsRemainingAtom);
  const [gameState] = useAtom(gameStateAtom);
  return (
    <GameStyles>
      <div className="shotsRemaining">
        {shotsRemaining} shot{shotsRemaining === 1 ? "" : "s"} left
        {gameState.step === GameStepsEnum.gameOver ? " - game over" : ""}
      </div>
      <GameContent />
    </GameStyles>
  );
}
const GameStyles = styled.div``;
function GameContent() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const tweets = useTweets();
  const loading = useLoading();

  // this one saves in local storage
  const [shotsRemaining, setShotsRemaining] = useAtom(shotsRemainingAtom);

  const { fetchNewTweets } = useStreamNewTweets();
  const deleteAllTweets = useDeleteAllTweets();
  const replaceNodesInDbForUser = useReplaceNodesInDbForUser();
  function startGame() {
    setGameState((p) => ({
      step: GameStepsEnum.lookingAtTweetsWithBotScores,
      startTime: Date.now(),
    }));
    setShotsRemaining(SHOTS_REMAINING);
    deleteAllTweets().then(() => {
      fetchNewTweets().then((newTweets) => {
        replaceNodesInDbForUser(newTweets);
      });
    });
  }
  function continueGame() {
    setGameState((p) => ({
      step: GameStepsEnum.lookingAtTweetsWithBotScores,
      startTime: Date.now(),
    }));
  }
  const setNodesInDb = useSetNodesInDbForUser();
  // game over when no shots remain
  useEffect(() => {
    if (shotsRemaining === 0) {
      setGameState((p) => ({
        step: GameStepsEnum.gameOver,
      }));
      const botTweets = tweets.filter((t) => Boolean(t.botScore));
      console.log("🌟🚨 ~ useEffect ~ botTweets", botTweets);
      setNodesInDb(botTweets);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shotsRemaining]);
  const scale = 1.6;
  const canContinue = tweets.length > 0 && shotsRemaining > 0;

  switch (gameState.step) {
    case GameStepsEnum.welcome:
      return (
        <Step1Styles>
          <div className="content">
            <h3>Twitter Botsketball 🤖🏀</h3>
            <p>
              <a href="https://botometer.osome.iu.edu/">Botometer API</a>{" "}
              estimates which users are more likely to be a bot.
            </p>
            <p>There are different kinds of bot:</p>
            <div style={{ margin: "auto", width: "fit-content" }}>
              <Canvas style={{ width: 240, height: 280 }}>
                {getIsMobileDevice() ? (
                  <DeviceOrientationOrbitControls />
                ) : (
                  <OrbitControls {...({} as any)} />
                )}
                <BotScoreLegend
                  isInStartMenu={true}
                  position={[0, 0.2, 0]}
                  scale={[scale, scale, scale]}
                />
              </Canvas>
            </div>
            <p>
              You'll see 10 twitter accounts from the{" "}
              <a
                href="https://developer.twitter.com/en/docs/tutorials/consuming-streaming-data"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter Stream API
              </a>
              .
            </p>
            <p>Take your shot, guess which one is a bot!</p>
            {/*
            <p style={{ textAlign: "center" }}>
              TODO: compete with others to get the highest bot score!
            </p> */}
            {canContinue && (
              <Button
                variant="contained"
                color="primary"
                onClick={continueGame}
                style={{ marginRight: 12 }}
              >
                Continue
              </Button>
            )}
            <Button
              variant="contained"
              color={canContinue ? "secondary" : "primary"}
              onClick={startGame}
            >
              {canContinue ? "Play Again" : "Play"}
            </Button>
          </div>
        </Step1Styles>
      );
    case GameStepsEnum.lookingAtTweetsWithBotScores:
      return (
        <Step2Styles>
          <Tooltip title="Start Over">
            <IconButton className="btnStartOver" onClick={startGame}>
              <Replay />
            </IconButton>
          </Tooltip>
          <TagTheBotButton />
        </Step2Styles>
      );
    case GameStepsEnum.gameOver:
      return (
        <>
          <Button
            color="secondary"
            disabled={loading}
            variant="contained"
            onClick={startGame}
            style={{ top: "20px", textTransform: "none" }}
          >
            Play again
          </Button>
        </>
      );
    default:
      return null;
  }
}

/*<Step2Styles>
Sorry, out of time!
<Button onClick={startGame}>Try again?</Button>
</Step2Styles> */

const Step2Styles = styled.div`
  .btnStartOver {
    position: fixed;
    top: 0;
    right: 0;
  }
`;
const Step1Styles = styled.div`
  position: fixed;
  inset: 0;
  margin: auto;
  display: grid;
  place-items: center;
  box-shadow: 0px 2px 30px 8px hsla(0, 0%, 0%, 0.3);
  .content {
    height: fit-content;
    width: fit-content;
    background: hsla(0, 0%, 0%, 0.92);
    padding: 32px;
    border-radius: 16px;
  }
  p {
    text-align: center;
    margin-bottom: 0.5em;
  }
  h3 {
    margin-bottom: 1em;
  }
  button {
    margin-top: 1em;
  }
  a {
    text-decoration: none;
    font-weight: bold;
    color: cornflowerblue;
  }
`;
function getIsMobileDevice() {
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  console.log("🌟🚨 ~ getIsMobileDevice ~ isMobile", isMobile);
  return isMobile;
}
