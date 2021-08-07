import { useState } from "react";
import { IconButton, TextField } from "@material-ui/core";
import { Check } from "@material-ui/icons";
import { saveHighScore } from "./highScoresUtils";
import styled from "styled-components/macro";
import { useLoading, useSetLoading } from "providers/store/useSelectors";
import { useAtom } from "jotai";
import { appUserIdAtom, scoreAtom } from "providers/store/store";
import { sortDescendingByScore } from "./sortDescendingByScore";
import { useSpring, animated } from "react-spring";
import { useMount } from "utils/utils";

export const NUM_SCORES = 12;
export const MAX_CHARACTERS_IN_NAME = 20;
export function SubmitHighScoreForm({
  highScores,
  setHighScores,
  setSubmittedName,
  setIsSubmitFormOpen,
}) {
  const [name, setName] = useState("");
  const isLoading = useLoading();
  const [score] = useAtom(scoreAtom);
  const [userId] = useAtom(appUserIdAtom);
  const setLoading = useSetLoading();
  const newHighScore = { isNewHighScore: true, score, name, userId };
  const [isSubmitted, setIsSubmitted] = useState(false);
  function saveHighScoreAndUpdate() {
    setIsSubmitted(true);
    setLoading(true);
    saveHighScore(newHighScore).then(() => {
      const newHighScores = getHighScoresFromNewHighScore(
        newHighScore,
        name,
        highScores
      );
      setHighScores(newHighScores);
      setLoading(false);
      setIsSubmitFormOpen(false);
      setSubmittedName(name);
    });
  }
  /* function setIsSubmitAnimatingTest() {
    setIsSubmitted(true);
    setLoading(true);
    setTimeout(() => {
      const newHighScores = getHighScoresFromNewHighScore(
        newHighScore,
        name,
        highScores
      );
      setHighScores(newHighScores);
      setIsSubmitFormOpen(false);
      setLoading(false);
      setSubmittedName(name);
    }, 1000);
  } */

  const springButtonOnSubmit = useSpring({
    transform: `rotate(${isSubmitted ? 0.3 : 0}turn) scale(${
      isSubmitted ? 0 : 1
    })`,
    opacity: isSubmitted ? 0 : 1,
    config: {
      tension: 160,
      mass: 5,
      friction: 30,
    },
  });

  const [isInputSprung, setIsInputSprung] = useState(false);
  useMount(() => {
    setTimeout(() => {
      setIsInputSprung(true);
    }, 250);
  });
  const isSprung = isInputSprung && !isSubmitted;
  const springFormRowOnSubmit = useSpring({
    transform: `rotate(${isSprung ? 2 : 0}deg) scale(${isSprung ? 1.1 : 1})`,
    config: {
      tension: 450,
      mass: 1,
      friction: 20,
    },
    onRest: () => {
      setIsInputSprung(false);
    },
  });

  return (
    <SubmitHighScoreFormStyles {...{ isSubmitted }}>
      <div className="submitHighScoreContent">
        <div className="newHighScore">
          <h4>New High Score!</h4>
          <div>🎉</div>
        </div>
        <animated.div style={springFormRowOnSubmit} className="formRow">
          <TextField
            onChange={(e) => {
              setName(e.target.value.substring(0, MAX_CHARACTERS_IN_NAME));
            }}
            value={name}
            label="name"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveHighScoreAndUpdate();
              }
            }}
          />
        </animated.div>
        <AnimatedIconButton
          className="btnSubmit"
          size="small"
          disabled={name === "" || isLoading}
          onClick={saveHighScoreAndUpdate}
          style={springButtonOnSubmit}
        >
          <Check />
        </AnimatedIconButton>
      </div>
    </SubmitHighScoreFormStyles>
  );
}

const AnimatedIconButton = animated(IconButton);
const SubmitHighScoreFormStyles = styled.div<{ isSubmitted: boolean }>`
  width: 180px;
  input {
    color: white;
  }
  .submitHighScoreContent {
    position: relative;
    .btnSubmit {
      position: absolute;
      right: -111px;
      bottom: -6px;
      background: #72cea578;
    }
    .newHighScore {
      display: grid;
      placei-items: center;
      font-size: 14px;
      text-align: left;
      line-height: 0;
      width: 86px;
      line-height: 1.3em;
      letter-spacing: 1.6px;
      text-align: center;
      transform: translate(-99px, 48px) rotate(298deg);
    }
    .formRow {
      display: flex;
      gap: 12px;
      margin-bottom: -7px;
    }
    font-size: 16px;
    display: grid;
    gap: 10px;
    margin: auto;
    place-items: left;
    place-content: center;
  }
  .MuiInput-underline:before {
    border-bottom: 1px solid rgba(223, 218, 218, 0.582) !important;
  }
`;
function getHighScoresFromNewHighScore(
  newHighScore: {
    isNewHighScore: boolean;
    score: number;
    name: string;
    userId: string;
  },
  name: string,
  highScores: any
) {
  const newHighScoreWithName = { ...newHighScore, name };
  const newHighScores = highScores
    .map((d) => (d.isNewHighScore ? newHighScoreWithName : d))
    .sort(sortDescendingByScore)
    .slice(0, NUM_SCORES);
  return newHighScores;
}
