import React from "react";
import { Menu, MenuItem } from "@material-ui/core";
import {
  useFetchLikes,
  useFetchTimeline,
  useFetchRetweets,
} from "../../utils/hooks";
import { useTooltipNode } from "providers/store";
import RetweetedIcon from "@material-ui/icons/CachedRounded";

export default function RightClickMenu({
  anchorEl,
  handleClose,
  isMenuOpen,
  user,
  MenuProps = {},
}) {
  const { fetchTimeline } = useFetchTimeline();
  const { fetchLikes } = useFetchLikes();
  const { fetchRetweets } = useFetchRetweets();
  // TODO: fetch retweeters of a tweet GET statuses/retweeters/ids https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/get-statuses-retweets-id
  // TODO: fetch users who liked a tweet
  const tooltipNode = useTooltipNode();
  const isUserNode = tooltipNode?.isUserNode;
  const isTweetNode = !isUserNode;
  return (
    <Menu
      {...(anchorEl ? { anchorEl } : {})}
      onBackdropClick={handleClose}
      open={isMenuOpen}
      {...MenuProps}
    >
      <MenuItem
        onClick={() => {
          fetchTimeline(user.id_str);
          handleClose();
        }}
      >
        Tweets by {tooltipNode?.user.name} (@{tooltipNode?.user.screen_name})
      </MenuItem>
      {/* <MenuItem onClick={handleFetchMedia}>Media</MenuItem> */}
      {/* <MenuItem onClick={handleFetchFollowing}>Following</MenuItem> */}
      {/* <MenuItem onClick={handleFetchFollowers}>Followers</MenuItem> */}

      {isUserNode ? (
        <MenuItem
          onClick={() => {
            fetchLikes(user.id_str);
            handleClose();
          }}
        >
          Tweets liked by {tooltipNode?.user.name} (@
          {tooltipNode?.user.screen_name})
        </MenuItem>
      ) : null}
      {isTweetNode ? (
        <MenuItem
          onClick={() => {
            fetchRetweets(tooltipNode?.id_str);
            handleClose();
          }}
        >
          Retweets of this tweet
        </MenuItem>
      ) : null}
      {isTweetNode && tooltipNode?.retweeted_status?.user ? (
        <MenuItem
          onClick={() => {
            fetchTimeline(tooltipNode.retweeted_status.user.id_str);
            handleClose();
          }}
        >
          Tweets by <RetweetedIcon style={{ transform: "scale(0.8)" }} />{" "}
          {tooltipNode.retweeted_status.user.name} (@
          {tooltipNode.retweeted_status.user.screen_name})
        </MenuItem>
      ) : null}
    </Menu>
  );
}
