import React, { useState, useRef } from "react";
import { Button, useTheme, Menu, MenuItem } from "@material-ui/core";
import {
  useConfig,
  useLoading,
  useTweets,
  useSetTweets,
} from "../../providers/store";
import { H5 } from "../common/styledComponents";
import SelectGeolocation from "./SelectGeolocation";
import { SelectCountry, SelectLanguage } from "./Dropdowns";
import {
  FilterLevelCheckboxes,
  MediaTypeCheckboxes,
  RecentPopularMixedRadioBtns,
} from "./Checkboxes";
import { FetchUserTweetsForm, HowManyTweets, SearchForm } from "./Inputs";
import { ControlTitle } from "../common/TwoColRowStyles";
import ControlsStyles from "./ControlsStyles";
import WordcloudControls from "./WordcloudControls";
import NetworkGraphControls from "./NetworkGraphControls";
import {
  SwitchReplace,
  BtnStreamNewTweets,
  BtnFetchFavorites,
} from "./Buttons";
import { getSavedDatasets } from "../common/BtnFavorite";
import { SERVER_URL } from "../../utils/constants";

const Controls = () => {
  // TODO
  const createLinks = () => {
    console.log("TODO");
  };
  const theme = useTheme();
  const { loading } = useLoading();
  return (
    <ControlsStyles
      isLoading={loading}
      isLight={theme.palette.type === "light"}
    >
      <VizSpecificControls />
      <FetchTweetsControls />
      <div className="saveData section">
        <BtnSaveData />
        <BtnLoadData />
        <BtnDeleteData />
      </div>
      <Button
        variant="contained"
        color="primary"
        disabled={true}
        onClick={createLinks}
      >
        Link Nodes
      </Button>
    </ControlsStyles>
  );
};

export default Controls;

function BtnSaveData() {
  const tweets = useTweets();
  const { addSave } = getSavedDatasets();
  return (
    <Button
      variant="contained"
      color="secondary"
      disabled={tweets.length === 0}
      onClick={() => addSave(tweets.map((t) => t.id_str))}
    >
      Save This Dataset
    </Button>
  );
}

function BtnLoadData() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const setTweets = useSetTweets();
  const ref = useRef();
  const { loading, setLoading } = useLoading();

  const { saves } = getSavedDatasets();

  const fetchTweetsByIds = async (savesIdx) => {
    setLoading(true);
    // after 10 seconds, stop loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10 * 1000);

    const resp = await fetch(`${SERVER_URL}/api/get?ids=${saves[savesIdx]}`);

    const tweetsResponses = await resp.json();
    const data = tweetsResponses.map((d) => d.data);

    setLoading(false);
    clearTimeout(timer);

    setTweets(data);
  };

  return (
    <>
      <Button
        key={saves.length}
        ref={ref}
        disabled={saves.length === 0 || loading}
        variant="outlined"
        color="secondary"
        onClick={() => setIsMenuOpen(true)}
      >
        Load Dataset
      </Button>
      <Menu
        anchorEl={ref.current}
        onBackdropClick={() => {
          setIsMenuOpen(false);
        }}
        open={isMenuOpen}
      >
        {saves.map((saveSet, idx) => (
          <MenuItem
            key={idx}
            onClick={() => {
              fetchTweetsByIds(idx);
              setIsMenuOpen(false);
            }}
          >
            Set {idx + 1}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
function BtnDeleteData() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ref = useRef();
  const { deleteSaved, saves } = getSavedDatasets();
  const [key, setKey] = useState(Math.random());
  const { loading } = useLoading();
  return (
    <>
      <Button
        key={key}
        ref={ref}
        disabled={saves.length === 0 || loading}
        variant="outlined"
        color="secondary"
        onClick={() => setIsMenuOpen(true)}
      >
        Delete Dataset
      </Button>
      <Menu
        anchorEl={ref.current}
        onBackdropClick={() => {
          setIsMenuOpen(false);
        }}
        open={isMenuOpen}
      >
        {saves.map((saveSet, idx) => (
          <MenuItem
            key={idx}
            onClick={() => {
              deleteSaved(idx);
              setIsMenuOpen(false);
              setKey(Math.random());
            }}
          >
            Set {idx + 1}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

function VizSpecificControls() {
  const { isWordcloud, isNetworkGraph } = useConfig();
  return isWordcloud ? (
    <WordcloudControls />
  ) : isNetworkGraph ? (
    <NetworkGraphControls />
  ) : null;
}

function FetchTweetsControls() {
  return (
    <>
      <div className="fetchTweets section">
        <H5>Fetch Tweets</H5>
        <SwitchReplace />
        <HowManyTweets />
        <BtnStreamNewTweets />
        <SearchForm />
        <FetchUserTweetsForm />
        <BtnFetchFavorites />
      </div>
      <div className="filterTweets section">
        <H5>Filter Incoming Tweets</H5>
        <TweetFilterControls />
      </div>
    </>
  );
}

function TweetFilterControls() {
  return (
    <>
      <ControlTitle>Popular/Recent</ControlTitle>
      <RecentPopularMixedRadioBtns />
      <ControlTitle>Media</ControlTitle>
      <MediaTypeCheckboxes />
      <ControlTitle>Content Filter</ControlTitle>
      <FilterLevelCheckboxes />
      <SelectCountry />
      <SelectGeolocation />
      <SelectLanguage />
    </>
  );
}
