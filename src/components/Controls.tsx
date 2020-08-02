import React, { useState, useEffect } from "react";
import {
  MenuItem,
  Switch,
  Select,
  Button,
  TextField,
  CircularProgress,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import styled from "styled-components/macro";
import { COLOR_BY, FILTER_BY, FILTER_LEVELS } from "../utils/constants";
import countryCodes from "../utils/countryCodes";
import languages from "../utils/languages";

const Div = styled.div`
  display: grid;
  place-items: center;
`;

const Switch3D = ({ onChange, checked }) => (
  <Div css={``}>
    <span>
      2D
      <Switch onChange={onChange} checked={checked} />
      3D
    </span>
  </Div>
);

const ControlsStyles = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-template-rows: repeat(auto-fit, 140px);
  grid-gap: 16px;
  .styleTweets {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 8px;
  }
  .fetchTweets {
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 1fr 100px;
  }
  .checkboxes {
    display: grid;
    max-width: 200px;
    grid-template-columns: 1fr 1fr;
  }
  padding: 8px;
  border-right: 1px solid black;
`;

const Controls = ({
  colorBy,
  is3d,
  setIs3d,
  setTweetsFromServer,
  setColorBy,
  setIsVideoChecked,
  setIsImageChecked,
  isVideoChecked,
  isImageChecked,
  mediaType,
  countryCode,
  setCountryCode,
  lang,
  setLang,
}) => {
  const [numTweets, setNumTweets] = useState(50);
  const [loading, setLoading] = useState(false);
  const [filterLevel, setFilterLevel] = useState(FILTER_LEVELS.low);

  useEffect(() => {
    if (mediaType) {
      setNumTweets(25);
    }
  }, [mediaType]);

  const fetchNewTweets = async () => {
    setLoading(true);
    const resp = await fetch(
      `/api/stream?num=${numTweets}&filterLevel=${filterLevel}${
        mediaType ? `&mediaType=${mediaType}` : ""
      }${countryCode !== "All" ? `&countryCode=${countryCode}` : ""}${
        lang !== "All" ? `&lang=${lang}` : ""
      }`
    );
    const data = await resp.json();
    setLoading(false);
    setTweetsFromServer(data);
  };
  return (
    <ControlsStyles>
      <div className="styleTweets">
        <FormControl>
          <InputLabel id="color-by">Color by...</InputLabel>
          <Select
            labelId="color-by"
            onChange={(event) => {
              setColorBy(event.target.value);
            }}
            value={colorBy}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={COLOR_BY.mediaType}>Media type</MenuItem>
            <MenuItem value={COLOR_BY.textLength}>Text length</MenuItem>
            <MenuItem value={COLOR_BY.sentiment}>Sentiment</MenuItem>
          </Select>
        </FormControl>
        {colorBy === COLOR_BY.mediaType ? (
          <div className="checkboxes">
            <FormControlLabel
              control={
                <Checkbox
                  checked={isVideoChecked}
                  onChange={() => setIsVideoChecked((p) => !p)}
                  name="checkedA"
                />
              }
              label="Video"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isImageChecked}
                  onChange={() => setIsImageChecked((p) => !p)}
                  name="checkedA"
                />
              }
              label="Image"
            />
          </div>
        ) : null}
        <FormControl>
          <InputLabel id="filter-level">Filter level</InputLabel>
          <Select
            labelId="filter-level"
            onChange={(event) => {
              setFilterLevel(event.target.value as string);
            }}
            value={filterLevel}
          >
            <MenuItem value={FILTER_LEVELS.medium}>Medium</MenuItem>
            <MenuItem value={FILTER_LEVELS.low}>Low</MenuItem>
            <MenuItem value={FILTER_LEVELS.none}>None</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="location">Country</InputLabel>
          <Select
            labelId="location"
            onChange={(event) => {
              setCountryCode(event.target.value);
            }}
            value={countryCode}
          >
            <MenuItem value="All">
              <em>All</em>
            </MenuItem>
            {Object.entries(countryCodes).map(([code, countryName]) => (
              <MenuItem key={code} value={code}>
                {countryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="language">Language</InputLabel>
          <Select
            labelId="language"
            onChange={(event) => {
              setLang(event.target.value);
            }}
            value={lang}
          >
            <MenuItem value="All">
              <em>All</em>
            </MenuItem>
            {languages.map(({ code, name }) => (
              <MenuItem key={code} value={code}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <Switch3D onChange={() => setIs3d((prev) => !prev)} checked={is3d} />
      <div className="fetchTweets">
        <Button
          className="btnFetch"
          disabled={loading}
          onClick={fetchNewTweets}
          variant="outlined"
        >
          {loading ? <CircularProgress /> : "Fetch New Tweets"}
        </Button>
        <TextField
          label="How many?"
          value={numTweets}
          onChange={(e) => setNumTweets(+e.target.value)}
          type="number"
          inputProps={{
            step: [
              FILTER_BY.imageAndVideo,
              FILTER_BY.imageOnly,
              FILTER_BY.videoOnly,
            ].includes(mediaType)
              ? 10
              : 50,
          }}
        />
      </div>
    </ControlsStyles>
  );
};

export default Controls;
