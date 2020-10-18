import React from "react";
import { getMediaArr } from "utils/utils";
import { TAB_INDICES } from "utils/constants";
import countryCodes from "utils/countryCodes";
import RetweetedIcon from "@material-ui/icons/CachedRounded";
import LocationIcon from "@material-ui/icons/LocationOnRounded";
import ReplyIcon from "@material-ui/icons/Reply";
import { TweetStyles } from "../TweetStyles";
import { Body2, Body1 } from "../common/styledComponents";
import BtnFetchTimeline from "../common/BtnFetchTimeline";
import { useSearchObj } from "../../providers/store";
import useContainerDimensions from "utils/useContainerDimensions";
import MediaContent from "./Media/MediaContent";
import { Tweet } from "types";

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
    in_reply_to_screen_name,
    entities,
  } = tweet;

  const retweetedUser = getRetweetedUser(tweet);
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

  const [ref, dimensions] = useContainerDimensions();
  const searchObj = useSearchObj();
  return (
    <TweetStyles
      ref={ref}
      isGallery={`${TAB_INDICES.GALLERY}` in searchObj}
      isRetweet={Boolean(retweetedUser)}
      isTooltip={isTooltip}
      isBottomDrawer={isBottomDrawer}
      videoHeight={-offset + 270}
      isVideo={extended_entities?.media[0]?.type === "video"}
    >
      <div className="userInfo">
        <div className="usersRows">
          {!retweetedUser && (
            <OriginalUser {...{ originalUser: user, isTooltip }} />
          )}
          {retweetedUser && <RetweetedByUser {...{ user, isTooltip }} />}
          {retweetedUser && <RetweetedUser {...{ retweetedUser, isTooltip }} />}
          {in_reply_to_screen_name && (
            <InReplyToUser {...{ in_reply_to_screen_name }} />
          )}
        </div>
      </div>

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
              {...{
                autoPlay,
                isTooltip,
                containerWidth: dimensions?.width || 0,
              }}
            />
          );
        })}
      </div>
    </TweetStyles>
  );
}

function RetweetedByUser({ user, isTooltip }) {
  return (
    <div className="retweetedByUser">
      <RetweetedIcon /> <div className="retweetedBy">by </div>
      <Body2 className="username">{user.name}</Body2>
      <a
        href={`https://twitter.com/${user.screen_name}`}
        target="_blank"
        rel="noopener noreferrer"
        className="user_screen_name"
      >
        @{user.screen_name}
      </a>
      {!isTooltip && <BtnFetchTimeline user={user} />}
    </div>
  );
}
function OriginalUser({ originalUser, isTooltip }) {
  return (
    <div className="originalUser">
      <Body1 className="user_name">{originalUser.name}</Body1>
      <a
        href={`https://twitter.com/${originalUser.screen_name}`}
        target="_blank"
        rel="noopener noreferrer"
        className="user_screen_name"
      >
        @{originalUser.screen_name}
      </a>
      {!isTooltip && <BtnFetchTimeline user={originalUser} />}
    </div>
  );
}
function RetweetedUser({ retweetedUser, isTooltip }) {
  return (
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
  );
}
function InReplyToUser({ in_reply_to_screen_name }) {
  return (
    <Body2 className="inReplyToUser">
      <ReplyIcon />
      to
      <a
        style={{ marginLeft: "0.5ch" }}
        href={`https://twitter.com/${in_reply_to_screen_name}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        @{in_reply_to_screen_name}
      </a>
    </Body2>
  );
}

export function getRetweetedUser(tweet: Tweet) {
  return tweet?.retweeted_status?.user
    ? {
        name: tweet.retweeted_status.user.name,
        screen_name: tweet.retweeted_status.user.screen_name,
        id_str: tweet.retweeted_status.user.id_str,
      }
    : null;
}
