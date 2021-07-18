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
      <ambientLight intensity={0.75} />
      <spotLight position={[20, 20, 25]} penumbra={1} angle={0.2} color="red" />
      <directionalLight position={[0, 5, -4]} intensity={4} />
      <directionalLight position={[0, -15, -0]} intensity={4} color="red" />
      <OrbitControls {...({} as any)} />
      <Physics {...{ gravity: [0, 0, 0] }}>
        <Collisions />
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

// copied from https://codesandbox.io/s/zxpv7?file=/src/App.js:1710-2277
function Collisions() {
  // usePlane(() => ({ position: [0, 0, 0], rotation: [0, 0, 0] }));
  // usePlane(() => ({ position: [0, 0, 8], rotation: [0, -Math.PI, 0] }));
  // usePlane(() => ({ position: [0, -4, 0], rotation: [-Math.PI / 2, 0, 0] }));
  // usePlane(() => ({ position: [0, 4, 0], rotation: [Math.PI / 2, 0, 0] }));
  // const viewport = useThree((state) => state.viewport);
  // const [, api] = useSphere(() => ({ type: "Kinematic", args: 2 }));
  // useFrame((state) =>
  //   api.position.set(
  //     (state.mouse.x * viewport.width) / 2,
  //     (state.mouse.y * viewport.height) / 2,
  //     2.5
  //   )
  // );
  return null;
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
