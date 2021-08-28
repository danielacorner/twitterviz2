import { useSphere } from "@react-three/cannon";
import * as THREE from "three";
import useStore, {
  isPointerOverAtom,
  isRightDrawerOpenAtom,
  numTooltipTweetsAtom,
  rightClickMenuAtom,
  scanningUserNodeIdAtom,
  tooltipTweetIndexAtom,
  useAreBotsLinedUp,
} from "providers/store/store";
import { useAtom } from "jotai";
import {
  useSetSelectedNode,
  useTooltipNode,
} from "providers/store/useSelectors";
import { UserNode } from "../../useUserNodes";
import { useHandleOpenRightClickMenu } from "../../GraphRightClickMenu";
import NodeBillboard from "./NodeBillboard";
import { useGravity } from "../useGravity";
import { useSpring, animated } from "@react-spring/three";
import { NodeBotScoreAntennae } from "./NodeBotScoreAntenna";
import {
  CONFIG_FADE_IN,
  NODE_RADIUS,
  NODE_RADIUS_COLLISION_MULTIPLIER,
  NODE_WIDTH,
} from "utils/constants";
import { ScoreIncreasedPopupText } from "./ScoreIncreasedPopupText";
import { useRef, useState } from "react";
import { ScanningAnimation } from "./ScanningAnimation";
import { MeshWobbleMaterial } from "@react-three/drei";
import { useControls } from "leva";
import { useMounted } from "utils/hooks";
import { randBetween } from "utils/utils";
import { useHoverAnimation } from "../useHoverAnimation";

const defaultNodeMaterial = new THREE.MeshPhysicalMaterial({
  emissive: "#0b152f",
  metalness: 0.97,
  transmission: 1,
  roughness: 0,
  envMapIntensity: 4,
  // color: "#316c83",
});
const opacityMaterial = new THREE.MeshPhysicalMaterial({
  emissive: "#0b152f",
  metalness: 0.97,
  transmission: 1,
  roughness: 0,
  envMapIntensity: 4,
  // color: "#316c83",
});
const rightClickNodeMaterial = new THREE.MeshPhysicalMaterial({
  // emissive: "#471111",
  metalness: -1,
  transmission: 1,
  roughness: 0,
  envMapIntensity: 4,
  // color: "#be5626",
});
const notABotMaterial = new THREE.MeshPhysicalMaterial({
  // emissive: "#471111",
  metalness: 0,
  transmission: 1,
  roughness: 0,
  envMapIntensity: 4,
  // color: "#be5626",
});
const pointerOverMaterial = new THREE.MeshPhysicalMaterial({
  // emissive: "#002741",
  metalness: 0.94,
  roughness: 0.1,
  transmission: 1,
  envMapIntensity: 4,
  // color: "#3ad64f",
});
const tooltipNodeMaterial = new THREE.MeshPhysicalMaterial({
  // emissive: "#002741",
  metalness: 1,
  roughness: 0.2,
  transmission: 1,
  envMapIntensity: 4,
  // color: "#26be3a",
});
const nodeGeometry = new THREE.SphereGeometry(NODE_RADIUS, 28, 28);

export const Node = ({
  vec = new THREE.Vector3(),
  node,
}: {
  vec?: any;
  node: UserNode;
}) => {
  // start at ("bubble up" or "emerge from") bottom center
  const spread = NODE_WIDTH * 2;
  const newX = 0;
  const newY = -NODE_WIDTH * 20;
  const newZ = 0;
  const x = randBetween(newX - spread, newX + spread);
  const y = randBetween(newY - spread, newY + spread);
  const z = randBetween(newZ - spread, newZ + spread);

  const startPosition = useRef([x, y, z]).current;
  const tooltipNode = useTooltipNode();

  const [scanningNodeId] = useAtom(scanningUserNodeIdAtom);
  const [rightClickMenu] = useAtom(rightClickMenuAtom);
  const isRightClickingThisNode = rightClickMenu.node
    ? rightClickMenu.node?.id_str === node.id_str
    : false;
  const isTooltipNode = tooltipNode
    ? tooltipNode?.id_str === node.id_str
    : false;
  const setTooltipNode = useStore((state) => state.setTooltipNode);
  const setSelectedNode = useSetSelectedNode();
  const [isPointerOver, setIsPointerOver] = useAtom(isPointerOverAtom);
  const [tooltipTweetIndex, setTooltipTweetIndex] = useAtom(
    tooltipTweetIndexAtom
  );
  const [, setIsRightDrawerOpen] = useAtom(isRightDrawerOpenAtom);
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
    const newSelectedNode = {
      ...node.tweets[0],
      user: node.user,
      id_str: node.user.id_str,
    };
    if (newSelectedNode.user) {
      setTimeout(() => {
        setSelectedNode(newSelectedNode);
        setIsRightDrawerOpen(true);
      });
    }
  };

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: startPosition as any,
    // position: getRandomPosition(-5 * RADIUS, 5 * RADIUS),
    // type: !paused ? "Dynamic" : "Static",
    // https://threejs.org/docs/scenes/geometry-browser.html#IcosahedronBufferGeometry
    args: NODE_RADIUS * NODE_RADIUS_COLLISION_MULTIPLIER,
  }));

  useGravity(api, vec);

  const mounted = useMounted();

  // hide nodes when the game ends
  const hide = (useAreBotsLinedUp() && !node.user.botScore) || !mounted;

  const isNotABot = node.user.isNotABot;

  const { scale2 } = useControls({ scale2: 1 });
  const scaleMult = isNotABot ? 0 : scale2;

  const isScanningNode = node.id_str === scanningNodeId;

  const springScale = useSpring({
    scale: hide
      ? [0, 0, 0]
      : isScanningNode || (isPointerOver && isTooltipNode)
      ? [2.2 * scaleMult, 2.2 * scaleMult, 2.2 * scaleMult]
      : isTooltipNode
      ? [1.8 * scaleMult, 1.8 * scaleMult, 1.8 * scaleMult]
      : [1 * scaleMult, 1 * scaleMult, 1 * scaleMult],
  });

  const [{ scale }, set] = useSpring(() => ({
    scale: isScanningNode ? [1.2, 1.2, 1.2] : [1, 1, 1],
    config: { mass: 3, friction: 40, tension: 800 },
  }));

  // TODO: check out name stays after submit

  const hasBotScore = Boolean(node.user.botScore);

  return (
    <animated.group scale={scale as any}>
      <animated.mesh renderOrder={2}>
        <animated.mesh
          ref={ref}
          scale={springScale.scale as any}
          {...(hasBotScore
            ? {}
            : {
                onPointerEnter,
                onPointerLeave,
                onContextMenu,
                onClick,
                onWheel: onScroll,
              })}
        >
          <NodeContent
            {...{
              node,
              isTooltipNode,
              isPointerOver,
              isScanningNode,
              isRightClickingThisNode,
            }}
          />
          {isScanningNode ? <ScanningAnimation /> : null}
        </animated.mesh>
      </animated.mesh>
    </animated.group>
  );
};
export function NodeContent({
  node,
  isTooltipNode,
  isPointerOver,
  isScanningNode,
  isRightClickingThisNode,
  forceOpaque = false,
  brightenBalls = false,
  isPopupNode = false,
}: {
  node: UserNode;
  isTooltipNode: boolean;
  isPointerOver: boolean;
  isScanningNode: boolean;
  isRightClickingThisNode: boolean;
  forceOpaque?: boolean;
  brightenBalls?: boolean;
  isPopupNode?: boolean;
}) {
  const hasBotScore = Boolean(node.user.botScore);
  const isNotABot = node.user.isNotABot;

  const [doneAnimating, setDoneAnimating] = useState(false);

  const material = isPopupNode
    ? defaultNodeMaterial
    : !doneAnimating
    ? opacityMaterial
    : isNotABot
    ? notABotMaterial
    : isScanningNode
    ? null
    : isRightClickingThisNode
    ? rightClickNodeMaterial
    : isPointerOver && isTooltipNode
    ? pointerOverMaterial
    : isTooltipNode
    ? tooltipNodeMaterial
    : defaultNodeMaterial;

  const mounted = useMounted();

  // fade in on mount
  const springProps = useSpring({
    opacity: mounted || isPopupNode ? 1 : 0,
    onRest() {
      setDoneAnimating(true);
    },
    config: CONFIG_FADE_IN,
    immediate: isPopupNode,
    clamp: true,
  });
  const hoverAnimationRef = useHoverAnimation({
    deltaX: 0.5,
    deltaY: 0.03,
    randomize: true,
  });

  // const { deltaX, deltaY } = useControls({ deltaX: 1, deltaY: 1 });
  const hoverAnimationRefWave = useHoverAnimation({
    deltaX: 0.7,
    deltaY: 0.7,
  });
  return (
    <>
      <animated.mesh ref={isPopupNode ? null : hoverAnimationRefWave}>
        <animated.mesh ref={isPopupNode ? null : hoverAnimationRef}>
          {isScanningNode ? null : (
            <animated.mesh
              {...(material ? { material } : {})}
              geometry={nodeGeometry}
              material-transparent={true}
              material-opacity={springProps.opacity}
            ></animated.mesh>
          )}
          {node.user.botScore ? (
            <>
              <NodeBotScoreAntennae
                {...{
                  botScore: node.user.botScore,
                  forceOpaque,
                  brightenBalls,
                }}
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
                node,
              }}
            />
          ) : null}
          {isScanningNode && <ScanningNodeAnimation />}
        </animated.mesh>
      </animated.mesh>
    </>
  );
}

function ScanningNodeAnimation() {
  return (
    <>
      <mesh geometry={nodeGeometry}>
        <MeshWobbleMaterial
          skinning={true}
          factor={20}
          speed={8}
          {...{
            metalness: 0.94,
            roughness: 0.1,
            color: "#1fd5db",
            transparent: true,
            opacity: 0.2,
          }}
        />
      </mesh>
    </>
  );
}
