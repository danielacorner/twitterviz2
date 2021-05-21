import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Controls from "./Controls/Controls";
import styled from "styled-components/macro";
import { Tune } from "@material-ui/icons";
import { animated, useSpring } from "react-spring";
import { NAV_HEIGHT } from "utils/constants";
import useStore from "providers/store/store";
import { LEFT_DRAWER_WIDTH } from "./LEFT_DRAWER_WIDTH";

export default function LeftDrawerCollapsible() {
  const open = useStore((s) => s.isDrawerOpen);
  const setOpen = useStore((s) => s.setIsDrawerOpen);
  const springRightOnOpen = useSpring({
    transform: `translate(${open ? 0 : -LEFT_DRAWER_WIDTH}px)`,
  });
  return (
    <AnimatedLeftDrawerStyles style={springRightOnOpen}>
      <div className="contents">
        <Controls />
        <IconButton
          className="btnOpenDrawer"
          onClick={() => setOpen(!open)}
          style={{ opacity: open ? 0.5 : 1 }}
        >
          <Tune />
        </IconButton>
      </div>
    </AnimatedLeftDrawerStyles>
  );
}

const AnimatedLeftDrawerStyles = styled(animated.div)`
  width: ${LEFT_DRAWER_WIDTH}px;
  position: fixed;
  left: 0;
  top: ${NAV_HEIGHT}px;
  bottom: 0;
  .contents {
    position: relative;
    .btnOpenDrawer {
      position: absolute;
      top: 0;
      right: -50px;
      transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
  }
`;
