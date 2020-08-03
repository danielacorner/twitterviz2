import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components/macro";
import { getMediaArr } from "../utils/utils";
import countryCodes from "../utils/countryCodes";

const AVATAR_WIDTH = 46;
const TOOLTIP_WIDTH = 380;
const MAX_TOOLTIP_HEIGHT = 680;
const MOUSE_WIDTH = 12;
const WINDOW_PADDING_HZ = 12;
const PADDING = 8;

const TooltipStyles = styled.div`
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

const NodeTooltip = ({ nodeData }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(false);

  // on mount, start listening to mouse position
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("auxclick", handleMiddleCLick);
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("auxclick", handleMiddleCLick);
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  function handleKeydown(event) {
    if (event.key === " ") {
      setHidden((h) => !h);
    }
  }

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
  .userInfo, .locationInfo {
    display: grid;
    grid-auto-flow:column;
    place-content: start;
    grid-gap: 4px;
  }
  .userInfo {}
  .locationInfo{
    color: hsl(0,0%,50%)
  }
  .media {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    ${(props) => (props.isVideo ? "grid-template-columns: 1fr;" : "")}
    grid-gap: ${PADDING}px;
    img {
      width: 100%;
    }
    video{
      width: 100%;
    }
  }
`;
export function TweetContent({ nodeData }) {
  const { user, text, extended_entities, entities } = nodeData;
  const mediaArr = getMediaArr(nodeData);
  return (
    <TweetStyles isVideo={extended_entities?.media[0]?.type === "video"}>
      <div className="userInfo">
        <div className="username">{user.name}</div>
        <div className="handle">| @{user.screen_name}</div>
      </div>
      <div className="locationInfo">
        {user.location && (
          <div className="location">
            <span aria-label="pin" role="img">
              📍
            </span>
            {user.location}
          </div>
        )}
        {entities?.place?.country_code && (
          <div className="country">
            | {countryCodes[entities?.place?.country_code]}
          </div>
        )}
      </div>
      <div className="text">{text}</div>

      <div className="media">
        {mediaArr.map(({ type, id_str, poster, src }) => {
          return (
            <div className="media" key={id_str}>
              {type === "video" ? (
                <video
                  poster={poster}
                  src={src}
                  autoPlay={true}
                  loop={true}
                ></video>
              ) : (
                <img src={src} alt="" />
              )}
            </div>
          );
        })}
      </div>
    </TweetStyles>
  );
}
