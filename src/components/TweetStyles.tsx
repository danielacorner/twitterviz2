import styled from "styled-components/macro";
import { PADDING } from "../utils/utils";

export const TweetStyles = styled.div`
  position: relative;
  display: grid;
  grid-gap: ${PADDING}px;
  overflow: hidden;
  word-break: break-all;

  .retweetedUser {
    position: absolute;
    top: -1px;
    display: grid;
    grid-auto-flow: column;
    align-items: start;
    justify-content: flex-start;
    grid-gap: 4px;
    .btnFetchRetweetedTimeline {
      transform: scale(0.6) translateY(2px);
      transform-origin: top left;
    }
    transform-origin: left;
  }
  .locationInfo {
    display: grid;
    grid-auto-flow: column;
    place-content: start;
    grid-gap: 4px;
  }
  .pipe {
    margin: 0 0.5ch;
  }
  .userInfo {
    height: 38px;
    display: grid;
    grid-auto-flow: column;
    justify-content: start;
    align-content: center;
    align-items: center;
    ${(props) =>
      props.isRetweet
        ? "font-size: 0.75em; align-content: end; color: hsl(0, 0%, 50%);"
        : ""};
    .MuiSvgIcon-root {
      transform: scale(0.75);
    }
    .retweetedBy {
      margin-right: 0.75ch;
    }
    .username {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .locationInfo {
    color: hsl(0, 0%, 50%);
    .location {
      display: grid;
      grid-auto-flow: column;
      transform: scale(0.8) translateY(-6px);
      transform-origin: top left;
    }
  }
  .text {
    text-align: left;
  }
  .allMedia {
    display: grid;
    max-height: calc(100vh - 100px);
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    ${(props) => (props.isVideo ? "grid-template-columns: 1fr;" : "")}
    grid-gap: ${PADDING}px;
    img {
      width: 100%;
    }
    video {
      height: ${(props) => props.videoHeight}px;
      width: 100%;
    }
  }
`;
