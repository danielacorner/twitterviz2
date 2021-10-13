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
import { WAIT_FOR_STREAM_TIMEOUT } from "utils/constants";

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

  const fetchFromDB = () => {
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
  };

  return () => {
    setLoading(true);
    deleteAllTweets().then((ret) => {
      setScore(0);
      setShotsRemaining(SHOTS_REMAINING);

      // try to fetch new tweets from API;
      // if it doesn't respond quickly, then try to fetch from DB

      const timer = window.setTimeout(fetchFromDB, WAIT_FOR_STREAM_TIMEOUT);

      fetchNewTweetsFromTwitterApi().then(
        ({ error, data: newTweets, msUntilRateLimitReset }) => {
          // cancel the DB fetch
          window.clearTimeout(timer);

          if (error || msUntilRateLimitReset) {
            replaceNodesInDbForUser(newTweets);
            setTweets(newTweets);

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
            // on error, fetch from DB immediately
            fetchFromDB();
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
