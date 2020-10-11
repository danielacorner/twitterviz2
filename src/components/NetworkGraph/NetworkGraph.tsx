import React, { useEffect, useMemo, useState } from "react";
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
  useRecomputeGraph,
  usePrevious,
  useTooltipNode,
  useTweets,
} from "../../providers/store";
import RightClickMenu from "../common/RightClickMenu";
// https://www.npmjs.com/package/d3-force-cluster
import { forceCluster } from "d3-force-cluster";
import { Tweet } from "../../types";
import { transformTweetsIntoGraphData } from "../../utils/transformData";

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

// https://github.com/vasturiano/react-force-graph

function Graph() {
  const recompute = useRecomputeGraph();
  const { fgRef, forceGraphProps } = useForceGraphProps();
  const { is3d, showUserNodes, replace } = useConfig();
  const tweets = useTweets();
  const { graph: graphData } = useMemo(
    () => transformTweetsIntoGraphData(tweets, showUserNodes),
    [tweets, showUserNodes]
  );

  // dynamic force graph updates WITHOUT re-rendering every node example: https://github.com/vasturiano/react-force-graph/blob/master/example/dynamic/index.html

  console.log("🌟🚨: Graph -> graphData", graphData);

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
    // eslint-disable-next-line
  }, [graphData]);

  const prevShowUserNodes = usePrevious(showUserNodes);
  useEffect(() => {
    if (showUserNodes !== prevShowUserNodes) {
      setTimeout(recompute);
    }
    // eslint-disable-next-line
  }, [showUserNodes]);

  // TODO:
  // manipulate the force!
  // https://github.com/vasturiano/react-force-graph/blob/master/example/collision-detection/index.html
  // https://www.npmjs.com/package/d3-force-cluster
  useEffect(() => {
    const fg = fgRef.current as any;
    if (!fg) {
      return;
    }

    // cluster centers = user nodes
    const clusterCenters: { [userId: string]: Tweet } = graphData.nodes.reduce(
      (acc, cur) =>
        // if we don't already have the user node, add it to the object
        cur.isUserNode && !(cur.user.id_str in acc)
          ? { ...acc, [cur.user.id_str]: cur }
          : acc,
      {}
    );

    // Deactivate existing forces
    // fg.d3Force("center", null);
    // fg.d3Force("charge", null);
    // fg.d3Force("link", null);

    // apply custom forces
    // fg.d3Force("link", d3.forceLink(graphData.links).strength(1));
    // https://www.npmjs.com/package/d3-force-cluster
    // https://bl.ocks.org/ericsoco/4e1b7b628771ae77753842e6dabfcef3
    fg.d3Force(
      "cluster",
      forceCluster()
        .centers(function (d) {
          return clusterCenters[d.user.id_str];
        })
        .strength(0.2)
        .centerInertia(0.1)
    );

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
        <ForceGraph3D ref={fgRef} graphData={graph} {...forceGraphProps} />
      ) : (
        <ForceGraph2D ref={fgRef} graphData={graph} {...forceGraphProps} />
      )}
      <GraphRightClickMenu />
    </>
  );
}

function GraphRightClickMenu() {
  const { mousePosition, handleCloseMenu } = useForceGraphProps();

  const tooltipNode = useTooltipNode();

  return (
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
  );
}

export default NetworkGraph;
