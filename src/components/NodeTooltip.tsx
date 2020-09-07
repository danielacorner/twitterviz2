import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components/macro";
import TweetContent from "./TweetContent";
import { PADDING } from "../utils/utils";
import useStore from "../providers/store";

const AVATAR_WIDTH = 46;
const TOOLTIP_WIDTH = 380;
const MAX_TOOLTIP_HEIGHT = 680;
const MOUSE_WIDTH = 12;
const WINDOW_PADDING_HZ = 12;

const TooltipStyles = styled.div`
  opacity: 0.9;
  pointer-events: none;
  border-radius: 4px;
  background: white;
  width: ${TOOLTIP_WIDTH}px;
  height: fit-content;
  box-shadow: 1px 1px 8px hsla(0, 0%, 0%, 0.5);
  padding: ${PADDING}px;
  .profileAndContent {
    display: grid;
    grid-gap: ${PADDING}px;
    grid-template-columns: ${AVATAR_WIDTH}px 1fr;
  }
`;

const AvatarStyles = styled.div`
  width: ${AVATAR_WIDTH}px;
  height: ${AVATAR_WIDTH}px;
  border-radius: 50%;
  overflow: hidden;
`;

const NodeTooltip = () => {
  const tooltipNode = useStore((state) => state.tooltipNode);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    console.log("🌟🚨: node", tooltipNode);
  }, [tooltipNode]);
  // on mount, start listening to mouse position
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("auxclick", handleMiddleCLick);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("auxclick", handleMiddleCLick);
    };
  }, []);

  function handleMouseMove(event) {
    const x = Math.min(
      event.x,
      window.innerWidth - TOOLTIP_WIDTH - MOUSE_WIDTH - WINDOW_PADDING_HZ
    );
    const y = Math.min(event.y, window.innerHeight - MAX_TOOLTIP_HEIGHT);
    setPosition({ x, y });
  }
  function handleMiddleCLick(e) {
    setHidden((h) => !h);
  }

  const springToMousePosition = useSpring({
    pointerEvents: "none",
    position: "fixed",
    top: 16,
    opacity: hidden ? 0 : 1,
    left: MOUSE_WIDTH,
    transform: `translate(${position.x}px,${position.y}px)`,
    config: { tension: 300, mass: 0.2 },
  });

  return tooltipNode ? (
    <animated.div style={springToMousePosition}>
      <TooltipStyles>
        <div className="profileAndContent">
          <AvatarStyles>
            <img src={tooltipNode.user.profile_image_url_https} alt="" />
          </AvatarStyles>
          {!hidden && <TweetContent nodeData={tooltipNode} />}
        </div>
      </TooltipStyles>
    </animated.div>
  ) : null;
};

export default NodeTooltip;
