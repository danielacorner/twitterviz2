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
import { Div, ControlsStyles, TwoColFormStyles } from "./ControlsStyles";
import WordcloudControls from "./WordcloudControls";
import CheckIcon from "@material-ui/icons/Check";

const Controls = () => {
  // TODO
  const createLinks = () => {
    console.log("TODO");
  };
  return (
    <ControlsStyles>
      <DisplayControls />
      <WordcloudControls />
      <TweetFilterControls />
      <BtnStreamNewTweets />
      <SearchForm />
      <FetchUserTweetsForm />
      <Button onClick={createLinks}>Link Nodes</Button>
    </ControlsStyles>
  );
};

export default Controls;

function TweetFilterControls() {
  return (
    <div className="tweetFilterControls">
      <h3>Filters</h3>
      <HowManyTweets />
      <SelectFilterLevel />
      <SelectCountry />
      <SelectLanguage />
      <SwitchReplace />
    </div>
  );
}

function DisplayControls() {
  return (
    <div className="displayControls">
      <h3>Display</h3>
      <SelectColorBy />
      <MediaTypeCheckboxes />
      <Switch3D />
    </div>
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
    const resp = await fetch(
      `/api/search?term=${searchTerm}&num=${numTweets}${langParam}${mediaParam}${countryParam}`
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

function BtnStreamNewTweets() {
  const { lang, countryCode, numTweets, filterLevel, mediaType } = useConfig();
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
      `/api/stream?num=${numTweets}&filterLevel=${filterLevel}${mediaParam}${countryParam}${langParam}`
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

function SwitchReplace() {
  const { replace, setConfig } = useConfig();
  return (
    <Div css={``}>
      <span>
        Add
        <Switch
          onChange={() => setConfig({ replace: !replace })}
          checked={replace}
        />
        Replace
      </span>
    </Div>
  );
}
