import { BotScore } from "types";
import { BOT_LABELS, BOT_TYPE_MORE_INFO } from "utils/constants";

export function getMostLikelyBotTypeText(botScore: BotScore) {
  let botTypeText = "";
  let botTypeInfo = "";

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

  const scorePercent = `(${(maxScore * 100).toFixed(0)}%)`;

  if (maxScore > 0.8) {
    botTypeText += "is very likely ";
  } else if (maxScore > 0.6) {
    botTypeText += "is likely ";
  } else if (maxScore > 0.4) {
    botTypeText += "could be ";
  } else {
    botTypeText += `is probably not a bot ${scorePercent}`;
    return { botTypeText, botTypeInfo };
  }

  /*  if (maxScore === overall) {
      botTypeText += BOT_LABELS.OVERALL;
    } else */ if (maxScore === fake_follower) {
    botTypeText += "a " + BOT_LABELS.FAKE_FOLLOWER;
    botTypeInfo += BOT_TYPE_MORE_INFO.FAKE_FOLLOWER;
  } else if (maxScore === astroturf) {
    botTypeText += "an " + BOT_LABELS.ASTROTURF;
    botTypeInfo += BOT_TYPE_MORE_INFO.ASTROTURF;
  } else if (maxScore === financial) {
    botTypeText += "a " + BOT_LABELS.FINANCIAL;
    botTypeInfo += BOT_TYPE_MORE_INFO.FINANCIAL;
  } else if (maxScore === other) {
    botTypeText += "an " + BOT_LABELS.OTHER;
    botTypeInfo += BOT_TYPE_MORE_INFO.OTHER;
  } else if (maxScore === self_declared) {
    botTypeText += "a " + BOT_LABELS.SELF_DECLARED;
    botTypeInfo += BOT_TYPE_MORE_INFO.SELF_DECLARED;
  } else if (maxScore === spammer) {
    botTypeText += "a " + BOT_LABELS.SPAMMER;
    botTypeInfo += BOT_TYPE_MORE_INFO.SPAMMER;
  }

  botTypeText += ` bot ${scorePercent}`;

  return { botTypeText, botTypeInfo };
}
