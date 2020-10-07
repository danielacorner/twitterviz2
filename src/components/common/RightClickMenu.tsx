import React from "react";
import { Menu, MenuItem } from "@material-ui/core";
import { useFetchLikes, useFetchTimeline } from "../../utils/hooks";

export default function RightClickMenu({
  anchorEl,
  handleClose,
  isMenuOpen,
  user,
  MenuProps = {},
}) {
  const { fetchTimeline } = useFetchTimeline();
  const { fetchLikes } = useFetchLikes();
  return (
    <Menu
      {...(anchorEl ? { anchorEl } : {})}
      onBackdropClick={handleClose}
      open={isMenuOpen}
      {...MenuProps}
    >
      <MenuItem
        onClick={() => {
          fetchTimeline(user.id_str);
          handleClose();
        }}
      >
        Tweets
      </MenuItem>
      {/* <MenuItem onClick={handleFetchMedia}>Media</MenuItem> */}
      {/* <MenuItem onClick={handleFetchFollowing}>Following</MenuItem> */}
      {/* <MenuItem onClick={handleFetchFollowers}>Followers</MenuItem> */}
      <MenuItem
        onClick={() => {
          fetchLikes(user.id_str);
          handleClose();
        }}
      >
        Likes
      </MenuItem>
    </Menu>
  );
}
