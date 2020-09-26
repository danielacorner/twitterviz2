import React from "react";
import { Button, Tooltip } from "@material-ui/core";
import {
  useConfig,
  useSetTweets,
  useLoading,
  useIsLeftDrawerOpen,
} from "../../providers/store";
import DiceIcon from "@material-ui/icons/Casino";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { CollapsibleSwitchWithLabels } from "../common/styledComponents";
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
    <CollapsibleButton
      text={"Stream Tweets"}
      icon={<DiceIcon className="diceIcon" />}
      disabled={loading}
      onClick={fetchNewTweets}
      className="btnFetch"
      variant="contained"
      color="primary"
    />
  );
}

export function BtnFetchFavorites() {
  const fetchTweetsByIds = useFetchTweetsByIds();
  const { loading } = useLoading();

  return (
    <CollapsibleButton
      text={"Favorites"}
      icon={<FavoriteIcon />}
      type="submit"
      className="btnFetch"
      disabled={loading}
      onClick={() => {
        const { favorites } = getFavorites();
        fetchTweetsByIds([favorites]);
      }}
      variant="outlined"
      color="secondary"
    />
  );
}

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

function CollapsibleButton({ text, icon, disabled, ...props }) {
  const { isDrawerOpen } = useIsLeftDrawerOpen();

  return (
    <Tooltip title={isDrawerOpen ? "" : text}>
      <Button
        disabled={disabled}
        endIcon={isDrawerOpen ? icon : null}
        {...props}
      >
        {isDrawerOpen ? text : icon}
      </Button>
    </Tooltip>
  );
}

export function SwitchReplace() {
  const { replace, setConfig } = useConfig();
  return (
    <CollapsibleSwitchWithLabels
      labelLeft="Add"
      labelRight="Replace"
      onChange={() => setConfig({ replace: !replace })}
      checked={replace}
    />
  );
}
