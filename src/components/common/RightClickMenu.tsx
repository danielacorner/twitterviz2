import React from "react";
import { Menu, MenuItem } from "@material-ui/core";
import {
  useFetchLikes,
  useFetchTimeline,
  useFetchRetweets,
} from "../../utils/hooks";
import {
  useSetTweets,
  useTooltipNode,
  useTweets,
} from "providers/store/useSelectors";
import { useConfig } from "providers/store/useConfig";
import RetweetedIcon from "@material-ui/icons/CachedRounded";
import { User } from "types";

type RightClickMenuProps = {
  anchorEl: any;
  handleClose: Function;
  isMenuOpen: boolean;
  user?: User;
  MenuProps?: any;
};

// tslint:disable-next-line: cognitive-complexity
export default function RightClickMenu({
  anchorEl,
  handleClose,
  isMenuOpen,
  user,
  MenuProps = {},
}: RightClickMenuProps) {
  const deleteAllTweets = useDeleteAllTweets();
  const { fetchTimeline } = useFetchTimeline();
  const { setConfig, replace, numTweets } = useConfig();
  const fetchLikes = useFetchLikes();
  const fetchRetweets = useFetchRetweets();
  // TODO: fetch retweeters of a tweet GET statuses/retweeters/ids https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/get-statuses-retweets-id
  // TODO: fetch users who liked a tweet
  const tooltipNode = useTooltipNode();
  const isUserNode = tooltipNode?.isUserNode;
  const isTweetNode = !isUserNode;
  const hasRetweet = isTweetNode && tooltipNode?.retweeted_status?.user;

  // send the user's tweets to the Botometer API https://rapidapi.com/OSoMe/api/botometer-pro/endpoints
  const tweets = useTweets();

  const setTweets = useSetTweets();
  const deleteTweetsByUser = () => {
    if (!tooltipNode) {
      return;
    }

    const tweetsWithoutThisUser = tweets.filter(
      (t) => t.user.id_str !== tooltipNode.user.id_str
    );

    const prevReplace = replace;
    setConfig({ replace: true });
    setTimeout(() => {
      setTweets(tweetsWithoutThisUser, true);
      setConfig({ replace: prevReplace });
    });
    // setTimeout(() => {
    //   setConfig({ replace: false });
    // });
  };
  return (
    <Menu
      {...(anchorEl ? { anchorEl } : {})}
      onBackdropClick={handleClose}
      open={isMenuOpen}
      {...MenuProps}
    >
      <MenuItem
        onClick={() => {
          if (user) {
            fetchTimeline(user.id_str);
          }
          handleClose();
        }}
      >
        Fetch {numTweets} tweets by {tooltipNode?.user.name} (@
        {tooltipNode?.user.screen_name})
      </MenuItem>
      {/* <MenuItem onClick={handleFetchMedia}>Media</MenuItem> */}
      {/* <MenuItem onClick={handleFetchFollowing}>Following</MenuItem> */}
      {/* <MenuItem onClick={handleFetchFollowers}>Followers</MenuItem> */}

      {isUserNode ? (
        <MenuItem
          onClick={() => {
            if (user) {
              fetchLikes(user.id_str);
            }
            handleClose();
          }}
        >
          Fetch {numTweets} tweets liked by {tooltipNode?.user.name} (@
          {tooltipNode?.user.screen_name})
        </MenuItem>
      ) : null}
      {isTweetNode ? (
        <MenuItem
          onClick={() => {
            if (tooltipNode?.id_str) {
              fetchRetweets(tooltipNode?.id_str);
            }
            handleClose();
          }}
        >
          Fetch {numTweets} retweets of this tweet (if any)
        </MenuItem>
      ) : null}
      {hasRetweet ? (
        <MenuItem
          onClick={() => {
            if (tooltipNode?.retweeted_status?.user.id_str) {
              fetchTimeline(tooltipNode?.retweeted_status?.user.id_str);
            }
            handleClose();
          }}
        >
          Fetch {numTweets} tweets by{" "}
          <RetweetedIcon style={{ transform: "scale(0.8)" }} />{" "}
          {tooltipNode?.retweeted_status?.user.name} (@
          {tooltipNode?.retweeted_status?.user.screen_name})
        </MenuItem>
      ) : null}
      {isUserNode ? (
        <MenuItem
          onClick={() => {
            handleClose();
          }}
        >
          Generate Bot Score for {tooltipNode?.user.name} (@
          {tooltipNode?.user.screen_name})
        </MenuItem>
      ) : null}
      {isUserNode ? (
        <MenuItem
          onClick={() => {
            deleteTweetsByUser();
            handleClose();
          }}
        >
          Delete all tweets by {tooltipNode?.user.name} (@
          {tooltipNode?.user.screen_name})
        </MenuItem>
      ) : null}
      <MenuItem
        onClick={() => {
          deleteAllTweets();
          handleClose();
        }}
      >
        Delete all tweets
      </MenuItem>
    </Menu>
  );
}

function useDeleteAllTweets() {
  const setTweets = useSetTweets();
  const { setConfig } = useConfig();

  return () => {
    setConfig({ replace: true });
    setTweets([], true);
    setTimeout(() => {
      setConfig({ replace: false });
    });
  };
}
