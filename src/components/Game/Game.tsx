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
  const tweets = useTweets();
  const setNodesInDb = useSetNodesInDbForUser();
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [shotsRemaining] = useAtom(shotsRemainingAtom);

  const startGame = usePlayAgain();

  const startLookingAtTweets = useStartLookingAtTweets();
  // start the game on mount
  useMount(startGame);

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
