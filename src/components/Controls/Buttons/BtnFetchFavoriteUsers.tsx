import React from "react";
import { useLoading } from "../../../providers/store";
import UserIcon from "@material-ui/icons/Face";
import { getFavorites } from "../../common/BtnFavorite";
import { useFetchTweetsByIds } from "../../../utils/hooks";
import { CollapsibleButton } from "./CollapsibleButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { RowDiv } from "../../common/styledComponents";

export function BtnFetchFavoriteUsers() {
  const fetchTweetsByIds = useFetchTweetsByIds();
  const { loading } = useLoading();

  return (
    <CollapsibleButton
      tooltipTitle="Favorite users"
      css={`
        margin: auto !important;
        width: fit-content;
        .MuiButton-startIcon {
          margin-left: 0;
          margin-right: 0;
        }
      `}
      startIcon={
        <RowDiv>
          <UserIcon />
          <FavoriteIcon />
        </RowDiv>
      }
      type="submit"
      className="btnFetch"
      disabled={loading}
      onClick={() => {
        const { favorites } = getFavorites();
        fetchTweetsByIds([favorites]);
      }}
      variant="outlined"
      color="secondary"
    />
  );
}
