import React from "react";
import { useTheme, Checkbox } from "@material-ui/core";
import { useSearchObj } from "../../providers/store/store";
import {
  useLoading,
  useIsLeftDrawerOpen,
} from "../../providers/store/useSelectors";
import { RowDiv, Body1 } from "../common/styledComponents";
import SelectGeolocation from "./SelectGeolocation";
import { SelectCountry, SelectLanguage } from "./Dropdowns";
import {
  FilterLevelCheckboxes,
  MediaTypeCheckboxes,
  RecentPopularMixedRadioBtns,
} from "./Checkboxes";
import { ControlTitle } from "../common/TwoColRowStyles";
import ControlsStyles from "./ControlsStyles";
import WordcloudControls from "./WordcloudControls";
import NetworkGraphControls from "./NetworkGraphControls";
import { BtnFetchFavoriteTweets } from "./Buttons/BtnFetchFavoriteTweets";
import { TAB_INDICES } from "../../utils/constants";
import { BtnFetchFavoriteUsers } from "./Buttons/BtnFetchFavoriteUsers";
import { useConfig } from "../../providers/store/useConfig";
import TitleRow from "components/common/TitleRow";
import styled from "styled-components/macro";

export function SwitchReplace() {
  const { replace, setConfig } = useConfig();
  return (
    <RowDiv>
      <Checkbox
        onChange={() => setConfig({ replace: !replace })}
        checked={replace}
      />
      <Body1>Replace all</Body1>
    </RowDiv>
  );
}

export default function Controls() {
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
      {/* <TitleRow title={"Save Data"}>
        <SaveDataControls />
      </TitleRow> */}
    </ControlsStyles>
  );
}

// function SaveDataControls() {
//   return (
//     <div className="saveData section">
//       <SaveDataForm />
//       <SavedDatasetsList />
//     </div>
//   );
// }

// function SaveDataForm() {
//   const tweets = useTweets();
//   const { addSave } = useSavedDatasets();
//   const [dataName, setDataName] = useState("");
//   return (
//     <TwoColFormStyles
//       onSubmit={(e) => {
//         e.preventDefault();
//         addSave({ saveName: dataName, ids: tweets.map((t) => t.id_str) });
//       }}
//     >
//       <TextField
//         label={"Save set as.."}
//         value={dataName}
//         onChange={(e) => setDataName(e.target.value)}
//         type="text"
//       />
//       <Button
//         type="submit"
//         variant="contained"
//         color="secondary"
//         disabled={tweets.length === 0}
//       >
//         <SaveIcon />
//       </Button>
//     </TwoColFormStyles>
//   );
// }

// function SavedDatasetsList() {
//   const setTweets = useSetTweets();
//   const loading = useLoading();
//   const setLoading = useSetLoading();

//   const { deleteSaved, saves } = useSavedDatasets();

//   const fetchTweetsBySavIdx = async (savesIdx) => {
//     setLoading(true);

//     const resp = await fetch(
//       `${SERVER_URL}/api/get?ids=${saves[savesIdx].ids}`
//     );

//     const tweetsResponses = await resp.json();
//     const data = tweetsResponses.map((d) => d.data);

//     setTweets(data);
//   };

//   return (
//     <Div
//       css={`
//         max-height: 4.5rem;
//         border: 1px solid grey;
//         ${CUSTOM_SHRINKING_SCROLLBAR_CSS};
//         button {
//           width: fit-content;
//           min-width: 0;
//           &.fetch {
//             font-size: 0.7em;
//             padding: 0 2px;
//             border: 1px solid cornflowerblue;
//           }
//         }
//         ul {
//           padding: 0;
//         }
//         li {
//           display: grid;
//           grid-template-columns: 1fr auto auto;
//           padding-right: 8px;
//         }
//       `}
//     >
//       <List>
//         {saves.map(({ saveName }, idx) => (
//           <ListItem key={idx}>
//             <Body2>{saveName}</Body2>
//             <Button
//               disabled={loading}
//               className="fetch"
//               onClick={() => {
//                 fetchTweetsBySavIdx(idx);
//               }}
//             >
//               FETCH
//             </Button>
//             <Tooltip title="Delete">
//               <IconButton
//                 disabled={loading}
//                 size="small"
//                 onClick={() => deleteSaved(idx)}
//               >
//                 <ClearIcon />
//               </IconButton>
//             </Tooltip>
//           </ListItem>
//         ))}
//       </List>
//     </Div>
//   );
// }

function VizSpecificControls() {
  const searchObj = useSearchObj();
  const isWordcloud =
    "tab" in searchObj && searchObj.tab === `${TAB_INDICES.WORDCLOUD}`;
  const isNetworkGraph =
    "tab" in searchObj && searchObj.tab === `${TAB_INDICES.NETWORKGRAPH}`;

  return isWordcloud ? (
    <TitleRow title={"Wordcloud"}>
      <WordcloudControls />
    </TitleRow>
  ) : isNetworkGraph ? (
    <NetworkGraphControls />
  ) : null;
}

function FetchTweetsControls() {
  return (
    <>
      <div className="section">
        <ControlTitle>Recent / Popular</ControlTitle>
        <RecentPopularMixedRadioBtns />
      </div>
      <div className="section">
        <ControlTitle>Media Types</ControlTitle>
        <MediaTypeCheckboxes />
      </div>
      <div className="section">
        <ControlTitle>Content Filter</ControlTitle>
        <FilterLevelCheckboxes />
      </div>
      <div className="section" style={{ display: "grid", gridGap: 16 }}>
        <SelectLanguage />
        <SelectCountry />
        <SelectGeolocation />
      </div>
      <div className="section">
        <ControlTitle style={{ marginBottom: 8 }}>Faves</ControlTitle>
        <FavesStyles>
          <BtnFetchFavoriteTweets />
          <BtnFetchFavoriteUsers />
        </FavesStyles>
      </div>
    </>
  );
}

const FavesStyles = styled.div`
  display: grid;
  grid-gap: 16px;
  button {
    width: 100%;
  }
`;
