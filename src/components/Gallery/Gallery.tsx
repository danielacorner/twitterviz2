import React, { useState } from "react";
import { useTweets, useLoading, useDeleteTweet } from "../../providers/store";
import styled from "styled-components/macro";
import TweetContent from "../TweetContent";
import { TABS_HEIGHT } from "../../utils/constants";
import { useTheme } from "@material-ui/core";
import { OpenTweetBtn } from "../BottomDrawer/BottomDrawer";
import useContainerDimensions from "../../utils/useContainerDimensions";
import {
  CUSTOM_SCROLLBAR_CSS,
  LOADING_SCROLLBAR_CSS,
} from "../common/styledComponents";
import { useMount } from "../../utils/utils";
import BtnFavorite from "../common/BtnFavorite";
import { Tweet } from "../../../types/types-cogeden";
import CloseIcon from "@material-ui/icons/Close";

/** smaller grid rows means finer but more time to compute layout */
const GRID_ROW_PX = 20;
const MIN_TWEET_WIDTH = 300;
const GRID_GAP = 24;

const GalleryStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${MIN_TWEET_WIDTH}px, 1fr));
  grid-auto-flow: dense;
  align-items: center;
  grid-auto-rows: ${GRID_ROW_PX}px;
  grid-column-gap: ${GRID_GAP}px;
  width: 100%;
  .tweetContent {
  }
  width: 100%;
  padding: 18px;
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
  .deleteTweet {
    transform: scale(0.8);
    transform-origin: top left;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    color: tomato;
    opacity: 0.5;
  }
  .btnFavorite {
    transform: scale(0.8);
    transform-origin: bottom right;
    position: absolute;
    bottom: 0;
    right: 0;
  }
  ${CUSTOM_SCROLLBAR_CSS}
  ${(props) => (props.isLoading ? LOADING_SCROLLBAR_CSS : "")}
`;

// TODO: use intersection observer to virtualize
function GridItem({ tweet }) {
  const [ref, dimensions] = useContainerDimensions();
  const rowSpan = Math.ceil(
    ((dimensions?.height || MIN_TWEET_WIDTH) + GRID_GAP) / GRID_ROW_PX
  );
  return (
    <div
      className="tweetContent"
      ref={ref}
      style={{ gridRow: `span ${rowSpan}` }}
    >
      <div className="openInNew">
        <OpenTweetBtn tweet={tweet} iconOnly={true} />
      </div>
      <div className="deleteTweet">
        <DeleteTweetBtn tweet={tweet} />
      </div>
      <TweetContent tweet={tweet} isTooltip={false} autoPlay={false} />
      <div className="btnFavorite">
        <BtnFavorite tweet={tweet} />
      </div>
    </div>
  );
}

function DeleteTweetBtn({ tweet }: { tweet: Tweet }) {
  const deleteTweet = useDeleteTweet();
  return <CloseIcon onClick={() => deleteTweet(tweet.id_str)} />;
}

const Gallery = () => {
  const tweets = useTweets();
  const theme = useTheme();
  const { loading } = useLoading();
  return (
    <GalleryStyles isLoading={loading} isLight={theme.palette.type === "light"}>
      {tweets.map((tweet) => (
        <GridItem key={tweet.id_str} tweet={tweet} />
      ))}
      {loading ? <ScrollMoreIndicator /> : null}
    </GalleryStyles>
  );
};

export default Gallery;

const ScrollMoreStyles = styled.div`
  position: fixed;
  z-index: 99999;
  bottom: 4px;
  right: 4px;
  display: grid;
  grid-auto-flow: row;
  grid-gap: 8px;
  transition: all 0.3s ease-in;
  opacity: ${(props) => (props.mounted ? 1 : 0)};
  .dot {
    height: 12px;
    width: 12px;
    border-radius: 99px;
    background: hsla(0, 0%, 90%);
    animation: inOut 0.5s cubic-bezier(0.16, 0.41, 0.15, 1.01) infinite
      alternate-reverse;
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
  @keyframes inOut {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;
function ScrollMoreIndicator() {
  const [mounted, setMounted] = useState(false);
  useMount(() => setMounted(true));
  return (
    <ScrollMoreStyles mounted={mounted}>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </ScrollMoreStyles>
  );
}
