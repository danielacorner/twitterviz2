import { useAtom } from "jotai";
import { appUserIdAtom, scoreAtom } from "providers/store/store";
import { useState } from "react";
import { IconButton, TextField } from "@material-ui/core";
import { Check } from "@material-ui/icons";
import { saveHighScore } from "./highScoresUtils";

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
