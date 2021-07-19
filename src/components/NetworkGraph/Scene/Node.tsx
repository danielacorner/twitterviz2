import { useSphere } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import useStore, {
  isPointerOverAtom,
  rightClickMenuAtom,
} from "providers/store/store";
import { useFrame } from "@react-three/fiber";
import { getRandPosition } from "./Scene";
import { Billboard } from "@react-three/drei";
import { NodeBillboardContent } from "./NodeBillboardContent";
import { useAtom } from "jotai";
import { useTooltipNode } from "providers/store/useSelectors";

const nodeMaterial = new THREE.MeshLambertMaterial({
  emissive: "blue",
  metalness: 1,
  color: "#316c83",
});
const rightClickNodeMaterial = new THREE.MeshLambertMaterial({
  emissive: "orange",
  metalness: 1,
  color: "#be9729",
});
const tooltipNodeMaterial = new THREE.MeshLambertMaterial({
  emissive: "yellow",
  metalness: 1,
  color: "#ecf021",
});
const RADIUS = 10;
const nodeGeometry = new THREE.SphereGeometry(RADIUS / 5, 28, 28);

export const Node = ({ vec = new THREE.Vector3(), node }) => {
  const tooltipNode = useTooltipNode();
  const setTooltipNode = useStore((state) => state.setTooltipNode);
  const setSelectedNode = useStore((state) => state.setSelectedNode);
  const [isPointerOver, setIsPointerOver] = useAtom(isPointerOverAtom);
  const onPointerEnter = () => {
    setIsPointerOver(true);
    console.log("🌟🚨 ~ Node ~ onPointerEnter", isPointerOver);
    setTooltipNode(node);
  };
  const onPointerLeave = () => {
    setIsPointerOver(false);
    console.log("🌟🚨 ~ Node ~ onPointerLeave", isPointerOver);
  };
  const onClick = () => {
    setSelectedNode(node);
  };

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: getRandPosition(-10 * RADIUS, 10 * RADIUS),
    // type: !paused ? "Dynamic" : "Static",
    // https://threejs.org/docs/scenes/geometry-browser.html#IcosahedronBufferGeometry
    args: RADIUS,
  }));

  // apply force toward center
  // copied from https://codesandbox.io/s/zxpv7?file=/src/App.js:1195-1404
  const position = useRef([0, 0, 0]);
  useEffect(() => api.position.subscribe((v) => (position.current = v)), [api]);
  useFrame(() =>
    api.applyForce(
      vec
        .set(...position.current)
        .normalize()
        .multiplyScalar(-3)
        .toArray(),
      [0, 0, 0]
    )
  );
  const [rightClickMenu] = useAtom(rightClickMenuAtom);
  const isRightClickingThisNode = rightClickMenu.node?.id_str === node.id_str;
  console.log("🌟🚨 ~ Node ~ node.id_str", node.id_str);
  const isTooltipNode = tooltipNode?.id_str === node.id_str;
  console.log("🌟🚨 ~ Node ~ tooltipNode?.id_str", tooltipNode?.id_str);
  console.log("🌟🚨 ~ Node ~ isTooltipNode", isTooltipNode);
  return (
    <mesh
      ref={ref}
      material={
        isRightClickingThisNode
          ? rightClickNodeMaterial
          : isTooltipNode
          ? tooltipNodeMaterial
          : nodeMaterial
      }
      geometry={nodeGeometry}
      scale={isTooltipNode ? [2, 2, 2] : [1, 1, 1]}
    >
      <Billboard {...({} as any)}>
        <NodeBillboardContent
          {...{
            tweet: node,
            onPointerEnter,
            onPointerLeave,
            onClick,
          }}
        />
      </Billboard>
    </mesh>
  );
};
