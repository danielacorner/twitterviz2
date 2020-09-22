import { useState, useEffect } from "react";
import {
  useConfig,
  useSetTweets,
  useLoading,
  useAddTweets,
  useTweets,
} from "../providers/store";
import { SERVER_URL } from "./constants";

export function useWindowSize() {
  // (For SSR apps only?) Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

export function useFetchTimeline() {
  const { loading, setLoading } = useLoading();
  const { numTweets, mediaType } = useConfig();
  const setTweets = useSetTweets();
  const tweets = useTweets();
  const addTweets = useAddTweets();

  const fetchTimeline = async (
    userId: string,
    isFetchMore: boolean = false
  ) => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 10 * 1000);
    const resp = await fetch(
      `${SERVER_URL}/api/user_timeline?id_str=${userId}&num=${numTweets}&mediaType=${mediaType}${
        isFetchMore ? `&maxId=${tweets[tweets.length - 1].id_str}` : ""
      }`
    );
    const data = await resp.json();
    setLoading(false);
    window.clearTimeout(timer);

    (isFetchMore ? addTweets : setTweets)(data);
  };

  return { loading, fetchTimeline };
}

export function useFetchLikes() {
  const { loading, setLoading } = useLoading();
  const { numTweets, mediaType } = useConfig();
  const setTweets = useSetTweets();

  const fetchLikes = async (userId: string) => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 10 * 1000);
    const resp = await fetch(
      `${SERVER_URL}/api/user_likes?id_str=${userId}&num=${numTweets}&mediaType=${mediaType}`
    );
    const data = await resp.json();
    setLoading(false);
    window.clearTimeout(timer);
    setTweets(data);
  };

  return { loading, fetchLikes };
}
