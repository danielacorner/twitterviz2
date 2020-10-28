import { Body1, RowDiv } from "components/common/styledComponents";
import { BtnStreamNewTweets } from "components/Controls/Buttons/BtnStreamNewTweets";
import { HowManyTweets } from "components/Controls/Inputs";
import { SearchForm } from "components/Controls/SearchForm";
import VisualizationTabs from "components/VisualizationTabs";
import React from "react";

import styled from "styled-components/macro";

const NavAndVizStyles = styled.div`
  display: grid;
  grid-gap: 0.5em;
  padding: 0.5em 1em;
`;
const NavBarStyles = styled.div`
  display: grid;
  grid-template-columns: 200px 140px auto 1fr;
  align-items: baseline;
  grid-gap: 1em;
`;

const NavAndViz = () => {
  return (
    <NavAndVizStyles>
      <NavBarStyles>
        <HowManyTweets />
        <BtnStreamNewTweets />
        <Body1 style={{ height: "fit-content" }}>or</Body1>
        <SearchForm />
      </NavBarStyles>
      <RowDiv>
        <VisualizationTabs />
      </RowDiv>
    </NavAndVizStyles>
  );
};

export default NavAndViz;
