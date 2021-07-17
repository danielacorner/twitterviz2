import create from "zustand";
import { Tweet } from "../../types";
import { COLOR_BY, FILTER_LEVELS } from "../../utils/constants";
import mockTweetsData from "../../assets/mockTweetsData.json";
import { useLocation } from "react-router";
import qs from "query-string";
import { WordcloudConfig } from "./useSelectors";
import { atom } from "jotai";

export const selectedNodeHistoryAtom = atom<Tweet[]>([]);
export const tooltipHistoryAtom = atom<Tweet[]>([]);

export const nodeMouseCoordsAtom = atom({ x: 0, y: 0 });

export const useSearchObj = () => qs.parse(useLocation().search);

export type GlobalStateType = {
  tweetsFromServer: Tweet[];
  selectedNode: Tweet | null;
  setSelectedNode: (node: Tweet | null) => void;
  tooltipNode: Tweet | null;
  setTooltipNode: (node: Tweet | null) => void;
  setTweetsFromServer: (tweets: Tweet[]) => void;
  config: AppConfig;
  setConfig: (newConfig: Partial<AppConfig>) => void;
  likesByUserId: { [userId: string]: string[] };
  setLikesByUserId: (newlikesByUserId: { [userId: string]: string[] }) => void;
  // repliesByUserId: { [tweetId: string]: string[] };
  // setRepliesByUserId: (newRepliesByUserId: {
  //   [userId: string]: string[];
  // }) => void;
  retweetsByTweetId: { [tweetId: string]: string[] };
  setRetweetsByTweetId: (newRetweetsByTweetId: {
    [tweetId: string]: string[];
  }) => void;
  loading: boolean;
  setLoading: (newLoading: boolean) => void;
  wordcloudConfig: WordcloudConfig;
  setWordcloudConfig: (newConfig: Partial<WordcloudConfig>) => void;
  savedDatasets: { saveName: string; ids: string[] }[];
  setSavedDatasets: (newSaves: { saveName: string; ids: string[] }[]) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (next: boolean) => void;
};
export type AppConfig = {
  is3d: boolean;
  gravity: number;
  charge: number;
  isPaused: boolean;
  d3VelocityDecay: number;
  d3AlphaDecay: number;
  cooldownTime: number;
  isGridMode: boolean;
  isOffline: boolean;
  showUserNodes: boolean;
  colorBy: keyof typeof COLOR_BY | null;
  lang: string;
  resultType: "mixed" | "recent" | "popular";
  geolocation: {
    latitude: { left: number; right: number };
    longitude: { left: number; right: number };
  } | null;
  countryCode: string;
  allowedMediaTypes: {
    video: boolean;
    photo: boolean;
    text: boolean;
    animated_gif: boolean;
  };
  replace: boolean;
  filterLevel: keyof typeof FILTER_LEVELS;
  searchTerm: string;
  numTweets: number;
  isDarkTheme: boolean;
};

// use to turn off mock tweets in dev mode
// const SHOULD_MOCK_TWEETS = true;

function getInitialTweets() {
  const tweetsLS = localStorage.getItem("tweets");
  console.log(tweetsLS);
  return tweetsLS && JSON.parse(tweetsLS)?.[0]?.id_str
    ? JSON.parse(tweetsLS)
    : [];
}

const [useStore] = create<GlobalStateType>(
  (set): GlobalStateType => ({
    /** tweets are saved to LS */
    tweetsFromServer: getInitialTweets(),
    // map between tweet.user.id_str and the liked tweet.id_str
    // likesByUserId is populated when we "fetch tweets liked by a user"
    likesByUserId:
      process.env.NODE_ENV === "development"
        ? mockTweetsData.likesByUserId
        : {},
    setLikesByUserId: (likesByUserId) => set(() => ({ likesByUserId })),
    // map between tweet.id_str and the retweeted tweet.id_str
    retweetsByTweetId:
      process.env.NODE_ENV === "development"
        ? mockTweetsData.retweetsByTweetId
        : {},
    setRetweetsByTweetId: (retweetsByTweetId) =>
      set(() => ({ retweetsByTweetId })),
    /** which node is displayed in the Tooltip */
    selectedNode: null as Tweet | null,
    setSelectedNode: (node: Tweet | null) =>
      set(() => ({ selectedNode: node })),

    tooltipNode: null as Tweet | null,
    setTooltipNode: (node: Tweet | null) => set(() => ({ tooltipNode: node })),
    setTweetsFromServer: (tweets) => set(() => ({ tweetsFromServer: tweets })),
    loading: false,
    // * only works for authenticated user (me)
    // repliesByUserId: {},
    // setRepliesByUserId: (repliesByUserId) => set(() => ({ repliesByUserId })),
    setLoading: (loading) => set(() => ({ loading })),
    config: {
      isDarkTheme: JSON.parse(
        window.localStorage.getItem("theme:isDark") || "true" // default to true
      ),
      isGridMode: false,
      showUserNodes: false,
      is3d: false,
      /** is the simulation paused */
      isPaused: false,
      gravity: 10,
      charge: -500,
      d3VelocityDecay: 0.9,
      d3AlphaDecay: 0.007,
      cooldownTime: 15 * 1000,
      colorBy: COLOR_BY.mediaType as keyof typeof COLOR_BY | null,
      lang: "All",
      countryCode: "All",
      resultType: "mixed",
      geolocation: null,
      allowedMediaTypes: {
        text: true,
        video: process.env.NODE_ENV === "development",
        photo: process.env.NODE_ENV === "development",
        animated_gif: process.env.NODE_ENV === "development",
      },
      replace: false,
      filterLevel: FILTER_LEVELS.none as keyof typeof FILTER_LEVELS,
      searchTerm: "",
      numTweets: 10,
      // numTweets: 50,
      isOffline: false,
    },
    isDrawerOpen: process.env.NODE_ENV === "development",
    setIsDrawerOpen: (next) => set((state) => ({ isDrawerOpen: next })),
    /** overwrite any values passed in */
    setConfig: (newConfig) =>
      set((state) => ({ config: { ...state.config, ...newConfig } })),
    wordcloudConfig: {
      minChars: 1,
      maxChars: 25,
      minInstances: 1,
      numAngles: 3,
    },
    setWordcloudConfig: (newConfig) =>
      set((state) => ({
        wordcloudConfig: { ...state.wordcloudConfig, ...newConfig },
      })),
    savedDatasets: JSON.parse(window.localStorage.getItem("saves") || "[]"),
    setSavedDatasets: (newSaves) =>
      set((state) => ({ savedDatasets: newSaves })),
  })
);

export default useStore;
