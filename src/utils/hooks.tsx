import { SERVER_URL } from "./constants";
import { useState, useEffect } from "react";
import {
  useConfig,
  useSetTweets,
  useLoading,
  useAddTweets,
  useTweets,
  useAllowedMediaTypes,
} from "../providers/store";
import { geoDistanceKm } from "./distanceFromCoords";
import { Tweet } from "../types";
import { getFavorites } from "../components/common/BtnFavorite";

export function useFetchTweetsByIds(): (ids: string[]) => void {
  const { setLoading } = useLoading();
  const setTweets = useSetTweets();

  return async (ids: string[]) => {
    setLoading(true);
    // after 10 seconds, stop loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10 * 1000);

    const resp = await fetch(`${SERVER_URL}/api/get?ids=${ids.join(",")}`);

    const tweetsResponses = await resp.json();
    const data = tweetsResponses.map((d) => d.data);

    setLoading(false);
    clearTimeout(timer);

    setTweets(data);
  };
}

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
  const { numTweets } = useConfig();
  const { allowedMediaTypesParam } = useParamsForFetch();

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
      `${SERVER_URL}/api/user_timeline?id_str=${userId}&num=${numTweets}${allowedMediaTypesParam}${
        isFetchMore ? `&maxId=${tweets[tweets.length - 1].id_str}` : ""
      }`
    );
    const data = await resp.json();
    setLoading(false);
    window.clearTimeout(timer);

    (isFetchMore ? addTweets : setTweets)(data);
  };

  const fetchTimelineByHandle = async (userHandle: string) => {
    setLoading(true);
    // after 10 seconds, stop loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10 * 1000);

    const resp = await fetch(
      `${SERVER_URL}/api/user_timeline?screen_name=${userHandle}&num=${numTweets}${allowedMediaTypesParam}`
    );
    const data = await resp.json();
    setLoading(false);
    clearTimeout(timer);

    setTweets(data);
  };

  return { loading, fetchTimeline, fetchTimelineByHandle };
}

export function useFetchUsers() {
  const { allowedMediaTypesParam } = useParamsForFetch();
  const { toggleFavoriteUser } = getFavorites();
  const setTweets = useSetTweets();
  const fetchUsers = async (userHandles: string[]) => {
    const results = await (Promise as any).allSettled(
      userHandles.map((userHandle) =>
        // TODO: GET users/lookup https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-users-lookup

        fetch(
          `${SERVER_URL}/api/user_timeline?screen_name=${userHandle}&num=${1}${allowedMediaTypesParam}`
        ).then((resp) => ({ ...resp.json() }))
      )
    );
    const resultsWithUsers = userHandles.map((userHandle, idx) => [
      userHandle,
      results[idx],
    ]);

    let newTweets = [] as Tweet[];
    (resultsWithUsers as any[]).forEach(
      ([userHandle, { status, value: tweetOrErr }]) => {
        if (status === "fulfilled" && "id_str" in tweetOrErr) {
          newTweets = [...newTweets, tweetOrErr];
        } else {
          console.log(tweetOrErr);
          toggleFavoriteUser(userHandle);
        }
      }
    );
    setTweets(newTweets);
  };

  return fetchUsers;
}

export function useFetchLikes() {
  const { loading, setLoading } = useLoading();
  const { numTweets } = useConfig();
  const { allowedMediaTypesParam } = useParamsForFetch();
  const setTweets = useSetTweets();

  const fetchLikes = async (userId: string) => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 10 * 1000);
    const resp = await fetch(
      `${SERVER_URL}/api/user_likes?id_str=${userId}&num=${numTweets}${allowedMediaTypesParam}`
    );
    const data = await resp.json();
    setLoading(false);
    window.clearTimeout(timer);
    setTweets(data);
  };

  return { loading, fetchLikes };
}

export function useParamsForFetch() {
  const { lang, countryCode, geolocation } = useConfig();
  const langParam = lang !== "All" ? `&lang=${lang}` : "";
  const allowedMediaTypesStrings = useAllowedMediaTypes();
  const allowedMediaTypesParam =
    allowedMediaTypesStrings.length === 0
      ? ""
      : `&allowedMediaTypes=${allowedMediaTypesStrings.join(",")}`;
  const countryParam =
    countryCode !== "All" ? `&countryCode=${countryCode}` : "";
  // https://developer.twitter.com/en/docs/twitter-api/v1/tweets/search/api-reference/get-search-tweets
  const searchRadius = geolocation
    ? geoDistanceKm(
        geolocation.latitude.left,
        geolocation.longitude.left,
        geolocation.latitude.right,
        geolocation.longitude.left
      ) / 2
    : "";
  const geocodeParam = geolocation
    ? `&geocode=${
        (geolocation.latitude.left + geolocation.latitude.right) / 2
      },${
        (geolocation.longitude.left + geolocation.longitude.right) / 2
      },${searchRadius}km`
    : "";
  return { langParam, allowedMediaTypesParam, countryParam, geocodeParam };
}
