import { OrbitControls } from "@react-three/drei";
import { useGraphWithUsersAndLinks } from "../useGraphWithUsersAndLinks";
// import ThreeForceGraph from "three-forcegraph";
import { Physics } from "@react-three/cannon";
import { Node } from "./Node";
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

export function getRandPosition(min, max): [x: number, y: number, z: number] {
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
