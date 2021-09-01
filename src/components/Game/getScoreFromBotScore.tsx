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
  const { maxBotScore, maxBotType } = Object.entries(botScore).reduce(
    (acc, [key, score]) => ({
      maxBotScore: Math.max(acc.maxBotScore, score),
      maxBotType: key,
    }),
    { maxBotScore: 0, maxBotType: "" }
  );
  const maxPossibleScoreIncrease =
    Object.values(botScore).length * MAX_POSSIBLE_SCORE_EACH;
  const scoreIncrease = Math.round(MAX_POSSIBLE_SCORE_EACH * maxBotScore);
  const scorePercent = scoreIncrease / maxPossibleScoreIncrease;
  const maxHue = 130;
  const minHue = 0;
  const color = `hsl(${((maxHue - minHue) * scorePercent).toFixed(
    0
  )},100%,50%)`;
  return { scoreIncrease, maxBotScore, maxBotType, scorePercent, color };
}
