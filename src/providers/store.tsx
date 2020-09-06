import create from "zustand";
import { uniqBy } from "lodash";
import { Tweet } from "../types";
import {
  GraphData,
  transformTweetsIntoGraphData,
} from "../utils/transformData";
import { COLOR_BY, FILTER_LEVELS, FILTER_BY } from "../utils/constants";

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
  wordcloudConfig: WordcloudConfig;
  setWordcloudConfig: (newConfig: Partial<WordcloudConfig>) => void;
};

const [useStore] = create(
  (set) =>
    ({
      graphData: {
        graph: { nodes: [], links: [] },
        users: [],
      } as GraphData,
      tweetsFromServer: [] as Tweet[],
      selectedNode: null as Tweet | null,
      setSelectedNode: (node: Tweet | null) =>
        set((state) => ({ selectedNode: node })),
      tooltipNode: null as Tweet | null,
      setTooltipNode: (node: Tweet | null) =>
        set((state) => ({ tooltipNode: node })),
      setTweetsFromServer: (tweets) =>
        set((state) => ({ tweetsFromServer: tweets })),
      setGraphData: (tweets) => set((state) => ({ graphData: tweets })),
      config: {
        is3d: false,
        colorBy: COLOR_BY.mediaType as keyof typeof COLOR_BY | null,
        lang: "All",
        countryCode: "All",
        isVideoChecked: true,
        isImageChecked: true,
        isWordcloud: false,
        replace: true,
        filterLevel: FILTER_LEVELS.none,
        searchTerm: "",
        numTweets: 50,
      },
      /** overwrite any values passed in */
      setConfig: (newConfig) =>
        set((state) => ({ config: { ...state.config, ...newConfig } })),
      wordcloudConfig: {
        minChars: 0,
        maxChars: 280,
      },
      setWordcloudConfig: (newConfig) =>
        set((state) => ({
          wordcloudConfig: { ...state.config, ...newConfig },
        })),
    } as GlobalStateStoreType)
);

export default useStore;

export const useTweets = () =>
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

/** transform and save tweets to store */
export const useSetTweets = () => {
  const setTweetsFromServer = useStore(
    (state: GlobalStateStoreType) => state.setTweetsFromServer
  );
  const setGraphData = useStore(
    (state: GlobalStateStoreType) => state.setGraphData
  );
  return (tweets: Tweet[]) => {
    setTweetsFromServer(tweets);
    setGraphData(transformTweetsIntoGraphData(tweets));
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

export type AppConfig = {
  is3d: boolean;
  colorBy: keyof typeof COLOR_BY | null;
  lang: string;
  countryCode: string;
  isVideoChecked: boolean;
  isImageChecked: boolean;
  replace: boolean;
  isWordcloud: boolean;
  filterLevel: keyof typeof FILTER_LEVELS;
  searchTerm: string;
  numTweets: number;
};

export const useConfig = () => {
  return {
    is3d: useStore((state: GlobalStateStoreType) => state.config.is3d),
    colorBy: useStore((state: GlobalStateStoreType) => state.config.colorBy),
    lang: useStore((state: GlobalStateStoreType) => state.config.lang),
    countryCode: useStore(
      (state: GlobalStateStoreType) => state.config.countryCode
    ),
    isVideoChecked: useStore(
      (state: GlobalStateStoreType) => state.config.isVideoChecked
    ),
    isImageChecked: useStore(
      (state: GlobalStateStoreType) => state.config.isImageChecked
    ),
    replace: useStore((state: GlobalStateStoreType) => state.config.replace),
    isWordcloud: useStore(
      (state: GlobalStateStoreType) => state.config.isWordcloud
    ),
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
};

export const useWordcloudConfig = () => {
  return {
    minChars: useStore(
      (state: GlobalStateStoreType) => state.wordcloudConfig.minChars
    ),
    maxChars: useStore(
      (state: GlobalStateStoreType) => state.wordcloudConfig.maxChars
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
  return [
    ...(isVideoChecked ? ["video"] : []),
    ...(isImageChecked ? ["photo"] : []),
  ];
}

/** returns one of imageAndVideo, imageOnly, videoOnly, null */
export function useMediaType(): string | null {
  const allowedMediaTypes = useAllowedMediaTypes();

  return allowedMediaTypes.length === 2
    ? FILTER_BY.imageAndVideo
    : allowedMediaTypes.includes("photo")
    ? FILTER_BY.imageOnly
    : allowedMediaTypes.includes("video")
    ? FILTER_BY.videoOnly
    : null;
}
