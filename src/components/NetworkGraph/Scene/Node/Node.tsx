import { useSphere } from "@react-three/cannon";
import * as THREE from "three";
import useStore, {
  botScorePopupNodeAtom,
  isBotScoreExplainerUpAtom,
  isPointerOverAtom,
  isRightDrawerOpenAtom,
  latestNodeWithBotScoreAtom,
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
import { useGravity } from "../useGravity";
import { useSpring, animated } from "@react-spring/three";
import {
  NODE_RADIUS,
  NODE_RADIUS_COLLISION_MULTIPLIER,
  NODE_WIDTH,
} from "utils/constants";
import { useState } from "react";
import { ScanningAnimation } from "./ScanningAnimation";
import { useControls } from "leva";
import { useMounted } from "utils/hooks";
import { randBetween } from "utils/utils";
import { NodeContent } from "./NodeContent";
import { Instance } from "@react-three/drei";
import { PopAnimation } from "./PopAnimation";
import {
  notABotMaterial,
  defaultNodeMaterial,
  opacityMaterial,
  rightClickNodeMaterial,
  pointerOverMaterial,
  tooltipNodeMaterial,
  invisibleMaterial,
} from "./materialsAndGeometries";

export const Node = ({
  vec = new THREE.Vector3(),
  userNode,
}: {
  vec?: any;
  userNode: UserNode;
}) => {
  const startPosition = getStartPosition();
  const tooltipNode = useTooltipNode();

  const [scanningNodeId] = useAtom(scanningUserNodeIdAtom);
  const [rightClickMenu] = useAtom(rightClickMenuAtom);
  const isRightClickingThisNode = rightClickMenu.node
    ? rightClickMenu.node?.id_str === userNode.id_str
    : false;
  const isTooltipNode = tooltipNode
    ? tooltipNode?.id_str === userNode.id_str
    : false;
  const setTooltipNode = useStore((state) => state.setTooltipNode);
  const setSelectedNode = useSetSelectedNode();
  const [isPointerOver, setIsPointerOver] = useAtom(isPointerOverAtom);
  const [tooltipTweetIndex, setTooltipTweetIndex] = useAtom(
    tooltipTweetIndexAtom
  );
  const [, setIsRightDrawerOpen] = useAtom(isRightDrawerOpenAtom);
  const [, setNumTooltipTweets] = useAtom(numTooltipTweetsAtom);

  const handleRightClick = useHandleOpenRightClickMenu(userNode.tweets[0]);
  const onContextMenu = (event) => {
    handleRightClick(event.nativeEvent);
  };
  const onPointerEnter = () => {
    setIsPointerOver(true);
    setTooltipTweetIndex(0);
    setNumTooltipTweets(userNode.tweets.length);
    setTooltipNode(userNode.tweets[0]);
  };
  const onScroll = (event) => {
    event.stopPropagation();
    event.nativeEvent.stopPropagation();
    event.nativeEvent.preventDefault();
    const isDown = event.deltaY > 0;
    const nextTooltipTweetIdx = Math.max(
      0,
      Math.min(
        tooltipTweetIndex + (isDown ? 1 : -1),
        userNode.tweets.length - 1
      )
    );
    setTooltipTweetIndex(nextTooltipTweetIdx);
    setTooltipNode(userNode.tweets[nextTooltipTweetIdx]);
  };
  const onPointerLeave = () => {
    setIsPointerOver(false);
  };
  const onClick = (e) => {
    e.stopPropagation();

    const newSelectedNode = {
      ...userNode.tweets[0],
      user: userNode.user,
      id_str: userNode.user.id_str,
    };
    if (newSelectedNode.user) {
      setTimeout(() => {
        setSelectedNode(newSelectedNode);
        setIsRightDrawerOpen(true);
      });
    }
  };
  const [sphereRef, api] = useSphere(() => ({
    mass: 1,
    position: startPosition,
    // linearDamping: 0.1,
    // material: { friction: 0, restitution: 0 },
    // geometry: geo,
    args: [NODE_RADIUS * NODE_RADIUS_COLLISION_MULTIPLIER],
  }));

  useGravity(api, vec);

  const mounted = useMounted();

  // hide nodes when the game ends
  const hide = (useAreBotsLinedUp() && !userNode.user.botScore) || !mounted;

  const isNotABot = userNode.user.isNotABot;

  const { scale2 } = useControls({ scale2: 1 });
  const shouldPop = true;
  // const shouldPop = useRef(Math.random() > 0.3);
  const scaleMult = isNotABot ? (shouldPop ? 2 : 0) : scale2;

  const isScanningNode = userNode.id_str === scanningNodeId;

  const springScale = useSpring({
    scale: hide
      ? [0, 0, 0]
      : isScanningNode || (isPointerOver && isTooltipNode)
      ? [2.2 * scaleMult, 2.2 * scaleMult, 2.2 * scaleMult]
      : isTooltipNode
      ? [1.8 * scaleMult, 1.8 * scaleMult, 1.8 * scaleMult]
      : [1 * scaleMult, 1 * scaleMult, 1 * scaleMult],
  });

  const hasBotScore = Boolean(userNode.user.botScore);

  const [, setIsUp] = useAtom(isBotScoreExplainerUpAtom);
  const [, setLatestNodeWithBotScore] = useAtom(latestNodeWithBotScoreAtom);
  const [, setBotScorePopupNode] = useAtom(botScorePopupNodeAtom);

  function handleShowBotScoreInfoCard(e) {
    e.stopPropagation();
    setIsUp(true);
    setLatestNodeWithBotScore(userNode.tweets[0]);
    setBotScorePopupNode(userNode);
  }

  const [doneAnimating, setDoneAnimating] = useState(false);
  const material = isNotABot
    ? notABotMaterial
    : !doneAnimating
    ? opacityMaterial
    : isScanningNode
    ? invisibleMaterial
    : isRightClickingThisNode
    ? rightClickNodeMaterial
    : isPointerOver && isTooltipNode
    ? pointerOverMaterial
    : isTooltipNode
    ? tooltipNodeMaterial
    : defaultNodeMaterial;

  return (
    <Instance ref={sphereRef}>
      <ScaleOnHover>
        <animated.mesh renderOrder={2} ref={sphereRef}>
          <animated.mesh
            scale={springScale.scale as any}
            // material-transparent={true}
            // material-opacity={springScale.opacity}
            {...(hasBotScore
              ? { onClick: handleShowBotScoreInfoCard }
              : {
                  onPointerEnter,
                  onPointerLeave,
                  onContextMenu,
                  onClick,
                  onWheel: onScroll,
                })}
          >
            {/* <NodeContent
              {...{
                node: userNode,
                isTooltipNode,
                isPointerOver,
                isScanningNode,
                isRightClickingThisNode,
              }}
            /> */}
            {isNotABot && shouldPop && <PopAnimation />}
            {/* <ScanningAnimation /> */}
            {isScanningNode ? <ScanningAnimation /> : null}
          </animated.mesh>
        </animated.mesh>
      </ScaleOnHover>
    </Instance>
  );
};
function ScaleOnHover({ children }: { children: React.ReactNode }) {
  const [isHovering, setIsHovering] = useState(false);

  const springScale = useSpring({
    scale: isHovering ? [1.2, 1.2, 1.2] : [1, 1, 1],
  });

  return (
    <animated.group
      scale={springScale.scale as any}
      onPointerEnter={() => setIsHovering(true)}
      onPointerLeave={() => setIsHovering(false)}
    >
      {children}
    </animated.group>
  );
}

export function getRandomPosition(min, max) {
  return [
    Math.random() * (max - min) + min,
    Math.random() * (max - min) + min,
    Math.random() * (max - min) + min,
  ];
}
/** start at ("bubble up" or "emerge from") bottom center  */
function getStartPosition(): [x: number, y: number, z: number] {
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
