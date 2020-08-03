import create from "zustand";

const [useStore] = create((set) => ({
  tweetsFromServer: [],
  setTweetsFromServer: (tweets) =>
    set((state) => ({ tweetsFromServer: tweets })),
  addTweetsFromServer: (tweets) =>
    set((state) => ({
      tweetsFromServer: [...state.tweetsFromServer, ...tweets],
    })),
}));

export default useStore;
