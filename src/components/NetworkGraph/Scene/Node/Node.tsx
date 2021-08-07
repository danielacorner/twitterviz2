import { useSphere } from "@react-three/cannon";
import * as THREE from "three";
import useStore, {
  isPointerOverAtom,
  numTooltipTweetsAtom,
  rightClickMenuAtom,
  tooltipTweetIndexAtom,
  useAreBotsLinedUp,
} from "providers/store/store";
import { useAtom } from "jotai";
import {
  getOriginalPoster,
  useSetSelectedNode,
  useTooltipNode,
  useTweets,
} from "providers/store/useSelectors";
import { UserNode } from "../../useGraphWithUsersAndLinks";
import { useHandleOpenRightClickMenu } from "../../GraphRightClickMenu";
import NodeBillboard from "./NodeBillboard";
import { useGravity } from "../useGravity";
import { useSpring, animated } from "@react-spring/three";
import { NodeBotScoreAntenna } from "./NodeBotScoreAntenna";
import { NODE_RADIUS } from "utils/constants";
import { ScoreIncreasedPopupText } from "./ScoreIncreasedPopupText";
import { useState } from "react";
import { useMount } from "utils/utils";

export const NODE_RADIUS_COLLISION_MULTIPLIER = 3;

const nodeMaterial = new THREE.MeshPhysicalMaterial({
  emissive: "#0b152f",
  metalness: 0.97,
  roughness: 0.15,
  // color: "#316c83",
});
const rightClickNodeMaterial = new THREE.MeshPhysicalMaterial({
  emissive: "#471111",
  metalness: -1,
  roughness: 0.18,
  // color: "#be5626",
});
const pointerOverMaterial = new THREE.MeshPhysicalMaterial({
  emissive: "#002741",
  metalness: 0.94,
  roughness: 0.1,
  // color: "#3ad64f",
});
const tooltipNodeMaterial = new THREE.MeshPhysicalMaterial({
  emissive: "#002741",
  metalness: 1,
  roughness: 0.2,
  // color: "#26be3a",
});
const nodeGeometry = new THREE.SphereGeometry(NODE_RADIUS, 28, 28);

export const Node = ({
  vec = new THREE.Vector3(),
  node,
  startPosition,
}: {
  vec?: any;
  node: UserNode;
  startPosition: [number, number, number];
}) => {
  const tooltipNode = useTooltipNode();

  const [rightClickMenu] = useAtom(rightClickMenuAtom);
  const isRightClickingThisNode = rightClickMenu.node
    ? getOriginalPoster(rightClickMenu.node)?.id_str === node.id_str
    : false;
  const isTooltipNode = tooltipNode
    ? getOriginalPoster(tooltipNode)?.id_str === node.id_str
    : false;
  const setTooltipNode = useStore((state) => state.setTooltipNode);
  const setSelectedNode = useSetSelectedNode();
  const [isPointerOver, setIsPointerOver] = useAtom(isPointerOverAtom);
  const [tooltipTweetIndex, setTooltipTweetIndex] = useAtom(
    tooltipTweetIndexAtom
  );
  const [, setNumTooltipTweets] = useAtom(numTooltipTweetsAtom);

  const handleRightClick = useHandleOpenRightClickMenu(node.tweets[0]);
  const onContextMenu = (event) => {
    handleRightClick(event.nativeEvent);
  };
  const onPointerEnter = () => {
    setIsPointerOver(true);
    setTooltipTweetIndex(0);
    setNumTooltipTweets(node.tweets.length);
    setTooltipNode(node.tweets[0]);
  };
  const onScroll = (event) => {
    event.stopPropagation();
    event.nativeEvent.stopPropagation();
    event.nativeEvent.preventDefault();
    const isDown = event.deltaY > 0;
    const nextTooltipTweetIdx = Math.max(
      0,
      Math.min(tooltipTweetIndex + (isDown ? 1 : -1), node.tweets.length - 1)
    );
    setTooltipTweetIndex(nextTooltipTweetIdx);
    setTooltipNode(node.tweets[nextTooltipTweetIdx]);
  };
  const onPointerLeave = () => {
    setIsPointerOver(false);
  };
  const onClick = () => {
    setSelectedNode(node.tweets[tooltipTweetIndex]);
  };

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: startPosition,
    // position: getRandomPosition(-5 * RADIUS, 5 * RADIUS),
    // type: !paused ? "Dynamic" : "Static",
    // https://threejs.org/docs/scenes/geometry-browser.html#IcosahedronBufferGeometry
    args: NODE_RADIUS * NODE_RADIUS_COLLISION_MULTIPLIER,
  }));

  useGravity(api, vec);

  const [mounted, setMounted] = useState(false);
  useMount(() => {
    setMounted(true);
  });

  // hide nodes when the game ends
  const hide = (useAreBotsLinedUp() && !node.user.botScore) || !mounted;

  const springProps = useSpring({
    scale: hide
      ? [0, 0, 0]
      : isPointerOver && isTooltipNode
      ? [2.2, 2.2, 2.2]
      : isTooltipNode
      ? [1.8, 1.8, 1.8]
      : [1, 1, 1],
  });
  return (
    <animated.mesh
      ref={ref}
      scale={springProps.scale}
      {...{
        onPointerEnter,
        onPointerLeave,
        onContextMenu,
        onWheel: onScroll,
        onClick,
      }}
    >
      <NodeContent
        {...{
          node,
          isTooltipNode,
          isPointerOver,
          isRightClickingThisNode,
        }}
      />
    </animated.mesh>
  );
};

export function NodeContent({
  node,
  isTooltipNode,
  isPointerOver,
  isRightClickingThisNode,
  forceOpaque = false,
}: {
  node: UserNode;
  isTooltipNode: boolean;
  isPointerOver: boolean;
  isRightClickingThisNode: boolean;
  forceOpaque?: boolean;
}) {
  const tweets = useTweets();
  const allTweetsByUser = tweets.filter((t) => t.user.id === node.user.id);
  const hasBotScore = Boolean(node.user.botScore);
  const material = isRightClickingThisNode
    ? rightClickNodeMaterial
    : isPointerOver && isTooltipNode
    ? pointerOverMaterial
    : isTooltipNode
    ? tooltipNodeMaterial
    : nodeMaterial;

  return (
    <>
      <mesh material={material} geometry={nodeGeometry}></mesh>

      {node.user.botScore ? (
        <>
          <NodeBotScoreAntenna
            {...{ botScore: node.user.botScore, forceOpaque }}
          />
          <ScoreIncreasedPopupText
            isMounted={hasBotScore}
            {...{ botScore: node.user.botScore }}
          />
        </>
      ) : null}
      {node ? (
        <NodeBillboard
          {...{
            tweets: allTweetsByUser,
            hasBotScore,
          }}
        />
      ) : null}
    </>
  );
}
