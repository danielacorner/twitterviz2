import React, { useCallback, useRef } from "react";
import {
  ForceGraph2D,
  ForceGraph3D,
  // ForceGraphVR,
  // ForceGraphAR,
} from "react-force-graph";
import NodeTooltip from "../NodeTooltip";
// https://www.npmjs.com/package/react-force-graph
import styled from "styled-components/macro";
import { useWindowSize } from "../../utils/hooks";
import {
  useConfig,
  useGraphData,
  useSetTooltipNode,
  useSetSelectedNode,
} from "../../providers/store";
import { getForceGraphProps } from "./graphConfig";
import { CONTROLS_WIDTH } from "../../utils/constants";

const GraphStyles = styled.div`
  width: 100%;
`;

const NetworkGraph = () => {
  return (
    <GraphStyles>
      <Graph />
      <NodeTooltip />
    </GraphStyles>
  );
};

function Graph() {
  const { is3d, colorBy, allowedMediaTypes } = useConfig();

  const setTooltipNode = useSetTooltipNode();
  const setSelectedNode = useSetSelectedNode();
  const { graph } = useGraphData();

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

  const onBackgroundClick = () => {
    setSelectedNode(null);
    setTooltipNode(null);
  };

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

  return (
    <>
      {is3d ? (
        // https://www.npmjs.com/package/react-force-graph
        <ForceGraph3D
          ref={fgRef}
          graphData={graph}
          {...forceGraphProps}
          onBackgroundClick={onBackgroundClick}
        />
      ) : (
        <ForceGraph2D
          ref={fgRef}
          graphData={graph}
          {...forceGraphProps}
          onBackgroundClick={onBackgroundClick}
        />
      )}
    </>
  );
}

export default NetworkGraph;
