import React, { useState, useCallback } from "react";
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
import { useWhyDidYouUpdate } from "use-why-did-you-update";

const defaultGraphData = transformTweetsIntoGraphData(tweets);

const NetworkGraph = ({ is3d, colorBy, graphDataFromServer }) => {
  useWhyDidYouUpdate("NETWORKGRAPH", { is3d, colorBy, graphDataFromServer });

  const [nodeData, setNodeData] = useState(null);

  return (
    <>
      <Graph {...{ is3d, graphDataFromServer, setNodeData, colorBy }} />
      <NodeTooltip nodeData={nodeData} />
    </>
  );
};

function Graph({ is3d, graphDataFromServer, setNodeData, colorBy }) {
  useWhyDidYouUpdate("GRAPH", { is3d, graphDataFromServer, setNodeData });
  const onNodeHover = useCallback(
    (node) => {
      if (node) {
        console.log("🌟🚨: NetworkGraph -> node", node);
        setNodeData(node);
      }
    },
    [setNodeData]
  );
  const onNodeClick = useCallback((node) => {
    window.open(
      `https://twitter.com/${node.user.screen_name}/status/${node.id_str}`,
      "_blank"
    );
  }, []);
  const forceGraphProps = {
    onNodeHover,
    onNodeClick,
    cooldownTime: 250,
    nodeRelSize: 25,
    nodeColor: (node) => getNodeColor(node, colorBy),
    // nodeAutoColorBy: (node) => node.extended_entities?.media[0].type,
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
    </>
  );
}

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
