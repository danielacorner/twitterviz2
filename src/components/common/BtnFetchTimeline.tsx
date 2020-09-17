import React, { useState, useRef } from "react";

import { Button, Menu, MenuItem, Tooltip } from "@material-ui/core";
import { useFetchTimeline, useFetchLikes } from "../../utils/hooks";
import { User } from "../../types";
import { useIsLight } from "../../providers/ThemeManager";

export default function BtnFetchTimeline({ user }: { user: Partial<User> }) {
  const { fetchTimeline } = useFetchTimeline();
  const { fetchLikes } = useFetchLikes();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLight = useIsLight();
  const ref = useRef();
  return (
    <>
      <Tooltip title="right-click for more options">
        <Button
          ref={ref}
          className="btnFetchTimeline"
          variant="outlined"
          style={{
            border: "1px solid cornflowerblue",
            color: `hsl(200,50%,${isLight ? 30 : 70}%)`,
          }}
          onClick={() => fetchTimeline(user.id_str)}
          onContextMenu={(e) => {
            e.preventDefault();
            setIsMenuOpen(true);
          }}
        >
          Fetch
        </Button>
      </Tooltip>
      <Menu
        anchorEl={ref.current}
        onBackdropClick={() => {
          setIsMenuOpen(false);
        }}
        open={isMenuOpen}
      >
        <MenuItem
          onClick={() => {
            fetchTimeline(user.id_str);
            setIsMenuOpen(false);
          }}
        >
          Tweets
        </MenuItem>
        {/* <MenuItem onClick={handleFetchMedia}>Media</MenuItem> */}
        <MenuItem
          onClick={() => {
            fetchLikes(user.id_str);
            setIsMenuOpen(false);
          }}
        >
          Likes
        </MenuItem>
      </Menu>
    </>
  );
}
