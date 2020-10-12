import React, { useState } from "react";
import styled from "styled-components/macro";
import { Button, CircularProgress } from "@material-ui/core";
import { useSelectedNode } from "../../providers/store";
import { useFetchTimeline } from "../../utils/hooks";
import { Tweet, User } from "../../types";
import BtnFavorite from "../common/BtnFavorite";

// TODO: User Object API Reference: https://developer.twitter.com/en/docs/twitter-api/v1/data-dictionary/overview/user-object
// TODO: GET users/lookup https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-users-lookup

export const USER_INFO_WIDTH = 200;

const UserInfoStyles = styled.div`
  height: ${USER_INFO_WIDTH}px;
  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    border: 8px solid white;
    box-sizing: border-box;
    box-shadow: 0px -4px 16px 2px #00000021;
    img {
      width: 100%;
    }
  }
  .username {
    text-align: center;
  }
  .screenName {
    text-align: center;
    font-size: 0.75em;
    color: hsl(0, 0%, 50%);
  }
`;
export default function UserInfo({
  tweetDisplay = null,
}: {
  tweetDisplay?: Tweet;
}) {
  const tweet = useSelectedNode();
  const user = (tweetDisplay || tweet)?.user;
  // const [user, setUser] = useState(tweet?.user || null);

  // fetch user profile on mount
  // useEffect(() => {
  //   fetch(
  //     `${SERVER_URL}/api/user_info?id_str=${user?.id_str}&screen_name=${user?.screen_name}`
  //   )
  //     .then((resp) => resp.json())
  //     .then(({ data }) => {
  //       setUser(data);
  //     });
  // }, []);

  const { fetchTimeline, loading } = useFetchTimeline();

  return (
    <UserInfoStyles>
      <UserAvatar user={user} />
      <Button
        variant="outlined"
        disabled={loading}
        onClick={() => user?.id_str && fetchTimeline(user?.id_str)}
      >
        {loading ? <CircularProgress /> : "Fetch user timeline"}
      </Button>
      <BtnFavorite tooltipTitle="favorite user" user={user} />
    </UserInfoStyles>
  );
}

const AvatarStyles = styled.div``;

export function UserAvatar({
  user = null,
  imageOnly = false,
  large = false,
}: {
  user?: User;
  imageOnly?: boolean;
  large?: boolean;
}) {
  return (
    <AvatarStyles
      css={`
        ${large ? "position: relative;" : ""}
        .MuiButtonBase-root {
          position: absolute;
          top: -4px;
          left: 53px;
          ${large ? "bottom: 42px; top: unset; right: 0; left: unset;" : ""}
        }
        svg {
          width: ${large ? 1 : 0.7}em;
        }
      `}
    >
      <a
        href={`https://twitter.com/${user?.screen_name}/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="avatar">
          <ImgUnmountOnError
            srcSet={`
              ${user?.profile_image_url_https} 480w,
              ${`${user?.profile_image_url_https.slice(
                0,
                -"_normal.jpg".length
              )}.jpg`} 800w
              `}
            sizes="(max-width: 600px) 480px, 800px"
            alt=""
          />
        </div>
      </a>
      {!imageOnly && (
        <>
          <div className="username">{user?.name}</div>
          <div className="screenName">{user?.screen_name}</div>
        </>
      )}
      <BtnFavorite tooltipTitle="favorite user" user={user} />
    </AvatarStyles>
  );
}

function ImgUnmountOnError(props: any) {
  const [mounted, setMounted] = useState(true);
  return mounted ? (
    <img alt={props.alt || ""} {...props} onError={() => setMounted(false)} />
  ) : null;
}
