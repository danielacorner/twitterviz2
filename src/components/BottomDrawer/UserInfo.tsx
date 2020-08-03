import React, { useState } from "react";
import styled from "styled-components/macro";
import { Button, CircularProgress, TextField } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { TweetContent } from "../NodeTooltip";
import { CONTROLS_WIDTH } from "../../utils/constants";
import { Tweet } from "../../types";
import useStore from "../../store";

export const USER_INFO_WIDTH = 200;

const UserInfoStyles = styled.div`
  height: ${USER_INFO_WIDTH}px;
  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
`;
export default function UserInfo({ tweet }: { tweet: Tweet | null }) {
  const addTweetsFromServer = useStore((state) => state.addTweetsFromServer);
  const [loading, setLoading] = useState(false);
  const [numTweets, setNumTweets] = useState(50);
  const user = tweet?.user || null;

  const fetchTimeline = async () => {
    setLoading(true);
    const resp = await fetch(
      `/api/user_timeline?id_str=${user?.id_str}&num=${numTweets}`
    );
    const { data } = await resp.json();
    setLoading(false);
    addTweetsFromServer(data);
  };

  return (
    <UserInfoStyles>
      <a
        href={`https://twitter.com/${user?.screen_name}/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="avatar">
          <img src={user?.profile_image_url_https} alt="" />
        </div>
      </a>
      <div className="screenName">{user?.screen_name}</div>
      <Button variant="outlined" disabled={loading} onClick={fetchTimeline}>
        {loading ? <CircularProgress /> : "Fetch user timeline"}
      </Button>
      <TextField
        label="How many tweets?"
        value={numTweets}
        onChange={(e) => setNumTweets(+e.target.value)}
        type="number"
        inputProps={{
          step: 10,
        }}
      />
    </UserInfoStyles>
  );
}
