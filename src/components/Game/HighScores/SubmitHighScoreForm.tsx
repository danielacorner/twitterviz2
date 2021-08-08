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
    transform: `rotate(${isSprung ? 2 : 0}deg) scale(${isSprung ? 1.08 : 1})`,
    config: {
      tension: 550,
      mass: 1.5,
      friction: 20,
      clamp: !isInputSprung,
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
          <div className="tada">🎉</div>
        </div>
        <animated.div style={springFormRowOnSubmit} className="formRow">
          <TextField
            onChange={(e) => {
              setName(e.target.value.substring(0, MAX_CHARACTERS_IN_NAME));
            }}
            value={name}
            label="enter your name"
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
    gap: 10px;
    margin: auto;
    place-items: left;
    place-content: center;
    .btnSubmit {
      position: absolute;
      right: -72px;
      bottom: 1px;
      background: #72cea5bd;
      box-shadow: 0px 2px 6px 0px #000000a3;
    }
    .newHighScore {
      position: absolute;
      bottom: 27px;
      left: -24px;
      display: flex;
      place-items: baseline;
      width: 210px;
      gap: 6px;
      text-align: left;
      /* line-height: 1.3em; */
      letter-spacing: 1.4px;
      /* transform: translate(20px, 78px); */
      font-size: 9px;
      opacity: 0.8;
    }
    .tada {
      font-size: 16px;
    }
    .formRow {
      display: flex;
      gap: 12px;
      margin-bottom: -7px;
    }
  }
  .MuiInput-underline:before {
    border-bottom: 1px solid rgba(223, 218, 218, 0.582) !important;
  }
  .MuiFormLabel-root {
    color: #fffb0095;
    font-variant: small-caps;
    font-family: monospace;
    padding: 0.2em;
    font-size: 14px;
    letter-spacing: 0.08em;
    word-spacing: -0.4em;
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
