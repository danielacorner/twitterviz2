import { RowDiv } from "components/common/styledComponents";
import NetworkGraph from "components/NetworkGraph/NetworkGraph";
import React from "react";
import styled from "styled-components/macro";
import { NavBar } from "./NavBar";

const NavAndViz = () => {
  return (
    <NavAndVizStyles>
      <NavBar></NavBar>
      <RowDiv>
        <NetworkGraph />
      </RowDiv>
    </NavAndVizStyles>
  );
};

export default NavAndViz;

const NavAndVizStyles = styled.div``;

// function BtnDeleteAllTweets() {
//   const deleteAllTweets = useDeleteAllTweets();
//   return (
//     <Button color="secondary" variant="contained" onClick={deleteAllTweets}>
//       Delete all
//     </Button>
//   );
// }
