import { Button } from "@material-ui/core";
import { useAtom } from "jotai";
import {
  gameStateAtom,
  GameStepsEnum,
  scoreAtom,
  shotsRemainingAtom,
  SHOTS_REMAINING,
} from "providers/store/store";
import { useStreamNewTweets } from "components/NavBar/useStreamNewTweets";
import { useDeleteAllTweets } from "components/common/useDeleteAllTweets";
import {
  useLoading,
  useSetLoading,
  useSetTweets,
  useTweets,
} from "providers/store/useSelectors";
import styled from "styled-components/macro";
import {
  useReplaceNodesInDbForUser,
  useSetNodesInDbForUser,
} from "providers/faunaProvider";
import { Canvas } from "@react-three/fiber";
import { BotScoreLegend } from "components/Game/GameStateHUD/BotScoreLegend";
import { DeviceOrientationOrbitControls } from "./DeviceOrientationOrbitControls";
import { OrbitControls } from "@react-three/drei";
import { useEffect } from "react";
import { popupBaseCss } from "./popupBaseCss";
import { GameStateHUD } from "./GameStateHUD/GameStateHUD";
import { BtnStartOver } from "./BtnStartOver";
import { BOT_SCORE_POPUP_TIMEOUT } from "./TagTheBotButton";
/** renders controls and instructions to play the game */
export function Game() {
  return (
    <GameStyles>
      {/* always visible */}
      <GameStateHUD />

      {/* switches for each step */}
      <GameContent />
    </GameStyles>
  );
}
const GameStyles = styled.div``;

function GameContent() {
  const tweets = useTweets();
  const loading = useLoading();
  const { fetchNewTweets } = useStreamNewTweets();
  const deleteAllTweets = useDeleteAllTweets();
  const replaceNodesInDbForUser = useReplaceNodesInDbForUser();
  const isLoading = useLoading();
  const setTweets = useSetTweets();
  const setLoading = useSetLoading();
  const setNodesInDb = useSetNodesInDbForUser();
  const [, setScore] = useAtom(scoreAtom);
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [shotsRemaining, setShotsRemaining] = useAtom(shotsRemainingAtom);

  function resetScoreAndFetchNewTweets() {
    setLoading(true);
    deleteAllTweets().then((ret) => {
      console.log("🌟🚨 ~ deleteAllTweets ", ret);
      fetchNewTweets().then((newTweets) => {
        console.log("🌟🚨 ~ fetchNewTweets ~ newTweets", newTweets);
        if (!newTweets) {
          return;
        }
        replaceNodesInDbForUser(newTweets);
        setTweets(newTweets);
        setScore(0);
        setShotsRemaining(SHOTS_REMAINING);
        setLoading(false);
      });
    });
  }

  function startLookingAtTweets() {
    setGameState((p) => ({
      ...p,
      step: GameStepsEnum.lookingAtTweetsWithBotScores,
      startTime: Date.now(),
    }));
  }

  // game over when no shots remain
  useEffect(() => {
    if (shotsRemaining === 0) {
      setTimeout(() => {
        setGameState((p) => ({ ...p, step: GameStepsEnum.gameOver }));
        const botTweets = tweets.filter((t) => Boolean(t.botScore));
        setNodesInDb(botTweets);
      }, BOT_SCORE_POPUP_TIMEOUT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shotsRemaining]);

  // can continue game instead of starting a new one
  const canContinue = tweets.length > 0 && shotsRemaining > 0;

  switch (gameState.step) {
    case GameStepsEnum.welcome:
      return (
        <Step1Styles>
          <div className="content">
            <h3>Twitter Botsketball 🤖🏀</h3>
            <p>Twitter's known to be full of bots.</p>
            <p>
              For example,{" "}
              <a
                href="https://www.npr.org/sections/coronavirus-live-updates/2020/05/20/859814085/researchers-nearly-half-of-accounts-tweeting-about-coronavirus-are-likely-bots"
                target="_blank"
                rel="noopener noreferrer"
              >
                researchers at Carnegie Mellon University reported that{" "}
                <span style={{ fontWeight: "bold", color: "cornflowerblue" }}>
                  half of all accounts
                </span>{" "}
                spreading messages about the coronavirus pandemic are likely
                bots
              </a>
            </p>
            <p>There are different kinds of bot:</p>
            <div style={{ margin: "auto", width: "fit-content" }}>
              <Canvas style={{ width: 240, height: 240 }}>
                {getIsMobileDevice() ? (
                  <DeviceOrientationOrbitControls />
                ) : (
                  <OrbitControls {...({} as any)} />
                )}
                <BotScoreLegend
                  isInStartMenu={true}
                  position={[0, 0.2, 0]}
                  scale={[1.3, 1.3, 1.3]}
                />
              </Canvas>
            </div>
            <p>
              You'll see 10 twitter accounts from{" "}
              <a
                href="https://developer.twitter.com/en/docs/tutorials/consuming-streaming-data"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter Stream API
              </a>
              .
            </p>
            <p>
              Guess which ones are bots. We'll get their a "bot score" from{" "}
              <a href="https://botometer.osome.iu.edu/">Botometer API</a>.
            </p>

            <div
              style={{
                fontStyle: "italic",
                fontSize: 14,
                marginBottom: -6,
                marginTop: 16,
              }}
            >
              <p style={{ marginBottom: 0 }}>Take your shot,</p>
              <p>guess which one is a bot!</p>
            </div>
            {/*
            <p style={{ textAlign: "center" }}>
              TODO: compete with others to get the highest bot score!
            </p> */}
            {canContinue ? (
              <Button
                variant="contained"
                color="primary"
                disabled={isLoading}
                onClick={() => {
                  startLookingAtTweets();
                }}
                style={{ marginRight: 12 }}
              >
                Continue
              </Button>
            ) : (
              <Button
                disabled={isLoading}
                variant="contained"
                color={canContinue ? "secondary" : "primary"}
                onClick={() => {
                  resetScoreAndFetchNewTweets();
                  startLookingAtTweets();
                }}
              >
                {canContinue ? "Play Again" : "Play"}
              </Button>
            )}
            <div style={{ fontSize: 14, marginTop: 12 }}>
              🤖 higher bot score = more points ⭐
            </div>
          </div>
        </Step1Styles>
      );
    case GameStepsEnum.lookingAtTweetsWithBotScores:
      return <BtnStartOver />;
    case GameStepsEnum.gameOver:
      return (
        <>
          <Button
            color="secondary"
            disabled={loading}
            variant="contained"
            onClick={() => {
              resetScoreAndFetchNewTweets();
              startLookingAtTweets();
            }}
            style={{
              bottom: 72,
              textTransform: "none",
              position: "fixed",
              left: 0,
              right: 0,
              margin: "auto",
              width: "fit-content",
              zIndex: 999999999,
            }}
          >
            Play again
          </Button>
        </>
      );
    default:
      return null;
  }
}

const Step1Styles = styled.div`
  position: fixed;
  inset: 0;
  margin: auto;
  display: grid;
  place-items: center;
  box-shadow: 0px 2px 30px 8px hsla(0, 0%, 0%, 0.3);
  .content {
    ${popupBaseCss}
    max-width: calc(100vw - 32px);
    @media (min-width: 768px) {
      max-width: 600px;
    }
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
    color: cornflowerblue !important;
    &:visited {
      color: cornflowerblue !important;
    }
  }
`;
function getIsMobileDevice() {
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  return isMobile;
}
