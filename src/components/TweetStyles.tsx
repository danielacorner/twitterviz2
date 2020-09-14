import styled from "styled-components/macro";
import { PADDING } from "../utils/utils";

export const TweetStyles = styled.div`
  position: relative;
  display: grid;
  grid-gap: ${PADDING}px;
  overflow: hidden;
  word-break: break-all;
  .user_name,
  .user_screen_name,
  .location,
  .inReplyTo {
    font-size: 0.8em;
  }
  .user_name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .retweetedUser {
    display: grid;
    width: 100%;
    grid-template-columns: auto auto auto;
    align-items: baseline;
    justify-content: start;
    grid-gap: 4px;
    transform-origin: left;
  }
  .btnFetchTimeline {
    font-size: 0.6rem;
    width: 42px;
    min-width: 0;
    padding: 0;
    height: 20px;
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
    grid-gap: 4px;
    ${(props) =>
      props.isRetweet
        ? "font-size: 0.75em; align-content: end; color: hsl(0, 0%, 50%);"
        : ""};

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
    grid-gap: 4px;
    height: 8px;
    .location {
      color: hsl(0, 0%, 50%);
      display: grid;
      grid-auto-flow: column;
      transform: translateY(-6px);
      transform-origin: top left;
    }
  }
  .inReplyTo {
    display: grid;
    grid-auto-flow: column;
    justify-content: flex-start;
    align-items: center;
    color: hsl(0, 0%, 50%);
    text-align: left;
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
    max-height: calc(100vh - 100px);
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    ${(props) => (props.isVideo ? "grid-template-columns: 1fr;" : "")}
    grid-gap: ${PADDING}px;
    img {
      width: 100%;
    }
    video {
      transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
      height: ${(props) => props.videoHeight}px;
      width: 100%;
    }
  }
`;
