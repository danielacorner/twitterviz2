import React from "react";
import { Graph } from "react-d3-graph";

const NetworkGraph = ({ tweets }) => {
  console.log("🌟🚨: App -> tweets", tweets);
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

  // the graph configuration, you only need to pass down properties
  // that you want to override, otherwise default ones will be used
  // https://danielcaldas.github.io/react-d3-graph/docs/index.html#config-global
  const myConfig = {
    nodeHighlightBehavior: true,
    collapsible: false,
    directed: false,
    node: {
      color: "lightgreen",
      size: 120,
      highlightStrokeColor: "blue",
    },
    link: {
      highlightColor: "lightblue",
    },
  };

  // graph event callbacks
  const onClickGraph = function () {
    console.log(`Clicked the graph background`);
  };

  const onClickNode = function (nodeId) {
    console.log(`Clicked node ${nodeId}`);
  };

  const onDoubleClickNode = function (nodeId) {
    console.log(`Double clicked node ${nodeId}`);
  };

  const onRightClickNode = function (event, nodeId) {
    console.log(`Right clicked node ${nodeId}`);
  };

  const onMouseOverNode = function (nodeId) {
    console.log(`Mouse over node ${nodeId}`);
  };

  const onMouseOutNode = function (nodeId) {
    console.log(`Mouse out node ${nodeId}`);
  };

  const onClickLink = function (source, target) {
    console.log(`Clicked link between ${source} and ${target}`);
  };

  const onRightClickLink = function (event, source, target) {
    console.log(`Right clicked link between ${source} and ${target}`);
  };

  const onMouseOverLink = function (source, target) {
    console.log(`Mouse over in link between ${source} and ${target}`);
  };

  const onMouseOutLink = function (source, target) {
    console.log(`Mouse out link between ${source} and ${target}`);
  };

  const onNodePositionChange = function (nodeId, x, y) {
    console.log(
      `Node ${nodeId} is moved to new position. New position is x= ${x} y= ${y}`
    );
  };

  return (
    <Graph
      id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
      data={data}
      config={myConfig}
      onClickNode={onClickNode}
      onDoubleClickNode={onDoubleClickNode}
      onRightClickNode={onRightClickNode}
      onClickGraph={onClickGraph}
      onClickLink={onClickLink}
      onRightClickLink={onRightClickLink}
      onMouseOverNode={onMouseOverNode}
      onMouseOutNode={onMouseOutNode}
      onMouseOverLink={onMouseOverLink}
      onMouseOutLink={onMouseOutLink}
      onNodePositionChange={onNodePositionChange}
    />
  );
};

export default NetworkGraph;
