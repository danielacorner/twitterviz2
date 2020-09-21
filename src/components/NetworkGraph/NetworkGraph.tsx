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
