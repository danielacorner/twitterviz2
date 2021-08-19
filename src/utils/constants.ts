export const WAIT_FOR_STREAM_TIMEOUT =
  (process.env.NODE_ENV !== "production" ? 2 : 12) * 1000;

const finalZ = window.innerWidth < 768 ? 130 : 100; // zoom out for smaller screen widths
export const CAMERA_POSITION = {
  initial: [0, 0, 500],
  final: [0, 0, finalZ],
  gameOver: [0, 0, 500],
};
export const AVATAR_WIDTH = 46;
export const TOOLTIP_WIDTH = 380;

export const INFO_CARD_INITIAL_Y = -30;
export const INFO_CARD_MAX_Y = 0.3;
export const INFO_CARD_MIN_Y = -2.1;
export const COLOR_BY = {
  mediaType: "mediaType",
  media: "media",
  textLength: "textLength",
  sentiment: "sentiment",
  profilePhoto: "profilePhoto",
};
export const FILTER_LEVELS = {
  medium: "medium",
  low: "low",
  none: "none",
};
export const BOT_LABELS = {
  OVERALL: "Overall",
  OTHER: "Other",
  ASTROTURF: "Astroturf",
  FINANCIAL: "Financial",
  FAKE_FOLLOWER: "Fake Follower",
  SPAMMER: "Spammer",
  SELF_DECLARED: "Self Declared",
};
export const BOT_TYPE_MORE_INFO = {
  OVERALL: "Overall",
  ASTROTURF:
    "(A.K.A. Echo-chamber bot) accounts that engage in follow back groups and share and delete political content in high volume",
  FINANCIAL: "bots that post using cashtags",
  FAKE_FOLLOWER: "bots purchased to increase follower counts",
  SPAMMER: "accounts labeled as spambots from several datasets",
  SELF_DECLARED: "bots from botwiki.org",
  OTHER:
    "miscellaneous other bots obtained from manual annotation, user feedback, etc.",
};
export const CONTROLS_WIDTH = 220;
export const TABS_HEIGHT = 48;
export const NAV_HEIGHT = 64;

export const SERVER_URL =
  process.env.NODE_ENV !== "production"
    ? ""
    : "https://twit-viz-api.herokuapp.com";

export const CONTROLS_PADDING_INNER = 14;
export const FORM_HEIGHT = 36;

export const TAB_INDICES = {
  NETWORKGRAPH: 0,
  WORDCLOUD: 1,
  GALLERY: 2,
};

export const BREAKPOINTS = { TABLET: 768 };

export const DISABLE_SELECTION_OF_TEXT_CSS = `
/* Disable selection of text */
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none;
`;
export const NODE_RADIUS = 2;
