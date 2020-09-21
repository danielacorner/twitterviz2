import create from "zustand";
import { uniqBy } from "lodash";
import { Tweet } from "../types";
import {
  GraphData,
  transformTweetsIntoGraphData,
} from "../utils/transformData";
import { COLOR_BY, FILTER_LEVELS, FILTER_BY } from "../utils/constants";
import mockTweets from "../tweets.json";

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
  setGraphData: (tweets) => void;
  graphData: GraphData;
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

const [useStore] = create(
  (set) =>
    ({
      graphData:
        process.env.NODE_ENV === "development"
          ? transformTweetsIntoGraphData(mockTweets as Tweet[])
          : ({
              graph: { nodes: [], links: [] },
              users: [],
              tweets: [],
            } as GraphData),
      tweetsFromServer:
        process.env.NODE_ENV === "development" ? mockTweets : ([] as Tweet[]),
      selectedNode: null as Tweet | null,
      setSelectedNode: (node: Tweet | null) =>
        set((state) => ({ selectedNode: node })),
      tooltipNode: null as Tweet | null,
      setTooltipNode: (node: Tweet | null) =>
        set((state) => ({ tooltipNode: node })),
      setTweetsFromServer: (tweets) =>
        set((state) => ({ tweetsFromServer: tweets })),
      setGraphData: (tweets) => set((state) => ({ graphData: tweets })),
      loading: false,
      setLoading: (loading) => set((state) => ({ loading })),
      config: {
        areUserNodesVisible: false,
        is3d: false,
        colorBy: COLOR_BY.mediaType as keyof typeof COLOR_BY | null,
        lang: "All",
        countryCode: "All",
        resultType: "mixed",
        geolocation: null,
        isAllChecked: true,
        isVideoChecked: true,
        isImageChecked: true,
        replace: true,
        filterLevel: FILTER_LEVELS.none,
        searchTerm: "",
        numTweets: 50,
        tabIndex: TAB_INDICES.NETWORKGRAPH,
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
export const useGraphData = () =>
  useStore((state: GlobalStateStoreType) => state.graphData);
export const useLoading = () =>
  useStore((state: GlobalStateStoreType) => ({
    loading: state.loading,
    setLoading: state.setLoading,
  }));
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
  const setGraphData = useStore(
    (state: GlobalStateStoreType) => state.setGraphData
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
    setGraphData(transformTweetsIntoGraphData(newTweets));
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
  const setGraphData = useStore(
    (state: GlobalStateStoreType) => state.setGraphData
  );
  return (tweets: Tweet[]) => {
    const newTweets = uniqBy([...tweetsFromServer, ...tweets], (t) => t.id_str);
    setTweetsFromServer(newTweets);
    setGraphData(transformTweetsIntoGraphData(newTweets));
  };
};

/** delete a tweet from store */
export const useDeleteTweet = () => {
  const tweetsFromServer = useStore(
    (state: GlobalStateStoreType) => state.tweetsFromServer
  );
  const setTweetsFromServer = useStore(
    (state: GlobalStateStoreType) => state.setTweetsFromServer
  );
  const setGraphData = useStore(
    (state: GlobalStateStoreType) => state.setGraphData
  );
  return (tweetId: string) => {
    const newTweets = tweetsFromServer.filter((t) => t.id_str !== tweetId);
    setTweetsFromServer(newTweets);
    setGraphData(transformTweetsIntoGraphData(newTweets));
  };
};

export type AppConfig = {
  is3d: boolean;
  areUserNodesVisible: boolean;
  colorBy: keyof typeof COLOR_BY | null;
  lang: string;
  resultType: "mixed" | "recent" | "popular";
  geolocation: {
    latitude: { left: number; right: number };
    longitude: { left: number; right: number };
  } | null;
  countryCode: string;
  isAllChecked: boolean;
  isVideoChecked: boolean;
  isImageChecked: boolean;
  replace: boolean;
  tabIndex: number;
  filterLevel: keyof typeof FILTER_LEVELS;
  searchTerm: string;
  numTweets: number;
};

export const useConfig = () => {
  return {
    loading: useStore((state: GlobalStateStoreType) => state.loading),
    is3d: useStore((state: GlobalStateStoreType) => state.config.is3d),
    areUserNodesVisible: useStore(
      (state: GlobalStateStoreType) => state.config.areUserNodesVisible
    ),
    colorBy: useStore((state: GlobalStateStoreType) => state.config.colorBy),
    lang: useStore((state: GlobalStateStoreType) => state.config.lang),
    countryCode: useStore(
      (state: GlobalStateStoreType) => state.config.countryCode
    ),
    geolocation: useStore(
      (state: GlobalStateStoreType) => state.config.geolocation
    ),
    resultType: useStore(
      (state: GlobalStateStoreType) => state.config.resultType
    ),
    isVideoChecked: useStore(
      (state: GlobalStateStoreType) => state.config.isVideoChecked
    ),
    isAllChecked: useStore(
      (state: GlobalStateStoreType) => state.config.isAllChecked
    ),
    isImageChecked: useStore(
      (state: GlobalStateStoreType) => state.config.isImageChecked
    ),
    replace: useStore((state: GlobalStateStoreType) => state.config.replace),
    isWordcloud: useStore(
      (state: GlobalStateStoreType) =>
        state.config.tabIndex === TAB_INDICES.WORDCLOUD
    ),
    isNetworkGraph: useStore(
      (state: GlobalStateStoreType) =>
        state.config.tabIndex === TAB_INDICES.NETWORKGRAPH
    ),
    tabIndex: useStore((state: GlobalStateStoreType) => state.config.tabIndex),
    filterLevel: useStore(
      (state: GlobalStateStoreType) => state.config.filterLevel
    ),
    searchTerm: useStore(
      (state: GlobalStateStoreType) => state.config.searchTerm
    ),
    numTweets: useStore(
      (state: GlobalStateStoreType) => state.config.numTweets
    ),
    mediaType: useMediaType(),
    allowedMediaTypes: useAllowedMediaTypes(),
    setConfig: useStore((state: GlobalStateStoreType) => state.setConfig),
  };
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

export function useAllowedMediaTypes(): string[] {
  const isVideoChecked = useStore(
    (state: GlobalStateStoreType) => state.config.isVideoChecked
  );
  const isImageChecked = useStore(
    (state: GlobalStateStoreType) => state.config.isImageChecked
  );
  const isAllChecked = useStore(
    (state: GlobalStateStoreType) => state.config.isAllChecked
  );
  return isAllChecked
    ? ["all"]
    : [
        ...(isVideoChecked ? ["video"] : []),
        ...(isImageChecked ? ["photo"] : []),
      ];
}

/** returns one of imageAndVideo, imageOnly, videoOnly, null */
export function useMediaType(): string | null {
  const allowedMediaTypes = useAllowedMediaTypes();

  return allowedMediaTypes.includes("all")
    ? FILTER_BY.all
    : allowedMediaTypes.includes("photo") && allowedMediaTypes.includes("video")
    ? FILTER_BY.imageAndVideo
    : allowedMediaTypes.includes("photo")
    ? FILTER_BY.imageOnly
    : allowedMediaTypes.includes("video")
    ? FILTER_BY.videoOnly
    : null;
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

export const useUserNodes = () => {
  const setGraphData = useStore(
    (state: GlobalStateStoreType) => state.setGraphData
  );
  const tweets = useTweets();

  const hideUserNodes = () => {
    const graphData = transformTweetsIntoGraphData(tweets);
    setGraphData({
      ...graphData,
      graph: { ...graphData.graph, nodes: graphData.tweets },
    });
  };
  const showUserNodes = () => {
    const graphData = transformTweetsIntoGraphData(tweets);
    setGraphData({
      ...graphData,
      graph: {
        ...graphData.graph,
        nodes: [...graphData.tweets, ...graphData.users],
      },
    });
  };
  return { hideUserNodes, showUserNodes };
};
