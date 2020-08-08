import create from "zustand";
import { uniqBy } from "lodash";
import { Tweet } from "./types";
import {
  TransformedTweets,
  transformTweetsIntoGraphData,
} from "./utils/transformData";
import tweets from "./tweets.json";

export type GlobalStateStoreType = {
  tweetsFromServer: Tweet[];
  selectedNode: Tweet | null;
  setSelectedNode: (node: Tweet | null) => void;
  tooltipNode: Tweet | null;
  setTooltipNode: (node: Tweet | null) => void;
  setTweetsFromServer: (tweets) => void;
  addTweetsFromServer: (tweets) => void;
};
const [useStore] = create(
  (set) =>
    ({
      transformedTweets: transformTweetsIntoGraphData(
        tweets as Tweet[]
      ) as TransformedTweets | null,
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
      addTweetsFromServer: (tweets) =>
        set((state) => ({
          tweetsFromServer: uniqBy(
            [...state.tweetsFromServer, ...tweets],
            (t) => t.id_str
          ),
        })),
    } as GlobalStateStoreType)
);

export default useStore;

export const useTweetsFromServer = () =>
  useStore((state: GlobalStateStoreType) => state.tweetsFromServer);
export const useSelectedNode = () =>
  useStore((state: GlobalStateStoreType) => state.selectedNode);
export const useSetSelectedNode = () =>
  useStore((state: GlobalStateStoreType) => state.setSelectedNode);
export const useTooltipNode = () =>
  useStore((state: GlobalStateStoreType) => state.tooltipNode);
export const useSetTooltipNode = () =>
  useStore((state: GlobalStateStoreType) => state.setTooltipNode);
export const useSetTweetsFromServer = () =>
  useStore((state: GlobalStateStoreType) => state.setTweetsFromServer);
export const useAddTweetsFromServer = () =>
  useStore((state: GlobalStateStoreType) => state.addTweetsFromServer);
