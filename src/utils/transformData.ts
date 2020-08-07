//

import { Tweet } from "../types";

// link tweets to other tweets by tweet.user.id_str
// (if they are in the dataset)

// link tweets to other tweets by...
// 1. their user's other tweets
// 2. mentioned users' other tweets
// 3. retweeted user's other tweets
// 4. replied-to users' other tweets
// 5. tweets sharing a hashtag
type Link = { source: string; target: string };
type User = Tweet["user"];
type GraphOfTweets = { nodes: Tweet[]; links: Link[] };
export type TransformedTweets = { graph: GraphOfTweets; users: User[] };
export function transformTweetsIntoGraphData(
  tweets: Tweet[]
): TransformedTweets {
  // list of all user that tweeted
  const users = tweets.map((t) => t.user);
  const userIds = tweets.map((t) => t.user.id_str);

  // list of hashtags by user id
  type HashtagWithUserType = { hashtag: string; userId: string };
  const allHashtagsWithUser: HashtagWithUserType[] = tweets.reduce(
    (acc: HashtagWithUserType[], t: Tweet) => {
      const hashtagsInTweet = (t.extended_tweet || t).entities.hashtags;
      const hashtagsWithUsers: HashtagWithUserType[] = (
        hashtagsInTweet || []
      ).map((hashtag) => ({
        hashtag: String(hashtag.text),
        userId: t.user.id_str,
      }));

      return [...acc, ...hashtagsWithUsers];
    },
    [] as HashtagWithUserType[]
  );

  // const { allHashtags, allHashtagUserIds } = allHashtagsWithUser.reduce(
  //   (acc, { hashtag, userId }) => ({
  //     allHashtags: [...acc.allHashtags, hashtag],
  //     allHashtagUserIds: [...acc.allHashtagUserIds, userId],
  //   }),
  //   {} as { allHashtags: string[]; allHashtagUserIds: string[] }
  // );

  // const allTweetUserIds = tweets.map((t) => t.user.id_str);
  // // list of all users that were replied to
  // const allReplyRecipientIds: string[] = tweets.reduce(
  //   (acc, t) => [...acc, t.in_reply_to_user_id_str],
  //   []
  // );
  // // list of users mentioned
  // const allMentionedUserIds: string[] = tweets.reduce(
  //   (acc, t) => [...acc, t.entities.user_mentions.map((user) => user.id_str)],
  //   []
  // );

  // const allUserIds = [...allReplyRecipientIds, ...allMentionedUserIds];

  // tweets link to other tweets by their user id
  // for each tweet, link the tweet to...
  const links = tweets.reduce((acc, t) => {
    // - reply recipient
    const replyRecipient = t.in_reply_to_user_id_str;

    // - mentioned users
    const mentions = (t.extended_tweet || t).entities.user_mentions.map(
      (user) => user.id_str
    );

    // users using the same hashtags
    // for each hashtag,
    const allHashtagRelatedUserIds: string[] = allHashtagsWithUser.reduce(
      (acc, { hashtag, userId }) => {
        // if we find that hashtag in our current tweet
        const isHashtagInThisTweet = (
          (t.extended_tweet || t).entities.hashtags || []
        )
          .map((h) => h.text)
          .includes(hashtag);
        if (isHashtagInThisTweet) {
          // save the user id
          return [...acc, userId];
        } else {
          return acc;
        }
      },
      [] as string[]
    );

    // - tweets of users that liked this tweet

    // - tweets of retweeted user
    // const retweetedUser = t.map([...mentions, replyRecipient]);

    const relatedUsers = [
      ...(replyRecipient ? [replyRecipient] : []),
      ...mentions,
      ...allHashtagRelatedUserIds,
    ];
    if (relatedUsers.length > 0) {
      // create a link if we find the users in our dataset
      userIds.forEach((userId) => {
        relatedUsers.forEach(relatedUser=>{

        if (relatedUser===userId) {
          // console.log("🌟🚨: userId", userId);
          // console.log("🌟🚨: relatedUser", relatedUser);
          acc = [...acc, { source: t.user.id_str, target: userId }];
        }

        })
      })
    }

    return acc;
  }, [] as {source:string,target:string}[]);

  // graph payload
  // const data = {
  //   nodes: [
  //     { id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
  //   links: [
  //     { source: "Harry", target: "Sally" },
  //     { source: "Harry", target: "Alice" },
  //   ],
  // };
  console.log({links})
  return {
    graph: {
      nodes: tweets,
      links: [] || links,
    },
    users,
  };
}
