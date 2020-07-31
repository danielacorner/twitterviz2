import React from "react";
import {
  ForceGraph2D,
  ForceGraph3D,
  // ForceGraphVR,
  // ForceGraphAR,
} from "react-force-graph";
// https://www.npmjs.com/package/react-force-graph

const NetworkGraph = ({ tweets, is3d }) => {
  console.log("🌟🚨: App -> tweets", tweets);
  const data = transformTweetsIntoGraphData(tweets);

  return is3d ? (
    <ForceGraph3D graphData={data} />
  ) : (
    <ForceGraph2D graphData={data} />
  );
};

export default NetworkGraph;

function transformTweetsIntoGraphData(tweets: any) {
  const allUserIds = tweets.map((t) => t.user.id);

  const prunedLinks = tweets.reduce((acc, tweet) => {
    // skip any links that don't point to nodes in our dataset
    // ? is there a more efficient way?
    const doWeHaveTargetUser = allUserIds.includes(
      tweet.in_reply_to_user_id_str
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

  console.log("🌟🚨: NetworkGraph -> prunedLinks", prunedLinks);

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
