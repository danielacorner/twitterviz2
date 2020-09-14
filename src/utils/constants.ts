export const COLOR_BY = {
  mediaType: "mediaType",
  media: "media",
  textLength: "textLength",
  sentiment: "sentiment",
  profilePhoto: "profilePhoto",
};
export const FILTER_BY = {
  all: "all",
  imageAndVideo: "imageAndVideo",
  imageOnly: "imageOnly",
  videoOnly: "videoOnly",
};
export const FILTER_LEVELS = {
  medium: "medium",
  low: "low",
  none: "none",
};
export const CONTROLS_WIDTH = 220;
export const TABS_HEIGHT = 48;

export const SERVER_URL =
  process.env.NODE_ENV !== "production"
    ? ""
    : "https://twit-viz-api.herokuapp.com";
