import { useState } from "react";
import { IconButton, TextField } from "@material-ui/core";
import { Check } from "@material-ui/icons";
import { saveHighScore } from "./highScoresUtils";
import styled from "styled-components/macro";
import { useLoading, useSetLoading } from "providers/store/useSelectors";
import { useAtom } from "jotai";
import { appUserIdAtom, scoreAtom } from "providers/store/store";
import { sortDescendingByScore } from "./sortDescendingByScore";

export const NUM_SCORES = 12;
export const MAX_CHARACTERS_IN_NAME = 20;
export function SubmitHighScoreForm({
  highScores,
  setHighScores,
  setIsSubmitFormOpen,
}) {
  const [name, setName] = useState("");
  const isLoading = useLoading();
  const [score] = useAtom(scoreAtom);
  const [userId] = useAtom(appUserIdAtom);
  const setLoading = useSetLoading();
  const newHighScore = { isNewHighScore: true, score, name, userId };
  function saveHighScoreAndUpdate() {
    setLoading(true);
    saveHighScore(newHighScore).then(() => {
      const newHighScoreWithName = { ...newHighScore, name };
      console.log(
        "🌟🚨 ~ saveHighScore ~ newHighScoreWithName",
        newHighScoreWithName
      );
      console.log("🌟🚨 ~ saveHighScore ~ highScores", highScores);
      const newHighScores = highScores
        .map((d) => (d.isNewHighScore ? newHighScoreWithName : d))
        .sort(sortDescendingByScore)
        .slice(0, NUM_SCORES);
      console.log("🌟🚨 ~ saveHighScore ~ newHighScores", newHighScores);
      setHighScores(newHighScores);
      setLoading(false);
      setIsSubmitFormOpen(false);
    });
  }

  return (
    <SubmitHighScoreFormStyles>
      <div className="submitHighScoreContent">
        <h4 className="newHighScore">New High Score! 🎉</h4>
        <div className="formRow">
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
          <IconButton
            className="btnSubmit"
            size="small"
            disabled={name === "" || isLoading}
            onClick={saveHighScoreAndUpdate}
          >
            <Check />
          </IconButton>
        </div>
      </div>
    </SubmitHighScoreFormStyles>
  );
}

const SubmitHighScoreFormStyles = styled.div`
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
