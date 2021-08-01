import { useAtom } from "jotai";
import {
  appUserIdAtom,
  gameStateAtom,
  GameStepsEnum,
  scoreAtom,
} from "providers/store/store";
import styled from "styled-components/macro";
import { useSpring, animated, config } from "react-spring";
import { useEffect, useState } from "react";
import { useMount } from "utils/utils";
const Score = () => {
  const [score] = useAtom(scoreAtom);

  // whenever we fetch a bot score, add points to the score
  const { number } = useSpring({
    reset: true,
    number: score,
    config: config.molasses,
    // onRest: () => set(!flip),
  });

  return (
    <ScoreStyles>
      <animated.div className="score">
        Score: {score.toFixed(0)}
        {/* Score: {number.to((n) => n.toFixed(0))} */}
      </animated.div>
      <HighScores />
    </ScoreStyles>
  );
};
const ScoreStyles = styled.div`
  .score {
    position: fixed;
    top: 13px;
    right: 56px;
    width: 100px;
    pointer-events: none;
  }
  .high-scores {
    position: fixed;
    inset: 0;
    .content {
    }
  }
`;

function HighScores() {
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
        fetchHighScores().then((data2) => {
          console.log("🌟🚨 ~ fetchHighScores ~ data2", data2);
          setHighScores(data2);
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver]);

  return (
    <ScoreStyles>
      <div className="high-scores">
        <animated.div className="content">
          <h1>High Scores</h1>
          <h2>
            {highScores.map(({ name, score }) => (
              <p key={name}>
                {name}:{score.toFixed(0)}
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
  return fetch("/api/highscores")
    .then((response) => response.json())
    .then((json) => json.map(({ userId, score }) => ({ userId, score })))
    .catch((err) => {
      console.error(err);
      return [];
    });
}
function saveHighScore(highScore: HighScore): Promise<any> {
  return fetch("/api/save_highscores", {
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

export default Score;
