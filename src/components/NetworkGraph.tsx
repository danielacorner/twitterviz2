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

const data = transformTweetsIntoGraphData(tweets);

const NetworkGraph = ({ is3d }) => {
  const [nodeData, setNodeData] = useState(null);

  const forceGraphProps = {
    onNodeHover: (node) => {
      if (node) {
        setNodeData(node);
      }
    },
    cooldownTime: 50,
    nodeRelSize: 10,
  };
  return (
    <>
      {is3d ? (
        <ForceGraph3D graphData={data} {...forceGraphProps} />
      ) : (
        <ForceGraph2D graphData={data} {...forceGraphProps} />
      )}
      <NodeTooltip nodeData={nodeData} />
    </>
  );
};

export default NetworkGraph;
