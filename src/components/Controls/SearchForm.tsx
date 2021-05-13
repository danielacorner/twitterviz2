import React, { useState } from "react";
import { TextField, IconButton, Tooltip } from "@material-ui/core";
import { SERVER_URL } from "../../utils/constants";
import { useFetchTimeline, useParamsForFetch } from "../../utils/hooks";
import {
  useSetTweets,
  useLoading,
  useSetLoading,
} from "../../providers/store/useSelectors";
import { useConfig } from "../../providers/store/useConfig";
import SearchIcon from "@material-ui/icons/Search";
import styled from "styled-components/macro";

export function SearchForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const { numTweets, resultType } = useConfig();
  const loading = useLoading();
  const setLoading = useSetLoading();
  const setTweets = useSetTweets();
  const { fetchTimelineByHandle } = useFetchTimeline();

  const { langParam, allowedMediaTypesParam, countryParam, geocodeParam } =
    useParamsForFetch();

  const fetchSearchResults = async () => {
    setLoading(true);

    if (searchTerm[0] === "@") {
      fetchTimelineByHandle(searchTerm.slice(1));
      // fetch user
    } else {
      // search by term
      const resp = await fetch(
        `${SERVER_URL}/api/search?term=${searchTerm}&num=${numTweets}&result_type=${resultType}${langParam}${allowedMediaTypesParam}${countryParam}${geocodeParam}`
      );
      const data = await resp.json();

      setTweets(data);
    }
  };
  const disabled = loading || process.env.NODE_ENV !== "development";
  return (
    <Tooltip title={disabled ? "Premium only" : ""}>
      <StyledForm
        onSubmit={(e) => {
          e.preventDefault();
          fetchSearchResults();
        }}
      >
        <TextField
          label="Search by terms or @username"
          value={searchTerm}
          style={{
            width: 240,
          }}
          disabled={disabled}
          // InputProps={{ style: { height: 36 } }}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
        />
        <IconButton
          color="primary"
          onClick={fetchSearchResults}
          // disabled={loading || searchTerm === ""}
          disabled={disabled}
          type="submit"
          className="btnSearch"
        >
          <SearchIcon />
        </IconButton>
      </StyledForm>
    </Tooltip>
  );
}
const StyledForm = styled.form`
  display: flex;
  .btnSearch {
    margin-bottom: -12px;
  }
`;
