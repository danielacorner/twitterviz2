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
import { NUM_SCORES, SubmitHighScoreForm } from "./SubmitHighScoreForm";
import {
  HighScore,
  fetchAllHighScoresSorted,
  useDeleteAllHighScores,
} from "./highScoresUtils";
import styled from "styled-components/macro";
import { uniqBy } from "lodash";
import { sortDescendingByScore } from "./sortDescendingByScore";

export function HighScores() {
  const [gameState] = useAtom(gameStateAtom);
  const [userScore] = useAtom(scoreAtom);
  const isGameOver = gameState.step === GameStepsEnum.gameOver;
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [isSubmitFormOpen, setIsSubmitFormOpen] = useState(false);
  const [userId] = useAtom(appUserIdAtom);

  // save high score on gameover, then display high scores
  useEffect(() => {
    if (isGameOver) {
      fetchAllHighScoresSorted().then((data) => {
        const highScoresSliced = data.slice(0, NUM_SCORES);

        // it's a high score if it's > than the smallest high
        const lowestHighScore = highScores.reduce(
          (acc, cur) => Math.min(acc, cur.score),
          Infinity
        );
        const isNotEnoughScoresYet = highScoresSliced.length < NUM_SCORES;
        const isNewHighScore =
          isNotEnoughScoresYet ||
          userScore > (lowestHighScore === Infinity ? 0 : lowestHighScore);

        if (isNewHighScore) {
          setIsSubmitFormOpen(true);
          const newHighScore = {
            userId,
            name: "",
            score: userScore,
            isNewHighScore: true,
          };
          const highScoresDeduped = uniqBy(
            highScoresSliced.sort(sortDescendingByScore),
            (d) => d.name
          );
          const topNminus1HighScores = highScoresDeduped
            .slice(0, NUM_SCORES - 1)
            .filter(Boolean);
          console.log(
            "🌟🚨 ~ fetchAllHighScoresSorted ~ topNminus1HighScores",
            topNminus1HighScores
          );

          const highScoresWithNewHighScore = [
            ...topNminus1HighScores,
            newHighScore,
          ].sort(sortDescendingByScore);

          setHighScores(highScoresWithNewHighScore);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver]);

  const deleteAllHighScores = useDeleteAllHighScores();

  return !isGameOver ? null : (
    <HighScoresStyles>
      <animated.div className="content">
        <h1>🌟 High Scores 🌟</h1>
        <div className="highScores">
          {highScores.map(({ name, score, isNewHighScore }, idx) => {
            return (
              <div className="highScore" key={name}>
                <div className="num">{idx + 1}.</div>
                <div className="name">
                  {isNewHighScore && isSubmitFormOpen ? (
                    <SubmitHighScoreForm
                      {...{
                        highScores,
                        setHighScores,
                        setIsSubmitFormOpen,
                      }}
                    />
                  ) : (
                    name
                  )}
                </div>
                <div className="score">{score.toFixed(0)}</div>
              </div>
            );
          })}
        </div>
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
  h1 {
    margin-bottom: 1em;
  }
  position: fixed;
  inset: 0;
  .content {
    margin: 128px auto auto;
    width: fit-content;
    background: #7b7b7b6c;
    padding: 14px 14px 38px;
    border-radius: 16px;
    box-shadow: 1px 2px 3px rgba(0, 0, 0, 50%);
  }
  .highScores {
  }
  .name {
  }
  .highScore {
    height: 40px;
    align-content: end;
    align-items: flex-end;
    margin: auto;
    width: 240px;
    gap: 12px;
    display: grid;
    grid-template-columns: auto auto 1fr;
  }
  .score {
    text-align: right;
  }
`;
