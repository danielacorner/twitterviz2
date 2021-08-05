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
import { useEffect } from "react";
import { GameStateHUD } from "./GameStateHUD/GameStateHUD";
import { BtnStartOver } from "./BtnStartOver";
import { BOT_SCORE_POPUP_TIMEOUT } from "./TagTheBotButton";
import { StartPage } from "./StartPage";

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

  switch (gameState.step) {
    case GameStepsEnum.welcome:
      return (
        <StartPage {...{ startLookingAtTweets, resetScoreAndFetchNewTweets }} />
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

export function getIsMobileDevice() {
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  return isMobile;
}
