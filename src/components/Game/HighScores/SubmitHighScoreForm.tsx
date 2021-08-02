import { useState } from "react";
import { IconButton, TextField } from "@material-ui/core";
import { Check } from "@material-ui/icons";
import { saveHighScore } from "./highScoresUtils";
import styled from "styled-components/macro";

export const NUM_SCORES = 12;
export const MAX_CHARACTERS_IN_NAME = 20;
export function SubmitHighScoreForm({
  highScores,
  setHighScores,
  setIsSubmitFormOpen,
  newHighScore,
}) {
  const [name, setName] = useState("");

  return (
    <SubmitHighScoreFormStyles>
      <div className="content">
        <h4>New High Score! 🎉</h4>
        <div>
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
              saveHighScore(newHighScore).then(() => {
                setHighScores(
                  [...highScores, { ...newHighScore, name }]
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
    </SubmitHighScoreFormStyles>
  );
}

const SubmitHighScoreFormStyles = styled.div`
  input {
    color: white;
  }
  .content {
    h4 {
      font-size: 14px;
      text-align: left;
      margin-left: 38px;
      line-height: 0;
    }
    font-size: 16px;
    display: grid;
    gap: 10px;
    margin: auto;
    margin-top: 360px;
    place-items: left;
    place-content: center;
  }
  .MuiInput-underline:before {
    border-bottom: 1px solid rgba(223, 218, 218, 0.582) !important;
  }
`;
