import React from "react";
import styled from "styled-components/macro";
import { Button, CircularProgress } from "@material-ui/core";
import { useSelectedNode } from "../../providers/store";
import { useFetchTimeline } from "../../utils/hooks";

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
export default function UserInfo() {
  const tweet = useSelectedNode();
  const user = tweet?.user;
  // const [user, setUser] = useState(tweet?.user || null);

  // fetch user profile on mount
  // useEffect(() => {
  //   fetch(
  //     `/api/user_info?id_str=${user?.id_str}&screen_name=${user?.screen_name}`
  //   )
  //     .then((resp) => resp.json())
  //     .then(({ data }) => {
  //       setUser(data);
  //     });
  // }, []);

  const { fetchTimeline, loading } = useFetchTimeline();

  const profileImgUrl = `${user?.profile_image_url_https.slice(
    0,
    -"_normal.jpg".length
  )}.jpg`;

  return (
    <UserInfoStyles>
      <a
        href={`https://twitter.com/${user?.screen_name}/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="avatar">
          <img src={profileImgUrl} alt="" />
          <img src={user?.profile_image_url_https} alt="" />
        </div>
      </a>
      <div className="username">{user?.name}</div>
      <div className="screenName">{user?.screen_name}</div>
      <Button
        variant="outlined"
        disabled={loading}
        onClick={() => user?.id_str && fetchTimeline(user?.id_str)}
      >
        {loading ? <CircularProgress /> : "Fetch user timeline"}
      </Button>
    </UserInfoStyles>
  );
}
