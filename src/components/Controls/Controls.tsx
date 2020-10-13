import React, { useState } from "react";
import {
  Button,
  useTheme,
  TextField,
  ListItem,
  List,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import {
  useLoading,
  useTweets,
  useSetTweets,
  useIsLeftDrawerOpen,
  useSetLoading,
  useSearchObj,
} from "../../providers/store";
import {
  H5,
  Body2,
  CUSTOM_SCROLLBAR_CSS,
  RowDiv,
} from "../common/styledComponents";
import SelectGeolocation from "./SelectGeolocation";
import { SelectCountry, SelectLanguage } from "./Dropdowns";
import {
  FilterLevelCheckboxes,
  MediaTypeCheckboxes,
  RecentPopularMixedRadioBtns,
} from "./Checkboxes";
import { FetchUserTweetsForm, SearchForm } from "./Inputs";
import { ControlTitle, TwoColFormStyles } from "../common/TwoColRowStyles";
import ControlsStyles from "./ControlsStyles";
import WordcloudControls from "./WordcloudControls";
import NetworkGraphControls from "./NetworkGraphControls";
import { SwitchReplace } from "./SwitchReplace";
import { BtnFetchFavoriteTweets } from "./Buttons/BtnFetchFavoriteTweets";
import { BtnStreamNewTweets } from "./Buttons/BtnStreamNewTweets";
import { useSavedDatasets } from "../common/BtnFavorite";
import { SERVER_URL, TAB_INDICES } from "../../utils/constants";
import SaveIcon from "@material-ui/icons/Save";
import ClearIcon from "@material-ui/icons/Clear";
import styled from "styled-components/macro";
import { BtnFetchFavoriteUsers } from "./Buttons/BtnFetchFavoriteUsers";

const Div = styled.div``;

const Controls = () => {
  const theme = useTheme();
  const loading = useLoading();
  const { isDrawerOpen } = useIsLeftDrawerOpen();
  return (
    <ControlsStyles
      isDrawerOpen={isDrawerOpen}
      isLoading={loading}
      isLight={theme.palette.type === "light"}
    >
      <VizSpecificControls />
      <FetchTweetsControls />
      <SaveDataControls />
    </ControlsStyles>
  );
};

export default Controls;

function SaveDataControls() {
  return (
    <div className="saveData section">
      <SaveDataForm />
      <SavedDatasetsList />
    </div>
  );
}

function SaveDataForm() {
  const tweets = useTweets();
  const { addSave } = useSavedDatasets();
  const [dataName, setDataName] = useState("");
  return (
    <TwoColFormStyles
      onSubmit={(e) => {
        e.preventDefault();
        addSave({ saveName: dataName, ids: tweets.map((t) => t.id_str) });
      }}
    >
      <TextField
        label={"Save set as.."}
        value={dataName}
        onChange={(e) => setDataName(e.target.value)}
        type="text"
      />
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        disabled={tweets.length === 0}
      >
        <SaveIcon />
      </Button>
    </TwoColFormStyles>
  );
}

function SavedDatasetsList() {
  const setTweets = useSetTweets();
  const loading = useLoading();
  const setLoading = useSetLoading();

  const { deleteSaved, saves } = useSavedDatasets();

  const fetchTweetsBySavIdx = async (savesIdx) => {
    setLoading(true);

    const resp = await fetch(
      `${SERVER_URL}/api/get?ids=${saves[savesIdx].ids}`
    );

    const tweetsResponses = await resp.json();
    const data = tweetsResponses.map((d) => d.data);

    setLoading(false);

    setTweets(data);
  };

  return (
    <Div
      css={`
        max-height: 4.5rem;
        border: 1px solid grey;
        ${CUSTOM_SCROLLBAR_CSS};
        button {
          width: fit-content;
          margin: 0;
          min-width: 0;
          &.fetch {
            font-size: 0.7em;
            padding: 0 2px;
            border: 1px solid cornflowerblue;
          }
        }
        ul {
          padding: 0;
        }
        li {
          display: grid;
          grid-template-columns: 1fr auto auto;
          padding-right: 8px;
        }
      `}
    >
      <List>
        {saves.map(({ saveName }, idx) => (
          <ListItem key={idx}>
            <Body2>{saveName}</Body2>
            <Button
              disabled={loading}
              className="fetch"
              onClick={() => {
                fetchTweetsBySavIdx(idx);
              }}
            >
              FETCH
            </Button>
            <Tooltip title="Delete">
              <IconButton
                disabled={loading}
                size="small"
                onClick={() => deleteSaved(idx)}
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Div>
  );
}

function VizSpecificControls() {
  const searchObj = useSearchObj();
  const isWordcloud =
    "tab" in searchObj && searchObj.tab === `${TAB_INDICES.WORDCLOUD}`;
  const isNetworkGraph =
    "tab" in searchObj && searchObj.tab === `${TAB_INDICES.NETWORKGRAPH}`;

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
        <H5 style={{ pointerEvents: "none" }}>Fetch Tweets</H5>
        <SwitchReplace />
        <BtnStreamNewTweets />
        <SearchForm />
        <FetchUserTweetsForm />
        <RowDiv>
          <BtnFetchFavoriteTweets />
          <BtnFetchFavoriteUsers />
        </RowDiv>
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
      <ControlTitle>Recent/Popular</ControlTitle>
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
