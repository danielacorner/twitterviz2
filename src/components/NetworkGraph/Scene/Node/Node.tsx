import { useSphere } from "@react-three/cannon";
import * as THREE from "three";
import useStore, {
  isPointerOverAtom,
  isRightDrawerOpenAtom,
  numTooltipTweetsAtom,
  rightClickMenuAtom,
  scanningNodeIdAtom,
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
import { NodeBotScoreAntenna } from "./NodeBotScoreAntenna";
import { NODE_RADIUS } from "utils/constants";
import { ScoreIncreasedPopupText } from "./ScoreIncreasedPopupText";
import { useState } from "react";
import { useMount } from "utils/utils";
import { ScanningAnimation } from "./ScanningAnimation";
import { MeshWobbleMaterial } from "@react-three/drei";

export const NODE_RADIUS_COLLISION_MULTIPLIER = 2.5;

const defaultNodeMaterial = new THREE.MeshPhysicalMaterial({
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
  startPosition,
}: {
  vec?: any;
  node: UserNode;
  startPosition: [number, number, number];
}) => {
  const tooltipNode = useTooltipNode();

  const [scanningNodeId] = useAtom(scanningNodeIdAtom);
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

  const isNotABot = node.user.isNotABot;

  const scaleMult = isNotABot ? 0 : 1;

  const isScanningNode = scanningNodeId === node.id_str;

  const springScale = useSpring({
    scale: hide
      ? [0, 0, 0]
      : isScanningNode || (isPointerOver && isTooltipNode)
      ? [2.2 * scaleMult, 2.2 * scaleMult, 2.2 * scaleMult]
      : isTooltipNode
      ? [1.8 * scaleMult, 1.8 * scaleMult, 1.8 * scaleMult]
      : [1 * scaleMult, 1 * scaleMult, 1 * scaleMult],
  });

  // -- drag to change position --

  // https://codesandbox.io/s/react-three-fiber-gestures-forked-qi8xq?file=/src/App.js:351-672

  // Set up a spring with values we're going to modify
  const [{ rotation, ...rest }, set] = useSpring(() => ({
    scale: isScanningNode ? [1.2, 1.2, 1.2] : [1, 1, 1],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    config: { mass: 3, friction: 40, tension: 800 },
  }));

  // Create a gesture that contains drag and hover, set the spring accordingly

  // ! when you re-enable orbit controls, it thinks there's still a mouse down? breaks future mouse events
  // const totalDelta = useRef(0);
  // const bind = useGesture({
  //   onPointerDown: () => {
  //     totalDelta.current = 0;
  //     // setMouseMoved({ mousedown: true, mousemoved: false });
  //     setAreOrbitControlsEnabled(false);
  //   },
  //   onDrag: ({ event, offset: [x, y], delta: [dx, dy], ...rest }) => {
  //     totalDelta.current += dx + dy;
  //     // ? could start dragging after timeout?
  //     // event.stopPropagation();
  //     set({
  //       position: [(x / aspect) * meow, (-y / aspect) * meow, 0],
  //       // rotation: [(y / aspect) * mu, (x / aspect) * mu, 0],
  //     });
  //   },
  //   onDragEnd: () => {
  //     // setMouseMoved((p) => ({ ...p, mousemoved: true }));
  //     console.log("🌟🚨 ~ totalDelta.current", totalDelta.current);
  //     const MAX_MOUSE_MOVE_FOR_CLICK = 5;
  //     const shouldClick =
  //       Math.abs(totalDelta.current) < MAX_MOUSE_MOVE_FOR_CLICK &&
  //       !isRightDrawerOpen;
  //     console.log("🌟🚨 ~ shouldClick", shouldClick);

  //     if (shouldClick) {
  //       onClick();
  //     }
  //     setAreOrbitControlsEnabled(true);
  //     // setMouseMoved({ mousedown: false, mousemoved: false });
  //   },
  //   onPointerUp: () => {},
  //   onHover: ({ hovering }) =>
  //     set({ scale: hovering ? [1.2, 1.2, 1.2] : [1, 1, 1] }),
  // });

  // TODO: check out name stays after submit

  const hasBotScore = Boolean(node.user.botScore);

  return (
    <animated.mesh
      rotation={rotation as any}
      // {...(bind() as any)}
      renderOrder={2}
    >
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
        <animated.group {...(rest as any)}>
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
        </animated.group>
      </animated.mesh>
    </animated.mesh>
  );
};
export function NodeContent({
  node,
  isTooltipNode,
  isPointerOver,
  isScanningNode,
  isRightClickingThisNode,
  forceOpaque = false,
}: {
  node: UserNode;
  isTooltipNode: boolean;
  isPointerOver: boolean;
  isScanningNode: boolean;
  isRightClickingThisNode: boolean;
  forceOpaque?: boolean;
}) {
  const hasBotScore = Boolean(node.user.botScore);
  const isNotABot = node.user.isNotABot;

  const material = isScanningNode
    ? null
    : isRightClickingThisNode
    ? rightClickNodeMaterial
    : isPointerOver && isTooltipNode
    ? pointerOverMaterial
    : isNotABot
    ? notABotMaterial
    : isTooltipNode
    ? tooltipNodeMaterial
    : defaultNodeMaterial;
  return (
    <>
      {isScanningNode && (
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
              opacity: 0.8,
            }}
          />
        </mesh>
      )}
      {isScanningNode ? null : (
        <mesh
          {...(material ? { material } : {})}
          geometry={nodeGeometry}
        ></mesh>
      )}
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
            node,
            hasBotScore,
          }}
        />
      ) : null}
    </>
  );
}
