import { SERVER_URL } from "./constants";
import { useState, useEffect } from "react";
import {
  useConfig,
  useSetTweets,
  useLoading,
  useAddTweets,
  useTweets,
  useAllowedMediaTypes,
  useSetLoading,
  useLikesByUserId,
  useSetLikesByUserId,
  useRetweetsByTweetId,
  useSetRetweetersByTweetId,
} from "../providers/store";
import { geoDistanceKm } from "./distanceFromCoords";
import { Tweet } from "../types";
import { getFavorites } from "../components/common/BtnFavorite";

export function useFetchTweetsByIds(): (ids: string[]) => void {
  const setLoading = useSetLoading();
  const setTweets = useSetTweets();

  return async (ids: string[]) => {
    setLoading(true);

    const resp = await fetch(`${SERVER_URL}/api/get?ids=${ids.join(",")}`);

    const tweetsResponses = await resp.json();
    const data = tweetsResponses.map((d) => d.data);

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
  const loading = useLoading();
  const setLoading = useSetLoading();
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
    const resp = await fetch(
      `${SERVER_URL}/api/user_timeline?id_str=${userId}&num=${numTweets}${allowedMediaTypesParam}${
        isFetchMore ? `&maxId=${tweets[tweets.length - 1].id_str}` : ""
      }`
    );
    const data = await resp.json();

    (isFetchMore ? addTweets : setTweets)(data);
  };

  const fetchTimelineByHandle = async (userHandle: string) => {
    setLoading(true);

    const resp = await fetch(
      `${SERVER_URL}/api/user_timeline?screen_name=${userHandle}&num=${numTweets}${allowedMediaTypesParam}`
    );
    const data = await resp.json();

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
  const setLoading = useSetLoading();
  const { numTweets } = useConfig();
  const { allowedMediaTypesParam } = useParamsForFetch();
  const setTweets = useSetTweets();
  const likesByUserId = useLikesByUserId();
  const setLikesByUserId = useSetLikesByUserId();

  const fetchLikes = async (userId: string) => {
    setLoading(true);
    const resp = await fetch(
      `${SERVER_URL}/api/user_likes?id_str=${userId}&num=${numTweets}${allowedMediaTypesParam}`
    );
    const likedTweets = await resp.json();

    // add to the likes object for this user
    setLikesByUserId({
      ...likesByUserId,
      [userId]: [
        ...(likesByUserId?.[userId] || []),
        ...likedTweets.map((tweet) => tweet.id_str),
      ],
    });
    setTweets(likedTweets.map((tweet) => ({ ...tweet, isLikedNode: true })));
  };

  return { fetchLikes };
}

// TODO:
/** fetch tweets replying to a tweet
 * since we can only fetch from statuses/mentions_timeline,
 * we'll fetch all the replies to this user
 * * (later we could filter out other replies to this user, leaving only the ones to this tweet)
 *
 */
export function useFetchRetweets() {
  const setLoading = useSetLoading();
  const { numTweets } = useConfig();
  const { allowedMediaTypesParam } = useParamsForFetch();
  const setTweets = useSetTweets();
  const retweetsByTweetId = useRetweetsByTweetId();
  const setRetweetsByTweetId = useSetRetweetersByTweetId();

  const fetchRetweets = async (tweetId: string) => {
    setLoading(true);
    const resp = await fetch(
      `${SERVER_URL}/api/retweets?id_str=${tweetId}&num=${numTweets}${allowedMediaTypesParam}`
    );
    const retweetTweets = await resp.json();

    if (retweetTweets.length === 0) {
      return;
    }
    // add to the retweets object for this tweet id
    setRetweetsByTweetId({
      // * link reply nodes by Tweet.in_reply_to_id
      ...retweetsByTweetId,
      [tweetId]: [
        ...(retweetsByTweetId?.[tweetId] || []),
        ...retweetTweets.map((tweet) => tweet.id_str),
      ],
    });
    setTweets(
      retweetTweets.map((tweet) => ({ ...tweet, isRetweetNode: true }))
    );
  };

  return { fetchRetweets };
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
