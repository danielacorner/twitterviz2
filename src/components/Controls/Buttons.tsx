import React from "react";
import { Button, CircularProgress } from "@material-ui/core";
import { useConfig, useSetTweets, useLoading } from "../../providers/store";
import SearchIcon from "@material-ui/icons/Search";
import { SwitchWithLabels } from "../common/styledComponents";
import { SERVER_URL } from "../../utils/constants";

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

    const data = await resp.json();
    setLoading(false);
    clearTimeout(timer);

    setTweets(data);
  };

  return (
    <Button
      type="submit"
      className="btnFetch"
      disabled={loading}
      onClick={fetchNewTweets}
      variant="contained"
      color="primary"
      endIcon={<SearchIcon />}
    >
      {loading ? (
        <CircularProgress style={{ height: "24px", width: "24px" }} />
      ) : (
        "Stream Tweets"
      )}
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
