import { useAtom } from "jotai";
import {
  appUserIdAtom,
  gameStateAtom,
  GameStepsEnum,
  scoreAtom,
} from "providers/store/store";
import { animated } from "react-spring";
import { useEffect, useState } from "react";
import { ScoreStyles } from "./Score";
import { faunaClient } from "providers/faunaProvider";
import { query as q } from "faunadb";

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

  // save high score on gameover, then display high scores
  useEffect(() => {
    if (isGameOver) {
      console.log("🌟🚨 ~ useEffect ~ isGameOver", isGameOver);
      saveHighScore({
        userId,
        name: "test",
        score,
      }).then((data) => {
        console.log("🌟🚨 ~ saveHighScore ~ data", data);
        fetchHighScores().then((data) => {
          setHighScores(data);
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver]);

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
    </ScoreStyles>
  );
}
type HighScore = {
  userId: string;
  name: string;
  score: number;
};
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
      const highScores = scores.sort((a, b) => a.score - b.score).slice(0, 10);
      console.log("🌟🚨 ~ .then ~ highScores", highScores);
      return scores as HighScore[];
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}
function saveHighScore(highScore: HighScore): Promise<any> {
  console.log("🌟🚨 ~ saveHighScore ~ highScore", highScore);
  return fetch("/api/save_highscore", {
    headers: { "content-type": "application/json" },
    method: "POST",
    body: JSON.stringify(highScore),
  })
    .then((response) => response.json())
    .then((json) =>
      json.map(({ userId, name, score }) => ({ userId, name, score }))
    )
    .catch((err) => {
      console.error(err);
      return [];
    });
}
