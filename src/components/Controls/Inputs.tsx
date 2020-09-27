import React, { useState, useEffect } from "react";
import {
  TextField,
  CircularProgress,
  InputLabel,
  Button,
} from "@material-ui/core";
import { SERVER_URL } from "../../utils/constants";
import { useParamsForFetch } from "../../utils/hooks";
import { useConfig, useSetTweets, useLoading } from "../../providers/store";
import SearchIcon from "@material-ui/icons/Search";
import { Body1 } from "../common/styledComponents";
import { TwoColRowStyles, TwoColFormStyles } from "../common/TwoColRowStyles";

// TODO: abstract forms
export function SearchForm() {
  const { searchTerm, numTweets, setConfig, resultType } = useConfig();
  const { loading, setLoading } = useLoading();
  const setTweets = useSetTweets();

  const {
    langParam,
    allowedMediaTypesParam,
    countryParam,
    geocodeParam,
  } = useParamsForFetch();

  const fetchSearchResults = async () => {
    setLoading(true);
    // after 10 seconds, stop loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10 * 1000);

    const resp = await fetch(
      `${SERVER_URL}/api/search?term=${searchTerm}&num=${numTweets}&result_type=${resultType}${langParam}${allowedMediaTypesParam}${countryParam}${geocodeParam}`
    );
    console.log("🌟🚨: fetchSearchResults -> resp", resp);
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
  const { numTweets, allowedMediaTypes, setConfig } = useConfig();

  useEffect(() => {
    // if searching for media, reduce num tweets
    if (!allowedMediaTypes.text) {
      setConfig({ numTweets: 25 });
    }
  }, [allowedMediaTypes, setConfig]);

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
          step: !allowedMediaTypes.text ? 5 : 50,
        }}
      />
    </TwoColRowStyles>
  );
}
