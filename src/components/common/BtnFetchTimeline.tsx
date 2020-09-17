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
  const handleFetchTimeline = () => fetchTimeline(user.id_str);
  // const handleFetchMedia = () => fetchMedia(user.id_str)
  const handleFetchLikes = () => fetchLikes(user.id_str);
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
          onClick={handleFetchTimeline}
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
        <MenuItem onClick={handleFetchTimeline}>Tweets</MenuItem>
        {/* <MenuItem onClick={handleFetchMedia}>Media</MenuItem> */}
        <MenuItem onClick={handleFetchLikes}>Likes</MenuItem>
      </Menu>
    </>
  );
}
