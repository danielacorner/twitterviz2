import { Body1, RowDiv } from "components/common/styledComponents";
import { BtnStreamNewTweets } from "components/Controls/Buttons/BtnStreamNewTweets";
import { HowManyTweets } from "components/Controls/Inputs";
import { SearchForm } from "components/Controls/SearchForm";
import NetworkGraph from "components/NetworkGraph/NetworkGraph";
import React from "react";
import styled from "styled-components/macro";
import { lightBorderColor } from "utils/colors";
import { NAV_HEIGHT } from "utils/constants";

const NavAndViz = () => {
  return (
    <NavAndVizStyles>
      <NavBarStyles>
        <HowManyTweets />
        <BtnStreamNewTweets />
        <Body1 style={{ height: "fit-content" }}>or</Body1>
        <SearchForm />
        {/* <ColumnDiv
          style={{
            height: 42,
            transform: "translateY(-21px) scale(0.7)",
            transformOrigin: "left",
          }}
        >
          <BtnDeleteAllTweets />
        </ColumnDiv> */}
      </NavBarStyles>
      <RowDiv>
        <NetworkGraph />
      </RowDiv>
    </NavAndVizStyles>
  );
};

export default NavAndViz;

const NavAndVizStyles = styled.div``;
const NavBarStyles = styled.div`
  height: ${NAV_HEIGHT}px;
  padding: 0em 1.5em 1em;
  display: grid;
  grid-template-columns: 200px 140px auto 1fr auto auto;
  align-items: baseline;
  grid-gap: 1em;
  border-bottom: 1px solid ${lightBorderColor};
`;

// function BtnDeleteAllTweets() {
//   const deleteAllTweets = useDeleteAllTweets();
//   return (
//     <Button color="secondary" variant="contained" onClick={deleteAllTweets}>
//       Delete all
//     </Button>
//   );
// }
