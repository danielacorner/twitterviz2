import React, { useEffect } from "react";
import {
  ForceGraph2D,
  ForceGraph3D,
  // ForceGraphVR,
  // ForceGraphAR,
} from "react-force-graph";
import NodeTooltip from "../NodeTooltip";
// https://www.npmjs.com/package/react-force-graph
import styled from "styled-components/macro";
import { useForceGraphProps } from "./useForceGraphProps";
import {
  useConfig,
  useGraphData,
  useRecomputeGraph,
  usePrevious,
} from "../../providers/store";
import * as d3 from "d3";

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
  const recompute = useRecomputeGraph();

  const { fgRef, forceGraphProps } = useForceGraphProps();
  const { graph: graphData } = useGraphData();
  const { is3d, showUserNodes } = useConfig();
  const prevShowUserNodes = usePrevious(showUserNodes);
  useEffect(() => {
    if (showUserNodes !== prevShowUserNodes) {
      setTimeout(recompute);
    }
    // eslint-disable-next-line
  }, [showUserNodes]);

  // manipulate the force!
  // https://github.com/vasturiano/react-force-graph/blob/master/example/collision-detection/index.html
  useEffect(() => {
    const fg = fgRef.current as any;
    if (!fg) {
      return;
    }

    // Deactivate existing forces
    // fg.d3Force("center", null);
    // fg.d3Force("charge", null);
    // fg.d3Force("link", null);
    // fg.d3Force("link", d3.forceLink(graphData.links).strength(1));

    // Add collision and bounding box forces
    // fg.d3Force('collide', d3.forceCollide(4));
    // fg.d3Force('box', () => {
    //   const SQUARE_HALF_SIDE = N * 2;

    //   graphData.nodes.forEach(node => {
    //     const x = node.x || 0, y = node.y || 0;

    //     // bounce on box walls
    //     if (Math.abs(x) > SQUARE_HALF_SIDE) { node.vx *= -1; }
    //     if (Math.abs(y) > SQUARE_HALF_SIDE) { node.vy *= -1; }
    //   });
  });

  return (
    <>
      {is3d ? (
        // https://www.npmjs.com/package/react-force-graph
        <ForceGraph3D ref={fgRef} graphData={graphData} {...forceGraphProps} />
      ) : (
        <ForceGraph2D ref={fgRef} graphData={graphData} {...forceGraphProps} />
      )}
    </>
  );
}

export default NetworkGraph;
