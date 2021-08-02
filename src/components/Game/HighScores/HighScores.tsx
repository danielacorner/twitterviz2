import { useAtom } from "jotai";
import {
  appUserIdAtom,
  gameStateAtom,
  GameStepsEnum,
  scoreAtom,
} from "providers/store/store";
import { animated } from "react-spring";
import { useEffect, useState } from "react";
import { IconButton } from "@material-ui/core";
import { Restore } from "@material-ui/icons";
import { SubmitHighScoreForm } from "./SubmitHighScoreForm";
import {
  HighScore,
  fetchHighScores,
  useDeleteAllHighScores,
} from "./highScoresUtils";
import styled from "styled-components/macro";

export function HighScores() {
  const [gameState] = useAtom(gameStateAtom);
  const [userScore] = useAtom(scoreAtom);
  const isGameOver = gameState.step === GameStepsEnum.gameOver;
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [isSubmitFormOpen, setIsSubmitFormOpen] = useState(false);

  // save high score on gameover, then display high scores
  useEffect(() => {
    if (isGameOver) {
      fetchHighScores().then((data) => {
        setHighScores(data);
      });
      console.log("🌟🚨 ~ useEffect ~ isGameOver", isGameOver);
      // it's a high score if it's > than the smallest high
      const lowestHighScore = highScores.reduce(
        (acc, cur) => Math.min(acc, cur.score),
        Infinity
      );
      console.log("🌟🚨 ~ useEffect ~ lowestHighScore", lowestHighScore);
      const isNewHighScore =
        userScore > (lowestHighScore === Infinity ? 0 : lowestHighScore);
      console.log("🌟🚨 ~ useEffect ~ isNewHighScore", isNewHighScore);

      if (isNewHighScore) {
        setIsSubmitFormOpen(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver]);

  const deleteAllHighScores = useDeleteAllHighScores();
  const topNminus1HighScores = highScores.slice(0, highScores.length - 2);

  const [userId] = useAtom(appUserIdAtom);
  const newHighScore = {
    userId,
    name: "",
    score: userScore,
    isNewHighScore: true,
  };
  const highScoresWithNewHighScore: {
    isNewHighScore?: boolean;
    userId: string;
    name: string;
    score: number;
  }[] = [...topNminus1HighScores, newHighScore].sort(
    (a, b) => a.score - b.score
  );
  return !isGameOver ? null : (
    <HighScoresStyles>
      <animated.div className="content">
        <h1>High Scores</h1>
        <h2>
          {highScoresWithNewHighScore.map(({ name, score, isNewHighScore }) => {
            return (
              <p key={name}>
                {isNewHighScore && (
                  <>
                    {isSubmitFormOpen ? (
                      <SubmitHighScoreForm
                        {...{
                          highScores,
                          setHighScores,
                          setIsSubmitFormOpen,
                          newHighScore,
                        }}
                      />
                    ) : null}
                  </>
                )}
                {name}: {score.toFixed(0)}
              </p>
            );
          })}
        </h2>
      </animated.div>
      {process.env.NODE_ENV !== "production" && (
        <IconButton
          style={{ position: "fixed", bottom: 0, right: 0 }}
          onClick={deleteAllHighScores}
        >
          <Restore />
        </IconButton>
      )}
    </HighScoresStyles>
  );
}

const HighScoresStyles = styled.div`
  &,
  * {
    color: white;
  }
  position: fixed;
  inset: 0;
  .content {
    margin-top: 128px;
  }
`;
