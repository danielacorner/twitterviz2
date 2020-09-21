//

import { Tweet } from "../types";
import { EMPTY_TWEET } from "./emptyTweet";
// each Tweet node links to one or more User nodes: poster, replied, mentioned, retweeted
// Tweet nodes link to each other via Hashtags

// link tweets to other tweets by tweet.user.id_str
// (if they are in the dataset)

// link tweets to other tweets by...
// 1. their user's other tweets
// 2. mentioned users' other tweets
// 3. retweeted user's other tweets
// 4. replied-to users' other tweets
// 5. tweets sharing a hashtag
export type Link = { source: string | number; target: string | number };
type User = Tweet["user"];
type GraphOfTweets = { nodes: Tweet[]; links: Link[] };
export type GraphData = {
  graph: GraphOfTweets;
  users: User[];
  tweets: Tweet[];
};
export function transformTweetsIntoGraphData(
  tweets: Tweet[],
  showUserNodes: boolean
): GraphData {
  const users = tweets.map((t) => t.user).filter(Boolean);

  // filter out tweets without users
  const tweetsWithUser: Tweet[] = tweets
    // id <- +id_str
    .map((t) => ({ ...t, id: Number(t.id_str) }))
    .filter((t) => Boolean(t.user?.id_str));

  // graph with no links
  let graph = {
    nodes: tweetsWithUser,
    // links: [],
    links: [],
    // links: uniqBy(links, (l) => JSON.stringify(l)),
  };

  if (showUserNodes) {
    // add nodes for each user & links to their tweets
    const { userLinks, userNodes } = getUserNodes({
      graph,
      users,
      tweets: tweetsWithUser,
    });

    graph = {
      nodes: [...graph.nodes, ...userNodes],
      // link user nodes to their tweets
      links: [
        ...graph.links,
        // one link for each tweet, from its user node to it
        ...userLinks,
      ],
    };
  }

  return {
    graph,
    users,
    tweets: tweetsWithUser,
  };
}

function getUserNodes(
  graphData: GraphData
): { userLinks: Link[]; userNodes: Tweet[] } {
  const userLinks = graphData.tweets.map((t) => ({
    // source: its user
    source: Number(t.user.id_str),
    // target: the tweet
    target: Number(t.id_str),
  }));
  const userNodes: Tweet[] = graphData.users.map((user) => ({
    ...EMPTY_TWEET,
    id: Number(user.id_str),
    id_str: user.id_str,
    user,
    isUserNode: true,
  }));

  return { userLinks, userNodes };
}
