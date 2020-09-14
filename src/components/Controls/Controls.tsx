import React from "react";
import { Button, useTheme } from "@material-ui/core";
import { useConfig } from "../../providers/store";
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

const Controls = () => {
  // TODO
  const createLinks = () => {
    console.log("TODO");
  };
  const theme = useTheme();
  return (
    <ControlsStyles isLight={theme.palette.type === "light"}>
      <VizSpecificControls />
      <FetchTweetsControls />
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
