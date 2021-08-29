import { useAtom } from "jotai";
import {
  appUserIdAtom,
  gameStateAtom,
  GameStepsEnum,
  scoreAtom,
} from "providers/store/store";
import { useEffect, useState } from "react";
import { Button, IconButton } from "@material-ui/core";
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
import { useInterval } from "utils/useInterval";
import { darkBackground } from "utils/colors";
import { useLoading } from "providers/store/useSelectors";
import { usePlayAgain, useStartLookingAtTweets } from "../Game";

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
  const loading = useLoading();
  const [submittedName, setSubmittedName] = useState("");
  const resetScoreAndFetchNewTweets = usePlayAgain();
  const startLookingAtTweets = useStartLookingAtTweets();
  return !isGameOver ? null : (
    <Html transform={true} position={[0, 30, 30]} scale={[18, 18, 18]}>
      <HighScoresStyles>
        <animated.div className="content">
          <h1>🌟 High Scores 🌟</h1>
          <div className="newHighScores">
            {/* high score or empty score, so the height is constant */}
            {[...new Array(NUM_SCORES)]
              .map((_, idx) => ({
                isNewHighScore: false,
                ...(highScores[idx] || { name: "", score: 0 }),
              }))
              .map(({ name, score, isNewHighScore }, idx) => {
                const wasJustSubmitted = name === submittedName;
                return (
                  <HighScore
                    key={idx}
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
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to delete all high scores?"
                )
              ) {
                deleteAllHighScores();
              }
            }}
          >
            <Restore />
          </IconButton>
        )}
        <Button
          className="btnPlayAgain"
          color="secondary"
          disabled={loading}
          variant="contained"
          onClick={() => {
            resetScoreAndFetchNewTweets();
            startLookingAtTweets();
          }}
        >
          Play again
        </Button>
        {/* TODO: learn more page? */}
      </HighScoresStyles>
    </Html>
  );
}

const LEARN_MORE_RESOURCES = [
  {
    title: "Secrets of Social Media PsyOps - BiaSciLab",
    description: `Psychological Warfare through social media is one of the most powerful weapons in today's political battlefield. PsyOps groups have figured out how to sharpen the blade through algorithms and targeted advertising. Nation states are using PsyOps to influence the citizens of their enemies, fighting battles from behind the keyboard.

In this talk, BiaSciLab with cover a brief history of PsyOps and how it has been used both on the battlefield and the political stage. Followed by a dive deep into how it works on the mind and how PsyOps groups are using social media to influence the political climate and elections worldwide.`,
    url: "https://www.youtube.com/watch?v=6pse_lOyT14",
  },
];

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
    <div
      className={`highScore${isNewHighScore ? " isNewHighScore" : ""}`}
      key={name}
    >
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
  align-items: flex-end;
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
      setTimeout(() => {
        setSprung(false);
      }, 200);
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
    transform: `translate(${sprung ? idx * 20 : 0}px,${
      sprung ? -20 : 0
    }px) scale(${sprung ? 3 : 1}) rotate(${sprung ? 10 : 0}deg)`,
    transformOrigin: "center",
    display: "flex",
    letterSpacing: sprung ? 1 : 0,
    marginLeft: 6,
    zIndex: 2,
    config: {
      tension: 340,
      friction: 8,
      mass: 0.8,
      clamp: !sprung,
    },
    delay: 0,
    onRest: () => {
      setSprung(false);
    },
  });

  const [rotations, setRotations] = useState(`0.2,0.6,0.3`);

  useInterval({
    callback: () => {
      setRotations(
        `${Math.round(Math.random() ** 0.5 * 10) / 10},${
          Math.round(Math.random() ** 0.5 * 10) / 10
        },${Math.round(Math.random() ** 0.5 * 10) / 10}`
      );
    },
    delay: 400,
    immediate: false,
  });

  const spring2 = useSpring({
    transform: `rotate3d(${rotations},${sprung ? 780 : 0}deg)`,
    config: { friction: 6, tension: 20, mass: 1.4 },
  });
  return (
    <animated.div style={spring}>
      <animated.div style={spring2}>⭐</animated.div>
    </animated.div>
  );
}

const HighScoresStyles = styled.div`
  &,
  * {
    color: white;
  }
  h1 {
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
    background: ${darkBackground};
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
    &.isNewHighScore {
      .num,
      .score {
        text-shadow: 1px 2px 3px #000000cc;
      }
    }
  }
  .score {
    text-align: right;
  }
  .MuiInput-input {
    box-shadow: 0px 2px 0px 0 #000000bf;
  }
  .btnPlayAgain {
    position: absolute;
    bottom: -18px;
    left: 0;
    right: 0;
    margin: auto;
    width: fit-content;
  }
`;
