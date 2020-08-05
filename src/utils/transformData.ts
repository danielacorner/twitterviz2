export function transformTweetsIntoGraphData(tweets: any) {
  const allUserIds = tweets.map((t) => t.user.id);

  const prunedLinks = tweets.reduce((acc, tweet) => {
    const mentionedUserIds = tweet.entities.user_mentions.map(
      (user) => user.id_str
    );
    // skip any links that don't point to nodes in our dataset
    // ? is there a more efficient way?
    const doWeHaveTargetUser = allUserIds.find((id) =>
      [tweet.in_reply_to_user_id_str, ...mentionedUserIds].includes(id)
    );

    // create a link if it's a reply
    if (tweet.in_reply_to_user_id_str && doWeHaveTargetUser) {
      acc = [
        ...acc,
        { source: tweet.user.id_str, target: tweet.in_reply_to_user_id_str },
      ];
    }

    return acc;
  }, []);

  // graph payload
  // const data = {
  //   nodes: [
  //     { id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
  //   links: [
  //     { source: "Harry", target: "Sally" },
  //     { source: "Harry", target: "Alice" },
  //   ],
  // };
  const data = {
    nodes: tweets,
    links: prunedLinks,
  };
  return data;
}
