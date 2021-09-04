import { BotScore } from "types";
import { BOT_TYPES } from "utils/constants";

export function getMostLikelyBotTypeText(botScore: BotScore) {
  let botTypeText = "";
  let botTypeInfo = "";
  let botType = "";

  const {
    // overall,
    fake_follower,
    astroturf,
    financial,
    other,
    self_declared,
    spammer,
  } = botScore;
  const maxScore = Math.max(
    // overall,
    fake_follower,
    astroturf,
    financial,
    self_declared,
    spammer
  );

  const scorePercent = (maxScore * 100).toFixed(0);

  if (maxScore === fake_follower) {
    botTypeText += "a";
    botType = BOT_TYPES.FAKE_FOLLOWER.name;
    botTypeInfo += BOT_TYPES.FAKE_FOLLOWER.tooltipText;
  } else if (maxScore === astroturf) {
    botTypeText += "an";
    botType = BOT_TYPES.ASTROTURF.name;
    botTypeInfo += BOT_TYPES.ASTROTURF.tooltipText;
  } else if (maxScore === financial) {
    botTypeText += "a";
    botType = BOT_TYPES.FINANCIAL.name;
    botTypeInfo += BOT_TYPES.FINANCIAL.tooltipText;
  } else if (maxScore === other) {
    botTypeText += "an";
    botType = BOT_TYPES.OTHER.name;
    botTypeInfo += BOT_TYPES.OTHER.tooltipText;
  } else if (maxScore === self_declared) {
    botTypeText += "a";
    botType = BOT_TYPES.SELF_DECLARED.name;
    botTypeInfo += BOT_TYPES.SELF_DECLARED.tooltipText;
  } else if (maxScore === spammer) {
    botTypeText += "a";
    botType = BOT_TYPES.SPAMMER.name;
    botTypeInfo += BOT_TYPES.SPAMMER.tooltipText;
  }

  if (maxScore > 0.8) {
    botTypeText = "very likely " + botTypeText;
  } else if (maxScore > 0.6) {
    botTypeText = "likely " + botTypeText;
  } else if (maxScore > 0.4) {
    botTypeText = "could be " + botTypeText;
  } else {
    botTypeText = `probably not ` + botTypeText;
  }

  return { botTypeText, botTypeInfo, botType, scorePercent };
}
