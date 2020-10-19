import create from "zustand";
import shallow from "zustand/shallow";
import { uniqBy } from "lodash";
import { Tweet } from "../types";
import { COLOR_BY, FILTER_LEVELS } from "../utils/constants";
import mockTweetsData from "../mockTweetsData.json";
import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import qs from "query-string";

export const useSearchObj = () => qs.parse(useLocation().search);

export type GlobalStateStoreType = {
  tweetsFromServer: Tweet[];
  selectedNode: Tweet | null;
  setSelectedNode: (node: Tweet | null) => void;
  tooltipNode: Tweet | null;
  setTooltipNode: (node: Tweet | null) => void;
  setTweetsFromServer: (tweets) => void;
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

const [useStore] = create(
  (set) =>
    ({
      tweetsFromServer:
        process.env.NODE_ENV === "development"
          ? mockTweetsData.tweets
          : ([] as Tweet[]),
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
      setTooltipNode: (node: Tweet | null) =>
        set(() => ({ tooltipNode: node })),
      setTweetsFromServer: (tweets) =>
        set(() => ({ tweetsFromServer: tweets })),
      loading: false,
      // * only works for authenticated user (me)
      // repliesByUserId: {},
      // setRepliesByUserId: (repliesByUserId) => set(() => ({ repliesByUserId })),
      setLoading: (loading) => set(() => ({ loading })),
      config: {
        isGridMode: false,
        showUserNodes: true,
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
        filterLevel: FILTER_LEVELS.none,
        searchTerm: "",
        numTweets: 1,
        // numTweets: 50,
      },
      isDrawerOpen: window.innerWidth > 600,
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
    } as GlobalStateStoreType)
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
    // useLoading: ()=> useStore((state: GlobalStateStoreType) => state.loading, shallow),
    is3d: useStore((state: GlobalStateStoreType) => state.config.is3d, shallow),
    gravity: useStore(
      (state: GlobalStateStoreType) => state.config.gravity,
      shallow
    ),
    charge: useStore(
      (state: GlobalStateStoreType) => state.config.charge,
      shallow
    ),
    isPaused: useStore(
      (state: GlobalStateStoreType) => state.config.isPaused,
      shallow
    ),
    d3VelocityDecay: useStore(
      (state: GlobalStateStoreType) => state.config.d3VelocityDecay,
      shallow
    ),
    d3AlphaDecay: useStore(
      (state: GlobalStateStoreType) => state.config.d3AlphaDecay,
      shallow
    ),
    cooldownTime: useStore(
      (state: GlobalStateStoreType) => state.config.cooldownTime,
      shallow
    ),
    isGridMode: useStore(
      (state: GlobalStateStoreType) => state.config.isGridMode,
      shallow
    ),
    showUserNodes: useStore(
      (state: GlobalStateStoreType) => state.config.showUserNodes,
      shallow
    ),
    colorBy: useStore(
      (state: GlobalStateStoreType) => state.config.colorBy,
      shallow
    ),
    lang: useStore((state: GlobalStateStoreType) => state.config.lang, shallow),
    countryCode: useStore(
      (state: GlobalStateStoreType) => state.config.countryCode,
      shallow
    ),
    geolocation: useStore(
      (state: GlobalStateStoreType) => state.config.geolocation,
      shallow
    ),
    resultType: useStore(
      (state: GlobalStateStoreType) => state.config.resultType,
      shallow
    ),
    allowedMediaTypes: useStore(
      (state: GlobalStateStoreType) => state.config.allowedMediaTypes,
      shallow
    ),
    replace: useStore(
      (state: GlobalStateStoreType) => state.config.replace,
      shallow
    ),
    filterLevel: useStore(
      (state: GlobalStateStoreType) => state.config.filterLevel,
      shallow
    ),
    searchTerm: useStore(
      (state: GlobalStateStoreType) => state.config.searchTerm,
      shallow
    ),
    numTweets: useStore(
      (state: GlobalStateStoreType) => state.config.numTweets,
      shallow
    ),
    setConfig: useStore(
      (state: GlobalStateStoreType) => state.setConfig,
      shallow
    ),
  };
};

export const useTweets = (): Tweet[] =>
  useStore((state: GlobalStateStoreType) => state.tweetsFromServer);
export const useSelectedNode = () =>
  useStore((state: GlobalStateStoreType) => state.selectedNode);
export const useSetSelectedNode = () =>
  useStore((state: GlobalStateStoreType) => state.setSelectedNode);
export const useTooltipNode = (): Tweet | null =>
  useStore((state: GlobalStateStoreType) => state.tooltipNode);
export const useSetTooltipNode = () =>
  useStore((state: GlobalStateStoreType) => state.setTooltipNode);
export const useLoading = () =>
  useStore((state: GlobalStateStoreType) => state.loading);
export const useSetLoading = () =>
  useStore((state: GlobalStateStoreType) => state.setLoading);
export const useLikesByUserId = () =>
  useStore((state: GlobalStateStoreType) => state.likesByUserId);
export const useSetLikesByUserId = () =>
  useStore((state: GlobalStateStoreType) => state.setLikesByUserId);
// export const useRepliesByUserId = () =>
//   useStore((state: GlobalStateStoreType) => state.repliesByUserId);
// export const useSetRepliesByUserId = () =>
//   useStore((state: GlobalStateStoreType) => state.setRepliesByUserId);
export const useRetweetsByTweetId = () =>
  useStore((state: GlobalStateStoreType) => state.retweetsByTweetId);
export const useSetRetweetsByTweetId = () =>
  useStore((state: GlobalStateStoreType) => state.setRetweetsByTweetId);

export const useStoredSaves = () =>
  useStore((state: GlobalStateStoreType) => ({
    saves: state.savedDatasets,
    setSaves: state.setSavedDatasets,
  }));

/** transform and save tweets to store */
export const useSetTweets = () => {
  const { replace } = useConfig();
  const setRetweets = useSetRetweetsByTweetId();
  const tweetsFromServer = useStore(
    (state: GlobalStateStoreType) => state.tweetsFromServer
  );
  const setTweetsFromServer = useStore(
    (state: GlobalStateStoreType) => state.setTweetsFromServer
  );
  return (tweetsArg: Tweet[]) => {
    const isError = !Array.isArray(tweetsArg);
    if (isError) {
      console.error(tweetsArg);
    }
    const tweets = isError ? [] : tweetsArg;

    const newTweets = replace
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
          console.log(
            "🌟🚨: useSetTweets -> tweet?.retweeted_status?.id_str",
            tweet?.retweeted_status?.id_str
          );
          // check the existing tweets for this tweet,
          // if it exists, add it to the list to create a link
          // *(this operation is now O^N2, but it's only performed when the tweets change)
          console.log("🌟🚨: useSetTweets -> tweets", newTweets);
          const isRetweetInAllTweets = Boolean(
            newTweets.find((t) => t.id_str === tweet.retweeted_status.id_str)
          );

          if (isRetweetInAllTweets) {
            acc = {
              ...acc,
              [tweet.id_str]: [
                ...(acc[tweet.id_str] || []),
                tweet.retweeted_status.id_str,
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
      []
    );
    const tweetIdsToTagAsRetweet = Object.keys(retweetsByTweetId).reduce(
      (acc, tweetId) => [...acc, tweetId],
      []
    );

    console.log(
      "🌟🚨: useSetTweets -> tweetIdsToTagAsOriginal",
      tweetIdsToTagAsOriginal
    );
    console.log(
      "🌟🚨: useSetTweets -> tweetIdsToTagAsRetweet",
      tweetIdsToTagAsRetweet
    );

    console.log("🌟🚨: useSetTweets -> retweetsByTweetId", retweetsByTweetId);

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
  const tweetsFromServer = useStore(
    (state: GlobalStateStoreType) => state.tweetsFromServer
  );
  const setTweetsFromServer = useStore(
    (state: GlobalStateStoreType) => state.setTweetsFromServer
  );

  return (tweets: Tweet[]) => {
    const newTweets = uniqBy([...tweetsFromServer, ...tweets], (t) => t.id_str);
    setTweetsFromServer(newTweets);
  };
};

/** delete a tweet from store */
export const useDeleteTweet = () => {
  const tweetsFromServer = useStore(
    (state: GlobalStateStoreType) => state.tweetsFromServer,
    shallow
  );
  const setTweetsFromServer = useStore(
    (state: GlobalStateStoreType) => state.setTweetsFromServer
  );
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
    minChars: useStore(
      (state: GlobalStateStoreType) => state.wordcloudConfig.minChars
    ),
    maxChars: useStore(
      (state: GlobalStateStoreType) => state.wordcloudConfig.maxChars
    ),
    minInstances: useStore(
      (state: GlobalStateStoreType) => state.wordcloudConfig.minInstances
    ),
    numAngles: useStore(
      (state: GlobalStateStoreType) => state.wordcloudConfig.numAngles
    ),
    setWordcloudConfig: useStore(
      (state: GlobalStateStoreType) => state.setWordcloudConfig
    ),
  };
};

/** returns some of ["all","video","photo","text"] */
export function useAllowedMediaTypes(): string[] {
  const allowedMediaTypes = useStore(
    (state: GlobalStateStoreType) => state.config.allowedMediaTypes
  );

  return [
    ...(allowedMediaTypes.video ? ["video"] : []),
    ...(allowedMediaTypes.photo ? ["photo"] : []),
    ...(allowedMediaTypes.animated_gif ? ["animated_gif"] : []),
    ...(allowedMediaTypes.text ? ["text"] : []),
  ];
}

export const useIsLeftDrawerOpen = () => {
  const isDrawerOpen = useStore(
    (state: GlobalStateStoreType) => state.isDrawerOpen
  );
  const setIsDrawerOpen = useStore(
    (state: GlobalStateStoreType) => state.setIsDrawerOpen
  );
  return { isDrawerOpen, setIsDrawerOpen };
};

export const useRecomputeGraph = () => {
  const tweets = useTweets();
  const setTweets = useSetTweets();
  return () => setTimeout(() => setTweets(tweets));
};

export function usePrevious(value): typeof value {
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
