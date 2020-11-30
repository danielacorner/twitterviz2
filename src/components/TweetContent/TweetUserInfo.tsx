import React from "react";
import RetweetedIcon from "@material-ui/icons/CachedRounded";
import ReplyIcon from "@material-ui/icons/Reply";
import { Body2, Body1 } from "../common/styledComponents";
import BtnFetchTimeline from "../common/BtnFetchTimeline";
import { User } from "types";

export default function TweetUserInfo({
  retweetedUser,
  user,
  isTooltip,
  in_reply_to_screen_name,
}: {
  retweetedUser?: User | null;
  user: User;
  isTooltip: boolean;
  in_reply_to_screen_name?: string | null;
}) {
  return (
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
  );
}

function RetweetedByUser({
  user,
  isTooltip,
}: {
  user: User;
  isTooltip: boolean;
}) {
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
function OriginalUser({
  originalUser,
  isTooltip,
}: {
  originalUser: User;
  isTooltip: boolean;
}) {
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
function RetweetedUser({
  retweetedUser,
  isTooltip,
}: {
  retweetedUser: User;
  isTooltip: boolean;
}) {
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
function InReplyToUser({
  in_reply_to_screen_name,
}: {
  in_reply_to_screen_name: string;
}) {
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
