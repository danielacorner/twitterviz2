import { useConvexPolyhedron } from "@react-three/cannon";
import { useMemo } from "react";
import { toConvexProps } from "./toConvexProps";
import * as THREE from "three";
import useStore, { nodeMouseCoordsAtom } from "providers/store/store";
import { useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { getRandPosition } from "./Scene";
import { Billboard } from "@react-three/drei";
import { NodeTooltipContent } from "../NodeTooltip";

export const Node = ({ node }) => {
  const radius = 1;
  const detail = 1;
  const geo = useMemo(
    () => toConvexProps(new THREE.IcosahedronBufferGeometry(radius, detail)),
    [radius, detail]
  );
  const [nodeMouseCoords, setNodeMouseCoords] = useAtom(nodeMouseCoordsAtom);
  const setTooltipNode = useStore((state) => state.setTooltipNode);
  const setSelectedNode = useStore((state) => state.setSelectedNode);

  const { mouse } = useThree();
  const onPointerEnter = () => {
    console.log("🌟🚨 ~ Node ~ nodeMouseCoords", nodeMouseCoords);
    console.log("🌟🚨 ~ Node ~ mouse", mouse);
    setTooltipNode(node);
    setNodeMouseCoords(mouse);
  };
  const onClick = () => {
    setSelectedNode(node);
    setNodeMouseCoords(mouse);
  };

  const [ref, api] = useConvexPolyhedron(() => ({
    mass: 1,
    position: getRandPosition(-10, 10),
    // type: !paused ? "Dynamic" : "Static",
    // https://threejs.org/docs/scenes/geometry-browser.html#IcosahedronBufferGeometry
    args: geo as any,
  }));

  // const position = useRef([0, 0, 0]);
  // useMount(() => {
  //   const unsubscribe = api.position.subscribe(
  //     (v) => (position.current = v)
  //   ) as any;
  //   return () => unsubscribe();
  // });
  // useFrame(({ clock }) => {
  //   console.log("🌟🚨 ~ useFrame ~ clock", clock);
  //   const shouldTick = Math.round(clock.elapsedTime * 100) % 10 === 0;
  //   console.log("🌟🚨 ~ useFrame ~ shouldTick", shouldTick);
  //   if (shouldTick) {
  //     const [x, y, z] = position.current.map((xyz) => -xyz / 1);
  //     // api.position.set(x, y, z);
  //     return;
  //   }
  // });
  return (
    <mesh ref={ref} {...{ onPointerEnter, onClick }}>
      <sphereBufferGeometry />
      <meshBasicMaterial />
      <Billboard {...({} as any)}>
        <NodeTooltipContent {...node} />
      </Billboard>
    </mesh>
  );
};
