import { uniqBy } from "lodash";
import { Tweet, User } from "../../types";
import { useCallback, useEffect, useRef } from "react";
import { useConfig } from "./useConfig";
import useStore from "./store";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const tweetsFromServerAtom = atomWithStorage<Tweet[]>(
  "atoms:tweetsFromServerAtom",
  []
);

export const useTweets = (): Tweet[] => {
  const [tweetsFromServer] = useAtom(tweetsFromServerAtom);
  return tweetsFromServer;
  // useStore((state) => state.tweetsFromServer);
};
export const useSelectedNode = () => useStore((state) => state.selectedNode);
export const useSetSelectedNode = () =>
  useStore((state) => state.setSelectedNode);
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
  const { replace } = useConfig();
  const setRetweets = useSetRetweetsByTweetId();
  const setLikes = useSetLikesByUserId();
  const [, setTweetsFromServer] = useAtom(tweetsFromServerAtom);

  return (tweetsArg: Tweet[], forceReplace: boolean = false) => {
    const tweets = handleTweetsErrors(tweetsArg);

    if (replace || forceReplace) {
      // delete all likes, retweets
      setRetweets({});
      setLikes({});
    }

    const newTweets = tweets;
    // : uniqBy([...tweetsFromServer, ...tweets], (t) => t.id_str);

    // * whenever we change the tweets,
    // * scan all the tweets once to create
    // * retweetsByTweetId
    const retweetsByTweetId: { [tweetId: string]: string[] } = newTweets.reduce(
      (acc, tweet) => {
        // for each tweet,
        // if the tweet has a retweet in it
        const hasRetweet = tweet?.retweeted_status?.id_str;
        // add its id_str to the array associated with its tweet.id_str
        if (hasRetweet) {
          // check the existing tweets for this tweet,
          // if it exists, add it to the list to create a link
          // *(this operation is now O^N2, but it's only performed when the tweets change)
          const isRetweetInAllTweets = Boolean(
            newTweets.find((t) => t.id_str === tweet.retweeted_status?.id_str)
          );

          if (isRetweetInAllTweets) {
            acc = {
              ...acc,
              [tweet.id_str]: [
                ...(acc[tweet.id_str] || []),
                tweet.retweeted_status?.id_str,
              ],
            };
          }
        }

        return acc;
      },
      {}
    );

    // for each retweet node, tag is as such
    const tweetIdsToTagAsOriginal = Object.values(retweetsByTweetId).reduce(
      (acc, retweetIds) => [...acc, ...retweetIds],
      [] as string[]
    );
    const tweetIdsToTagAsRetweet = Object.keys(retweetsByTweetId).reduce(
      (acc, tweetId) => [...acc, tweetId],
      [] as string[]
    );

    setRetweets(retweetsByTweetId);

    const newTweetsTagged = newTweets.map((t) => ({
      ...t,
      ...(tweetIdsToTagAsOriginal.includes(t.id_str)
        ? { isRetweetNode: true }
        : {}),
      ...(tweetIdsToTagAsRetweet.includes(t.id_str)
        ? { isOriginalNode: true }
        : {}),
    }));

    setTweetsFromServer(newTweetsTagged);
    window.localStorage.setItem("tweets", JSON.stringify(newTweetsTagged));
  };
};
/** transform and add tweets to store */

export const useAddTweets = () => {
  const [tweetsFromServer, setTweetsFromServer] = useAtom(tweetsFromServerAtom);

  return (tweets: Tweet[]) => {
    const newTweets = uniqBy([...tweetsFromServer, ...tweets], (t) => t.id_str);
    setTweetsFromServer(newTweets);
  };
};
/** delete a tweet from store */

export const useDeleteTweet = () => {
  const [tweetsFromServer, setTweetsFromServer] = useAtom(tweetsFromServerAtom);
  return useCallback(
    (tweetId: string) => {
      const newTweets = tweetsFromServer.filter((t) => t.id_str !== tweetId);
      setTweetsFromServer(newTweets);
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
};
function handleTweetsErrors(tweetsArg: Tweet[]) {
  const isError = !Array.isArray(tweetsArg);
  if (isError) {
    console.error(tweetsArg);
  }
  const tweets = isError ? [] : tweetsArg;
  return tweets;
}

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

export const useIsLeftDrawerOpen = () => {
  const isDrawerOpen = useStore((state) => state.isDrawerOpen);
  const setIsDrawerOpen = useStore((state) => state.setIsDrawerOpen);
  return { isDrawerOpen, setIsDrawerOpen };
};

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
  return tweet?.retweeted_status?.user || null;
}

export function getOriginalPoster(tweet: any) {
  const retweetedUser = getRetweetedUser(tweet);
  const originalPoster = retweetedUser ? retweetedUser : tweet?.user;
  return originalPoster;
}
