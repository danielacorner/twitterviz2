import React, { useState } from "react";
import styled from "styled-components/macro";
import { Drawer, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { TweetContent } from "./NodeTooltip";
import { CONTROLS_WIDTH } from "../utils/constants";

const DRAWER_HEIGHT = 400;

const BottomDrawerStyles = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: ${CONTROLS_WIDTH}px;
`;
const DrawerContentStyles = styled.div`
  padding: 16px;
  position: relative;
  .btnClose {
    position: absolute;
    top: 0;
    right: 0;
  }
  height: ${DRAWER_HEIGHT}px;
  .tweetContentWrapper {
    max-height: 900px;
  }
  .dragHandleWrapper {
    width: 100%;
    display: grid;
    place-items: center;
    padding: 8px 0 16px 0;
    margin: -16px 0 -8px 0;
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
  const handleDrag = (event) => {
    if (!event.pageY) {
      return;
    }
    console.log(event);
    const newOffset = event.pageY - window.innerHeight + DRAWER_HEIGHT;
    console.log("🌟🚨: handleDrag ->  event.pageY", event.pageY);
    console.log("🌟🚨: handleDrag -> newOffset", newOffset);
    setOffset(newOffset);
  };
  const handleClose = () => setSelectedNode(null);
  return (
    <BottomDrawerStyles>
      <Drawer
        anchor="bottom"
        open={Boolean(selectedNode)}
        onBackdropClick={handleClose}
        ModalProps={{
          BackdropProps: { style: { backgroundColor: "transparent" } },
        }}
        PaperProps={{ style: { height: DRAWER_HEIGHT - offset } }}
      >
        <DrawerContentStyles>
          <IconButton className="btnClose" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <div onDrag={handleDrag} className="dragHandleWrapper">
            <div className="dragHandle"></div>
          </div>
          <div className="tweetContentWrapper">
            {selectedNode && <TweetContent nodeData={selectedNode} />}
          </div>
        </DrawerContentStyles>
      </Drawer>
    </BottomDrawerStyles>
  );
};

export default BottomDrawer;
