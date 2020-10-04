import React, { useRef, useState } from "react";
import styled from "styled-components/macro";
import { Menu, IconButton, MenuItem } from "@material-ui/core";
import HighQualityIcon from "@material-ui/icons/HighQuality";
import { Variant } from "../../../types";
import { Player, ControlBar, VolumeMenuButton } from "video-react";
import { MediaItem } from "../../../utils/utils";

const VideoStyles = styled.div`
  .video-react {
    padding: 0 !important;
    position: static !important;
  }
  .video-react-big-play-button {
    display: none;
  }
`;
export default function VideoWithControls({
  videoRef,
  containerWidth,
  mediaItem,
}: {
  videoRef: { current: any };
  containerWidth: number;
  mediaItem: MediaItem;
}) {
  const { variants, sizes, poster } = mediaItem;

  const [bitrate, setBitrate] = useState(
    variants[variants.length - 1].bitrate || 0
  );
  return (
    <VideoStyles>
      <Player
        ref={videoRef}
        controls={true}
        src={variants.find((v) => v.bitrate === bitrate).url}
        poster={poster}
        autoPlay={true}
        loop={true}
        width={containerWidth}
        height={(containerWidth * sizes.large.h) / sizes.large.w}
        preload="none"
      >
        <ControlBar autoHide={true}>
          <VolumeMenuButton vertical={true} />
          <BitrateControls
            {...{
              bitrate,
              setBitrate,
              variants,
            }}
          />
        </ControlBar>
      </Player>
    </VideoStyles>
  );
}

const BitrateStyles = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  align-items: center;
  display: flex;
`;
function BitrateControls({
  bitrate,
  setBitrate,
  variants,
}: {
  bitrate: number;
  setBitrate: Function;
  variants: Variant[];
}) {
  // open/close the bitrate menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const ref = useRef();

  return (
    <BitrateStyles>
      <IconButton
        size="small"
        ref={ref}
        onClick={() => setIsMenuOpen((p) => !p)}
      >
        <HighQualityIcon />
      </IconButton>
      <Menu
        anchorEl={ref.current}
        open={isMenuOpen}
        onChange={(event) => {
          setBitrate((event.target as any).value);
        }}
        onBackdropClick={() => setIsMenuOpen(false)}
      >
        {variants
          .sort((a, b) => a.bitrate - b.bitrate)
          .map((variant) => (
            <MenuItem
              {...(variant.bitrate === bitrate
                ? { disabled: true, style: { background: "hsl(0,0%,50%)" } }
                : {})}
              onClick={() => setBitrate(variant.bitrate)}
              key={variant.url}
              value={variant.url}
            >
              {variant.bitrate || 0}
            </MenuItem>
          ))}
      </Menu>
    </BitrateStyles>
  );
}
