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
  CONFIG_POP_OUT,
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
import { randBetween, useMount } from "utils/utils";
import { useHoverAnimation } from "../useHoverAnimation";
import { useIsMounted } from "../useIsMounted";

const defaultNodeMaterial = new THREE.MeshPhysicalMaterial({
  emissive: "#0b152f",
  metalness: 0.4,
  transmission: 1,
  roughness: 0,
  envMapIntensity: 4,
  transparent: true,
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
  emissive: "#0b152f",
  metalness: 0.4,
  transmission: 1,
  roughness: 0,
  envMapIntensity: 4,
  transparent: true,
  // opacity: 0,
  // color: "#be5626",
});
const pointerOverMaterial = new THREE.MeshPhysicalMaterial({
  // emissive: "#002741",
  metalness: -1.5,
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
  const startPosition = getStartPosition();
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
  const shouldPop = true;
  // const shouldPop = useRef(Math.random() > 0.3);
  const scaleMult = isNotABot ? (shouldPop ? 2 : 0) : scale2;

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

  // TODO: check out name stays after submit

  const hasBotScore = Boolean(node.user.botScore);

  return (
    <animated.group>
      <animated.mesh renderOrder={2}>
        <animated.mesh
          ref={ref}
          scale={springScale.scale as any}
          // material-transparent={true}
          // material-opacity={springScale.opacity}
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
          {isNotABot && shouldPop && <PopAnimation />}
          {isScanningNode ? <ScanningAnimation /> : null}
        </animated.mesh>
      </animated.mesh>
    </animated.group>
  );
};
function PopAnimation() {
  const numBubbles = Math.round(Math.random() * 7) + 1;
  const [bubblesIds, setBubblesIds] = useState(
    [...new Array(numBubbles)].map((_) => Math.random())
  );
  return (
    <>
      {bubblesIds.map((bubbleId) => (
        <AnimatingBubble
          key={bubbleId}
          handleUnmount={() => {
            setBubblesIds((p) => p.filter((id) => id !== bubbleId));
          }}
        />
      ))}
    </>
  );
}
function getRandomPosition(min, max) {
  return [
    Math.random() * (max - min) + min,
    Math.random() * (max - min) + min,
    Math.random() * (max - min) + min,
  ];
}
const V1 = 0.001;
const BUBBLE_RADIUS_MULT = 0.2;
function AnimatingBubble({ handleUnmount }) {
  const [ref, api] = useSphere(() => ({
    mass: 0.07,
    position: getRandomPosition(-1.5 * NODE_RADIUS, 1.5 * NODE_RADIUS) as any,
    velocity: [
      0,
      // Math.random() * V1 - V1 / 2,
      Math.random() * V1,
      0,
      // Math.random() * V1 - V1 / 2,
    ],
    // onRest: handleUnmount,
  }));
  // useFrame(()=>{
  //   ref.current.velocity
  // })
  // usespring
  const [isOpaque, setIsOpaque] = useState(true);
  // useMount(() => {
  //   setIsOpaque(true);
  // });
  useMount(() => {
    window.setTimeout(() => {
      setIsOpaque(false);
    }, Math.random() * 300 + 100);
  });
  const { opacity } = useSpring({
    opacity: isOpaque ? 1 : 0,
    config: CONFIG_POP_OUT,
  });
  return (
    <mesh ref={ref} material={notABotMaterial}>
      <sphereBufferGeometry
        attach="geometry"
        args={[NODE_RADIUS * Math.random() * BUBBLE_RADIUS_MULT, 32, 32]}
      />
      <animated.meshPhysicalMaterial
        {...{
          metalness: 0.4,
          transmission: 1,
          roughness: 0,
          envMapIntensity: 4,
          transparent: true,
        }}
        opacity={opacity}
      />
    </mesh>
  );
}

/** start at ("bubble up" or "emerge from") bottom center  */
function getStartPosition() {
  // start position
  function addSpread(val: number, spread: number) {
    return randBetween(val - spread, val + spread);
  }
  const x = addSpread(0, NODE_WIDTH * 2);
  const y = addSpread(-NODE_WIDTH * 10, NODE_WIDTH * 4);
  const z = addSpread(0, NODE_WIDTH * 2);

  // const startPosition = useRef([x, y, z]).current;
  return [x, y, z];
}

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
  console.log("🌟🚨 ~ isNotABot", isNotABot);

  const [doneAnimating, setDoneAnimating] = useState(false);

  const material = isNotABot
    ? notABotMaterial
    : isPopupNode
    ? defaultNodeMaterial
    : !doneAnimating
    ? opacityMaterial
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
    opacity: isNotABot ? 0 : mounted || isPopupNode ? 1 : 0,
    onRest() {
      setDoneAnimating(true);
    },
    config: isNotABot ? CONFIG_POP_OUT : CONFIG_FADE_IN,
    immediate: isPopupNode,
    clamp: true,
  });
  // const hoverAnimationRef = useHoverAnimation({
  //   deltaX: 0.5,
  //   deltaY: 0.03,
  //   randomize: true,
  // });

  // const { deltaX, deltaY } = useControls({ deltaX: 1, deltaY: 1 });
  const hoverAnimationRefWave = useHoverAnimation({
    deltaX: 0.7,
    deltaY: 0.7,
    randomize: true,
  });
  const { metalness } = useControls({ metalness: 0 });
  return (
    <>
      <animated.mesh ref={isPopupNode ? null : hoverAnimationRefWave}>
        <animated.mesh ref={isPopupNode ? null : null}>
          {isScanningNode ? null : (
            <animated.mesh
              {...(material ? { material } : {})}
              geometry={nodeGeometry}
              material-transparent={true}
              material-opacity={springProps.opacity}
              // material-metalness={metalness}
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
