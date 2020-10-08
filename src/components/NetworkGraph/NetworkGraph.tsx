import React, { useEffect, useState } from "react";
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
  useTooltipNode,
} from "../../providers/store";
import RightClickMenu from "../common/RightClickMenu";
import { Tweet } from "../../types";

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

NetworkGraph.whyDidYouRender = { logOnDifferentValues: true };

// https://github.com/vasturiano/react-force-graph

function Graph() {
  const recompute = useRecomputeGraph();
  const {
    fgRef,
    forceGraphProps,
    mousePosition,
    handleCloseMenu,
  } = useForceGraphProps();

  // dynamic force graph updates WITHOUT re-rendering every node example: https://github.com/vasturiano/react-force-graph/blob/master/example/dynamic/index.html

  const { graph: graphData } = useGraphData();
  const { replace } = useConfig();

  // New force graph nodes should be able to mount without causing all others to re-mount
  // But, for some reason, using graphData as ForceGraph props caused every node to re-render on every change of graphData.

  // Instead, it seems to work if we manually sync it to some state,
  // and use the setState (setGraph) callback function to update

  // sync internal state to prevent node re-renders
  const [graph, setGraph] = useState(graphData);
  // sync with store
  useEffect(() => {
    const nodeIds = graphData.nodes.map((node) => node.id);
    // spread existing nodes, and only spread new nodes on the end
    const newNodes = graphData.nodes.filter((node) =>
      nodeIds.includes(node.id)
    );

    // * consider spreading newLinks if not doing so causes a performance issue

    setGraph((prev) => ({
      ...prev,
      links: graphData.links,
      nodes: [...(replace ? [] : prev.nodes), ...newNodes],
    }));
  }, [graphData]);

  const { is3d, showUserNodes } = useConfig();
  const tooltipNode = useTooltipNode();
  const prevShowUserNodes = usePrevious(showUserNodes);
  useEffect(() => {
    if (showUserNodes !== prevShowUserNodes) {
      setTimeout(recompute);
    }
    // eslint-disable-next-line
  }, [showUserNodes]);

  //   // TODO
  // manipulate the force!
  // https://github.com/vasturiano/react-force-graph/blob/master/example/collision-detection/index.html
  // useEffect(() => {
  //   const fg = fgRef.current as any;
  //   if (!fg) {
  //     return;
  //   }

  //   // Deactivate existing forces
  //   // fg.d3Force("center", null);
  //   // fg.d3Force("charge", null);
  //   // fg.d3Force("link", null);
  //   // fg.d3Force("link", d3.forceLink(graphData.links).strength(1));

  //   // Add collision and bounding box forces
  //   // fg.d3Force('collide', d3.forceCollide(4));
  //   // fg.d3Force('box', () => {
  //   //   const SQUARE_HALF_SIDE = N * 2;

  //   //   graphData.nodes.forEach(node => {
  //   //     const x = node.x || 0, y = node.y || 0;

  //   //     // bounce on box walls
  //   //     if (Math.abs(x) > SQUARE_HALF_SIDE) { node.vx *= -1; }
  //   //     if (Math.abs(y) > SQUARE_HALF_SIDE) { node.vy *= -1; }
  //   //   });
  // });

  return (
    <>
      {is3d ? (
        // https://www.npmjs.com/package/react-force-graph
        <ForceGraph3D ref={fgRef} graphData={graph} {...forceGraphProps} />
      ) : (
        <ForceGraph2D ref={fgRef} graphData={graph} {...forceGraphProps} />
      )}
      <RightClickMenu
        {...{
          anchorEl: null,
          handleClose: handleCloseMenu,
          isMenuOpen: mousePosition.mouseY !== null,
          user: tooltipNode?.user,
          MenuProps: {
            keepMounted: true,
            anchorReference: "anchorPosition",
            anchorPosition:
              mousePosition.mouseY !== null && mousePosition.mouseX !== null
                ? { top: mousePosition.mouseY, left: mousePosition.mouseX }
                : undefined,
          },
        }}
      />
    </>
  );
}

Graph.whyDidYouRender = { logOnDifferentValues: true };

export default NetworkGraph;
