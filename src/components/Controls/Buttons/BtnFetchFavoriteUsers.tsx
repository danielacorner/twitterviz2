import React from "react";
import { useLoading } from "../../../providers/store/useSelectors";
import UserIcon from "@material-ui/icons/Face";
import { getFavorites } from "../../common/BtnFavorite";
import { useFetchUsers } from "../../../utils/hooks";
import { StyledButton } from "./StyledButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { RowDiv } from "../../common/styledComponents";

export function BtnFetchFavoriteUsers() {
  const fetchUsers = useFetchUsers();
  const loading = useLoading();

  return (
    <StyledButton
      tooltipTitle="Favorite users"
      css={`
        .MuiButton-startIcon {
          margin-left: 0;
          margin-right: 24px;
        }
        .MuiButton-label {
          font-size: 15px;
        }
      `}
      startIcon={
        <RowDiv style={{ position: "relative", transform: `scale(0.8)` }}>
          <UserIcon />
          <div
            style={{
              position: "absolute",
              transform: `scale(0.5)`,
              right: -14,
              top: -2,
              transformOrigin: "top right",
            }}
          >
            <FavoriteIcon />
          </div>
        </RowDiv>
      }
      type="submit"
      className="btnFetch"
      disabled={loading}
      onClick={() => {
        const { favoriteUsers } = getFavorites();
        fetchUsers([favoriteUsers]);
      }}
      variant="outlined"
      color="secondary"
    >
      Peeps
    </StyledButton>
  );
}
