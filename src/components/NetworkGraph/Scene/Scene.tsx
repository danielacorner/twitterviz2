import { OrbitControls } from "@react-three/drei";
import { useGraphWithUsersAndLinks } from "../useGraphWithUsersAndLinks";
// import ThreeForceGraph from "three-forcegraph";
import { Physics, useConvexPolyhedron } from "@react-three/cannon";
import { useMemo } from "react";
import { toConvexProps } from "./toConvexProps";
import * as THREE from "three";

export function Scene() {
  const graphWithUsers = useGraphWithUsersAndLinks();
  console.log("🌟🚨 ~ Scene ~ graphWithUsers", graphWithUsers);
  // const graphData: GraphData = { nodes: [], links: [] };
  // const myGraph = new ThreeForceGraph().graphData(graphData);

  return (
    <>
      <OrbitControls {...({} as any)} />
      <Physics {...{ gravity: [0, 0, 0] }}>
        {graphWithUsers.nodes.map((node) => (
          <Node key={node.id_str} node={node} />
        ))}
      </Physics>
      {/* <mesh>
        <boxBufferGeometry />
        <meshBasicMaterial />
      </mesh> */}
      {/* <primitive object={myGraph} /> */}
    </>
  );
}

function getRandPosition(min, max): [x: number, y: number, z: number] {
  return [
    Math.random() * (max - min) + min,
    Math.random() * (max - min) + min,
    Math.random() * (max - min) + min,
  ];
  // return new THREE.Vector3(
  //   Math.random() * (max - min) + min,
  //   Math.random() * (max - min) + min,
  //   Math.random() * (max - min) + min
  // );
}

const Node = ({ node }) => {
  const radius = 1;
  const detail = 1;
  const geo = useMemo(
    () => toConvexProps(new THREE.IcosahedronBufferGeometry(radius, detail)),
    [radius, detail]
  );

  const [ref, api] = useConvexPolyhedron(() => ({
    mass: 1, // approximate mass using volume of a sphere equation
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
    <mesh ref={ref}>
      <sphereBufferGeometry />
      <meshBasicMaterial />
    </mesh>
  );
};

interface GraphData {
  nodes: NodeObject[];
  links: LinkObject[];
}

// from import ThreeForceGraph from "three-forcegraph";
type NodeObject = object & {
  id?: string | number;
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  fx?: number;
  fy?: number;
  fz?: number;
};

type LinkObject = object & {
  source?: string | number | NodeObject;
  target?: string | number | NodeObject;
};
