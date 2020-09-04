import React, { useCallback, useRef } from "react";
import {
  ForceGraph2D,
  ForceGraph3D,
  // ForceGraphVR,
  // ForceGraphAR,
} from "react-force-graph";
import NodeTooltip from "../NodeTooltip";
// https://www.npmjs.com/package/react-force-graph
import { TransformedTweets } from "../../utils/transformData";
import { useWhyDidYouUpdate } from "use-why-did-you-update";
import styled from "styled-components/macro";
import { useWindowSize } from "../../utils/hooks";
import useStore, { GlobalStateStoreType } from "../../providers/store";
import { isEqual } from "lodash";
import { getForceGraphProps } from "./graphConfig";
import { CONTROLS_WIDTH } from "../../utils/constants";

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
    (state) => state.transformedTweets,
    isEqual
  );
  useWhyDidYouUpdate("GRAPH", {
    is3d,
    setTooltipNode,
    transformedTweets,
    setSelectedNode,
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
    },
    [setSelectedNode]
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
  );

  const { graph } = transformedTweets;

  return (
    <>
      {is3d ? (
        // https://www.npmjs.com/package/react-force-graph
        <ForceGraph3D ref={fgRef} graphData={graph} {...forceGraphProps} />
      ) : (
        <ForceGraph2D ref={fgRef} graphData={graph} {...forceGraphProps} />
      )}
    </>
  );
}

export default NetworkGraph;
