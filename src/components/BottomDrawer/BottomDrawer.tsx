import React, { useState, useEffect } from "react";
import { Drawer, IconButton, Button, Tooltip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import TweetContent from "../TweetContent/TweetContent";
import UserInfo from "./UserInfo";
import useStore, { GlobalStateStoreType } from "../../providers/store";
import { useWindowSize } from "../../utils/hooks";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import {
  BottomDrawerStyles,
  DrawerContentStyles,
  DRAWER_HEIGHT,
} from "./BottomDrawerStyles";

const DRAWER_MAX_HEIGHT_MULTIPLIER = 3.5;

const BottomDrawer = () => {
  const setSelectedNode = useStore(
    (state: GlobalStateStoreType) => state.setSelectedNode
  );
  const selectedNode = useStore(
    (state: GlobalStateStoreType) => state.selectedNode
  );
  const [offsetY, setOffsetY] = useState(0);
  const { height } = useWindowSize();

  const handleWheel = (event) => {
    const delta = offsetY - event.deltaY;
    setOffsetY(
      Math.max(
        DRAWER_HEIGHT - height * DRAWER_MAX_HEIGHT_MULTIPLIER,
        Math.min(DRAWER_HEIGHT - 100, delta)
      )
    );
  };
  const handleClose = () => setSelectedNode(null);

  useEffect(() => {
    disableScroll();
    return () => {
      enableScroll();
    };
  }, []);

  return (
    <BottomDrawerStyles>
      <Drawer
        anchor="bottom"
        open={Boolean(selectedNode)}
        onBackdropClick={handleClose}
        onWheel={handleWheel}
        ModalProps={{
          BackdropProps: {
            style: {
              // backgroundColor: "transparent",
              // transform: `translateY(calc(-100vh + ${
              //   DRAWER_HEIGHT - offsetY
              // }px))`,
            },
          },
        }}
        hideBackdrop={true}
        PaperProps={{
          style: {
            height: `${DRAWER_MAX_HEIGHT_MULTIPLIER * 100}vh`,
            overflow: "visible",
          },
        }}
        style={{
          bottom: `-${(DRAWER_MAX_HEIGHT_MULTIPLIER - 1) * 100}vh`,
          transform: `translateY(calc(100vh - ${DRAWER_HEIGHT - offsetY}px))`,
        }}
      >
        <DrawerContentStyles>
          {/* absolute-position below here */}
          <Tooltip title="delete">
            <IconButton className="btnClose" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
          <div className="userAndTweetWrapper">
            {/* non-absolute-position below here */}
            <div className="userWrapper">
              <UserInfo />
            </div>
            <div className="tweetContentWrapper">
              {selectedNode && (
                <TweetContent
                  {...{
                    offsetY,
                    tweet: selectedNode,
                    isBottomDrawer: true,
                  }}
                />
              )}
            </div>
          </div>
          {selectedNode?.user && (
            <OpenTweetBtn tweet={selectedNode} offsetY={offsetY} />
          )}
        </DrawerContentStyles>
      </Drawer>
    </BottomDrawerStyles>
  );
};

export const OpenTweetBtn = ({ tweet, offsetY = 0, iconOnly = false }) => (
  <a
    className="viewTweet"
    style={{ transform: `translateY(${-offsetY}px)` }}
    href={`https://www.twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {iconOnly ? (
      <Tooltip title="Open in new">
        <OpenInNewIcon />
      </Tooltip>
    ) : (
      <Button variant="outlined" endIcon={<OpenInNewIcon />}>
        Open tweet
      </Button>
    )}
  </a>
);

export default BottomDrawer;

// https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

const wheelEvent =
  "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

function preventDefault(e) {
  e.preventDefault();
}
function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}
// call this to Disable
function disableScroll() {
  window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault); // modern desktop
  window.addEventListener("touchmove", preventDefault); // mobile
  window.addEventListener("keydown", preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener("DOMMouseScroll", preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault);
  window.removeEventListener("touchmove", preventDefault);
  window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}
