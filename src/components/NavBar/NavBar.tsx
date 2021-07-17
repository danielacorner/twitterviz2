import { Body1 } from "components/common/styledComponents";
import { BtnStreamNewTweets } from "components/NavBar/BtnStreamNewTweets";
import { SearchForm } from "components/Controls/SearchForm";

import styled from "styled-components/macro";
import { lightBorderColor } from "utils/colors";
import { BREAKPOINTS, NAV_HEIGHT } from "utils/constants";
import HowManyTweets from "./HowManyTweets";

export function NavBar() {
  return (
    <NavBarStyles>
      <HowManyTweets />
      <BtnStreamNewTweets />
      <Body1
        style={{
          height: "fit-content",
        }}
      >
        or
      </Body1>
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
  );
}
const NavBarStyles = styled.div`
  z-index: 9;
  position: fixed;
  top: 0;
  left: 0;
  /* right: 0; */
  height: ${NAV_HEIGHT}px;
  padding: 0em 1.5em 1em;
  display: grid;
  grid-template-columns: auto auto auto 1fr auto auto;
  grid-gap: 0.5em;
  @media (min-width: ${BREAKPOINTS.TABLET}px) {
    grid-gap: 1em;
    grid-template-columns: 200px 140px auto 1fr auto auto;
  }
  align-items: baseline;
  border-bottom: 1px solid ${lightBorderColor};
`;
