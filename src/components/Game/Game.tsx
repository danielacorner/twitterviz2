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
  const { fetchNewTweets } = useStreamNewTweets();
  const deleteAllTweets = useDeleteAllTweets();
  const replaceNodesInDbForUser = useReplaceNodesInDbForUser();
  const setTweets = useSetTweets();
  const setLoading = useSetLoading();
  const [, setScore] = useAtom(scoreAtom);
  const [, setShotsRemaining] = useAtom(shotsRemainingAtom);

  return () => {
    setLoading(true);
    deleteAllTweets().then((ret) => {
      fetchNewTweets().then((newTweets) => {
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
