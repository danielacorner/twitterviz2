import React, { useState, useEffect } from "react";
import {
  MenuItem,
  Select,
  Button,
  TextField,
  CircularProgress,
  InputLabel,
  FormControl,
  IconButton,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { FILTER_BY, FILTER_LEVELS } from "../../utils/constants";
import countryCodes from "../../utils/countryCodes";
import languages from "../../utils/languages";
import { useConfig, useSetTweets } from "../../providers/store";
import { TwoColFormStyles } from "./ControlsStyles";
import CheckIcon from "@material-ui/icons/Check";
import { H5, H6, Body1, SwitchWithLabels } from "../common/DivStyles";
import styled from "styled-components/macro";
import SelectGeolocation from "./SelectGeolocation";
import { geoDistanceKm } from "../../utils/distanceFromCoords";

const FetchTweetsControlsStyles = styled.div`
  h6 {
    margin: 1em 0 0.5em;
  }
`;

const FetchTweetsControls = () => {
  return (
    <FetchTweetsControlsStyles className="fetchTweetsControls controlsContainer">
      <H5>Fetch New Tweets</H5>
      <SwitchReplace />
      <H6>Filters</H6>
      <TweetFilterControls />
      <H6>Stream Tweets</H6>
      <BtnStreamNewTweets />
      <H6>Search Tweets</H6>
      <SearchForm />
      <FetchUserTweetsForm />
    </FetchTweetsControlsStyles>
  );
};

export default FetchTweetsControls;

function TweetFilterControls() {
  return (
    <div className="tweetFilterControls">
      <HowManyTweets />
      <RecentPopularMixedRadioBtns />
      <MediaTypeCheckboxes />
      <SelectFilterLevel />
      <SelectCountry />
      <SelectGeolocation />
      <SelectLanguage />
    </div>
  );
}

const RadioBtnsStyles = styled.div``;

function RecentPopularMixedRadioBtns() {
  const { resultType, setConfig } = useConfig();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ resultType: event.target.value as any });
  };
  return (
    <RadioBtnsStyles>
      <RadioGroup
        aria-label="result type"
        name="resultType"
        value={resultType}
        onChange={handleChange}
        row={true}
      >
        <FormControlLabel
          value="mixed"
          control={<Radio />}
          label={<Body1>Mixed</Body1>}
        />
        <FormControlLabel
          value="recent"
          control={<Radio />}
          label={<Body1>Recent</Body1>}
        />
        <FormControlLabel
          value="popular"
          control={<Radio />}
          label={<Body1>Popular</Body1>}
        />
      </RadioGroup>
    </RadioBtnsStyles>
  );
}

function BtnStreamNewTweets() {
  const {
    lang,
    countryCode,
    numTweets,
    filterLevel,
    mediaType,
    geolocation,
  } = useConfig();
  const setTweets = useSetTweets();

  const [loading, setLoading] = useState(false);

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
        ? `/api/filter?num=${numTweets}&locations=${locations}${mediaParam}`
        : `/api/stream?num=${numTweets}&filterLevel=${filterLevel}${mediaParam}${countryParam}${langParam}`
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
      variant="outlined"
    >
      {loading ? <CircularProgress /> : "Stream New Tweets"}
    </Button>
  );
}

// TODO: abstract forms
function SearchForm() {
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
      `/api/search?term=${searchTerm}&num=${numTweets}&result_type=${resultType}${langParam}${mediaParam}${countryParam}${geocodeParam}`
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
        label="Search for..."
        value={searchTerm}
        onChange={(e) => setConfig({ searchTerm: e.target.value })}
        type="text"
      />
      <IconButton disabled={loading || searchTerm === ""} type="submit">
        <CheckIcon />
      </IconButton>
    </TwoColFormStyles>
  );
}

function FetchUserTweetsForm() {
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
      `/api/user_timeline?screen_name=${userHandle}&num=${numTweets}`
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
      <TextField
        label={loading ? <CircularProgress /> : "Fetch user timeline..."}
        value={userHandle}
        onChange={(e) => setUserHandle(e.target.value)}
        type="text"
      />
      <IconButton disabled={loading || userHandle === ""} type="submit">
        <CheckIcon />
      </IconButton>
    </TwoColFormStyles>
  );
}

function HowManyTweets() {
  const { numTweets, mediaType, setConfig } = useConfig();

  useEffect(() => {
    // if searching for media, reduce num tweets
    if (mediaType) {
      setConfig({ numTweets: 25 });
    }
  }, [mediaType, setConfig]);

  return (
    <TextField
      label="How many tweets?"
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
  );
}

function SelectLanguage() {
  const { setConfig, lang } = useConfig();
  return (
    <FormControl>
      <InputLabel id="language">Language</InputLabel>
      <Select
        labelId="language"
        onChange={(event) => {
          setConfig({ lang: String(event.target.value) });
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
  );
}

function SelectCountry() {
  const { countryCode, setConfig } = useConfig();
  return (
    <FormControl>
      <InputLabel id="location">Country</InputLabel>
      <Select
        labelId="location"
        onChange={(event) => {
          setConfig({ countryCode: event.target.value as string });
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
  );
}

function SelectFilterLevel() {
  const { filterLevel, setConfig } = useConfig();

  return (
    <FormControl>
      <InputLabel id="filter-level">Filter level</InputLabel>
      <Select
        labelId="filter-level"
        onChange={(event) => {
          setConfig({
            filterLevel: event.target.value as keyof typeof FILTER_LEVELS,
          });
        }}
        value={filterLevel}
      >
        <MenuItem value={FILTER_LEVELS.medium}>Medium</MenuItem>
        <MenuItem value={FILTER_LEVELS.low}>Low</MenuItem>
        <MenuItem value={FILTER_LEVELS.none}>None</MenuItem>
      </Select>
    </FormControl>
  );
}

function SwitchReplace() {
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

const MediaTypeCheckboxesStyles = styled.div`
  display: grid;
  max-width: 200px;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
`;

function MediaTypeCheckboxes() {
  const {
    isVideoChecked,
    isImageChecked,
    setConfig,
    isAllChecked,
  } = useConfig();

  return (
    <MediaTypeCheckboxesStyles className="checkboxes">
      <FormControlLabel
        control={
          <Checkbox
            checked={isAllChecked}
            onChange={() => setConfig({ isAllChecked: !isAllChecked })}
            name="checkedA"
          />
        }
        label={<Body1>All</Body1>}
      />
      <FormControlLabel
        control={
          <Checkbox
            disabled={isAllChecked}
            checked={isVideoChecked || isAllChecked}
            onChange={() => setConfig({ isVideoChecked: !isVideoChecked })}
            name="checkedA"
          />
        }
        label={<Body1>Video</Body1>}
      />
      <FormControlLabel
        control={
          <Checkbox
            disabled={isAllChecked}
            checked={isImageChecked || isAllChecked}
            onChange={() => setConfig({ isImageChecked: !isImageChecked })}
            name="checkedA"
          />
        }
        label={<Body1>Image</Body1>}
      />
    </MediaTypeCheckboxesStyles>
  );
}
