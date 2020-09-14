import React, { useState, useEffect } from "react";
import {
  TextField,
  CircularProgress,
  InputLabel,
  Button,
} from "@material-ui/core";
import { FILTER_BY, SERVER_URL } from "../../utils/constants";
import { useConfig, useSetTweets } from "../../providers/store";
import SearchIcon from "@material-ui/icons/Search";
import { Body1 } from "../common/styledComponents";
import { geoDistanceKm } from "../../utils/distanceFromCoords";
import { TwoColRowStyles, TwoColFormStyles } from "../common/TwoColRowStyles";

// TODO: abstract forms
export function SearchForm() {
  const {
    searchTerm,
    numTweets,
    setConfig,
    lang,
    mediaType,
    countryCode,
    geolocation,
    resultType,
  } = useConfig();
  const [loading, setLoading] = useState(false);
  const setTweets = useSetTweets();

  const fetchSearchResults = async () => {
    setLoading(true);
    // after 10 seconds, stop loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10 * 1000);

    const langParam = lang !== "All" ? `&lang=${lang}` : "";
    const mediaParam = mediaType ? `&mediaType=${mediaType}` : "";
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
    const resp = await fetch(
      `${SERVER_URL}/api/search?term=${searchTerm}&num=${numTweets}&result_type=${resultType}${langParam}${mediaParam}${countryParam}${geocodeParam}`
    );
    const data = await resp.json();
    console.log("🌟🚨: fetchSearchResults -> data", data);
    setLoading(false);
    clearTimeout(timer);

    setTweets(data);
  };
  return (
    <TwoColFormStyles
      onSubmit={(e) => {
        e.preventDefault();
        fetchSearchResults();
      }}
    >
      <TextField
        label="🔎 Search"
        value={searchTerm}
        onChange={(e) => setConfig({ searchTerm: e.target.value })}
        type="text"
      />
      <Button
        variant="contained"
        color="primary"
        disabled={loading || searchTerm === ""}
        type="submit"
      >
        <SearchIcon />
      </Button>
    </TwoColFormStyles>
  );
}

export function FetchUserTweetsForm() {
  const [userHandle, setUserHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const setTweets = useSetTweets();
  const { numTweets } = useConfig();

  const fetchUserTweets = async () => {
    setLoading(true);
    // after 10 seconds, stop loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10 * 1000);

    const resp = await fetch(
      `${SERVER_URL}/api/user_timeline?screen_name=${userHandle}&num=${numTweets}`
    );
    const data = await resp.json();
    setLoading(false);
    clearTimeout(timer);

    setTweets(data);
  };

  return (
    <TwoColFormStyles
      onSubmit={(e) => {
        e.preventDefault();
        fetchUserTweets();
      }}
    >
      <div
        style={{
          display: "grid",
          gridAutoFlow: "column",
          alignItems: "baseline",
        }}
      >
        <Body1>@</Body1>
        <TextField
          label={loading ? <CircularProgress /> : "Fetch user..."}
          value={userHandle}
          onChange={(e) => setUserHandle(e.target.value)}
          type="text"
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        disabled={loading || !userHandle}
        type="submit"
      >
        <SearchIcon />
      </Button>
    </TwoColFormStyles>
  );
}

export function HowManyTweets() {
  const { numTweets, mediaType, setConfig } = useConfig();

  useEffect(() => {
    // if searching for media, reduce num tweets
    if (mediaType) {
      setConfig({ numTweets: 25 });
    }
  }, [mediaType, setConfig]);

  return (
    <TwoColRowStyles>
      <InputLabel
        className="inputLabel"
        id="language"
        style={{ whiteSpace: "nowrap" }}
      >
        How many?
      </InputLabel>
      <TextField
        value={numTweets}
        onChange={(e) => setConfig({ numTweets: +e.target.value })}
        type="number"
        inputProps={{
          step: [
            FILTER_BY.imageAndVideo,
            FILTER_BY.imageOnly,
            FILTER_BY.videoOnly,
          ].includes(mediaType)
            ? 5
            : 50,
        }}
      />
    </TwoColRowStyles>
  );
}
