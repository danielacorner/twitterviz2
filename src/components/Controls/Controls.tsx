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
  IconButton,
} from "@material-ui/core";
import { COLOR_BY, FILTER_BY, FILTER_LEVELS } from "../../utils/constants";
import countryCodes from "../../utils/countryCodes";
import languages from "../../utils/languages";
import { useConfig, useSetTweets, AppConfig } from "../../providers/store";
import {
  Div,
  ControlsStyles,
  FetchUserTweetsFormStyles,
} from "./ControlsStyles";
import WordcloudControls from "./WordcloudControls";
import CheckIcon from "@material-ui/icons/Check";

const Controls = () => {
  // TODO
  const createLinks = () => {
    console.log("TODO");
  };
  return (
    <ControlsStyles>
      <div className="styleTweets">
        <SelectColorBy />
        <MediaTypeCheckboxes />
      </div>
      <Switch3D />
      <WordcloudControls />
      <form onSubmit={(e) => e.preventDefault()} className="filters">
        <SearchBox />
        <HowMany />
        <SelectFilterLevel />
        <SelectCountry />
        <SelectLanguage />
        <BtnFetchNewTweets />
        <ReplaceCheckbox />
        <Button onClick={createLinks}>Link Nodes</Button>
      </form>
      <FetchUserTweetsForm />
    </ControlsStyles>
  );
};

export default Controls;

function SearchBox() {
  const { searchTerm, setConfig } = useConfig();
  return (
    <TextField
      style={{
        gridColumn: "span 2",
      }}
      label="Search for..."
      value={searchTerm}
      onChange={(e) => setConfig({ searchTerm: e.target.value })}
      type="text"
    />
  );
}

function FetchUserTweetsForm() {
  const [userHandle, setUserHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const setTweets = useSetTweets();

  const fetchUserTweets = async () => {
    setLoading(true);
    // after 10 seconds, stop loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10 * 1000);

    const resp = await fetch(`/api/user_timeline?screen_name=${userHandle}`);
    const data = await resp.json();
    setLoading(false);
    clearTimeout(timer);

    setTweets(data);
  };

  return (
    <FetchUserTweetsFormStyles
      onSubmit={(e) => {
        e.preventDefault();
        fetchUserTweets();
      }}
    >
      <TextField
        label={loading ? <CircularProgress /> : "Fetch user timeline"}
        value={userHandle}
        onChange={(e) => setUserHandle(e.target.value)}
        type="text"
      />
      <IconButton disabled={userHandle === ""} type="submit">
        <CheckIcon />
      </IconButton>
    </FetchUserTweetsFormStyles>
  );
}

function HowMany() {
  const { numTweets, mediaType, setConfig } = useConfig();

  return (
    <TextField
      label="How many?"
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

function Switch3D() {
  const { is3d, setConfig } = useConfig();
  return (
    <Div css={``}>
      <span>
        2D
        <Switch onChange={() => setConfig({ is3d: !is3d })} checked={is3d} />
        3D
      </span>
    </Div>
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

function MediaTypeCheckboxes() {
  const {
    isVideoChecked,
    isImageChecked,
    colorBy,
    setConfig,
    mediaType,
  } = useConfig();

  useEffect(() => {
    // if searching for media, reduce num tweets
    if (mediaType) {
      setConfig({ numTweets: 25 });
    }
  }, [mediaType, setConfig]);

  return colorBy === COLOR_BY.mediaType ? (
    <div className="checkboxes">
      <FormControlLabel
        control={
          <Checkbox
            checked={isVideoChecked}
            onChange={() => setConfig({ isVideoChecked: !isVideoChecked })}
            name="checkedA"
          />
        }
        label="Video"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={isImageChecked}
            onChange={() => setConfig({ isImageChecked: !isImageChecked })}
            name="checkedA"
          />
        }
        label="Image"
      />
    </div>
  ) : null;
}

function SelectColorBy() {
  const { setConfig, colorBy } = useConfig();
  return (
    <FormControl>
      <InputLabel id="color-by">Color by...</InputLabel>
      <Select
        labelId="color-by"
        onChange={(event) => {
          setConfig({ colorBy: event.target.value as AppConfig["colorBy"] });
        }}
        value={colorBy}
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

function BtnFetchNewTweets() {
  const {
    lang,
    countryCode,
    searchTerm,
    numTweets,
    filterLevel,
    mediaType,
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

    const resp = await fetch(
      !searchTerm
        ? `/api/stream?num=${numTweets}&filterLevel=${filterLevel}${mediaParam}${countryParam}${langParam}`
        : `/api/search?num=${numTweets}&term=${searchTerm}${langParam}${mediaParam}`
    );

    const data = await resp.json();
    setLoading(false);
    clearTimeout(timer);

    setTweets(data);
  };

  return (
    <Button
      type="submit"
      style={{
        gridColumn: "span 2",
      }}
      className="btnFetch"
      disabled={loading}
      onClick={fetchNewTweets}
      variant="outlined"
    >
      {loading ? <CircularProgress /> : "Fetch New Tweets"}
    </Button>
  );
}

function ReplaceCheckbox() {
  const { replace, setConfig } = useConfig();
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={replace}
          onChange={() => setConfig({ replace: !replace })}
          name="checkedD"
        />
      }
      label="Replace?"
    />
  );
}
