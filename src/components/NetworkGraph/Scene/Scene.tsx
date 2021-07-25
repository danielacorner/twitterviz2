import { OrbitControls } from "@react-three/drei";
import { useGraphWithUsersAndLinks } from "../useGraphWithUsersAndLinks";
import { Physics } from "@react-three/cannon";
import { Node } from "./Node";
import * as THREE from "three";
import { uniqBy } from "lodash";

export function Scene() {
  const graphWithUsers = useGraphWithUsersAndLinks();
  const vertices = getVertices(graphWithUsers.nodes.length);

  return (
    <>
      <ambientLight intensity={0.75} />
      <spotLight
        position={[20, 20, 25]}
        penumbra={1}
        angle={0.2}
        color="blue"
      />
      <directionalLight position={[0, 5, -4]} intensity={4} />
      <directionalLight position={[0, -15, -0]} intensity={4} color="blue" />
      <OrbitControls {...({} as any)} />
      <Physics {...{ gravity: [0, 0, 0] }}>
        {graphWithUsers.nodes.map((node, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <Node
              key={node.id_str}
              node={node}
              startPosition={vertices[isEven ? idx : vertices.length - idx - 1]}
            />
          );
        })}
      </Physics>
    </>
  );
}

const getVertices = (numNodes) => {
  const tooBig = numNodes > 92;
  const y = new THREE.IcosahedronGeometry(tooBig ? 65 : 60, tooBig ? 3 : 2);
  // Get float array of all coordinates of vertices
  const float32array = y.attributes.position.array;
  // run loop,  each step of loop need increment by 3, because each vertex has 3 coordinates, X, Y and Z
  let vertices: [number, number, number][] = [];
  for (let i = 0; i < float32array.length; i += 3) {
    // inside the loop you can get coordinates
    const x = float32array[i];
    const y = float32array[i + 1];
    const z = float32array[i + 2];
    vertices.push([x, y, z]);
  }
  return uniqBy(vertices, JSON.stringify);
};
