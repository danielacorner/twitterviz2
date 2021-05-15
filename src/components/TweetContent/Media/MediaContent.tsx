import React, { useRef, useEffect, useState } from "react";
import { MediaItem } from "../../../utils/utils";
import VideoWithControls from "./VideoWithControls";
import styled from "styled-components/macro";

type MediaProps = MediaItem & {
  autoPlay: boolean;
  containerWidth: number;
  containerHeight: number;
  numImages: number;
  isTooltip: boolean;
  isBottomDrawer: boolean;
};
export default function MediaContent({
  autoPlay,
  containerWidth,
  containerHeight,
  isTooltip,
  numImages,
  isBottomDrawer,
  ...mediaItem
}: MediaProps) {
  const { poster, src, type, sizes } = mediaItem;

  // focus the video player when it starts playing
  const videoRef = useRef();
  useEffect(() => {
    if (videoRef.current && (videoRef.current as any).focus && autoPlay) {
      (videoRef.current as any).focus();
    }
  }, [autoPlay]);

  // play video on first click
  const [clickedOnce, setClickedOnce] = useState(false);
  const handleClick = () => {
    if (!clickedOnce) {
      setClickedOnce(true);
    }
  };

  const VIDEO_CONTROLS_HEIGHT = 100;
  const isVideo = mediaItem.type === "video";
  return (
    <MediaContentStyles
      onClick={handleClick}
      className="media"
      style={{
        ...(isVideo && isBottomDrawer
          ? { height: containerHeight / numImages - VIDEO_CONTROLS_HEIGHT }
          : {}),
        width: containerWidth,
      }}
    >
      {["video", "animated_gif"].includes(type) ? (
        autoPlay || clickedOnce ? (
          <VideoWithControls
            {...{ videoRef, isTooltip, containerWidth, mediaItem }}
          />
        ) : (
          // must use custom element to enable lazy-loading poster image
          <PosterImage
            {...{
              containerWidth,
              numImages,
              poster,
              large: sizes.large,
            }}
          />
        )
      ) : (
        <ImageLinked
          {...{
            containerWidth,
            src,
            large: sizes.large,
          }}
        />
      )}
    </MediaContentStyles>
  );
}

const MediaContentStyles = styled.div`
  position: relative;
  img {
    border-radius: 16px;
  }
`;

function PosterImage({
  containerWidth,
  large,
  poster,
  numImages,
}: {
  containerWidth: number;
  large: any;
  poster?: string;
  numImages: number;
}) {
  return (
    // must use custom element to enable lazy-loading poster image
    <div
      className="poster"
      style={{
        height: (containerWidth * large.h) / large.w,
        width: containerWidth,
      }}
    >
      <img
        loading="lazy"
        src={poster}
        alt=""
        width={containerWidth / numImages}
        height={(containerWidth * large.h) / large.w}
      />
    </div>
  );
}

function ImageLinked({
  src,
  containerWidth,
  large,
}: {
  src: string;
  containerWidth: number;
  large: any;
}) {
  return (
    <a className="imgLink" href={src} target="_blank" rel="noopener noreferrer">
      <img
        loading="lazy"
        src={src}
        alt=""
        width={containerWidth}
        height={(containerWidth * large.h) / large.w}
      />
    </a>
  );
}
