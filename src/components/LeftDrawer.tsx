import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Controls from "./Controls/Controls";
import styled from "styled-components/macro";
import { ChevronRight } from "@material-ui/icons";
import { animated, useSpring } from "react-spring";

export const LEFT_DRAWER_WIDTH = 240;

export default function LeftDrawerCollapsible() {
  const [open, setOpen] = useState(false);
  const springRightOnOpen = useSpring({
    transform: `translateX(${open ? 0 : -LEFT_DRAWER_WIDTH}px)`,
  });
  return (
    <AnimatedLeftDrawerStyles style={springRightOnOpen}>
      <div className="contents">
        <Controls />
        <IconButton
          className="btnOpenDrawer"
          onClick={() => setOpen((prev) => !prev)}
          style={{ transform: `rotate(${open ? 180 : 0}deg)` }}
        >
          <ChevronRight />
        </IconButton>
      </div>
    </AnimatedLeftDrawerStyles>
  );
}

const AnimatedLeftDrawerStyles = styled(animated.div)`
  width: ${LEFT_DRAWER_WIDTH}px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  .contents {
    position: relative;
    .btnOpenDrawer {
      position: absolute;
      top: 128px;
      right: -48px;
      transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
  }
`;
