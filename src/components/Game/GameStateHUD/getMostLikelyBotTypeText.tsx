import { BotScore } from "types";
import { BOT_TYPES, BOT_TYPE_MORE_INFO } from "utils/constants";

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

  if (maxScore > 0.8) {
    botTypeText += "is very likely ";
  } else if (maxScore > 0.6) {
    botTypeText += "is likely ";
  } else if (maxScore > 0.4) {
    botTypeText += "could be ";
  } else {
    botTypeText += `is probably not a`;
    return { botTypeText, botTypeInfo, scorePercent };
  }

  if (maxScore === fake_follower) {
    botTypeText += "a";
    botType = BOT_TYPES.FAKE_FOLLOWER.name;
    botTypeInfo += BOT_TYPE_MORE_INFO.FAKE_FOLLOWER;
  } else if (maxScore === astroturf) {
    botTypeText += "an";
    botType = BOT_TYPES.ASTROTURF.name;
    botTypeInfo += BOT_TYPE_MORE_INFO.ASTROTURF;
  } else if (maxScore === financial) {
    botTypeText += "a";
    botType = BOT_TYPES.FINANCIAL.name;
    botTypeInfo += BOT_TYPE_MORE_INFO.FINANCIAL;
  } else if (maxScore === other) {
    botTypeText += "an";
    botType = BOT_TYPES.OTHER.name;
    botTypeInfo += BOT_TYPE_MORE_INFO.OTHER;
  } else if (maxScore === self_declared) {
    botTypeText += "a";
    botType = BOT_TYPES.SELF_DECLARED.name;
    botTypeInfo += BOT_TYPE_MORE_INFO.SELF_DECLARED;
  } else if (maxScore === spammer) {
    botTypeText += "a";
    botType = BOT_TYPES.SPAMMER.name;
    botTypeInfo += BOT_TYPE_MORE_INFO.SPAMMER;
  }

  return { botTypeText, botTypeInfo, botType, scorePercent };
}
