import React, { useState } from "react";
import {
  ForceGraph2D,
  ForceGraph3D,
  // ForceGraphVR,
  // ForceGraphAR,
} from "react-force-graph";
import NodeTooltip from "./NodeTooltip";
// https://www.npmjs.com/package/react-force-graph
import tweets from "../tweets.json";
import { transformTweetsIntoGraphData } from "../utils/transformData";
import { COLOR_BY } from "../utils/constants";

const defaultGraphData = transformTweetsIntoGraphData(tweets);

const NetworkGraph = ({ is3d, colorBy, tweetsFromServer }) => {
  const graphDataFromServer =
    tweetsFromServer && transformTweetsIntoGraphData(tweetsFromServer);
  const [nodeData, setNodeData] = useState(null);

  const forceGraphProps = {
    onNodeHover: (node) => {
      if (node) {
        setNodeData(node);
      }
    },
    cooldownTime: 250,
    nodeRelSize: 25,
    nodeColor: (node) => getNodeColor(node, colorBy),
    // nodeAutoColorBy:
  };
  return (
    <>
      {is3d ? (
        <ForceGraph3D
          graphData={graphDataFromServer || defaultGraphData}
          {...forceGraphProps}
        />
      ) : (
        <ForceGraph2D
          graphData={graphDataFromServer || defaultGraphData}
          {...forceGraphProps}
        />
      )}
      <NodeTooltip nodeData={nodeData} />
    </>
  );
};

export default NetworkGraph;

const DEFAULT_NODE_COLOR = "steelblue";
function getNodeColor(node, colorBy) {
  if (!colorBy) {
    return DEFAULT_NODE_COLOR;
  } else if (colorBy === COLOR_BY.mediaType) {
    const type = node.extended_entities?.media[0].type;
    return type === "video"
      ? "tomato"
      : type === "photo"
      ? "limegreen"
      : DEFAULT_NODE_COLOR;
  }
}
