import React from "react";
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
import { useConfig, useGraphData } from "../../providers/store";

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
  const { fgRef, forceGraphProps } = useForceGraphProps();
  const { graph: graphData } = useGraphData();
  const { is3d } = useConfig();
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
