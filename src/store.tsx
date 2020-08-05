import create from "zustand";
import { uniqBy } from "lodash";
import { Tweet } from "./types";

const [useStore] = create((set) => ({
  tweetsFromServer: [],
  selectedNode: null as Tweet | null,
  setSelectedNode: (node: Tweet | null) =>
    set((state) => ({ selectedNode: node })),
  tooltipNode: null as Tweet | null,
  setTooltipNode: (node: Tweet | null) =>
    set((state) => ({ tooltipNode: node })),
  setTweetsFromServer: (tweets) =>
    set((state) => ({ tweetsFromServer: tweets })),
  addTweetsFromServer: (tweets) =>
    set((state) => ({
      tweetsFromServer: uniqBy(
        [...state.tweetsFromServer, ...tweets],
        (t) => t.id_str
      ),
    })),
}));

export default useStore;
