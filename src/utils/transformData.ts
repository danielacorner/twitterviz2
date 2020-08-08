//

import { Tweet } from "../types";
import { uniq } from "lodash";
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
type Link = { source: string | number; target: string | number };
type User = Tweet["user"];
type GraphOfTweets = { nodes: Tweet[]; links: Link[] };
export type TransformedTweets = { graph: GraphOfTweets; users: User[] };
export function transformTweetsIntoGraphData(
  tweetsArg: Tweet[]
): TransformedTweets {
  let tweets = tweetsArg.map((tweet) => ({ ...tweet, id: +tweet.id_str }));
  // list of all user that tweeted
  const users = tweets.map((t) => t.user);
  const tweetsByUser: { [userId: string]: Tweet } = tweets.reduce(
    (acc, t) => ({
      ...acc,
      [t.user.id_str]: t,
    }),
    {} as { [userId: string]: Tweet }
  );

  // for each user, make a isUserNode: true node
  users.forEach((user) => {
    if (tweetsByUser[user.id_str]) {
      tweets.push({
        ...tweetsByUser[user.id_str],
        isUserNode: true,
        // the id_str becomes the user's id_str
        id: +user.id_str,
      });
    }
  });

  const userIds = uniq(tweets.map((t) => t.user.id_str));

  const tweetIdsByHashtag: {
    [hashtag: string]: Tweet[];
  } = tweets.reduce(
    (acc, tweet) => {
      const hashtagsInTweet = (tweet.extended_tweet || tweet)?.entities
        .hashtags;

      hashtagsInTweet.forEach((hashtag) => {
        acc = { ...acc, [hashtag]: [...(acc[hashtag] ? acc[hashtag] : [])] };
      });
      return acc;
    },
    {} as {
      [hashtag: string]: Tweet[];
    }
  );

  // list of hashtags by user id
  // type HashtagWithTweetType = { hashtag: string; tweetId: string };
  // const allHashtagsWithTweet: HashtagWithTweetType[] = tweets.reduce(
  //   (acc: HashtagWithTweetType[], t: Tweet) => {
  //     const hashtagsInTweet = (t.extended_tweet || t).entities.hashtags;
  //     const hashtagsWithUsers: HashtagWithTweetType[] = (
  //       hashtagsInTweet || []
  //     ).map((hashtag) => ({
  //       hashtag: String(hashtag.text),
  //       tweetId: t.id_str,
  //     }));

  //     return [...acc, ...hashtagsWithUsers];
  //   },
  //   [] as HashtagWithTweetType[]
  // );
  // type HashtagWithUserType = { hashtag: string; userId: string };
  // const allHashtagsWithUser: HashtagWithUserType[] = tweets.reduce(
  //   (acc: HashtagWithUserType[], t: Tweet) => {
  //     const hashtagsInTweet = (t.extended_tweet || t).entities.hashtags;
  //     const hashtagsWithUsers: HashtagWithUserType[] = (
  //       hashtagsInTweet || []
  //     ).map((hashtag) => ({
  //       hashtag: String(hashtag.text),
  //       userId: t.user.id_str,
  //     }));

  //     return [...acc, ...hashtagsWithUsers];
  //   },
  //   [] as HashtagWithUserType[]
  // );

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
    const replyRecipientUserId = t.in_reply_to_user_id_str;

    // - mentioned users
    const mentionedUserIds = (t.extended_tweet || t).entities.user_mentions
      .map(
        (user) =>
          tweets.find(
            (tweet) => tweet.isUserNode && tweet.user.id_str === user.id_str
          )?.id_str
      )
      .filter(Boolean);

    // users using the same hashtags
    // for each hashtag,
    const allHashtagRelatedTweetIds: string[] = Object.entries(
      tweetIdsByHashtag
    ).reduce((acc, [hashtag, tweets]) => {
      // for each hashtag shared by many tweets

      if (tweets.length > 1) {
        // save all sets of links between these tweets
        tweets.forEach((tweet) => {
          acc = [...acc, tweet.id_str];
        });
      }
      return acc;
    }, [] as string[]);

    // - tweets of users that liked this tweet

    // - tweets of retweeted user
    // const retweetedUser = t.map([...mentions, replyRecipient]);

    // Link this tweet to userIds: poster, replied, mentioned, retweeted
    const relatedUserIds = uniq([
      t.user.id_str,
      ...(replyRecipientUserId ? [replyRecipientUserId] : []),
      ...mentionedUserIds,
    ]);
    const relatedTweetIds = uniq(allHashtagRelatedTweetIds);
    // create a link if we find the users in our dataset
    tweets.forEach((tweet) => {
      // link each tweet to each user node
      relatedUserIds.forEach((relatedUserId) => {
        if (relatedUserId === tweet.user.id_str) {
          acc = [
            ...acc,
            {
              // target = the user node, (isUserNode && id_str is user.id_str)
              target: +relatedUserId,
              // source = this tweet
              source: +t.id,
            },
          ];
        }
      });
      relatedTweetIds.forEach((relatedTweetId) => {
        if (relatedTweetId === tweet.id_str) {
          console.log("🌟🚨: relatedTweetId", relatedTweetId);
          acc = [
            ...acc,
            {
              // target = the related tweet node
              target: +relatedTweetId,
              // source = this tweet
              source: +tweet.id_str,
            },
          ];
        }
      });
    });

    return acc;
  }, [] as Link[]);

  // graph payload
  // const data = {
  //   nodes: [
  //     { id: 1 }, { id: 2 }, { id: 3 }],
  //   links: [
  //     { source: 1, target: 2 },
  //     { source: 1, target: 3 },
  //   ],
  // };
  console.log({ links });
  return {
    graph: {
      nodes: tweets.map((t) => ({ ...t, id: +t.user.id_str })),
      // links: [],
      links: [],
      // links: uniqBy(links, (l) => JSON.stringify(l)),
    },
    users,
  };
}
