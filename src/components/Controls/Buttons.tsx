import React from "react";
import { Button } from "@material-ui/core";
import { useConfig, useSetTweets, useLoading } from "../../providers/store";
import DiceIcon from "@material-ui/icons/Casino";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { SwitchWithLabels } from "../common/styledComponents";
import { SERVER_URL } from "../../utils/constants";
import { getFavorites } from "../common/BtnFavorite";

export function BtnStreamNewTweets() {
  const {
    lang,
    countryCode,
    numTweets,
    filterLevel,
    mediaType,
    geolocation,
  } = useConfig();
  const { loading, setLoading } = useLoading();
  const setTweets = useSetTweets();

  const fetchNewTweets = async () => {
    setLoading(true);
    // after 10 seconds, stop loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10 * 1000);

    const langParam = lang !== "All" ? `&lang=${lang}` : "";
    const mediaParam = mediaType ? `&mediaType=${mediaType}` : "";
    const countryParam =
      countryCode !== "All" ? `&countryCode=${countryCode}` : "";

    const locations = geolocation
      ? `${geolocation.latitude.left},${geolocation.longitude.left},${geolocation.latitude.right},${geolocation.longitude.right}`
      : "";

    const resp = await fetch(
      geolocation
        ? `${SERVER_URL}/api/filter?num=${numTweets}&locations=${locations}${mediaParam}`
        : `${SERVER_URL}/api/stream?num=${numTweets}&filterLevel=${filterLevel}${mediaParam}${countryParam}${langParam}`
    );

    console.log("🌟🚨: fetchNewTweets -> resp", resp);
    const data = await resp.json();
    console.log("🌟🚨: fetchNewTweets -> data", data);
    setLoading(false);
    clearTimeout(timer);

    setTweets(data);
  };

  return (
    <Button
      className="btnFetch"
      disabled={loading}
      onClick={fetchNewTweets}
      variant="contained"
      color="primary"
      endIcon={<DiceIcon className="diceIcon" />}
    >
      Stream Tweets
    </Button>
  );
}

export function BtnFetchFavorites() {
  const { loading, setLoading } = useLoading();
  const setTweets = useSetTweets();

  const fetchTweetsByIds = async () => {
    setLoading(true);
    // after 10 seconds, stop loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10 * 1000);

    const { favorites } = getFavorites();
    const resp = await fetch(`${SERVER_URL}/api/get?ids=${favorites}`);

    const tweetsResponses = await resp.json();
    const data = tweetsResponses.map((d) => d.data);

    setLoading(false);
    clearTimeout(timer);

    setTweets(data);
  };

  return (
    <Button
      type="submit"
      className="btnFetch"
      disabled={loading}
      onClick={fetchTweetsByIds}
      variant="outlined"
      color="secondary"
      endIcon={<FavoriteIcon />}
    >
      Favorites
    </Button>
  );
}

export function SwitchReplace() {
  const { replace, setConfig } = useConfig();
  return (
    <SwitchWithLabels
      labelLeft="Add"
      labelRight="Replace"
      onChange={() => setConfig({ replace: !replace })}
      checked={replace}
    />
  );
}
