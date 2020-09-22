import React from "react";
import styled from "styled-components/macro";
import { Button } from "@material-ui/core";
import { useFetchTimeline } from "../../utils/hooks";
import { User } from "../../types";

const BtnFetchMoreStyles = styled.div``;
/** button which shows up when we're looking at a user's gallery */
const BtnFetchMore = ({ user }: { user: User }) => {
  const { fetchTimeline } = useFetchTimeline();

  const handleFetchMore = () => {
    fetchTimeline(user.id_str, true);
  };
  return (
    <BtnFetchMoreStyles className="btnFetchMore">
      <Button variant="outlined" onClick={handleFetchMore}>
        Fetch More
      </Button>
    </BtnFetchMoreStyles>
  );
};

export default BtnFetchMore;
