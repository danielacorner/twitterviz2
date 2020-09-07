import React from "react";
import { getMediaArr, PADDING } from "../utils/utils";
import countryCodes from "../utils/countryCodes";
import styled from "styled-components/macro";
import CachedIcon from "@material-ui/icons/CachedRounded";
import LocationIcon from "@material-ui/icons/LocationOnRounded";
import { Button } from "@material-ui/core";
import { useFetchTimeline } from "../utils/hooks";

const TweetStyles = styled.div`
  position: relative;
  display: grid;
  grid-gap: ${PADDING}px;
  .retweetedUser {
    position: absolute;
    top: 0;
    right: -28px;
    .user {
      display: grid;
      grid-auto-flow: column;
      align-items: start;
      justify-content: flex-end;
      grid-gap: 4px;
    }
    button {
      transform: scale(0.8);
      transform-origin: right;
    }
    transform: scale(0.8);
    transform-origin: left;
  }
  .userInfo,
  .locationInfo {
    display: grid;
    grid-auto-flow: column;
    place-content: start;
    grid-gap: 4px;
  }
  .userInfo {
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

export default function TweetContent({ nodeData, offset = 0, numTweets = 0 }) {
  const { fetchTimeline } = useFetchTimeline();
  const { user, text, extended_entities, entities } = nodeData;
  let retweetedUser = null;
  const mediaArr = getMediaArr(nodeData);
  const textWithLinks = text
    .split(" ")
    // if first two are "RT: someUser", store separately
    .reduce((acc, cur) => {
      if (cur === "RT") {
        retweetedUser = "next";
        return acc;
      } else if (retweetedUser === "next") {
        retweetedUser = cur;
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
  return (
    <TweetStyles
      videoHeight={-offset + 270}
      isVideo={extended_entities?.media[0]?.type === "video"}
    >
      {retweetedUser && (
        <div className="retweetedUser">
          <div className="user">
            <CachedIcon />
            <a
              href={`https://twitter.com/${retweetedUser.slice(1)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {retweetedUser.slice(0, -1)}
            </a>
          </div>
          <Button
            variant="outlined"
            onClick={() => fetchTimeline(retweetedUser.slice(1, -1))}
          >
            Fetch user timeline
          </Button>
        </div>
      )}
      <div className="userInfo">
        <div className="username">{user.name}</div>
        <div className="handle">
          |{" "}
          <a
            href={`https://twitter.com/${user.screen_name}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            @{user.screen_name}
          </a>
        </div>
      </div>
      <div className="locationInfo">
        {user.location && (
          <div className="location">
            <LocationIcon />
            {user.location}
          </div>
        )}
        {entities?.place?.country_code && (
          <div className="country">
            | {countryCodes[entities?.place?.country_code]}
          </div>
        )}
      </div>
      <div className="text">{textWithLinks}</div>

      <div className="allMedia">
        {mediaArr.map(({ type, id_str, poster, src }) => {
          return (
            <div className="media" key={id_str}>
              {type === "video" ? (
                <video
                  controls={true}
                  poster={poster}
                  src={src}
                  autoPlay={true}
                  loop={true}
                ></video>
              ) : (
                <img src={src} alt="" />
              )}
            </div>
          );
        })}
      </div>
    </TweetStyles>
  );
}
