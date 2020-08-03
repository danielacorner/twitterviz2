import create from "zustand";
import { uniqBy } from "lodash";

const [useStore] = create((set) => ({
  tweetsFromServer: [],
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
