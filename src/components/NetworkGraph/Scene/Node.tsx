import { useSphere } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import useStore from "providers/store/store";
import { useFrame } from "@react-three/fiber";
import { getRandPosition } from "./Scene";
import { Billboard } from "@react-three/drei";
import { NodeBillboardContent } from "./NodeBillboardContent";

const nodeMaterial = new THREE.MeshLambertMaterial({
  color: "#316c83",
  emissive: "blue",
});
const RADIUS = 10;
const nodeGeometry = new THREE.SphereGeometry(RADIUS / 5, 28, 28);

export const Node = ({ vec = new THREE.Vector3(), node }) => {
  const setTooltipNode = useStore((state) => state.setTooltipNode);
  const setSelectedNode = useStore((state) => state.setSelectedNode);

  const onPointerEnter = () => {
    setTooltipNode(node);
  };
  const onPointerLeave = () => {
    setTooltipNode(null);
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
        .multiplyScalar(-10)
        .toArray(),
      [0, 0, 0]
    )
  );

  return (
    <mesh ref={ref} material={nodeMaterial} geometry={nodeGeometry}>
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
