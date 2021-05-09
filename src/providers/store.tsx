import create from "zustand";
import shallow from "zustand/shallow";
import { uniqBy } from "lodash";
import { Tweet } from "../types";
import { COLOR_BY, FILTER_LEVELS } from "../utils/constants";
import mockTweetsData from "../assets/mockTweetsData.json";
import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import qs from "query-string";

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
};

// use to turn off mock tweets in dev mode
const SHOULD_MOCK_TWEETS = true;

const [useStore] = create<GlobalStateType>(
  (set): GlobalStateType => ({
    tweetsFromServer: (process.env.NODE_ENV === "development" &&
    SHOULD_MOCK_TWEETS
      ? mockTweetsData.tweets
      : []) as Tweet[],
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
    /** which node is displayed in the BottomDrawer */
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
        video: true,
        photo: true,
        animated_gif: true,
      },
      replace: false,
      filterLevel: FILTER_LEVELS.none as keyof typeof FILTER_LEVELS,
      searchTerm: "",
      numTweets: 10,
      // numTweets: 50,
      isOffline: false,
    },
    isDrawerOpen: false,
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

/** return all configurable values from the control panel
 * * the convenience of a big object useConfig() is offset by the consequence of
 * * causing re-renders on each component using it, every time any config value changes
 */
export const useConfig = () => {
  // ? is it possible to return factory functions which generate these selectors instead?
  // ? e.g.
  // ? return { getLoading: () => useStore(state...
  // ? const {getLoading} = useConfig(); const loading = getLoading())

  return {
    isStorybook: window.location.href.includes("localhost:6006"),
    // useLoading: ()=> useStore((state) => (state).loading, shallow),
    is3d: useStore((state) => state.config.is3d, shallow),
    gravity: useStore((state) => state.config.gravity, shallow),
    charge: useStore((state) => state.config.charge, shallow),
    isPaused: useStore((state) => state.config.isPaused, shallow),
    d3VelocityDecay: useStore((state) => state.config.d3VelocityDecay, shallow),
    d3AlphaDecay: useStore((state) => state.config.d3AlphaDecay, shallow),
    cooldownTime: useStore((state) => state.config.cooldownTime, shallow),
    isGridMode: useStore((state) => state.config.isGridMode, shallow),
    showUserNodes: useStore((state) => state.config.showUserNodes, shallow),
    colorBy: useStore((state) => state.config.colorBy, shallow),
    lang: useStore((state) => state.config.lang, shallow),
    countryCode: useStore((state) => state.config.countryCode, shallow),
    geolocation: useStore((state) => state.config.geolocation, shallow),
    resultType: useStore((state) => state.config.resultType, shallow),
    allowedMediaTypes: useStore(
      (state) => state.config.allowedMediaTypes,
      shallow
    ),
    replace: useStore((state) => state.config.replace, shallow),
    filterLevel: useStore((state) => state.config.filterLevel, shallow),
    searchTerm: useStore((state) => state.config.searchTerm, shallow),
    numTweets: useStore((state) => state.config.numTweets, shallow),
    isOffline: useStore((state) => state.config.isOffline, shallow),
    setConfig: useStore((state) => state.setConfig, shallow),
  };
};

export const useTweets = (): Tweet[] =>
  useStore((state) => state.tweetsFromServer);
export const useSelectedNode = () => useStore((state) => state.selectedNode);
export const useSetSelectedNode = () =>
  useStore((state) => state.setSelectedNode);
export const useTooltipNode = (): Tweet | null =>
  useStore((state) => state.tooltipNode);
export const useSetTooltipNode = () =>
  useStore((state) => state.setTooltipNode);
export const useLoading = () => useStore((state) => state.loading);
export const useSetLoading = () => useStore((state) => state.setLoading);
export const useLikesByUserId = () => useStore((state) => state.likesByUserId);
export const useSetLikesByUserId = () =>
  useStore((state) => state.setLikesByUserId);
// export const useRepliesByUserId = () =>
//   useStore((state) => (state).repliesByUserId);
// export const useSetRepliesByUserId = () =>
//   useStore((state) => (state).setRepliesByUserId);
export const useRetweetsByTweetId = () =>
  useStore((state) => state.retweetsByTweetId);
export const useSetRetweetsByTweetId = () =>
  useStore((state) => state.setRetweetsByTweetId);

export const useStoredSaves = () =>
  useStore((state) => ({
    saves: state.savedDatasets,
    setSaves: state.setSavedDatasets,
  }));

/** transform and save tweets to store */
export const useSetTweets = () => {
  const { replace } = useConfig();
  const setRetweets = useSetRetweetsByTweetId();
  const setLikes = useSetLikesByUserId();
  const tweetsFromServer = useStore((state) => state.tweetsFromServer);
  const setTweetsFromServer = useStore((state) => state.setTweetsFromServer);
  return (tweetsArg: Tweet[], forceReplace: boolean = false) => {
    if (replace || forceReplace) {
      // delete all likes, retweets
      setRetweets({});
      setLikes({});
    }

    const isError = !Array.isArray(tweetsArg);
    if (isError) {
      console.error(tweetsArg);
    }
    const tweets = isError ? [] : tweetsArg;

    const newTweets =
      replace || forceReplace
        ? tweets
        : uniqBy([...tweetsFromServer, ...tweets], (t) => t.id_str);

    // * whenever we change the tweets,
    // * scan all the tweets once to create
    // * retweetsByTweetId

    const retweetsByTweetId: { [tweetId: string]: string[] } = newTweets.reduce(
      (acc, tweet) => {
        // for each tweet,
        // if the tweet has a retweet in it
        const hasRetweet = tweet?.retweeted_status?.id_str;
        // add its id_str to the array associated with its tweet.id_str
        if (hasRetweet) {
          // check the existing tweets for this tweet,
          // if it exists, add it to the list to create a link
          // *(this operation is now O^N2, but it's only performed when the tweets change)
          const isRetweetInAllTweets = Boolean(
            newTweets.find((t) => t.id_str === tweet.retweeted_status?.id_str)
          );

          if (isRetweetInAllTweets) {
            acc = {
              ...acc,
              [tweet.id_str]: [
                ...(acc[tweet.id_str] || []),
                tweet.retweeted_status?.id_str,
              ],
            };
          }
        }

        return acc;
      },
      {}
    );

    // for each retweet node, tag is as such
    const tweetIdsToTagAsOriginal = Object.values(retweetsByTweetId).reduce(
      (acc, retweetIds) => [...acc, ...retweetIds],
      [] as string[]
    );
    const tweetIdsToTagAsRetweet = Object.keys(retweetsByTweetId).reduce(
      (acc, tweetId) => [...acc, tweetId],
      [] as string[]
    );

    setRetweets(retweetsByTweetId);

    const newTweetsTagged = newTweets.map((t) => ({
      ...t,
      ...(tweetIdsToTagAsOriginal.includes(t.id_str)
        ? { isRetweetNode: true }
        : {}),
      ...(tweetIdsToTagAsRetweet.includes(t.id_str)
        ? { isOriginalNode: true }
        : {}),
    }));

    setTweetsFromServer(newTweetsTagged);
  };
};

/** transform and add tweets to store */
export const useAddTweets = () => {
  const tweetsFromServer = useStore((state) => state.tweetsFromServer);
  const setTweetsFromServer = useStore((state) => state.setTweetsFromServer);

  return (tweets: Tweet[]) => {
    const newTweets = uniqBy([...tweetsFromServer, ...tweets], (t) => t.id_str);
    setTweetsFromServer(newTweets);
  };
};

/** delete a tweet from store */
export const useDeleteTweet = () => {
  const tweetsFromServer = useStore((state) => state.tweetsFromServer, shallow);
  const setTweetsFromServer = useStore((state) => state.setTweetsFromServer);
  return useCallback(
    (tweetId: string) => {
      const newTweets = tweetsFromServer.filter((t) => t.id_str !== tweetId);
      setTweetsFromServer(newTweets);
    },
    [tweetsFromServer, setTweetsFromServer]
  );
};

export type WordcloudConfig = {
  minChars: number;
  maxChars: number;
  minInstances: number;
  numAngles: number;
};

export const useWordcloudConfig = () => {
  return {
    minChars: useStore((state) => state.wordcloudConfig.minChars),
    maxChars: useStore((state) => state.wordcloudConfig.maxChars),
    minInstances: useStore((state) => state.wordcloudConfig.minInstances),
    numAngles: useStore((state) => state.wordcloudConfig.numAngles),
    setWordcloudConfig: useStore((state) => state.setWordcloudConfig),
  };
};

/** returns some of ["all","video","photo","text"] */
export function useAllowedMediaTypes(): string[] {
  const allowedMediaTypes = useStore((state) => state.config.allowedMediaTypes);

  return [
    ...(allowedMediaTypes.video ? ["video"] : []),
    ...(allowedMediaTypes.photo ? ["photo"] : []),
    ...(allowedMediaTypes.animated_gif ? ["animated_gif"] : []),
    ...(allowedMediaTypes.text ? ["text"] : []),
  ];
}

export const useIsLeftDrawerOpen = () => {
  const isDrawerOpen = useStore((state) => state.isDrawerOpen);
  const setIsDrawerOpen = useStore((state) => state.setIsDrawerOpen);
  return { isDrawerOpen, setIsDrawerOpen };
};

export const useRecomputeGraph = () => {
  const tweets = useTweets();
  const setTweets = useSetTweets();
  return () => setTimeout(() => setTweets(tweets));
};

export function usePrevious(value: any): typeof value {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
