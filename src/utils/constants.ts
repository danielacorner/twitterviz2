import { degToRad } from "three/src/math/MathUtils";

export const WAIT_FOR_STREAM_TIMEOUT =
  (process.env.NODE_ENV !== "production" ? 6 : 12) * 1000;

const Z_MOBILE = 100;
const Z_DESKTOP = 100;
const FINAL_Z = window.innerWidth < 768 ? Z_MOBILE : Z_DESKTOP; // zoom out for smaller screen widths
export const CAMERA_POSITION = {
  initial: [0, process.env.NODE_ENV === "production" ? 350 : 0, 350],
  final: [0, 0, FINAL_Z], // during gameplay
  gameOver: [0, 0, 500],
};
export const CAMERA_ROTATION = {
  initial: [0, degToRad(30), 0],
};
export const AVATAR_WIDTH = 46;
export const TOOLTIP_WIDTH = 380;

export const INFO_CARD_INITIAL_Y = -10;
export const INFO_CARD_MAX_Y = 0.3;
export const INFO_CARD_MIN_Y = -1.9;
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

export const BOT_TYPES = {
  OVERALL: { name: "Overall", tooltipText: "Overall" },
  OTHER: {
    name: "Other",
    tooltipText:
      "miscellaneous other bots obtained from manual annotation, user feedback, etc.",
  },
  ASTROTURF: {
    name: "Echo Chamber",
    tooltipText:
      "accounts that engage in follow back groups and share and delete political content in high volume",
  },
  FINANCIAL: {
    name: "Financial",
    tooltipText: "bots that post using cashtags",
  },
  FAKE_FOLLOWER: {
    name: "Fake Follower",
    tooltipText: "bots purchased to increase follower counts",
  },
  SPAMMER: {
    name: "Spammer",
    tooltipText: "accounts labeled as spambots from several datasets",
  },
  SELF_DECLARED: {
    name: "Self-Declared",
    tooltipText: "bots that say they are a bot, bots from botwiki.org",
  },
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

export const BREAKPOINTS = { TABLET: 768 };

export const DISABLE_SELECTION_OF_TEXT_CSS = `
/* Disable selection of text */
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none;
`;
export const NODE_RADIUS = 2;
export const CONFIG_FADE_IN = { tension: 20, friction: 30, mass: 2 };
export const CONFIG_POP_OUT = { tension: 170, friction: 17, mass: 1 };
export const NODE_RADIUS_COLLISION_MULTIPLIER = 2.5;
export const NODE_WIDTH = NODE_RADIUS * NODE_RADIUS_COLLISION_MULTIPLIER;
export const MARGIN_TOP = 92;
