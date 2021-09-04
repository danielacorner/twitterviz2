import { useAtom } from "jotai";
import {
  gameStateAtom,
  GameStepsEnum,
  scoreAtom,
  serverErrorAtom,
  shotsRemainingAtom,
  SHOTS_REMAINING,
} from "providers/store/store";
import { useStreamNewTweets } from "components/NavBar/useStreamNewTweets";
import { useDeleteAllTweets } from "components/common/useDeleteAllTweets";
import { useSetLoading, useSetTweets } from "providers/store/useSelectors";
import styled from "styled-components/macro";
import { useReplaceNodesInDbForUser } from "providers/faunaProvider";
import { GameStateHUD } from "./GameStateHUD/GameStateHUD";
import { BtnStartOver } from "./BtnStartOver";
import { StartPage } from "./StartPage";
import { useMount } from "utils/utils";

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

export const usePlayAgain = () => {
  const { fetchNewTweetsFromTwitterApi, fetchNewTweetsFromDB } =
    useStreamNewTweets();
  const deleteAllTweets = useDeleteAllTweets();
  const replaceNodesInDbForUser = useReplaceNodesInDbForUser();
  const setTweets = useSetTweets();
  const setLoading = useSetLoading();
  const [, setScore] = useAtom(scoreAtom);
  const [, setShotsRemaining] = useAtom(shotsRemainingAtom);
  const [, setServerError] = useAtom(serverErrorAtom);
  return () => {
    setLoading(true);
    deleteAllTweets().then((ret) => {
      fetchNewTweetsFromTwitterApi().then(
        ({ error, data: newTweets, msUntilRateLimitReset }) => {
          if (error || msUntilRateLimitReset) {
            replaceNodesInDbForUser(newTweets);
            setTweets(newTweets);
            setScore(0);
            setShotsRemaining(SHOTS_REMAINING);
            setLoading(false);
            console.log("🌟🚨🌟🚨🌟🚨🌟🚨 ~ deleteAllTweets ~ error", error);
            setServerError(
              error || msUntilRateLimitReset
                ? {
                    ...error,
                    ...(msUntilRateLimitReset ? { msUntilRateLimitReset } : {}),
                  }
                : null
            );

            fetchNewTweetsFromDB().then(
              ({
                error: dbError,
                data: newTweetsFromDb,
                msUntilRateLimitReset: msUntilRateLimitResetFromDb,
              }) => {
                console.log(
                  "🌟🚨 ~ deleteAllTweets ~ msUntilRateLimitResetFromDb",
                  msUntilRateLimitResetFromDb
                );
                setTweets(newTweetsFromDb);

                return;
              }
            );
            return;
          }
        }
      );
    });
  };
};

export function useStartLookingAtTweets() {
  const [, setGameState] = useAtom(gameStateAtom);

  return () => {
    setGameState((p) => ({
      ...p,
      step: GameStepsEnum.lookingAtTweetsWithBotScores,
      startTime: Date.now(),
    }));
  };
}

function GameContent() {
  const [gameState] = useAtom(gameStateAtom);

  const startGame = usePlayAgain();

  const startLookingAtTweets = useStartLookingAtTweets();

  // start the game on mount
  useMount(startGame);

  // can continue game instead of starting a new one

  switch (gameState.step) {
    case GameStepsEnum.welcome:
      return <StartPage {...{ startLookingAtTweets }} />;
    case GameStepsEnum.lookingAtTweetsWithBotScores:
      return <BtnStartOver />;
    // case GameStepsEnum.gameOver:
    //   return (
    //     <>

    //     </>
    //   );
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
