import { OrbitControls } from "@react-three/drei";
import { useGraphWithUsersAndLinks } from "../useGraphWithUsersAndLinks";
import { Physics } from "@react-three/cannon";
import { Node } from "./Node/Node";
import * as THREE from "three";
import { uniqBy } from "lodash";
import { BotScoreLegend } from "../../Game/GameStateHUD/BotScoreLegend";
import { useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { CAMERA_POSITION } from "utils/constants";
import { useSpring } from "react-spring";
import { Suspense, useState } from "react";
import { useMount } from "utils/utils";
import { Sky /* Stars */ } from "@react-three/drei";
import { useTurbidityByTimeOfDay } from "./useTurbidityByTimeOfDay";
import { Stars } from "./Stars";
import { gameStateAtom, GameStepsEnum } from "providers/store/store";
import { useAtom } from "jotai";

export function Scene() {
  const graphWithUsers = useGraphWithUsersAndLinks();
  const vertices = getVertices(graphWithUsers.nodes.length);
  const { camera } = useThree();
  const [gameState] = useAtom(gameStateAtom);
  const isGameOver = gameState.step === GameStepsEnum.gameOver;
  const isMounted = useIsMounted();
  // zoom in camera on mount
  useSpring({
    z: isGameOver
      ? CAMERA_POSITION.gameOver[2]
      : isMounted
      ? CAMERA_POSITION.final[2]
      : CAMERA_POSITION.initial[2],
    onChange(state) {
      camera.position.set(0, 0, state.value.z);
    },
    config: { tension: 20, mass: 6, friction: 20 },
  });
  // lined up: hide if they don't have a bot score
  const turbidity = useTurbidityByTimeOfDay();
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.75} />
      <spotLight
        position={[20, 20, 25]}
        penumbra={1}
        angle={0.2}
        color="blue"
      />
      <Stars count={1000} />
      <Environment background={true} path={"/"} preset={"forest"} />
      <mesh scale={[20, 20, 20]}>
        <Sky
          rayleigh={7}
          mieCoefficient={0.1}
          mieDirectionalG={1}
          turbidity={turbidity}
        />
      </mesh>
      <directionalLight position={[0, 5, -4]} intensity={4} />
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
      <BotScoreLegend />
    </Suspense>
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
