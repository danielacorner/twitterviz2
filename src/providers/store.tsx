import create from "zustand";
import shallow from "zustand/shallow";
import { uniqBy } from "lodash";
import { Tweet } from "../types";
import { COLOR_BY, FILTER_LEVELS } from "../utils/constants";
import mockTweets from "../tweets.json";
import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import qs from "query-string";

export const useSearchObj = () => qs.parse(useLocation().search);

export const TAB_INDICES = {
  NETWORKGRAPH: 0,
  WORDCLOUD: 1,
  GALLERY: 2,
};

export type GlobalStateStoreType = {
  tweetsFromServer: Tweet[];
  selectedNode: Tweet | null;
  setSelectedNode: (node: Tweet | null) => void;
  tooltipNode: Tweet | null;
  setTooltipNode: (node: Tweet | null) => void;
  setTweetsFromServer: (tweets) => void;
  config: AppConfig;
  setConfig: (newConfig: Partial<AppConfig>) => void;
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
          ? mockTweets.slice(0, 12)
          : ([] as Tweet[]),
      selectedNode: null as Tweet | null,
      setSelectedNode: (node: Tweet | null) =>
        set((state) => ({ selectedNode: node })),
      tooltipNode: null as Tweet | null,
      setTooltipNode: (node: Tweet | null) =>
        set((state) => ({ tooltipNode: node })),
      setTweetsFromServer: (tweets) =>
        set((state) => ({ tweetsFromServer: tweets })),
      loading: false,
      setLoading: (loading) => set((state) => ({ loading })),
      config: {
        isGridMode: false,
        showUserNodes: false,
        is3d: false,
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
        replace: true,
        filterLevel: FILTER_LEVELS.none,
        searchTerm: "",
        numTweets: 50,
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
    isWordcloud: `${TAB_INDICES.WORDCLOUD}` in useSearchObj(),
    isNetworkGraph: `${TAB_INDICES.NETWORKGRAPH}` in useSearchObj(),
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
export const useTooltipNode = () =>
  useStore((state: GlobalStateStoreType) => state.tooltipNode);
export const useSetTooltipNode = () =>
  useStore((state: GlobalStateStoreType) => state.setTooltipNode);
export const useLoading = () =>
  useStore((state: GlobalStateStoreType) => state.loading);
export const useSetLoading = () =>
  useStore((state: GlobalStateStoreType) => state.setLoading);
export const useStoredSaves = () =>
  useStore((state: GlobalStateStoreType) => ({
    saves: state.savedDatasets,
    setSaves: state.setSavedDatasets,
  }));

/** transform and save tweets to store */
export const useSetTweets = () => {
  const { replace } = useConfig();
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
    setTweetsFromServer(newTweets);
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
