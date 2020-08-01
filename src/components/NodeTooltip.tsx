import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components/macro";

const AVATAR_WIDTH = 46;
const TOOLTIP_WIDTH = 380;
const MOUSE_WIDTH = 12;
const WINDOW_PADDING_HZ = 12;
const PADDING = 8;

const TooltipStyles = styled.div`
  background: white;
  pointer-events: none;
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

const NodeTooltip = ({ nodeData }) => {
  console.log("🌟🚨: NodeTooltip -> nodeData", nodeData);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // on mount, start listening to mouse position
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  function handleMouseMove(event) {
    const x = Math.min(
      event.x,
      window.innerWidth - TOOLTIP_WIDTH - MOUSE_WIDTH - WINDOW_PADDING_HZ
    );
    const y = event.y;
    setPosition({ x, y });
  }

  const springToMousePosition = useSpring({
    position: "fixed",
    top: 16,
    left: MOUSE_WIDTH,
    transform: `translate(${position.x}px,${position.y}px)`,
    config: { tension: 300, mass: 0.2 },
  });

  return nodeData ? (
    <animated.div style={springToMousePosition}>
      <TooltipStyles>
        <div className="profileAndContent">
          <AvatarStyles>
            <img src={nodeData.user.profile_image_url_https} alt="" />
          </AvatarStyles>
          <TweetContent nodeData={nodeData} />
        </div>
      </TooltipStyles>
    </animated.div>
  ) : null;
};

export default NodeTooltip;

const TweetStyles = styled.div`
  display: grid;
  grid-gap: ${PADDING}px;
  .userInfo {
    display: flex;
  }
  .media {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    grid-gap: ${PADDING}px;
    img {
      width: 100%;
    }
  }
`;
function TweetContent({ nodeData }) {
  const { user, text, extended_entities } = nodeData;
  return (
    <TweetStyles>
      <div className="userInfo">
        <div className="username">{user.name}</div>
        <div className="handle">@{user.screen_name}</div>
      </div>
      <div className="text">{text}</div>
      <div className="media">
        {extended_entities?.media.map((media) => (
          <div className="media" key={media.id_str}>
            <img src={media.media_url_https} alt="" />
          </div>
        ))}
      </div>
    </TweetStyles>
  );
}
