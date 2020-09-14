import { useState, useEffect } from "react";
import { useConfig, useSetTweets, useLoading } from "../providers/store";
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

  const fetchTimeline = async (userId: string) => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 10 * 1000);
    const resp = await fetch(
      `${SERVER_URL}/api/user_timeline?id_str=${userId}&num=${numTweets}&mediaType=${mediaType}`
    );
    const data = await resp.json();
    setLoading(false);
    window.clearTimeout(timer);
    setTweets(data);
  };

  return { loading, fetchTimeline };
}
