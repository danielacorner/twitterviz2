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
  useTooltipNode,
} from "providers/store/useSelectors";
import { UserNode } from "../useGraphWithUsersAndLinks";
import { useHandleOpenRightClickMenu } from "../GraphRightClickMenu";
import NodeBillboard from "./NodeBillboard";
import { useGravity } from "./useGravity";
import { useSpring, animated } from "@react-spring/three";
import { NodeBotScoreAntenna } from "./NodeBotScoreAntenna";
import { NODE_RADIUS } from "utils/constants";
import { useEffect, useState } from "react";
import { Text } from "@react-three/drei";
import { getScoreFromBotScore } from "components/Game/getScoreFromBotScore";

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
  const isRightClickingThisNode =
    rightClickMenu.node &&
    getOriginalPoster(rightClickMenu.node)?.id_str === node.id_str;
  const isTooltipNode =
    tooltipNode && getOriginalPoster(tooltipNode)?.id_str === node.id_str;
  const setTooltipNode = useStore((state) => state.setTooltipNode);
  const setSelectedNode = useStore((state) => state.setSelectedNode);
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
    args: NODE_RADIUS * 5,
  }));

  useGravity(api, vec);

  // hide nodes when the game ends
  const hide = useAreBotsLinedUp() && !node.user.botScore;

  const springProps = useSpring({
    scale: hide
      ? [0, 0, 0]
      : isPointerOver && isTooltipNode
      ? [2.2, 2.2, 2.2]
      : isTooltipNode
      ? [1.8, 1.8, 1.8]
      : [1, 1, 1],
  });

  const [hasBotScore, setHasBotScore] = useState(false);
  useEffect(() => {
    if (node.user.botScore && !hasBotScore) {
      setHasBotScore(true);
    }
  }, [node.user.botScore, hasBotScore]);

  return (
    <animated.mesh
      ref={ref}
      material={
        isRightClickingThisNode
          ? rightClickNodeMaterial
          : isPointerOver && isTooltipNode
          ? pointerOverMaterial
          : isTooltipNode
          ? tooltipNodeMaterial
          : nodeMaterial
      }
      geometry={nodeGeometry}
      scale={springProps.scale}
      {...{
        onPointerEnter,
        onPointerLeave,
        onContextMenu,
        onWheel: onScroll,
        onClick,
      }}
    >
      {node.user.botScore ? (
        <>
          <NodeBotScoreAntenna {...{ botScore: node.user.botScore }} />
          <BotScorePopup
            isMounted={hasBotScore}
            {...{ botScore: node.user.botScore }}
          />
        </>
      ) : null}
      <NodeBillboard
        {...{
          tweets: node.tweets,
          hasBotScore: Boolean(node.user.botScore),
        }}
      />
    </animated.mesh>
  );
};

function BotScorePopup({ isMounted, botScore }) {
  const { scoreIncrease, scorePercent } = getScoreFromBotScore(botScore);
  const maxHue = 120;
  const minHue = 30;
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const springProps = useSpring({
    color: `hsl(${(maxHue - minHue) * scorePercent},80%,60%)`,
    position: [0, isMounted ? 11 : 0, 0],
    opacity: isAnimationComplete ? 0 : isMounted ? 1 : 0,
    delay: 200,
    onRest: () => {
      if (!isAnimationComplete) {
        setIsAnimationComplete(true);
      }
    },
  });
  return (
    <animated.mesh position={springProps.position} transparent={true}>
      <AnimatedText
        {...({} as any)}
        color={springProps.color}
        textAlign={"center"}
        anchorY={"top"}
        maxWidth={0.5}
        fontSize={2}
        fillOpacity={springProps.opacity}
      >
        +{scoreIncrease.toFixed(0)}
      </AnimatedText>
    </animated.mesh>
  );
}
const AnimatedText = animated(Text);
