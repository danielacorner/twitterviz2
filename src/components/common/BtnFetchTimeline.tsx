import React, { useState, useRef } from "react";

import { Button, Menu, MenuItem } from "@material-ui/core";
import { useFetchTimeline } from "../../utils/hooks";
import { User } from "../../types";
import { useIsLight } from "../../providers/ThemeManager";

export default function BtnFetchTimeline({ user }: { user: Partial<User> }) {
  const { fetchTimeline } = useFetchTimeline();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLight = useIsLight();
  const ref = useRef();
  return (
    <>
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
      <Menu
        anchorEl={ref.current}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        onBackdropClick={() => {
          setIsMenuOpen(false);
        }}
        open={isMenuOpen}
      >
        <MenuItem>Hellooo</MenuItem>
      </Menu>
    </>
  );
}
