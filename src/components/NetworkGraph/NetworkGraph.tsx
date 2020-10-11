import React, { useEffect, useState } from "react";
import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import NodeTooltip from "../NodeTooltip";
// https://www.npmjs.com/package/react-force-graph
import styled from "styled-components/macro";
import { NODE_DIAMETER, useForceGraphProps } from "./useForceGraphProps";
import { useConfig, useTooltipNode, useTweets } from "../../providers/store";
import RightClickMenu from "../common/RightClickMenu";
// https://www.npmjs.com/package/d3-force-cluster
import { forceCluster } from "d3-force-cluster";
import { Tweet } from "../../types";
import { uniqBy } from "lodash";
import { EMPTY_TWEET } from "../../utils/emptyTweet";
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

// https://github.com/vasturiano/react-force-graph

function Graph() {
  const {
    fgRef,
    forceGraphProps,
    mousePosition,
    handleCloseMenu,
  } = useForceGraphProps();
  const { is3d, showUserNodes, replace } = useConfig();
  const tweets = useTweets();

  // dynamic force graph updates WITHOUT re-rendering every node example: https://github.com/vasturiano/react-force-graph/blob/master/example/dynamic/index.html

  // New force graph nodes should be able to mount without causing all others to re-mount
  // But, for some reason, using graphData as ForceGraph props caused every node to re-render on every change of graphData.

  // Instead, it seems to work if we manually sync it to some state,
  // and use the setState (setGraph) callback function to update

  // sync internal state to prevent node re-renders
  const [graph, setGraph] = useState({ nodes: [], links: [] });
  const [userNodes, setUserNodes] = useState([]);
  // cluster centers = user nodes
  const clusterCenters: { [userId: string]: Tweet } = userNodes.reduce(
    (acc, cur) =>
      // if we don't already have the user node, add it to the object
      ({ ...acc, [cur.user.screen_name]: cur }),
    // !(cur.user.id_str in acc) ? { ...acc, [cur.user.id_str]: cur } : acc,
    {}
  );
  console.log("🌟🚨: Graph -> userNodes", userNodes);
  console.log("🌟🚨: Graph -> clusterCenters", clusterCenters);

  //
  // show/hide user nodes
  //

  useEffect(() => {
    if (!showUserNodes) {
      setUserNodes([]);
      return;
    }

    const tweetsWithUser: Tweet[] = tweets
      // id <- +id_str
      .map((t) => ({ ...t, id: Number(t.id_str) }))
      .filter((t) => Boolean(t.user?.id_str));

    // add nodes for each user & links to their tweets

    const userLinks = ([] || tweetsWithUser).map((t) => ({
      // * for now, trying cluster force instead of link force
      // source: its user
      source: Number(t.user.id_str),
      // target: the tweet
      target: Number(t.id_str),
    }));

    const nonUniqueUserNodes: Tweet[] = tweets.map((tweet) => ({
      ...EMPTY_TWEET,
      id: Number(tweet.user.id_str),
      id_str: tweet.user.screen_name,
      user: tweet.user,
      isUserNode: true,
    }));

    // deduplicate
    const newUserNodes = uniqBy(nonUniqueUserNodes, (d) => d.user.screen_name);
    setUserNodes(newUserNodes);

    setGraph((prev) => {
      return {
        ...prev,
        links: [...userLinks],
        nodes: [...prev.nodes].filter((tweet) =>
          showUserNodes ? true : !tweet.isUserNode
        ),
      };
    });
  }, [showUserNodes, tweets]);

  //
  // sync graph with store
  //

  useEffect(() => {
    const tweetsWithUser: Tweet[] = tweets
      // id <- +id_str
      .map((t) => ({ ...t, id: Number(t.id_str) }))
      .filter((t) => Boolean(t.user?.id_str));
    // filter out tweets without users

    const nodeIds = graph.nodes.map((node) => node.id_str);
    console.log("🌟🚨: Graph -> graph.nodes", graph.nodes);

    // to prevent existing node re-renders, we'll spread existing nodes, and only spread new nodes on the end

    // new nodes are ones whose ids aren't already in the graph
    const newNodes = tweetsWithUser.filter(
      (node) => !nodeIds.includes(node.id_str)
    );
    console.log("🌟🚨: Graph -> newNodes", newNodes);

    // * consider spreading newLinks if not doing so causes a performance issue

    setGraph((prev) => {
      return {
        ...prev,
        links: [],
        nodes: [
          ...(replace
            ? []
            : prev.nodes) /* .filter(tweet=>showUserNodes?true:!tweet.isUserNode)*/,
          ...newNodes,
        ],
      };
    });
    // eslint-disable-next-line
  }, [tweets]);

  // TODO:
  //
  // use the force!
  //

  const fg = fgRef.current as any;

  useEffect(() => {
    // https://github.com/vasturiano/react-force-graph/blob/master/example/collision-detection/index.html
    // https://www.npmjs.com/package/d3-force-cluster

    if (!fg) {
      return;
    }

    // Deactivate existing forces
    // fg.d3Force("center", null);
    // fg.d3Force("charge", null);
    // fg.d3Force("link", null);

    // apply custom forces
    fg.d3Force("link", d3.forceLink(graph.links).strength(1));
    // https://www.npmjs.com/package/d3-force-cluster
    // https://bl.ocks.org/ericsoco/4e1b7b628771ae77753842e6dabfcef3
    // TODO: not working
    // fg.d3Force(
    //   "cluster",
    //   forceCluster()
    //     .centers(function (tweet: Tweet) {
    //       const center = clusterCenters[tweet.user.screen_name];
    //       return center;
    //     })
    //     .strength(0.2)
    //     .centerInertia(0.1)
    // );

    // Add collision and bounding box forces
    // fg.d3Force("collide", d3.forceCollide(NODE_DIAMETER / 2));
    // fg.d3Force("box", () => {
    //   const SQUARE_HALF_SIDE = window.innerWidth / 2;

    //   graph.nodes.forEach((node) => {
    //     const x = node.x || 0,
    //       y = node.y || 0;

    //     // bounce on box walls
    //     if (Math.abs(x) > SQUARE_HALF_SIDE) {
    //       node.vx *= -1;
    //     }
    //     if (Math.abs(y) > SQUARE_HALF_SIDE) {
    //       node.vy *= -1;
    //     }
    //   });
    // });
  }, [graph, userNodes, clusterCenters, fg]);

  const graphWithUsers = {
    ...graph,
    nodes: [...graph.nodes, ...(showUserNodes ? userNodes : [])],
  };
  console.log("🌟🚨: Graph -> graphWithUsers", graphWithUsers);

  return (
    <>
      {is3d ? (
        // https://www.npmjs.com/package/react-force-graph
        <ForceGraph3D
          ref={fgRef}
          graphData={graphWithUsers}
          {...forceGraphProps}
        />
      ) : (
        <ForceGraph2D
          ref={fgRef}
          graphData={graphWithUsers}
          {...forceGraphProps}
        />
      )}
      <GraphRightClickMenu {...{ mousePosition, handleCloseMenu }} />
    </>
  );
}

function GraphRightClickMenu({ mousePosition, handleCloseMenu }) {
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
