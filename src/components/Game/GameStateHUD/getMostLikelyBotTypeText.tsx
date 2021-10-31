import { BotScore } from "types";
import { BOT_TYPES } from "utils/constants";

export function getMostLikelyBotTypeText(botScore: BotScore) {
  let botTypeText = "";
  let botTypeInfo = "";
  let botType = "";
  if (!botScore) {
    console.log("🌟🚨 ~ getMostLikelyBotTypeText ~ !botScore", botScore);
    return {
      botTypeText: null,
      botTypeInfo: null,
      botType: null,
      scorePercent: null,
    };
  }
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
    botType = BOT_TYPES.FAKE_FOLLOWER.name;
    botTypeText += "a " + botType;
    botTypeInfo += BOT_TYPES.FAKE_FOLLOWER.tooltipText;
  } else if (maxScore === astroturf) {
    botType = BOT_TYPES.ASTROTURF.name;
    botTypeText += "an ";
    botTypeInfo += BOT_TYPES.ASTROTURF.tooltipText;
  } else if (maxScore === financial) {
    botType = BOT_TYPES.FINANCIAL.name;
    botTypeText += "a " + botType;
    botTypeInfo += BOT_TYPES.FINANCIAL.tooltipText;
  } else if (maxScore === other) {
    botType = BOT_TYPES.OTHER.name;
    botTypeText += "an " + botType;
    botTypeInfo += BOT_TYPES.OTHER.tooltipText;
  } else if (maxScore === self_declared) {
    botType = BOT_TYPES.SELF_DECLARED.name;
    botTypeText += "a " + botType;
    botTypeInfo += BOT_TYPES.SELF_DECLARED.tooltipText;
  } else if (maxScore === spammer) {
    botType = BOT_TYPES.SPAMMER.name;
    botTypeText += "a " + botType;
    botTypeInfo += BOT_TYPES.SPAMMER.tooltipText;
  }

  if (maxScore > 0.8) {
    botTypeText = " is very likely " + botTypeText;
  } else if (maxScore > 0.6) {
    botTypeText = " is likely " + botTypeText;
  } else if (maxScore > 0.4) {
    botTypeText = " could be " + botTypeText;
  } else {
    botTypeText = " is probably not a ";
  }

  return { botTypeText, botTypeInfo, botType, scorePercent };
}
