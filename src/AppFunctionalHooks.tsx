import { useMount } from "utils/utils";

import { useEffect, useRef } from "react";
import "./App.css";
import { useFetchTweetsByIds } from "./utils/hooks";
import {
  useLoading,
  useTweets,
  useSetLoading,
} from "./providers/store/useSelectors";
import { useConfig } from "./providers/store/useConfig";
import { useFetchTweetsOnMount } from "./providers/faunaProvider";
import "./video-react.css"; // import video-react css
import qs from "query-string";
import { useLocation } from "react-router";

export default function AppFunctionalHooks() {
  useFetchTweetsOnMount();
  useFetchQueryTweetsOnMount();
  useStopLoadingEventually();
  useDetectOffline();

  return null;
}

function useDetectOffline() {
  const { setConfig } = useConfig();
  useMount(() => {
    window.addEventListener("offline", () => {
      setConfig({ isOffline: true });
    });
  });
}

/** fetch tweets if there's a query string like /?t=12345,12346
 *
 * [docs](https://docs.fauna.com/fauna/current/tutorials/crud?lang=javascript#retrieve)
 */
function useFetchQueryTweetsOnMount() {
  const query = useQueryString();
  const qTweets = query.tweets;
  const fetchTweetsByIds = useFetchTweetsByIds();
  const tweets = useTweets();
  // fetch tweets from DB on mount
  useMount(() => {
    if (
      // skip if we already have tweets,
      tweets.length > 0 ||
      // or if the query is empty
      !qTweets ||
      qTweets.length === 0
    ) {
      return;
    }

    const tweetIds = Array.isArray(qTweets) ? qTweets : qTweets.split(",");
    fetchTweetsByIds(tweetIds);
  });
}

function useQueryString() {
  const location = useLocation();
  return qs.parse(location.search);
}

const MAX_LOADING_TIME = 2 * 1000;

/** stop loading after MAX_LOADING_TIME */
function useStopLoadingEventually() {
  const loading = useLoading();
  const setLoading = useSetLoading();
  const tweets = useTweets();
  const prevTweets = useRef(tweets);

  // when loading starts, start a timer to stop loading
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, MAX_LOADING_TIME);

    return () => {
      clearTimeout(timer);
    };
  }, [loading, setLoading, tweets]);

  // when tweets length changes, stop loading
  useEffect(() => {
    if (prevTweets.current.length !== tweets.length) {
      setLoading(false);
      const app = document.querySelector(".App");
      if (!app) {
        return;
      }
      (app as HTMLElement).style.cursor = "unset";
    }
  }, [tweets, setLoading]);
}
