import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import {
  Drawer,
  IconButton,
  Button,
  CircularProgress,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { TweetContent } from "./NodeTooltip";
import { CONTROLS_WIDTH } from "../utils/constants";
import { Tweet } from "../types";
import useStore from "../store";

const DRAWER_HEIGHT = 400;
const USER_INFO_WIDTH = 200;

const BottomDrawerStyles = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: ${CONTROLS_WIDTH}px;
`;
const DrawerContentStyles = styled.div`
  box-sizing: border-box;
  padding: 16px;
  position: relative;
  height: ${DRAWER_HEIGHT}px;
  .userAndTweetWrapper {
    display: grid;
    grid-template-columns: ${USER_INFO_WIDTH}px 1fr;
  }
  .btnClose {
    position: absolute;
    top: 0;
    right: 0;
  }
  .tweetContentWrapper {
    max-height: 900px;
  }
  .dragHandleWrapper {
    width: calc(100% + 32px);
    display: grid;
    place-items: center;
    padding: 8px 0 16px 0;
    margin: -16px 0 0px -16px;
    &:hover {
      background: hsl(0, 0%, 80%);
    }
    cursor: n-resize;
    .dragHandle {
      height: 6px;
      width: 48px;
      background: hsl(0, 0%, 40%);
      border-radius: 999px;
    }
  }
`;

const BottomDrawer = ({ selectedNode, setSelectedNode }) => {
  const [offset, setOffset] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const handleDrag = (event) => {
    if (!event.pageY || !isMouseDown) {
      // mouseup
      return;
    }
    const newOffset = event.pageY - window.innerHeight + DRAWER_HEIGHT;
    setOffset(newOffset);
  };
  const handleClose = () => setSelectedNode(null);
  const mouseDown = () => setIsMouseDown(true);
  const mouseUp = () => setIsMouseDown(false);

  useEffect(() => {
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    return () => {
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, []);

  return (
    <BottomDrawerStyles>
      <Drawer
        anchor="bottom"
        open={Boolean(selectedNode)}
        onBackdropClick={handleClose}
        ModalProps={{
          BackdropProps: { style: { backgroundColor: "transparent" } },
        }}
        PaperProps={{ style: { height: DRAWER_HEIGHT + 20 - offset } }}
      >
        <DrawerContentStyles>
          {/* absolute-position below here */}
          <IconButton className="btnClose" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <div
            onMouseDown={handleDrag}
            onDrag={handleDrag}
            onTouchStart={handleDrag}
            onTouchMove={handleDrag}
            className="dragHandleWrapper"
          >
            <div className="dragHandle"></div>
          </div>
          <div className="userAndTweetWrapper">
            {/* non-absolute-position below here */}
            <div className="userWrapper">
              <UserInfo tweet={selectedNode} />
            </div>
            <div className="tweetContentWrapper">
              {selectedNode && <TweetContent nodeData={selectedNode} />}
            </div>
          </div>
        </DrawerContentStyles>
      </Drawer>
    </BottomDrawerStyles>
  );
};

export default BottomDrawer;

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
function UserInfo({ tweet }: { tweet: Tweet | null }) {
  const addTweetsFromServer = useStore((state) => state.addTweetsFromServer);
  const [loading, setLoading] = useState(false);
  const user = tweet?.user || null;
  const fetchTimeline = async (user: Tweet["user"]) => {
    setLoading(true);
    const resp = await fetch(`/api/user_timeline?id_str=${user?.id_str}`);
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
      <Button
        variant="outlined"
        disabled={loading}
        onClick={() => fetchTimeline(user)}
      >
        {loading ? <CircularProgress /> : "Fetch user timeline"}
      </Button>
    </UserInfoStyles>
  );
}
