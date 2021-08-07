import { useAtom } from "jotai";
import {
  appUserIdAtom,
  gameStateAtom,
  GameStepsEnum,
  scoreAtom,
} from "providers/store/store";
import { useEffect, useState } from "react";
import { IconButton } from "@material-ui/core";
import { Restore } from "@material-ui/icons";
import { NUM_SCORES, SubmitHighScoreForm } from "./SubmitHighScoreForm";
import {
  HighScoreType,
  fetchAllHighScoresSorted,
  useDeleteAllHighScores,
} from "./highScoresUtils";
import styled from "styled-components/macro";
import { uniqBy } from "lodash";
import { sortDescendingByScore } from "./sortDescendingByScore";
import { useSpring, animated } from "react-spring";
import { useMount } from "utils/utils";
import { Html } from "@react-three/drei";
import { useControls } from "leva";

const DIV_WIDTH = 280;
export function HighScores() {
  const [gameState] = useAtom(gameStateAtom);
  const [userScore] = useAtom(scoreAtom);
  const isGameOver = gameState.step === GameStepsEnum.gameOver;
  const [highScores, setHighScores] = useState<HighScoreType[]>([]);
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

  const [submittedName, setSubmittedName] = useState("");
  const { x, y, z, scale } = useControls({ x: 0, y: 0, z: 240, scale: 10 });
  return !isGameOver ? null : (
    <Html transform={true} position={[x, y, z]} scale={[scale, scale, scale]}>
      <HighScoresStyles>
        <animated.div className="content">
          <h1>🌟 High Scores 🌟</h1>
          <div className="newHighScores">
            {highScores.map(({ name, score, isNewHighScore }, idx) => {
              const wasJustSubmitted = name === submittedName;
              return (
                <HighScore
                  {...{
                    name,
                    idx,
                    isNewHighScore,
                    wasJustSubmitted,
                    isSubmitFormOpen,
                    highScores,
                    setHighScores,
                    setSubmittedName,
                    setIsSubmitFormOpen,
                    score,
                  }}
                />
              );
            })}
          </div>
        </animated.div>
        {process.env.NODE_ENV !== "production" && (
          <IconButton
            style={{ position: "absolute", bottom: 0, right: 0 }}
            onClick={deleteAllHighScores}
          >
            <Restore />
          </IconButton>
        )}
      </HighScoresStyles>
    </Html>
  );
}

function HighScore({
  name,
  idx,
  isNewHighScore,
  wasJustSubmitted,
  isSubmitFormOpen,
  highScores,
  setHighScores,
  setSubmittedName,
  setIsSubmitFormOpen,
  score,
}: {
  name: string;
  idx: number;
  isNewHighScore: boolean | undefined;
  wasJustSubmitted: boolean | undefined;
  isSubmitFormOpen: boolean;
  highScores: HighScoreType[];
  setHighScores;
  setSubmittedName;
  setIsSubmitFormOpen;
  score: number;
}): JSX.Element {
  return (
    <div className="highScore" key={name}>
      <div className="num">{idx + 1}.</div>
      <div className="name">
        {isNewHighScore && isSubmitFormOpen ? (
          <SubmitHighScoreForm
            {...{
              highScores,
              setHighScores,
              setSubmittedName,
              setIsSubmitFormOpen,
            }}
          />
        ) : wasJustSubmitted ? (
          <AnimatedName {...{ name }} />
        ) : (
          name
        )}
      </div>
      <div className="score">{score.toFixed(0)}</div>
    </div>
  );
}

function AnimatedName({ name }) {
  return (
    <AnimatedNameStyles>
      {name.split("").map((letter, idx) => (
        <AnimatedLetter
          key={idx}
          {...{
            progress: name.length === 1 ? 1 : idx / (name.length - 1),
            letter,
            idx,
          }}
        />
      ))}
    </AnimatedNameStyles>
  );
}
const AnimatedNameStyles = styled.div`
  display: flex;
`;

function AnimatedLetter({ progress, letter, idx }) {
  const [sprung, setSprung] = useState(false);
  useMount(() => {
    setTimeout(() => {
      setSprung(true);
    }, 20 * idx);
  });
  const heightUpAndDown =
    Math.round(Math.sin(progress * Math.PI) * 1000) / 1000;
  const spring = useSpring({
    transform: `scale(${sprung ? 2 : 1}) rotate(${
      sprung ? -6 + progress * 5 : 0
    }deg) translate(${sprung ? idx * 2 : 0}px,${
      sprung ? -4 - 5 * heightUpAndDown : 0
    }px)`,
    transformOrigin: "left",
    letterSpacing: sprung ? 1 : 0,
    color: sprung ? `#ecdd56` : "#ffffff",
    config: {
      tension: 500,
      friction: 15,
      mass: 0.7,
    },
    onRest: () => {
      setSprung(false);
    },
  });
  return (
    <>
      <animated.div style={spring}>{letter}</animated.div>
      {progress === 1 ? <AnimatedTadah {...{ idx }} /> : null}
    </>
  );
}
function AnimatedTadah({ idx }) {
  const [sprung, setSprung] = useState(false);
  useMount(() => {
    setTimeout(() => {
      setSprung(true);
    }, 30);
  });
  const spring = useSpring({
    transform: `scale(${sprung ? 2 : 1}) rotate(${
      sprung ? -6 + 5 : 0
    }deg) translate(${sprung ? idx * 2 : 0}px,${sprung ? -4 : 0}px)`,
    transformOrigin: "left",
    letterSpacing: sprung ? 1 : 0,
    color: sprung ? `#ecdd56` : "#ffffff",
    marginLeft: 6,
    config: {
      tension: 340,
      friction: 6,
      mass: 0.7,
    },
    onRest: () => {
      setSprung(false);
    },
  });

  return <animated.div style={spring}>⭐</animated.div>;
}

const HighScoresStyles = styled.div`
  &,
  * {
    color: white;
  }
  h1 {
    margin-bottom: 1em;
    font-size: 28px;
  }
  width: 300px;
  display: grid;
  justify-content: center;
  justify-items: center;
  align-items: start;
  .content {
    margin: 0 auto;
    /* width: fit-content; */
    width: ${DIV_WIDTH}px;
    background: #525252c1;
    padding: 14px 14px 38px;
    border-radius: 16px;
    box-shadow: 1px 2px 3px rgba(0, 0, 0, 50%);
  }
  .newHighScores {
    h4 {
      background: #5e5e5eea;
      border-radius: 4px;
      padding: 0.2em 0.5em;
      box-shadow: 0px 2px 2.5px 0.4px #00000053;
    }
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
