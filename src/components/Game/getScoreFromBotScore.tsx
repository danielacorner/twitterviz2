import { BotScore } from "types";

const MAX_POSSIBLE_SCORE_EACH = 200;
export function getScoreFromBotScore(botScore: BotScore) {
  // const botSubScoresEntries = Object.entries(botScore).filter(
  //   ([key]) => key !== "overall"
  // );
  // const maxPossibleScore =
  //   MAX_POSSIBLE_SCORE_EACH * botSubScoresEntries.length * 100;
  // const scoreIncrease =
  //   MAX_POSSIBLE_SCORE_EACH *
  //   botSubScoresEntries.reduce((acc, [key, val]) => acc + val, 0);
  const maxBotScore = Object.values(botScore).reduce(
    (acc, score) => Math.max(acc, score),
    0
  );
  const scoreIncrease = MAX_POSSIBLE_SCORE_EACH * maxBotScore;
  const scorePercent = scoreIncrease / scoreIncrease;
  return { scoreIncrease, scorePercent };
}
