import { useSetTweets } from "providers/store/useSelectors";
import { useConfig } from "providers/store/useConfig";

export function useDeleteAllTweets() {
  const setTweets = useSetTweets();
  const { setConfig } = useConfig();

  return () => {
    setConfig({ replace: true });
    setTweets([], true);
    setTimeout(() => {
      setConfig({ replace: false });
    });
  };
}
