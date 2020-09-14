import React, { useState } from "react";
import { useTweets } from "../../providers/store";
import styled from "styled-components/macro";
import TweetContent from "../TweetContent";
import { TABS_HEIGHT } from "../../utils/constants";
import { useTheme } from "@material-ui/core";
import { OpenTweetBtn } from "../BottomDrawer/BottomDrawer";
import useContainerDimensions from "../../utils/useContainerDimensions";

/** smaller grid rows means finer but more time to compute layout */
const GRID_ROW_PX = 10;
const MIN_TWEET_WIDTH = 300;

const GalleryStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${MIN_TWEET_WIDTH}px, 1fr));
  grid-auto-flow: dense;
  align-items: center;
  grid-auto-rows: ${GRID_ROW_PX}px;
  grid-column-gap: 6px;
  width: 100%;
  .tweetContent {
  }
  width: 100%;
  padding: 16px;
  height: calc(100vh - ${TABS_HEIGHT}px);
  overflow-y: scroll;
  .tweetContent {
    height: fit-content;
    border: 1px solid hsl(0, 0%, ${(props) => (props.isLight ? "70" : "30")}%);
    margin: -0.5px;
    padding: 16px;
    position: relative;
  }
  .openInNew {
    transform: scale(0.8);
    transform-origin: top right;
    position: absolute;
    top: 0;
    right: 0;
  }
`;

function GridItem({ tweet }) {
  const [ref, dimensions] = useContainerDimensions();
  const rowSpan = Math.ceil(
    (dimensions?.height || MIN_TWEET_WIDTH) / GRID_ROW_PX
  );
  const [autoPlay, setAutoPlay] = useState(false);
  return (
    <div
      onMouseEnter={() => setAutoPlay(true)}
      onMouseLeave={() => setAutoPlay(false)}
      className="tweetContent"
      ref={ref}
      style={{ gridRow: `span ${rowSpan}` }}
    >
      <div className="openInNew">
        <OpenTweetBtn tweet={tweet} iconOnly={true} />
      </div>
      <TweetContent tweet={tweet} isTooltip={false} autoPlay={autoPlay} />
    </div>
  );
}

const Gallery = () => {
  const tweets = useTweets();
  const theme = useTheme();
  return (
    <GalleryStyles isLight={theme.palette.type === "light"}>
      {tweets.map((tweet) => (
        <GridItem key={tweet.id_str} tweet={tweet} />
      ))}
    </GalleryStyles>
  );
};

export default Gallery;
