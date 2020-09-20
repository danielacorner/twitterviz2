import React, { useRef, useEffect, useState } from "react";
import { getMediaArr, MediaItem } from "../utils/utils";
import countryCodes from "../utils/countryCodes";
import RetweetedIcon from "@material-ui/icons/CachedRounded";
import LocationIcon from "@material-ui/icons/LocationOnRounded";
import ReplyIcon from "@material-ui/icons/Reply";
import { TweetStyles } from "./TweetStyles";
import { Body2, Body1 } from "./common/styledComponents";
import BtnFetchTimeline from "./common/BtnFetchTimeline";
import { TAB_INDICES, useConfig } from "../providers/store";
import useContainerDimensions from "../utils/useContainerDimensions";
import styled from "styled-components/macro";
import { Menu, IconButton, MenuItem } from "@material-ui/core";
import HighQualityIcon from "@material-ui/icons/HighQuality";
import { Variant } from "../types";
import { Player } from "video-react";

export default function TweetContent({
  tweet,
  offset = 0,
  autoPlay = true,
  isTooltip = false,
  isBottomDrawer = false,
}) {
  const {
    user,
    text,
    retweeted_status,
    extended_tweet,
    extended_entities,
    entities,
  } = tweet;
  const retweetedUser = retweeted_status?.user
    ? {
        name: retweeted_status.user.name,
        screen_name: retweeted_status.user.screen_name,
        id_str: retweeted_status.user.id_str,
      }
    : null;

  let parsing = null; //TODO necessary?

  const mediaArr = getMediaArr(tweet);
  const fullText =
    extended_tweet?.full_text ||
    retweeted_status?.extended_tweet?.full_text ||
    retweeted_status?.text ||
    text;
  const textWithLinks = fullText
    .split(" ")
    // if first two are "RT: someUser", store separately
    .reduce((acc, cur, idx) => {
      if (cur === "RT") {
        parsing = "next";
        return acc;
      } else if (parsing === "next") {
        parsing = cur;
        return acc;
      } else {
        return [...acc, cur];
      }
    }, [])
    .map((word) =>
      word[0] === "@" ? (
        <a
          style={{ marginRight: "0.5ch" }}
          key={word}
          href={`https://twitter.com/${
            word.slice(-1) === ":" ? word.slice(1, -1) : word.slice(1)
          }`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {word}
        </a>
      ) : word[0] === "#" ? (
        <a
          style={{ marginRight: "0.5ch" }}
          key={word}
          href={`https://twitter.com/hashtag/${word.slice(1)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {word}
        </a>
      ) : word.slice(0, 5) === "https" ? (
        <a
          style={{ marginRight: "0.5ch" }}
          key={word}
          href={word}
          target="_blank"
          rel="noopener noreferrer"
        >
          {word}
        </a>
      ) : (
        word + " "
      )
    );

  const { tabIndex } = useConfig();
  const [ref, dimensions] = useContainerDimensions();
  return (
    <TweetStyles
      ref={ref}
      isGallery={tabIndex === TAB_INDICES.GALLERY}
      isRetweet={Boolean(retweetedUser)}
      isTooltip={isTooltip}
      isBottomDrawer={isBottomDrawer}
      videoHeight={-offset + 270}
      isVideo={extended_entities?.media[0]?.type === "video"}
    >
      {retweetedUser && (
        <div className="retweetedUser">
          <Body1 className="user_name">{retweetedUser.name}</Body1>
          <a
            href={`https://twitter.com/${retweetedUser.screen_name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="user_screen_name"
          >
            @{retweetedUser.screen_name}
          </a>
          {!isTooltip && <BtnFetchTimeline user={retweetedUser} />}
        </div>
      )}
      <div className="userInfo">
        {retweetedUser && (
          <>
            <RetweetedIcon /> <div className="retweetedBy">by </div>
          </>
        )}
        <Body2 className="username">{user.name}</Body2>
        <a
          href={`https://twitter.com/${user.screen_name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="user_screen_name"
        >
          @{user.screen_name}
        </a>
        <BtnFetchTimeline user={user} />
      </div>

      {tweet.in_reply_to_screen_name && (
        <>
          <Body2 className="inReplyTo">
            <ReplyIcon />
            to
            <a
              style={{ marginLeft: "0.5ch" }}
              href={`https://twitter.com/${tweet.in_reply_to_screen_name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              @{tweet.in_reply_to_screen_name}
            </a>
          </Body2>
        </>
      )}
      {(user.location || entities?.place?.country_code) && (
        <Body2 className="locationInfo">
          {user.location && (
            <>
              <LocationIcon />
              {user.location}
            </>
          )}
          {entities?.place?.country_code && (
            <Body2 className="country">
              | {countryCodes[entities?.place?.country_code]}
            </Body2>
          )}
        </Body2>
      )}
      <Body2 className="text">{textWithLinks}</Body2>
      <div className="allMedia">
        {mediaArr.map((mediaItem) => {
          return (
            <MediaContent
              key={mediaItem.id_str}
              {...mediaItem}
              {...{ autoPlay, containerWidth: dimensions?.width || 0 }}
            />
          );
        })}
      </div>
    </TweetStyles>
  );
}

type MediaProps = MediaItem & {
  autoPlay: boolean;
  containerWidth: number;
};
function MediaContent({ autoPlay, containerWidth, ...mediaItem }: MediaProps) {
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

  return (
    <div
      onClick={handleClick}
      className="media"
      style={{
        height: (containerWidth * sizes.large.h) / sizes.large.w,
        width: containerWidth,
        position: "relative",
      }}
    >
      {type === "video" ? (
        autoPlay || clickedOnce ? (
          <VideoWithControls {...{ videoRef, containerWidth, mediaItem }} />
        ) : (
          <div
            className="poster"
            style={{
              height: (containerWidth * sizes.large.h) / sizes.large.w,
              width: containerWidth,
            }}
          >
            <img
              loading="lazy"
              src={poster}
              alt=""
              width={containerWidth}
              height={(containerWidth * sizes.large.h) / sizes.large.w}
            />
          </div>
        )
      ) : (
        <a
          className="imgLink"
          href={src}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            loading="lazy"
            src={src}
            alt=""
            width={containerWidth}
            height={(containerWidth * sizes.large.h) / sizes.large.w}
          />
        </a>
      )}
    </div>
  );
}

const VideoStyles = styled.div`
  .video-react-controls-enabled {
  }
  .video-react-icon-fullscreen {
    min-width: 56px;
  }
  .video-react-control:before {
    margin-left: -14px;
  }
  .video-react-slider {
    padding: 10px;
    background: none;
  }
  .video-react-progress-holder {
  }
  .video-react-play-progress {
    top: calc(50% - 2px) !important;
  }
  .video-react-load-progress {
    padding: 10px;
    opacity: 0;
    div {
      top: calc(50% - 2px);
    }
  }
`;
function VideoWithControls({
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
        style={{ paddingTop: 0 }}
        ref={videoRef}
        controls={true}
        src={variants.find((v) => v.bitrate === bitrate).url}
        poster={poster}
        autoPlay={true}
        loop={true}
        width={containerWidth}
        height={(containerWidth * sizes.large.h) / sizes.large.w}
      ></Player>
      <BitrateControls
        {...{
          bitrate,
          setBitrate,
          variants,
        }}
      />
    </VideoStyles>
  );
}

const BitrateStyles = styled.div`
  position: absolute;
  bottom: 5px;
  right: 6px;
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
          console.log("🌟🚨: event", event);
          setBitrate((event.target as any).value);
        }}
        onBackdropClick={() => setIsMenuOpen(false)}
      >
        {variants.map((variant) => (
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
