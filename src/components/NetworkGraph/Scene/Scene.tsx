import { OrbitControls } from "@react-three/drei";
import { useGraphWithUsersAndLinks } from "../useGraphWithUsersAndLinks";
import { Physics } from "@react-three/cannon";
import { Node } from "./Node";
import * as THREE from "three";
import { uniqBy } from "lodash";
import { BotScoreLegend } from "./BotScoreLegend";
import { useThree } from "@react-three/fiber";
import { CAMERA_POSITION } from "utils/constants";
import { useSpring } from "react-spring";
import { useState } from "react";
import { useMount } from "utils/utils";
import { useAreBotsLinedUp } from "providers/store/store";

export function Scene() {
  const graphWithUsers = useGraphWithUsersAndLinks();
  const vertices = getVertices(graphWithUsers.nodes.length);
  const { camera } = useThree();

  const isMounted = useIsMounted();
  // zoom in camera on mount
  useSpring({
    z: isMounted ? CAMERA_POSITION.final[2] : CAMERA_POSITION.initial[2],
    onChange(state) {
      camera.position.set(0, 0, state.value.z);
    },
    config: { tension: 50, mass: 12, friction: 60 },
  });

  // lined up: hide if they don't have a bot score
  const areBotsLinedUp = useAreBotsLinedUp();
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
        {graphWithUsers.nodes
          // .filter((node) => {
          //   const hide = areBotsLinedUp && !node.user.botScore;
          //   return !hide;
          // })
          .map((node, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <Node
                key={node.id_str}
                node={node}
                startPosition={
                  vertices[isEven ? idx : vertices.length - idx - 1]
                }
              />
            );
          })}
      </Physics>
      <BotScoreLegend />
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

function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  useMount(() => {
    setIsMounted(true);
  });
  return isMounted;
}
