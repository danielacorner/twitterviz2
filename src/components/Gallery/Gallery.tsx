import React from "react";
import { useTweets } from "../../providers/store";
import styled from "styled-components/macro";
import TweetContent from "../TweetContent";

const GalleryStyles = styled.div``;

const Gallery = () => {
  const tweets = useTweets();
  return (
    <GalleryStyles>
      {tweets.map((tweet) => (
        <TweetContent tweet={tweet} isTooltip={false} autoPlay={false} />
      ))}
    </GalleryStyles>
  );
};

export default Gallery;
