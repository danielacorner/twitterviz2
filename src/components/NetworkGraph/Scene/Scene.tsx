import { OrbitControls } from "@react-three/drei";
import { useGraphWithUsersAndLinks } from "../useGraphWithUsersAndLinks";
// import ThreeForceGraph from "three-forcegraph";
import { Physics, useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";

export function Scene() {
  const graphWithUsers = useGraphWithUsersAndLinks();
  console.log("🌟🚨 ~ Scene ~ graphWithUsers", graphWithUsers);
  // const graphData: GraphData = { nodes: [], links: [] };
  // const myGraph = new ThreeForceGraph().graphData(graphData);

  return (
    <>
      <OrbitControls {...({} as any)} />
      <Physics>
        {graphWithUsers.nodes.map((node) => (
          <Node node={node} />
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

const Node = ({ node }) => {
  const [boxRef, api] = useBox(() => ({ mass: 1 }));

  // useFrame(({ clock }) =>
  //   api.position.set(Math.sin(clock.getElapsedTime()) * 5, 0, 0)
  // );

  return (
    <mesh ref={boxRef}>
      <boxBufferGeometry />
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
