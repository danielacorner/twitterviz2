import React, { useCallback, useRef, useEffect } from "react";
import {
  ForceGraph2D,
  ForceGraph3D,
  // ForceGraphVR,
  // ForceGraphAR,
} from "react-force-graph";
import NodeTooltip from "../NodeTooltip";
// https://www.npmjs.com/package/react-force-graph
import tweets from "../../tweets.json";
import {
  transformTweetsIntoGraphData,
  TransformedTweets,
} from "../../utils/transformData";
import { useWhyDidYouUpdate } from "use-why-did-you-update";
import styled from "styled-components/macro";
import { useWindowSize } from "../../utils/hooks";
import useStore, { GlobalStateStoreType, useTooltipNode } from "../../store";
import { isEqual } from "lodash";
import { Tweet } from "../../types";
import { getForceGraphProps } from "./graphConfig";
import { CONTROLS_WIDTH } from "../../utils/constants";

const transformedTweetsDefault = transformTweetsIntoGraphData(
  tweets as Tweet[]
);
console.log("🌟🚨: transformedTweetsDefault", transformedTweetsDefault);

const GraphStyles = styled.div`
  width: 100%;
`;

const NetworkGraph = ({ is3d, colorBy, allowedMediaTypes }) => {
  useWhyDidYouUpdate("NETWORKGRAPH", { is3d, colorBy });
  return (
    <GraphStyles>
      <Graph
        {...{
          is3d,
          colorBy,
          allowedMediaTypes,
        }}
      />
      <NodeTooltip />
    </GraphStyles>
  );
};

function Graph({ is3d, colorBy, allowedMediaTypes }) {
  const setTooltipNode = useStore(
    (state: GlobalStateStoreType) => state.setTooltipNode
  );
  const setSelectedNode = useStore(
    (state: GlobalStateStoreType) => state.setSelectedNode
  );

  const transformedTweets: TransformedTweets = useStore(
    (state) => transformTweetsIntoGraphData(state.tweetsFromServer),
    isEqual
  );
  useWhyDidYouUpdate("GRAPH", {
    is3d,
    setTooltipNode,
    setSelectedNode,
    transformedTweets,
  });

  const fgRef = useRef();

  const onNodeHover = useCallback(
    (node) => {
      if (node) {
        setTooltipNode(node);
      }
    },
    [setTooltipNode]
  );
  // on click, open the bottom drawer containing tweet info
  const onNodeClick = useCallback(
    (node) => {
      setSelectedNode(node);
      setTooltipNode(null);
    },
    [setSelectedNode, setTooltipNode]
  );

  const { width, height } = useWindowSize();

  const forceGraphProps = getForceGraphProps(
    width || window.innerWidth - CONTROLS_WIDTH,
    height,
    onNodeHover,
    onNodeClick,
    is3d,
    colorBy,
    fgRef,
    allowedMediaTypes
  )

  const { graph } = transformedTweets;
  const defaultGraph = transformedTweetsDefault.graph;

  return (
    <>
      {is3d ? (
        // https://www.npmjs.com/package/react-force-graph
        <ForceGraph3D
          ref={fgRef}
          graphData={graph.nodes.length > 0 ? graph : defaultGraph}
          {...forceGraphProps}
        />
      ) : (
        <ForceGraph2D
          ref={fgRef}
          graphData={graph.nodes.length > 0 ? graph : defaultGraph}
          {...forceGraphProps}
        />
      )}
    </>
  );
}

export default NetworkGraph;
