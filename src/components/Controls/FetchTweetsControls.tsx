import React, { useState } from "react";
import { Button, CircularProgress } from "@material-ui/core";
import { useConfig, useSetTweets } from "../../providers/store";
import SearchIcon from "@material-ui/icons/Search";
import { H5, SwitchWithLabels } from "../common/DivStyles";
import SelectGeolocation from "./SelectGeolocation";
import { SelectCountry, SelectLanguage } from "./Dropdowns";
import {
  FilterLevelCheckboxes,
  MediaTypeCheckboxes,
  RecentPopularMixedRadioBtns,
} from "./Checkboxes";
import { FetchUserTweetsForm, HowManyTweets, SearchForm } from "./Inputs";
import { ControlTitle } from "../common/TwoColRowStyles";

const FetchTweetsControls = () => {
  return (
    <>
      <H5>Fetch Tweets</H5>
      <SwitchReplace />
      <HowManyTweets />
      <BtnStreamNewTweets />
      <SearchForm />
      <FetchUserTweetsForm />
      <H5>Filter Incoming Tweets</H5>
      <TweetFilterControls />
    </>
  );
};

export default FetchTweetsControls;

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
      variant="contained"
      color="primary"
      endIcon={<SearchIcon />}
    >
      {loading ? <CircularProgress /> : "Stream Tweets"}
    </Button>
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
