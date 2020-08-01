import React, { useState, useCallback, useRef, useEffect } from "react";
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

const NetworkGraph = ({
  is3d,
  colorBy,
  graphDataFromServer,
  allowedMediaTypes,
}) => {
  useWhyDidYouUpdate("NETWORKGRAPH", { is3d, colorBy, graphDataFromServer });

  const [nodeData, setNodeData] = useState(null);

  useEffect(() => {
    console.log("🌟🚨: node", nodeData);
  }, [nodeData]);

  return (
    <>
      <Graph
        {...{
          is3d,
          graphDataFromServer,
          setNodeData,
          colorBy,
          allowedMediaTypes,
        }}
      />
      <NodeTooltip nodeData={nodeData} />
    </>
  );
};

function Graph({
  is3d,
  graphDataFromServer,
  setNodeData,
  colorBy,
  allowedMediaTypes,
}) {
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

    onEngineStop: () =>
      fgRef.current && !is3d ? (fgRef.current as any).zoomToFit(400) : null,

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
            const mediaArr = getMediaArr(node);
            const first = mediaArr[0];
            if (!allowedMediaTypes.includes(first?.type)) {
              return null;
            }
            const imgSrc = first?.poster || first?.src;
            const imgTexture = new THREE.TextureLoader().load(imgSrc);
            const color = new THREE.Color(
              first?.type === "video" ? "hsl(10,100%,80%)" : "hsl(120,100%,80%)"
            );
            const material = new THREE.SpriteMaterial({
              map: imgTexture,
              color,
            });
            const sprite = new THREE.Sprite(material);
            const scaleDown = 0.3;
            const { h, w, d } = {
              h: first?.sizes.small.h * scaleDown,
              w: first?.sizes.small.w * scaleDown,
              d: 0,
            };
            sprite.scale.set(w, h, d);

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

      return scale(node.sentimentResult?.comparative) as string;

    default:
      return DEFAULT_NODE_COLOR;
  }
}
