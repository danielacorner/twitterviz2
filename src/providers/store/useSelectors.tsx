import { uniqBy } from "lodash";
import { Tweet, User } from "../../types";
import { useCallback, useEffect, useRef } from "react";
import useStore, { selectedNodeIdAtom } from "./store";
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const tweetsFromServerAtom = atomWithStorage<Tweet[]>(
  "atoms:tweetsFromServerAtom",
  []
);
export const isLoadingFromTwitterApiAtom = atom<boolean>(false);

export const useTweets = (): Tweet[] => {
  const [tweetsFromServer] = useAtom(tweetsFromServerAtom);
  return tweetsFromServer || [];
  // useStore((state) => state.tweetsFromServer);
};
export const useSelectedNode = () => {
  const tweets = useTweets();
  const [selectedNodeId] = useAtom(selectedNodeIdAtom);
  const selectedNode = selectedNodeId
    ? tweets.find((t) =>
        [t.id_str, t.id, t.user.id, t.user.id_str]
          .map(String)
          .includes(selectedNodeId)
      )
    : null;
  return selectedNode;
};
export const useSetSelectedNode = () => {
  const [, setSelectedNodeId] = useAtom(selectedNodeIdAtom);

  return (node: Tweet | null) => {
    setSelectedNodeId(node?.id_str || String(node?.id) || null);
  };
};
export const useTooltipNode = (): Tweet | null =>
  useStore((state) => state.tooltipNode);
export const useSetTooltipNode = () =>
  useStore((state) => state.setTooltipNode);
export const useLoading = () => useStore((state) => state.loading);
export const useSetLoading = () => useStore((state) => state.setLoading);
export const useLikesByUserId = () => useStore((state) => state.likesByUserId);
export const useSetLikesByUserId = () =>
  useStore((state) => state.setLikesByUserId);
// export const useRepliesByUserId = () =>
//   useStore((state) => (state).repliesByUserId);
// export const useSetRepliesByUserId = () =>
//   useStore((state) => (state).setRepliesByUserId);
export const useRetweetsByTweetId = () =>
  useStore((state) => state.retweetsByTweetId);
export const useSetRetweetsByTweetId = () =>
  useStore((state) => state.setRetweetsByTweetId);

export const useStoredSaves = () =>
  useStore((state) => ({
    saves: state.savedDatasets,
    setSaves: state.setSavedDatasets,
  }));

/** transform and save tweets to store */
export const useSetTweets = () => {
  const [, setTweetsFromServer] = useAtom(tweetsFromServerAtom);
  return setTweetsFromServer;
};

export const useAddTweets = () => {
  const [tweetsFromServer, setTweetsFromServer] = useAtom(tweetsFromServerAtom);

  return (tweets: Tweet[]) => {
    const newTweets = uniqBy([...tweetsFromServer, ...tweets], (t) => t.id_str);
    setTweetsFromServer(newTweets || []);
  };
};
/** delete a tweet from store */

export const useDeleteTweet = () => {
  const [tweetsFromServer, setTweetsFromServer] = useAtom(tweetsFromServerAtom);
  return useCallback(
    (tweetId: string) => {
      const newTweets = tweetsFromServer.filter((t) => t.id_str !== tweetId);
      setTweetsFromServer(newTweets || []);
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
    minChars: useStore((state) => state.wordcloudConfig.minChars),
    maxChars: useStore((state) => state.wordcloudConfig.maxChars),
    minInstances: useStore((state) => state.wordcloudConfig.minInstances),
    numAngles: useStore((state) => state.wordcloudConfig.numAngles),
    setWordcloudConfig: useStore((state) => state.setWordcloudConfig),
  };
}; /*
function handleTweetsErrors(tweetsArg: Tweet[]) {
  const isError = !Array.isArray(tweetsArg);
  if (isError) {
    console.error(tweetsArg);
  }
  const tweets = isError ? [] : tweetsArg;
  return tweets;
}
 */
/** returns some of ["all","video","photo","text"] */

export function useAllowedMediaTypes(): string[] {
  const allowedMediaTypes = useStore((state) => state.config.allowedMediaTypes);

  return [
    ...(allowedMediaTypes.video ? ["video"] : []),
    ...(allowedMediaTypes.photo ? ["photo"] : []),
    ...(allowedMediaTypes.animated_gif ? ["animated_gif"] : []),
    ...(allowedMediaTypes.text ? ["text"] : []),
  ];
}

export const useRecomputeGraph = () => {
  const tweets = useTweets();
  const setTweets = useSetTweets();
  return () => setTimeout(() => setTweets(tweets));
};

export function usePrevious(value: any): typeof value {
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

export function getRetweetedUser(tweet: Tweet): User | null {
  const retweetedUser = tweet?.retweeted_status?.user || null;
  return retweetedUser;
}

export function getOriginalPoster(tweet: Tweet): User | null {
  const retweetedUser = getRetweetedUser(tweet);
  const originalPoster = retweetedUser ? retweetedUser : tweet?.user;
  return originalPoster;
}

export function getUsersInTweet(tweet: Tweet) {
  const retweetedUser = getRetweetedUser(tweet);
  const originalPoster = retweetedUser ? retweetedUser : tweet?.user;
  const retweetingUser = retweetedUser ? tweet.user : null;
  return { retweetingUser, originalPoster };
}
