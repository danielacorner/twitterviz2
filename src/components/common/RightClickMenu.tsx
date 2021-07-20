import { Menu, MenuItem } from "@material-ui/core";
import {
  useFetchLikes,
  useFetchTimeline,
  useFetchRetweets,
} from "../../utils/hooks";
import {
  getUsersInTweet,
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
  const { numTweets } = useConfig();
  const fetchRetweets = useFetchRetweets();
  // TODO: fetch retweeters of a tweet GET statuses/retweeters/ids https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/get-statuses-retweets-id
  // TODO: fetch users who liked a tweet
  const tooltipNode = useTooltipNode();

  const { originalPoster, retweetingUser } = tooltipNode
    ? getUsersInTweet(tooltipNode)
    : { originalPoster: null, retweetingUser: null };

  const originalPosterDisplay =
    originalPoster &&
    `${originalPoster.name} (@
    ${originalPoster.screen_name})`;
  const retweetingUserDisplay = retweetingUser && (
    <>
      {" "}
      <RetweetedIcon style={{ transform: "scale(0.8)" }} />{" "}
      {retweetingUser.name} (@
      {retweetingUser.screen_name})
    </>
  );

  return (
    <Menu
      {...(anchorEl ? { anchorEl } : {})}
      onBackdropClick={handleClose}
      open={isMenuOpen}
      {...MenuProps}
    >
      {originalPoster && (
        <MenuItemsForUser
          user={originalPoster}
          userDisplay={originalPosterDisplay}
          {...{ handleClose }}
        />
      )}
      {retweetingUser && (
        <MenuItemsForUser
          user={retweetingUser}
          userDisplay={retweetingUserDisplay}
          {...{ handleClose }}
        />
      )}
      {tooltipNode && (
        <MenuItem
          onClick={() => {
            if (tooltipNode.id_str) {
              fetchRetweets(tooltipNode.id_str);
            }
            handleClose();
          }}
        >
          ♻ Fetch {numTweets} retweets of this tweet (if any)
        </MenuItem>
      )}

      <MenuItem
        onClick={() => {
          deleteAllTweets();
          handleClose();
        }}
      >
        ❌ Delete all tweets
      </MenuItem>
    </Menu>
  );
}

function MenuItemsForUser({
  user,
  userDisplay,
  handleClose,
}: {
  user: User;
  userDisplay: string | React.ReactNode | null;
  handleClose: Function;
}) {
  const { fetchTimeline } = useFetchTimeline();
  const fetchLikes = useFetchLikes();
  const tooltipNode = useTooltipNode();
  const { setConfig, replace, numTweets } = useConfig();

  // send the user's tweets to the Botometer API https://rapidapi.com/OSoMe/api/botometer-pro/endpoints
  const tweets = useTweets();

  const setTweets = useSetTweets();

  const deleteTweetsByUser = (user: User) => {
    if (!tooltipNode) {
      return;
    }

    const tweetsWithoutThisUser = tweets.filter(
      (t) => t.user.id_str !== user.id_str
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
    <>
      <MenuItem
        onClick={() => {
          fetchTimeline(user.id_str);
          handleClose();
        }}
      >
        🐦 Fetch {numTweets} tweets by {userDisplay}
      </MenuItem>
      <MenuItem
        onClick={() => {
          fetchLikes(user.id_str);
          handleClose();
        }}
      >
        🐦 Fetch {numTweets} tweets liked by {userDisplay}
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleClose();
        }}
      >
        🤖 Generate Bot Score for {userDisplay}
      </MenuItem>
      <MenuItem
        onClick={() => {
          deleteTweetsByUser(user);
          handleClose();
        }}
      >
        ❌ Delete all tweets by {userDisplay}
      </MenuItem>
    </>
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
