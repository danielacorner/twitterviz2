import create from "zustand";
import { Tweet } from "../../types";
import { COLOR_BY, FILTER_LEVELS } from "../../utils/constants";
import mockTweetsData from "../../assets/mockTweetsData.json";
import { useLocation } from "react-router";
import qs from "query-string";
import { WordcloudConfig } from "./useSelectors";
import { atom, useAtom } from "jotai";
import { atomWithHash, atomWithStorage } from "jotai/utils";
import { UserNode } from "components/NetworkGraph/useUserNodes";

export const SHOTS_REMAINING = process.env.NODE_ENV === "development" ? 2 : 3;
export const INITIAL_NUM_TWEETS = 10;

export const lastTimeMonthlyTwitterApiUsageWasExceededAtom = atom<
  number | null
>(null);

export const isRightDrawerOpenAtom = atom<boolean>(false);
export const areOrbitControlsEnabledAtom = atom<boolean>(true);
export const scanningNodeIdAtom = atom<string | null>(null);
export const botScorePopupNodeAtom = atom<UserNode | null>(null);
export const appUserIdAtom = atomWithStorage<string>("atoms:userId", "");
export enum GameStepsEnum {
  welcome = "welcome",
  lookingAtTweetsWithBotScores = "lookingAtTweetsWithBotScores",
  gameOver = "gameOver",
}
export function useAreBotsLinedUp() {
  // when the game ends, line up the bots
  const [gameState] = useAtom(gameStateAtom);
  return gameState.step === GameStepsEnum.gameOver;
}
export const scoreAtom = atomWithStorage<number>("atoms:score", 0);
export const gameStateAtom = atomWithStorage<{
  step: GameStepsEnum;
  startTime?: number;
}>("atoms:gameState", {
  step: GameStepsEnum.welcome,
});
export const shotsRemainingAtom = atomWithStorage(
  "atoms:shotsRemaining",
  SHOTS_REMAINING
);

export const numTooltipTweetsAtom = atom<number>(1);
export const tooltipTweetIndexAtom = atom<number>(0);
export const isPointerOverAtom = atom<boolean>(false);
export const isLeftDrawerOpenAtom = atomWithStorage<boolean>(
  "atoms:isLeftDrawerOpen",
  false
);
export const selectedNodeHistoryAtom = atom<Tweet[]>([]);
export const tooltipHistoryAtom = atom<Tweet[]>([]);
export const rightClickMenuAtom = atom<{
  mouseX: number | null;
  mouseY: number | null;
  node: Tweet | null;
}>({
  mouseX: null,
  mouseY: null,
  node: null,
});

export const nodeMouseCoordsAtom = atom({ x: 0, y: 0 });
export const isDarkModeAtom = atomWithStorage<boolean>(
  "atoms:isDarkMode",
  true
);
export const selectedNodeIdAtom = atomWithHash<string | null>("selected", null);

export const useSearchObj = () => qs.parse(useLocation()?.search);
export type GlobalStateType = {
  tooltipNode: Tweet | null;
  setTooltipNode: (node: Tweet | null) => void;
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
};

const [useStore] = create<GlobalStateType>(
  (set): GlobalStateType => ({
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
    tooltipNode: null as Tweet | null,
    setTooltipNode: (node: Tweet | null) => set(() => ({ tooltipNode: node })),
    loading: false,
    // * only works for authenticated user (me)
    // repliesByUserId: {},
    // setRepliesByUserId: (repliesByUserId) => set(() => ({ repliesByUserId })),
    setLoading: (loading) => set(() => ({ loading })),
    config: {
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
      filterLevel: FILTER_LEVELS[
        process.env.NODE_ENV === "production" ? "medium" : "none"
      ] as keyof typeof FILTER_LEVELS,
      searchTerm: "",
      numTweets: INITIAL_NUM_TWEETS,
      // numTweets: 50,
      isOffline: false,
    },

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
