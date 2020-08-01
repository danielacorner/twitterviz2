import React, { useState, useCallback, useRef } from "react";
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
import { getMediaArr } from "../utils/utils";
import { COLOR_BY } from "../utils/constants";
import { useWhyDidYouUpdate } from "use-why-did-you-update";
import * as d3 from "d3";
import * as THREE from "three";

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

  const fgRef = useRef();

  const onNodeHover = useCallback(
    (node) => {
      if (node) {
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
    // d3Force: (...args) => {
    //   console.log("🌟🚨: Graph -> args", args);
    // },
    onEngineStop: () =>
      fgRef.current ? (fgRef.current as any).zoomToFit(400) : null,

    // nodeCanvasObject: (node, ctx, scale) => {
    //   const mediaArr = getMediaArr(node);
    //   const imageObj1 = new Image();

    //   if (!mediaArr[0]) {
    //     ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
    //     return;
    //   }
    //   imageObj1.src = mediaArr[0].poster || mediaArr[0].src;
    //   imageObj1.onload = function () {
    //     ctx.drawImage(imageObj1, 0, 0);
    //   };
    //   return mediaArr[0] ? ctx.drawImage(imageObj1, 10, 10) : null;
    // },
    // nodeCanvasObjectMode: () => "after" as any,
    nodeThreeObject:
      colorBy === COLOR_BY.mediaType
        ? (node) => {
            console.log("🌟🚨: Graph -> node", node);
            console.log("🌟🚨: Graph -> node.media", node.media);
            const mediaArr = getMediaArr(node);
            const imgTexture = new THREE.TextureLoader().load(
              mediaArr[0]?.poster || mediaArr[0]?.src
            );
            const material = new THREE.SpriteMaterial({ map: imgTexture });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(48, 48, 48);

            return sprite;
          }
        : null,
    // nodeAutoColorBy: (node) => node.extended_entities?.media[0].type,
  };

  return (
    <>
      {is3d ? (
        <ForceGraph3D
          ref={fgRef}
          graphData={graphDataFromServer || defaultGraphData}
          {...forceGraphProps}
        />
      ) : (
        <ForceGraph2D
          ref={fgRef}
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
  switch (colorBy) {
    case COLOR_BY.mediaType:
      const type = node.extended_entities?.media[0].type;
      return type === "video"
        ? "tomato"
        : type === "photo"
        ? "limegreen"
        : DEFAULT_NODE_COLOR;

    case COLOR_BY.sentiment:
      const scale = d3.scaleSequential(d3.interpolatePiYG).domain([-1, 1]);

      return scale(node.sentimentResult.comparative) as string;

    default:
      return DEFAULT_NODE_COLOR;
  }
}
