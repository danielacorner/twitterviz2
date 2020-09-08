import React from "react";
import { getMediaArr } from "../utils/utils";
import countryCodes from "../utils/countryCodes";
import RetweetedIcon from "@material-ui/icons/CachedRounded";
import LocationIcon from "@material-ui/icons/LocationOnRounded";
import { Button } from "@material-ui/core";
import { useFetchTimeline } from "../utils/hooks";
import { TweetStyles } from "./TweetStyles";

export default function TweetContent({ nodeData, offset = 0, isTooltip }) {
  const { fetchTimeline } = useFetchTimeline();
  const {
    user,
    text,
    retweeted_status,
    extended_tweet,
    extended_entities,
    entities,
  } = nodeData;
  console.log("🌟🚨: TweetContent -> nodeData", nodeData);
  const retweetedUser = retweeted_status?.user
    ? {
        name: retweeted_status.user.name,
        screen_name: retweeted_status.user.screen_name,
        id_str: retweeted_status.user.id_str,
      }
    : null;

  let parsing = null; //TODO necessary?

  const mediaArr = getMediaArr(nodeData);
  const textWithLinks = (
    extended_tweet?.full_text ||
    retweeted_status?.extended_tweet?.full_text ||
    retweeted_status?.text ||
    text
  )
    .split(" ")
    // if first two are "RT: someUser", store separately
    .reduce((acc, cur) => {
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

  return (
    <TweetStyles
      isRetweet={Boolean(retweetedUser)}
      isTooltip={isTooltip}
      videoHeight={-offset + 270}
      isVideo={extended_entities?.media[0]?.type === "video"}
    >
      {retweetedUser && (
        <div className="retweetedUser">
          <span className="user_name">{retweetedUser.name}</span>{" "}
          <span className="pipe">|</span>
          <a
            href={`https://twitter.com/${retweetedUser.screen_name}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="user_screen_name">
              {retweetedUser.screen_name}
            </span>
          </a>
          {!isTooltip && (
            <Button
              className="btnFetchRetweetedTimeline"
              variant="outlined"
              onClick={() => fetchTimeline(retweetedUser.id_str)}
            >
              Fetch user timeline
            </Button>
          )}
        </div>
      )}
      <div className="userInfo">
        {retweetedUser && (
          <>
            <RetweetedIcon /> <span className="retweetedBy">retweeted by </span>
          </>
        )}
        <div className="username">{user.name}</div>
        <span className="pipe">|</span>
        <div className="handle">
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
