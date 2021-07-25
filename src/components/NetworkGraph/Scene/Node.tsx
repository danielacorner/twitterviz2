import { useSphere } from "@react-three/cannon";
import * as THREE from "three";
import useStore, {
  isPointerOverAtom,
  numTooltipTweetsAtom,
  rightClickMenuAtom,
  tooltipTweetIndexAtom,
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

const nodeMaterial = new THREE.MeshLambertMaterial({
  emissive: "blue",
  metalness: 1,
  color: "#316c83",
});
const rightClickNodeMaterial = new THREE.MeshLambertMaterial({
  emissive: "green",
  metalness: 1,
  color: "#26be3a",
});
const pointerOverMaterial = new THREE.MeshLambertMaterial({
  emissive: "blue",
  metalness: 1,
  color: "#3ad64f",
});
const tooltipNodeMaterial = new THREE.MeshLambertMaterial({
  emissive: "blue",
  metalness: 1,
  color: "#26be3a",
});
const RADIUS = 10;
const nodeGeometry = new THREE.SphereGeometry(RADIUS / 5, 28, 28);

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
    args: RADIUS,
  }));

  useGravity(api, vec);

  const springProps = useSpring({
    scale:
      isPointerOver && isTooltipNode
        ? [2.2, 2.2, 2.2]
        : isTooltipNode
        ? [1.8, 1.8, 1.8]
        : [1, 1, 1],
  });
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
      <NodeBillboard
        {...{
          tweets: node.tweets,
        }}
      />
    </animated.mesh>
  );
};

// function getRandomPosition(min, max): [x: number, y: number, z: number] {
// 	return [
// 		Math.random() * (max - min) + min,
// 		Math.random() * (max - min) + min,
// 		Math.random() * (max - min) + min,
// 	];
// }
