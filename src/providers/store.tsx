import create from "zustand";
import { uniqBy } from "lodash";
import { Tweet } from "../types";
import {
  TransformedTweets,
  transformTweetsIntoGraphData,
} from "../utils/transformData";
import { COLOR_BY, FILTER_LEVELS, FILTER_BY } from "../utils/constants";

export type AppConfig = {
  is3d: boolean;
  colorBy: keyof typeof COLOR_BY | null;
  lang: string;
  countryCode: string;
  isVideoChecked: boolean;
  isImageChecked: boolean;
  replace: boolean;
  filterLevel: keyof typeof FILTER_LEVELS;
  searchTerm: string;
  numTweets: number;
};

export type GlobalStateStoreType = {
  tweetsFromServer: Tweet[];
  selectedNode: Tweet | null;
  setSelectedNode: (node: Tweet | null) => void;
  tooltipNode: Tweet | null;
  setTooltipNode: (node: Tweet | null) => void;
  setTransformedTweets: (tweets) => void;
  transformedTweets: TransformedTweets;
  setTweetsFromServer: (tweets) => void;
  config: AppConfig;
  setConfig: (newConfig: Partial<AppConfig>) => void;
};

const [useStore] = create(
  (set) =>
    ({
      transformedTweets: {
        graph: { nodes: [], links: [] },
        users: [],
      } as TransformedTweets,
      tweetsFromServer: [] as Tweet[],
      selectedNode: null as Tweet | null,
      setSelectedNode: (node: Tweet | null) =>
        set((state) => ({ selectedNode: node })),
      tooltipNode: null as Tweet | null,
      setTooltipNode: (node: Tweet | null) =>
        set((state) => ({ tooltipNode: node })),
      setTweetsFromServer: (tweets) =>
        set((state) => ({ tweetsFromServer: tweets })),
      setTransformedTweets: (tweets) =>
        set((state) => ({ transformedTweets: tweets })),
      config: {
        is3d: false,
        colorBy: COLOR_BY.mediaType as keyof typeof COLOR_BY | null,
        lang: "All",
        countryCode: "All",
        isVideoChecked: true,
        isImageChecked: true,
        replace: true,
        filterLevel: FILTER_LEVELS.none,
        searchTerm: "",
        numTweets: 50,
      },
      /** overwrite any values passed in */
      setConfig: (newConfig) =>
        set((state) => ({ config: { ...state.config, ...newConfig } })),
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

/** transform and save tweets to store */
export const useSetTweets = () => {
  const setTweetsFromServer = useStore(
    (state: GlobalStateStoreType) => state.setTweetsFromServer
  );
  const setTransformedTweets = useStore(
    (state: GlobalStateStoreType) => state.setTransformedTweets
  );
  return (tweets: Tweet[]) => {
    setTweetsFromServer(tweets);
    setTransformedTweets(transformTweetsIntoGraphData(tweets));
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
  const setTransformedTweets = useStore(
    (state: GlobalStateStoreType) => state.setTransformedTweets
  );
  return (tweets: Tweet[]) => {
    const newTweets = uniqBy([...tweetsFromServer, ...tweets], (t) => t.id_str);
    setTweetsFromServer(newTweets);
    setTransformedTweets(transformTweetsIntoGraphData(newTweets));
  };
};

export const useConfig = () => {
  return {
    ...useStore((state: GlobalStateStoreType) => state.config),
    mediaType: useMediaType(),
    allowedMediaTypes: useAllowedMediaTypes(),
    setConfig: useStore((state: GlobalStateStoreType) => state.setConfig),
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
