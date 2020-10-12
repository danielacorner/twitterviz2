import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import { SERVER_URL } from "../../utils/constants";
import { useFetchTimeline, useParamsForFetch } from "../../utils/hooks";
import {
  useConfig,
  useSetTweets,
  useLoading,
  useSetLoading,
} from "../../providers/store";
import SearchIcon from "@material-ui/icons/Search";
import { Body1 } from "../common/styledComponents";
import { TwoColFormStyles } from "../common/TwoColRowStyles";
import styled from "styled-components/macro";
const Div = styled.div``;
const InputStyles = styled.div`
  display: flex;
  place-items: center;
  place-content: center;
  align-items: flex-end;
  .MuiInput-root {
    margin-top: 0 !important;
  }
`;

export function SearchForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const { numTweets, resultType } = useConfig();
  const loading = useLoading();
  const setLoading = useSetLoading();
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
    const data = await resp.json();
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
      <InputStyles>
        <TextField
          label="🔎 Search"
          value={searchTerm}
          style={{ textAlign: "left" }}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
        />
      </InputStyles>
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

  const { fetchTimelineByHandle, loading } = useFetchTimeline();

  return (
    <TwoColFormStyles
      onSubmit={(e) => {
        e.preventDefault();
        fetchTimelineByHandle(userHandle);
      }}
    >
      <InputStyles>
        <Body1
          style={{ color: "hsl(0,0%,50%)", marginBottom: 6, marginRight: 4 }}
        >
          @
        </Body1>
        <TextField
          style={{ textAlign: "left" }}
          label={"Fetch user..."}
          value={userHandle}
          onChange={(e) => setUserHandle(e.target.value)}
          type="text"
        />
      </InputStyles>
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
  const { numTweets, setConfig } = useConfig();

  return (
    <Div
      css={`
        .MuiFormLabel-root {
          white-space: nowrap;
        }
      `}
    >
      <TextField
        style={{ width: 60 }}
        label="How many?"
        value={numTweets}
        onChange={(e) => setConfig({ numTweets: +e.target.value })}
        type="number"
        inputProps={{
          step: 5,
        }}
      />
    </Div>
  );
}
