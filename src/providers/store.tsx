import create from "zustand";
import { uniqBy } from "lodash";
import { Tweet } from "../types";
import {
  TransformedTweets,
  transformTweetsIntoGraphData,
} from "../utils/transformData";

export type GlobalStateStoreType = {
  tweetsFromServer: Tweet[];
  selectedNode: Tweet | null;
  setSelectedNode: (node: Tweet | null) => void;
  tooltipNode: Tweet | null;
  setTooltipNode: (node: Tweet | null) => void;
  setTransformedTweets: (tweets) => void;
  transformedTweets: TransformedTweets;
  setTweetsFromServer: (tweets) => void;
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

/** transform and save tweets to store */
export const useSetTweetsFromServer = () => {
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
export const useAddTweetsFromServer = () => {
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
