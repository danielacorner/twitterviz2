import React, { useEffect, useState } from "react";
import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import NodeTooltip from "../NodeTooltip";
// https://www.npmjs.com/package/react-force-graph
import styled from "styled-components/macro";
import { NODE_DIAMETER, useForceGraphProps } from "./useForceGraphProps";
import {
  useConfig,
  useLikesByUserId,
  useRetweetsByTweetId,
  useTweets,
} from "../../providers/store";
// https://www.npmjs.com/package/d3-force-cluster
import { Tweet } from "../../types";
import { uniqBy } from "lodash";
import { EMPTY_TWEET } from "../../utils/emptyTweet";
import * as d3 from "d3";
import GraphRightClickMenu from "./GraphRightClickMenu";

const GraphStyles = styled.div`
  width: 100%;
`;

const NetworkGraph = () => {
  return (
    <GraphStyles>
      <Graph />
      <NodeTooltip />
      <GraphRightClickMenu />
    </GraphStyles>
  );
};

// https://github.com/vasturiano/react-force-graph
function Graph() {
  const { fgRef, forceGraphProps } = useForceGraphProps();
  const { is3d, showUserNodes, replace, isGridMode } = useConfig();
  const tweets = useTweets();
  console.log("🌟🚨: Graph -> tweets", tweets);

  // dynamic force graph updates WITHOUT re-rendering every node example: https://github.com/vasturiano/react-force-graph/blob/master/example/dynamic/index.html

  // New force graph nodes should be able to mount without causing all others to re-mount
  // But, for some reason, using graphData as ForceGraph props caused every node to re-render on every change of graphData.

  // Instead, it seems to work if we manually sync it to some state,
  // and use the setState (setGraph) callback function to update

  // sync internal state to prevent node re-renders
  const [graph, setGraph] = useState({ nodes: [], links: [] });
  const [userNodes, setUserNodes] = useState([] as Tweet[]);
  const likesByUserId = useLikesByUserId();
  const retweetsByTweetId = useRetweetsByTweetId();
  const userToLikesLinks = showUserNodes
    ? userNodes.reduce((acc, userNode) => {
        const userLikes = likesByUserId[userNode.id_str];
        if (userLikes) {
          const likedTweetLinks = userLikes.map((likedTweetId) => {
            const source = Number(likedTweetId);
            const target = Number(userNode.id_str);
            return { source, target };
          });
          return [...acc, ...likedTweetLinks];
        } else {
          return acc;
        }
      }, [])
    : [];

  const userToRetweetsLinks = showUserNodes
    ? tweets.reduce((acc, tweet) => {
        const tweetRetweets = retweetsByTweetId[tweet.id_str];
        if (tweetRetweets) {
          const retweetedTweetLinks = tweetRetweets.map((retweetedTweetId) => {
            const source = Number(retweetedTweetId);
            const target = Number(tweet.id_str);
            return { source, target };
          });
          return [...acc, ...retweetedTweetLinks];
        } else {
          return acc;
        }
      }, [])
    : [];

  const tweetToRetweetsLinks = [];

  const graphWithUsers = {
    ...graph,
    nodes: [...graph.nodes, ...(showUserNodes ? userNodes : [])],
    links: [
      ...graph.links,
      ...(showUserNodes
        ? [
            // links from each user to their tweets
            ...tweets.map((t) => ({
              // source: its user
              source: Number(t.user.id_str),
              // target: the tweet
              target: Number(t.id_str),
            })),
            // links from each user to their likes
            ...userToLikesLinks,
            ...userToRetweetsLinks,
            ...tweetToRetweetsLinks,
          ]
        : []),
    ],
  };

  //
  // show/hide user nodes
  //

  useEffect(() => {
    if (!showUserNodes) {
      setUserNodes([]);
    } else {
      // add nodes for each user

      const nonUniqueUserNodes: Tweet[] = tweets.map((tweet) => ({
        ...EMPTY_TWEET,
        id: Number(tweet.user.id_str),
        id_str: tweet.user.id_str,
        user: tweet.user,
        isUserNode: true,
      }));

      // deduplicate
      const newUserNodes = uniqBy(nonUniqueUserNodes, (d) => d.user.id_str);
      setUserNodes(newUserNodes);
    }
  }, [showUserNodes, tweets]);

  //
  // sync graph with store
  //

  useEffect(() => {
    const tweetsWithUser: Tweet[] = tweets
      // id <- +id_str
      .map((t) => ({
        ...t,
        id: Number(t.id_str),
      }))
      .filter((t) => Boolean(t.user?.id_str));
    // filter out tweets without users

    const nodeIds = graph.nodes.map((node) => node.id_str);

    // to prevent existing node re-renders, we'll spread existing nodes, and only spread new nodes on the end

    // new nodes are ones whose ids aren't already in the graph
    const newNodes = tweetsWithUser.filter(
      (node) => !nodeIds.includes(node.id_str)
    );

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

  const fg = fgRef.current as any;

  //
  // use the force!
  //
  useTheForce(fg, showUserNodes, graph, isGridMode);

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
    </>
  );
}

export default NetworkGraph;

function useTheForce(
  fg: any,
  showUserNodes: boolean,
  graph: { nodes: any[]; links: any[] },
  isGridMode: boolean
) {
  useEffect(() => {
    if (!fg) {
      return;
    }

    // Deactivate existing forces
    // fg.d3Force("center", d3.forceCenter());
    // fg.d3Force("gravity", d3.forceManyBody().strength(10));

    // position each node in a (square?) grid
    // order from top-left, rightwards
    const gridColumnWidth = 100;

    if (isGridMode) {
      fg.d3Force("gravity", null);
      fg.d3Force("charge", null);
      fg.d3Force("link", null);
      fg.d3Force(
        "forceX",
        d3
          .forceX((node, idx, allNodes) => {
            // each node goes to the right
            const numNodesAcross = Math.floor(allNodes.length ** 0.5);
            const gridColumn = idx % numNodesAcross;

            // const randomNumberNear1 = 1.01 - 0.05 * Math.random();
            const randomNumberNear1 = 1;

            return (
              -0.5 * gridColumnWidth +
              gridColumn * gridColumnWidth * randomNumberNear1
            );
          })
          .strength(0.6)
      );
      fg.d3Force(
        "forceY",
        d3
          .forceY((node, idx, allNodes) => {
            // each node goes in its column
            const numNodesAcross = Math.floor(allNodes.length ** 0.5);
            const gridRow = Math.floor(idx / numNodesAcross);

            // const randomNumberNear1 = 1.01 - 0.05 * Math.random();
            const randomNumberNear1 = 1;

            return (
              -0.5 * gridColumnWidth +
              gridRow * gridColumnWidth * randomNumberNear1
            );
          })
          .strength(0.6)
      );
    } else {
      // disable positioning forces
      fg.d3Force("forceY", null);
      fg.d3Force("forceX", null);

      // gravitate nodes together
      fg.d3Force(
        "gravity",
        d3
          .forceManyBody()
          .strength(10)
          // turn off gravity when nodes get close enough together
          .distanceMin(NODE_DIAMETER * 5)
      );

      // repel nodes from each other
      fg.d3Force(
        "charge",
        d3
          .forceManyBody()
          .strength(-500)
          // .strength((node) => ((node as Tweet).isUserNode ? -360 : -30))
          // max distance to push other nodes away
          .distanceMax(NODE_DIAMETER * (showUserNodes ? 10 : 5))
      );

      // fg.d3Force(
      //   "gravity",
      //   d3.forceManyBody().strength(showUserNodes ? 120 : 0)
      //   // max distance to push other nodes away
      //   // .distanceMax(NODE_DIAMETER * 2)
      // );

      // fg.d3Force("collide", d3.forceCollide(NODE_DIAMETER));
      // fg.d3Force("link", null);
      // apply custom forces
      fg.d3Force(
        "link",
        d3
          .forceLink(graph.links)
          .strength(0.2)
          .distance((link, idx, links) => {
            return (
              NODE_DIAMETER *
              1.25 *
              (link.source.isLikedNode
                ? 15
                : link.source.isRetweetNode
                ? 30
                : 1)
            );
          })
      );

      // fg.d3Force("pullTogether", d3.forceManyBody().strength(400));

      // setTimeout(() => {
      //   fg.d3Force("pullTogether", null);
      // }, 250);

      // gravitate all towards each other
      // fg.d3Force("gravity", d3.forceManyBody().strength(140));

      // spring all to center, then stop
      // fg.d3Force("forceY", d3.forceY(0).strength(0.1));
      // fg.d3Force("forceX", d3.forceX(0).strength(0.1));
      // setTimeout(() => {
      // fg.d3Force("gravity", null);
      //   fg.d3Force("forceY", null);
      //   fg.d3Force("forceX", null);
      // }, 250);
    }

    // https://github.com/vasturiano/react-force-graph/blob/master/example/collision-detection/index.html
    // https://www.npmjs.com/package/d3-force-cluster
    // https://bl.ocks.org/ericsoco/4e1b7b628771ae77753842e6dabfcef3
    // cluster centers = user nodes
    // const clusterCenters: { [userId: string]: Tweet } = userNodes.reduce(
    //   (acc, cur) =>
    //     // if we don't already have the user node, add it to the object
    //     ({ ...acc, [cur.user.id_str]: cur }),
    //   // !(cur.user.id_str in acc) ? { ...acc, [cur.user.id_str]: cur } : acc,
    //   {}
    // );
    // fg.d3Force("cluster", (alpha) => {
    //   graphWithUsers.nodes.forEach(function (d) {
    //     const cluster = clusterCenters[d.cluster] as any;
    //     if (!cluster || cluster.id_str === d.id_str) {
    //       return;
    //     }
    //     let x = d.x - (cluster.x || 0),
    //       y = d.y - (cluster.y || 0),
    //       l = Math.sqrt(x * x + y * y),
    //       r = NODE_DIAMETER / 2;
    //     // r = d.radius + cluster.radius;
    //     if (l != r) {
    //       l = (l - r) / (l * alpha ** 0.1);
    //       d.x -= x *= l;
    //       d.y -= y *= l;
    //       cluster.x += x;
    //       cluster.y += y;
    //     }
    //   });
    // });
    // fg.d3Force("box", () => {
    //   const SQUARE_HALF_SIDE = (window.innerWidth - CONTROLS_WIDTH) / 2;
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
  }, [graph, fg, isGridMode, showUserNodes]);
}
