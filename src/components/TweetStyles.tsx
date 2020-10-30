import styled from "styled-components/macro";
import { PADDING } from "../utils/utils";
import playArrowSvg from "./icon-play-white.svg";

export const TweetStyles = styled.div`
  position: relative;
  display: grid;
  grid-gap: ${PADDING}px;
  overflow: ${(props) => (props.isBottomDrawer ? "visible" : "hidden")};
  word-break: break-all;
  height: 100%;
  .user_name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .usersRows {
    display: grid;
  }
  .retweetedByUser,
  .retweetedUser,
  .originalUser,
  .inReplyToUser {
    display: grid;
    grid-auto-flow: column;
    align-items: baseline;
    justify-content: start;
    grid-gap: 2px;
    transform-origin: left;
  }
  .location,
  .inReplyToUser,
  .retweetedByUser,
  .locationInfo {
    font-size: 0.8em;
    color: hsl(0, 0%, 50%);
  }

  .btnFetchTimeline {
    font-size: 0.6rem;
    width: 42px;
    min-width: 0;
    padding: 0;
    height: 16px;
  }
  .MuiSvgIcon-root {
    height: 18px;
    width: 18px;
    align-self: center;
  }
  .userInfo {
    height: fit-content;
    display: grid;
    grid-auto-flow: column;
    justify-content: start;
    align-content: center;
    align-items: baseline;
    grid-gap: 2px;
    .username {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .locationInfo {
    display: grid;
    grid-auto-flow: column;
    place-content: start;
    grid-gap: 2px;
    height: 8px;
    transform: translateY(-6px);
    transform-origin: top left;
  }
  .inReplyToUser {
    text-align: left;
    display: grid;
    grid-auto-flow: column;
    justify-content: flex-start;
    align-items: center;
    .MuiSvgIcon-root {
      width: 0.8em;
      height: 0.8em;
    }
  }
  .text {
    text-align: left;
  }
  .allMedia {
    .imgLink {
      cursor: pointer;
    }
    display: grid;
    ${(props) => (!props.isGallery ? "max-height: calc(100vh - 100px);" : "")}
    ${(props) =>
      props.isBottomDrawer
        ? "grid-auto-flow:row"
        : "grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))"};
    ${(props) => (props.isVideo ? "grid-template-columns: 1fr;" : "")}
    grid-gap: ${PADDING}px;
    img {
      width: 100%;
    }
    video {
      transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
      height: ${(props) =>
        props.isBottomDrawer ? props.videoHeight + "px" : "auto"};
      width: 100%;
    }
  }
  .poster {
    height: fit-content;
    width: 100%;
    position: relative;
    img {
      width: 100%;
      height: auto;
    }
    &:after {
      /* play button svg */
      content: "";
      opacity: 0.6;
      position: absolute;
      top: calc(50% - 48px);
      left: calc(50% - 48px);
      background-image: url(${playArrowSvg});
      background-position: center;
      background-repeat: no-repeat;
      width: 96px;
      height: 96px;
    }
  }
`;
