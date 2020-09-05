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
import { COLOR_BY, FILTER_BY, FILTER_LEVELS } from "../../utils/constants";
import countryCodes from "../../utils/countryCodes";
import languages from "../../utils/languages";
import { useTweetsFromServer } from "../../providers/store";
import { uniqBy } from "lodash";
import { useSetTweetsFromServer } from "../../providers/store";
import { Div, ControlsStyles } from "./ControlsStyles";

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
  const setTweetsFromServer = useSetTweetsFromServer();
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
    setLoading(true);
    // after 10 seconds, stop loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10 * 1000);

    const langParam = lang !== "All" ? `&lang=${lang}` : "";
    const mediaParam = mediaType ? `&mediaType=${mediaType}` : "";
    const countryParam =
      countryCode !== "All" ? `&countryCode=${countryCode}` : "";

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
  };

  const createLinks = () => {};
  return (
    <ControlsStyles>
      <div className="styleTweets">
        <SelectColorBy {...{ colorBy, setColorBy }} />
        {colorBy === COLOR_BY.mediaType ? (
          <MediaTypeCheckboxes
            {...{
              setIsVideoChecked,
              setIsImageChecked,
              isVideoChecked,
              isImageChecked,
            }}
          />
        ) : null}
      </div>
      <Switch3D onChange={() => setIs3d((prev) => !prev)} checked={is3d} />
      <form onSubmit={(e) => e.preventDefault()} className="filters">
        <SearchBox {...{ searchTerm, setSearchTerm }}></SearchBox>
        <HowMany {...{ numTweets, setNumTweets, mediaType }}></HowMany>
        <SelectFilterLevel
          {...{
            filterLevel,
            setFilterLevel,
          }}
        />
        <SelectCountry {...{ countryCode, setCountryCode }} />
        <SelectLanguage {...{ lang, setLang }} />
        <BtnFetchNewTweets {...{ loading, fetchNewTweets }} />
        <ReplaceCheckbox {...{ replace, setReplace }}></ReplaceCheckbox>
        <Button onClick={createLinks}>Link Nodes</Button>
      </form>
    </ControlsStyles>
  );
};

export default Controls;

function SearchBox(props) {
  return (
    <TextField
      style={{
        gridColumn: "span 2",
      }}
      label="Search for..."
      value={props.searchTerm}
      onChange={(e) => props.setSearchTerm(e.target.value)}
      type="text"
    />
  );
}

function HowMany(props) {
  return (
    <TextField
      label="How many?"
      value={props.numTweets}
      onChange={(e) => props.setNumTweets(+e.target.value)}
      type="number"
      inputProps={{
        step: [
          FILTER_BY.imageAndVideo,
          FILTER_BY.imageOnly,
          FILTER_BY.videoOnly,
        ].includes(props.mediaType)
          ? 5
          : 50,
      }}
    />
  );
}

function Switch3D({ onChange, checked }) {
  return (
    <Div css={``}>
      <span>
        2D
        <Switch onChange={onChange} checked={checked} />
        3D
      </span>
    </Div>
  );
}

function SelectLanguage(props) {
  return (
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
}

function SelectCountry(props) {
  return (
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
}

function SelectFilterLevel(props) {
  return (
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
}

function MediaTypeCheckboxes(props) {
  return (
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
}

function SelectColorBy(props) {
  return (
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
}

function BtnFetchNewTweets(props) {
  return (
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
}

function ReplaceCheckbox(props) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={props.replace}
          onChange={() => props.setReplace((p) => !p)}
          name="checkedD"
        />
      }
      label="Replace?"
    />
  );
}
