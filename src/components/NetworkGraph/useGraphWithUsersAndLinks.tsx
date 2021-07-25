import {
  getOriginalPoster,
  useTweets,
} from "../../providers/store/useSelectors";
import { Tweet, User } from "../../types";
import { groupBy } from "lodash";

/** preprocess tweets to add links & user nodes */
export function useGraphWithUsersAndLinks() {
  // dynamic force graph updates WITHOUT re-rendering every node example: https://github.com/vasturiano/react-force-graph/blob/master/example/dynamic/index.html
  // New force graph nodes should be able to mount without causing all others to re-mount
  // But, for some reason, using graphData as ForceGraph props caused every node to re-render on every change of graphData.
  // Instead, it seems to work if we manually sync it to some state,
  // and use the setState (setGraph) callback function to update
  // sync internal state to prevent node re-renders
  // const [graph, setGraph] = useState({
  //   nodes: [] as Tweet[],
  //   links: [] as Link[],
  // });
  // const tweets = useTweets();
  const userNodes = useUserNodes();
  // const likesByUserId = useLikesByUserId();
  // const retweetsByTweetId = useRetweetsByTweetId();

  // uncomment to grab the current state and copy-paste into mockTweetsData.json
  // console.log("🚨🚨: Graph -> mockTweetsData", {
  //   tweets,
  //   retweetsByTweetId,
  //   likesByUserId,
  // });
  // const userToLikesLinks = showUserNodes
  //   ? userNodes.reduce((acc, userNode) => {
  //       const userLikes = likesByUserId[userNode.id_str];
  //       if (userLikes) {
  //         const likedTweetLinks = userLikes.map((likedTweetId) => {
  //           const source = Number(likedTweetId);
  //           const target = Number(userNode.id_str);
  //           return { source, target };
  //         });
  //         return [...acc, ...likedTweetLinks];
  //       } else {
  //         return acc;
  //       }
  //     }, [] as Link[])
  //   : [];

  // const tweetToRetweetsLinks = showUserNodes
  //   ? tweets.reduce((acc, tweet) => {
  //       const retweetsOfThisTweet = retweetsByTweetId[tweet.id_str];
  //       if (retweetsOfThisTweet) {
  //         const linksFromRetweetsOfThisTweet = retweetsOfThisTweet.map(
  //           (idOfOriginalTweet) => {
  //             const source = Number(idOfOriginalTweet);
  //             const target = Number(tweet.id_str);
  //             return { source, target };
  //           }
  //         );
  //         return [...acc, ...linksFromRetweetsOfThisTweet];
  //       } else {
  //         return acc;
  //       }
  //     }, [] as Link[])
  //   : [];

  // const userToTweetsLinks = tweets.map((t) => ({
  //   // source: its user
  //   source: Number(t.user.id_str),
  //   // target: the tweet
  //   target: Number(t.id_str),
  // }));

  return {
    nodes: userNodes,
    links: [
      // ...tweetToRetweetsLinks,
      // links from each user to their tweets
      // ...userToTweetsLinks,
      // links from each user to their likes
      // ...userToLikesLinks,
    ],
  };
}

export type UserNode = {
  id_str: string;
  user: User;
  tweets: Tweet[];
};
function useUserNodes(): UserNode[] {
  const tweets = useTweets();
  const tweetsGroupedByUserId = groupBy(tweets, (tweet: Tweet) =>
    tweet ? getOriginalPoster(tweet)?.id_str : ""
  );
  return Object.entries(tweetsGroupedByUserId).map(
    ([id_str, tweetsByUser]) => ({
      id_str,
      user: tweetsByUser[0].user,
      tweets: tweetsByUser,
    })
  );
}
