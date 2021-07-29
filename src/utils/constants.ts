export const AVATAR_WIDTH = 46;
export const TOOLTIP_WIDTH = 380;

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
