import React from "react";

import { Button } from "@material-ui/core";
import { useFetchTimeline } from "../../utils/hooks";
import { User } from "../../types";

export default function BtnFetchTimeline({ user }: { user: Partial<User> }) {
  const { fetchTimeline } = useFetchTimeline();
  return (
    <Button
      className="btnFetchTimeline"
      variant="outlined"
      color="primary"
      onClick={() => fetchTimeline(user.id_str)}
    >
      Fetch
    </Button>
  );
}
