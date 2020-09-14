import React from "react";

import { Button } from "@material-ui/core";
import { useFetchTimeline } from "../../utils/hooks";
import { User } from "../../types";
import { useIsLight } from "../../providers/ThemeManager";

export default function BtnFetchTimeline({ user }: { user: Partial<User> }) {
  const { fetchTimeline } = useFetchTimeline();
  const isLight = useIsLight();
  return (
    <Button
      className="btnFetchTimeline"
      variant="outlined"
      style={{
        border: "1px solid cornflowerblue",
        color: `hsl(200,50%,${isLight ? 30 : 70}%)`,
      }}
      onClick={() => fetchTimeline(user.id_str)}
    >
      Fetch
    </Button>
  );
}
