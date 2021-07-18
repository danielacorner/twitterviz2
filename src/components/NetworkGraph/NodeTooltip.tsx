import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import { animated } from "react-spring";
import styled from "styled-components/macro";
import TweetContent from "../TweetContent/TweetContent";
import { PADDING } from "../../utils/utils";
import useStore from "../../providers/store/store";
import useContainerDimensions from "../../utils/useContainerDimensions";
import { useWindowSize } from "../../utils/hooks";
import { Tweet } from "types";
import { RowDiv } from "../common/styledComponents";
import { LEFT_DRAWER_WIDTH } from "components/LEFT_DRAWER_WIDTH";
import { useNodeTooltipContentProps } from "./useNodeTooltipContentProps";

const AVATAR_WIDTH = 46;
export const TOOLTIP_WIDTH = 380;
export const MOUSE_WIDTH = 12;
const WINDOW_PADDING_HZ = 12;
const WINDOW_PADDING_VERT = 100;

export const TooltipStyles = styled.div`
  pointer-events: none;
  border-radius: 16px;
  background: ${(props) =>
    props.isLight ? "hsla(0,0%,100%,0.9)" : "hsla(0,0%,13%,0.9)"};
  width: ${(p) => p.width || TOOLTIP_WIDTH}px;
  height: fit-content;
  box-shadow: 1px 1px 8px hsla(0, 0%, 0%, 0.5);
  padding: 12px 18px 18px 12px;
  .profileAndContent {
    display: grid;
    grid-gap: ${PADDING}px;
    grid-template-columns: ${AVATAR_WIDTH}px 1fr;
  }
  position: relative;
  .id_str {
    font-size: 0.7em;
    position: absolute;
    top: -16px;
    right: 0;
    color: ${(props) =>
      props.isLight ? "hsla(0,0%,13%,0.9)" : "hsla(0,0%,95%,0.9)"};
  }
  ${(props) => props.css}
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
  const lastTooltipNode = useRef(null as Tweet | null);
  const [ref, dimensions] = useContainerDimensions();
  const { height: windowHeight, width: windowWidth } = useWindowSize();
  const tooltipHeight = dimensions?.height || 0;
  const minYPosition = windowHeight - tooltipHeight - WINDOW_PADDING_VERT;
  const isLeftDrawerOpen = useStore((s) => s.isDrawerOpen);
  const maxXPosition =
    windowWidth - TOOLTIP_WIDTH - MOUSE_WIDTH - WINDOW_PADDING_HZ;

  const minXPosition = isLeftDrawerOpen ? LEFT_DRAWER_WIDTH : 0;

  useEffect(() => {
    if (tooltipNode) {
      lastTooltipNode.current = tooltipNode;
    }
  });

  const handleMouseMove = useCallback(
    (event) => {
      const x = Math.max(Math.min(event.x, maxXPosition), minXPosition);
      const y = Math.max(Math.min(event.y, minYPosition), WINDOW_PADDING_VERT);
      setPosition({ x, y });
    },
    [maxXPosition, minYPosition, minXPosition]
  );

  // on mount, start listening to mouse position
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [minYPosition, maxXPosition, minXPosition, handleMouseMove]);

  const { springToMousePosition, isLight, originalPoster, tweet } =
    useNodeTooltipContentProps(position);
  return (
    <animated.div style={springToMousePosition as any}>
      <NodeTooltipContent
        {...{ springToMousePosition, ref, isLight, originalPoster, tweet }}
      />
    </animated.div>
  );
};

export default NodeTooltip;

export type NodeTooltipContentProps = {
  ref: React.MutableRefObject<any>;
  isLight: boolean;
  originalPoster: any;
  tweet: Tweet | null;
  tooltipStyles?: any;
};
export const NodeTooltipContent = forwardRef(
  (
    { isLight, originalPoster, tweet, tooltipStyles }: NodeTooltipContentProps,
    ref
  ) => {
    return (
      <TooltipStyles ref={ref} isLight={isLight} style={tooltipStyles}>
        <TooltipContent {...{ originalPoster, tweet }} />
      </TooltipStyles>
    );
  }
);
export function TooltipContent({
  originalPoster,
  tweet,
}: {
  originalPoster: any;
  tweet: Tweet | null;
}) {
  return (
    <div className="profileAndContent">
      <RowDiv style={{ alignItems: "start" }}>
        <AvatarStyles>
          <img src={originalPoster?.profile_image_url_https} alt="" />
        </AvatarStyles>
      </RowDiv>
      {tweet && (
        <>
          <div className="id_str">{tweet.id_str}</div>
          <TweetContent {...{ tweet, isTooltip: true }} />
        </>
      )}
    </div>
  );
}
