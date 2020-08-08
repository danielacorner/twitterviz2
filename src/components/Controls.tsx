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
import useStore, { useTweetsFromServer } from "../store";
import { transformTweetsIntoGraphData } from "../utils/transformData";
import { uniqBy } from "lodash";

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
  grid-gap: 32px;
  align-content: start;
  .styleTweets {
    display: grid;
    grid-gap: 8px;
  }
  .filters {
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 1fr 1fr;
  }
  .checkboxes {
    display: grid;
    max-width: 200px;
    grid-template-columns: 1fr 1fr;
  }
  padding: 8px;
  border-right: 1px solid black;
`;

const SelectLanguage = (props) => (
  <FormControl>
    <InputLabel id="language">Language</InputLabel>
    <Select
      labelId="language"
      onChange={(event) => {
        props.setLang(event.target.value);
      }}
      value={props.lang}
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

const SelectCountry = (props) => (
  <FormControl>
    <InputLabel id="location">Country</InputLabel>
    <Select
      labelId="location"
      onChange={(event) => {
        props.setCountryCode(event.target.value);
      }}
      value={props.countryCode}
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

const SelectFilterLevel = (props) => (
  <FormControl>
    <InputLabel id="filter-level">Filter level</InputLabel>
    <Select
      labelId="filter-level"
      onChange={(event) => {
        props.setFilterLevel(event.target.value as string);
      }}
      value={props.filterLevel}
    >
      <MenuItem value={FILTER_LEVELS.medium}>Medium</MenuItem>
      <MenuItem value={FILTER_LEVELS.low}>Low</MenuItem>
      <MenuItem value={FILTER_LEVELS.none}>None</MenuItem>
    </Select>
  </FormControl>
);

const MediaTypeCheckboxes = (props) => (
  <div className="checkboxes">
    <FormControlLabel
      control={
        <Checkbox
          checked={props.isVideoChecked}
          onChange={() => props.setIsVideoChecked((p) => !p)}
          name="checkedA"
        />
      }
      label="Video"
    />
    <FormControlLabel
      control={
        <Checkbox
          checked={props.isImageChecked}
          onChange={() => props.setIsImageChecked((p) => !p)}
          name="checkedA"
        />
      }
      label="Image"
    />
  </div>
);

const SelectColorBy = (props) => (
  <FormControl>
    <InputLabel id="color-by">Color by...</InputLabel>
    <Select
      labelId="color-by"
      onChange={(event) => {
        props.setColorBy(event.target.value);
      }}
      value={props.colorBy}
    >
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      <MenuItem value={COLOR_BY.mediaType}>Media type</MenuItem>
      <MenuItem value={COLOR_BY.textLength}>Text length</MenuItem>
      <MenuItem value={COLOR_BY.sentiment}>Sentiment</MenuItem>
      <MenuItem value={COLOR_BY.profilePhoto}>Profile Photo</MenuItem>
    </Select>
  </FormControl>
);

const BtnFetchNewTweets = (props) => (
  <Button
    type="submit"
    style={{
      gridColumn: "span 2",
    }}
    className="btnFetch"
    disabled={props.loading}
    onClick={props.fetchNewTweets}
    variant="outlined"
  >
    {props.loading ? <CircularProgress /> : "Fetch New Tweets"}
  </Button>
);

const Controls = ({
  colorBy,
  is3d,
  setIs3d,
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
  const setTweetsFromServer = useStore((state) => state.setTweetsFromServer);
  const setTransformedTweets = useStore((state) => state.setTransformedTweets);
  const tweetsFromServer = useTweetsFromServer();
  const [numTweets, setNumTweets] = useState(50);
  const [loading, setLoading] = useState(false);
  const [replace, setReplace] = useState(true);
  const [filterLevel, setFilterLevel] = useState(FILTER_LEVELS.none);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (mediaType) {
      setNumTweets(25);
    }
  }, [mediaType]);

  const fetchNewTweets = async () => {
    // after 10 seconds, stop loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10 * 1000);

    const langParam = lang !== "All" ? `&lang=${lang}` : "";
    const mediaParam = mediaType ? `&mediaType=${mediaType}` : "";
    const countryParam =
      countryCode !== "All" ? `&countryCode=${countryCode}` : "";

    setLoading(true);
    const resp = await fetch(
      !searchTerm
        ? `/api/stream?num=${numTweets}&filterLevel=${filterLevel}${mediaParam}${countryParam}${langParam}`
        : `/api/search?num=${numTweets}&term=${searchTerm}${langParam}${mediaParam}`
    );
    const data = await resp.json();
    setLoading(false);
    clearTimeout(timer);
    const newTweets = replace
      ? data
      : uniqBy([...tweetsFromServer, ...data], (t) => t.id_str);
    setTweetsFromServer(newTweets);
    setTransformedTweets(transformTweetsIntoGraphData(newTweets));
  };

  const createLinks = () => {};
  return (
    <ControlsStyles>
      <div className="styleTweets">
        <SelectColorBy colorBy={colorBy} setColorBy={setColorBy} />
        {colorBy === COLOR_BY.mediaType ? (
          <MediaTypeCheckboxes
            setIsVideoChecked={setIsVideoChecked}
            setIsImageChecked={setIsImageChecked}
            isVideoChecked={isVideoChecked}
            isImageChecked={isImageChecked}
          />
        ) : null}
      </div>
      <Switch3D onChange={() => setIs3d((prev) => !prev)} checked={is3d} />
      <form onSubmit={(e) => e.preventDefault()} className="filters">
        <TextField
          style={{ gridColumn: "span 2" }}
          label="Search for..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
        />
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
              ? 5
              : 50,
          }}
        />
        <SelectFilterLevel
          filterLevel={filterLevel}
          setFilterLevel={setFilterLevel}
        />
        <SelectCountry
          countryCode={countryCode}
          setCountryCode={setCountryCode}
        />
        <SelectLanguage lang={lang} setLang={setLang} />
        <BtnFetchNewTweets loading={loading} fetchNewTweets={fetchNewTweets} />
        <FormControlLabel
          control={
            <Checkbox
              checked={replace}
              onChange={() => setReplace((p) => !p)}
              name="checkedD"
            />
          }
          label="Replace?"
        />
        <Button onClick={createLinks}>Link Nodes</Button>
      </form>
    </ControlsStyles>
  );
};

export default Controls;
