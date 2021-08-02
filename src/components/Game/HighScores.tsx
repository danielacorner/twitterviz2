import { useAtom } from "jotai";
import {
  appUserIdAtom,
  gameStateAtom,
  GameStepsEnum,
  scoreAtom,
} from "providers/store/store";
import { a, animated } from "react-spring";
import { useEffect, useState } from "react";
import { ScoreStyles } from "./ScoreStyles";
import { faunaClient } from "providers/faunaProvider";
import { query as q } from "faunadb";
import { Button, IconButton, TextField } from "@material-ui/core";
import { Check, Restore } from "@material-ui/icons";

export function HighScores() {
  const [gameState] = useAtom(gameStateAtom);
  const [score] = useAtom(scoreAtom);
  const isGameOver = gameState.step === GameStepsEnum.gameOver;
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  // useMount(() => {
  //   fetchHighScores().then((data) => {
  //     console.log("🌟🚨 ~ fetchHighScores ~ data", data);
  //     setHighScores(data);
  //   });
  // });
  const [userId] = useAtom(appUserIdAtom);
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
        score > (lowestHighScore === Infinity ? 0 : lowestHighScore);
      console.log("🌟🚨 ~ useEffect ~ isNewHighScore", isNewHighScore);

      if (isNewHighScore) {
        setIsSubmitFormOpen(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver]);

  const deleteAllHighScores = useDeleteAllHighScores();

  return !isGameOver ? null : (
    <ScoreStyles>
      <div className="high-scores">
        <animated.div className="content">
          <h1>High Scores</h1>
          <h2>
            {highScores.map(({ name, score }) => (
              <p key={name}>
                {name}: {score.toFixed(0)}
              </p>
            ))}
          </h2>
        </animated.div>
      </div>
      {isSubmitFormOpen && (
        <SubmitHighScoreForm
          {...{ highScores, setHighScores, setIsSubmitFormOpen }}
        />
      )}
      {process.env.NODE_ENV !== "production" && (
        <IconButton
          style={{ position: "fixed", bottom: 0, right: 0 }}
          onClick={deleteAllHighScores}
        >
          <Restore />
        </IconButton>
      )}
    </ScoreStyles>
  );
}
function useDeleteAllHighScores() {
  return () =>
    faunaClient.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("player_scores"))),
        q.Lambda((x) => q.Delete(x))
      )
    );
}

type HighScore = {
  userId: string;
  name: string;
  score: number;
};

const NUM_SCORES = 12;
const MAX_CHARACTERS_IN_NAME = 20;
function SubmitHighScoreForm({
  highScores,
  setHighScores,
  setIsSubmitFormOpen,
}) {
  const [name, setName] = useState("");
  const [userId] = useAtom(appUserIdAtom);
  const [score] = useAtom(scoreAtom);
  return (
    <div className="submit-high-score">
      <div className="content">
        <h4>New High Score! 🎉</h4>
        <TextField
          onChange={(e) => {
            setName(e.target.value.substring(0, MAX_CHARACTERS_IN_NAME));
          }}
          value={name}
          label="name"
        />
        <IconButton
          disabled={name === ""}
          onClick={() => {
            const newHighScore = {
              userId,
              name,
              score,
            };
            saveHighScore(newHighScore).then(() => {
              setHighScores(
                [...highScores, newHighScore]
                  .sort((a, b) => a.score - b.score)
                  .slice(0, NUM_SCORES)
              );
              setIsSubmitFormOpen(false);
            });
          }}
        >
          <Check />
        </IconButton>
      </div>
    </div>
  );
}

function fetchHighScores(): Promise<HighScore[]> {
  // get all documents https://stackoverflow.com/questions/61488323/how-to-get-all-documents-from-a-collection-in-faunadb
  return faunaClient
    .query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("player_scores"))),
        q.Lambda((x) => q.Get(x))
      )
    )
    .then((ret) => {
      console.log("🌟🚨 ~ .then ~ ret", ret);
      const scores = (ret as any).data?.map((d) => d.data) || [];
      console.log("🌟🚨 ~ .then ~ scores", scores);
      const highScores = scores
        .sort((a, b) => a.score - b.score)
        .slice(0, NUM_SCORES);
      console.log("🌟🚨 ~ .then ~ highScores", highScores);
      return scores as HighScore[];
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}
function saveHighScore(highScore: HighScore): Promise<HighScore[]> {
  return fetch("/api/save_highscore", {
    headers: { "content-type": "application/json" },
    method: "POST",
    body: JSON.stringify(highScore),
  })
    .then((response) => response.json())
    .then((ret) => {
      console.log("🌟🚨 ~ saveHighScore ~ ret", ret);
      return ret;
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}
