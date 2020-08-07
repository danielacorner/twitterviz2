import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import { Drawer, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import TweetContent from "../TweetContent";
import { CONTROLS_WIDTH } from "../../utils/constants";
import UserInfo, { USER_INFO_WIDTH } from "./UserInfo";
import useStore from "../../store";
import { PADDING } from "../../utils/utils";
import { useWindowSize } from "../../utils/hooks";

const DRAWER_HEIGHT = 400;
const DRAWER_MAX_HEIGHT_MULTIPLIER = 3.5;

const BottomDrawerStyles = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: ${CONTROLS_WIDTH}px;
`;
const DrawerContentStyles = styled.div`
  box-sizing: border-box;
  padding: 32px 16px 16px;
  position: relative;
  height: ${DRAWER_HEIGHT}px;
  .userAndTweetWrapper {
    display: grid;
    grid-gap: ${PADDING}px;
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
  .MuiDrawer-paper,
  .MuiDrawer-root {
    transition: all 225ms cubic-bezier(0, 0, 0.2, 1) 0ms !important;
  }
`;

const BottomDrawer = () => {
  const setSelectedNode = useStore((state) => state.setSelectedNode);
  const selectedNode = useStore((state) => state.selectedNode);
  const [offset, setOffset] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const { height } = useWindowSize();
  const handleDrag = (event) => {
    if (!event.pageY || !isMouseDown) {
      // mouseup
      return;
    }
    const newOffset = event.pageY - height + DRAWER_HEIGHT;
    setOffset(newOffset);
  };

  const handleWheel = (event) => {
    const delta = offset - event.deltaY;
    setOffset(
      Math.max(
        DRAWER_HEIGHT - height * DRAWER_MAX_HEIGHT_MULTIPLIER,
        Math.min(0, delta)
      )
    );
  };
  const handleClose = () => setSelectedNode(null);
  const mouseDown = () => setIsMouseDown(true);
  const mouseUp = () => setIsMouseDown(false);

  useEffect(() => {
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    disableScroll();
    return () => {
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
      enableScroll();
    };
  }, []);

  return (
    <BottomDrawerStyles offset={offset}>
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
              //   DRAWER_HEIGHT - offset
              // }px))`,
            },
          },
        }}
        hideBackdrop={true}
        PaperProps={{
          style: {
            height: `${DRAWER_MAX_HEIGHT_MULTIPLIER * 100}vh`,
            overflow: "hidden",
          },
        }}
        style={{
          bottom: `-${(DRAWER_MAX_HEIGHT_MULTIPLIER - 1) * 100}vh`,
          transform: `translateY(calc(100vh - ${DRAWER_HEIGHT - offset}px))`,
        }}
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
              <UserInfo />
            </div>
            <div className="tweetContentWrapper">
              {selectedNode && (
                <TweetContent offset={offset} nodeData={selectedNode} />
              )}
            </div>
          </div>
        </DrawerContentStyles>
      </Drawer>
    </BottomDrawerStyles>
  );
};

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
