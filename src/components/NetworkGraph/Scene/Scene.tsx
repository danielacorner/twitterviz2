import { OrbitControls, useDetectGPU } from "@react-three/drei";
import { useGraphWithUsersAndLinks } from "../useGraphWithUsersAndLinks";
import { Debug, Physics } from "@react-three/cannon";
import { Node, NODE_RADIUS_COLLISION_MULTIPLIER } from "./Node/Node";
import { BotScoreLegend } from "../../Game/GameStateHUD/BotScoreLegend";
import { useFrame, useThree } from "@react-three/fiber";
import { CAMERA_POSITION, NODE_RADIUS } from "utils/constants";
import { useSpring } from "react-spring";
import { forwardRef, Suspense, useState } from "react";
import { useMount } from "utils/utils";
import { Stars } from "./Stars";
import { gameStateAtom, GameStepsEnum } from "providers/store/store";
import { useAtom } from "jotai";
import { Collisions } from "./Collisions";
import { HighScores } from "components/Game/HighScores/HighScores";
import Background from "./Background";
import { KernelSize } from "postprocessing";
import { Effects } from "./Effects";

const NODE_WIDTH = NODE_RADIUS * NODE_RADIUS_COLLISION_MULTIPLIER;
export function Scene() {
  const graphWithUsers = useGraphWithUsersAndLinks();
  // const vertices = getVertices(graphWithUsers.nodes.length);
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
  const { viewport } = useThree();
  const gpuInfo = useDetectGPU();
  return (
    <Suspense fallback={null}>
      {/* <ambientLight intensity={0.75} /> */}
      {/* <spotLight
        position={[20, 20, 25]}
        penumbra={1}
        angle={0.2}
        color="blue"
      /> */}
      <Stars count={gpuInfo.tier > 2 ? 4000 : gpuInfo.tier > 1 ? 1000 : 600} />

      <mesh scale={[20, 20, 20]}>
        {/* <Sky
          rayleigh={7}
          mieCoefficient={0.1}
          mieDirectionalG={1}
          turbidity={0.2}
        /> */}
      </mesh>
      <directionalLight position={[0, 5, -4]} intensity={4} />
      <OrbitControls
        {...{}}
        minPolarAngle={degToRad(45)}
        maxPolarAngle={degToRad(135)}
      />
      <Physics
        {...{ gravity: [0, 0, 0] }}
        defaultContactMaterial={{ friction: 10, restitution: 0.8 }}
      >
        <DebugInDev>
          <Collisions />
          {graphWithUsers.nodes.map((node, idx) => {
            const isEven = idx % 2 === 0;
            const width = viewport.width / 8;

            const x = randBetween(-1, 1) * width;
            const z = (randBetween(-1, 1) * viewport.width) / 8;
            const y =
              randBetween(-1, 1) * NODE_WIDTH * 5 + (isEven ? 1 : -1) * width;
            return (
              <Node
                key={node.id_str}
                node={node}
                startPosition={
                  [x, y, z]
                  // vertices[isEven ? idx : vertices.length - idx - 1]
                }
              />
            );
          })}
        </DebugInDev>
      </Physics>
      <HighScores />

      <BotScoreLegend />
      <Background background={true} />
      <Effects />
    </Suspense>
  );
}

export function getHourOfDay() {
  const now = new Date();
  const hours = now.getHours();
  return hours;
}

const SUN_RADIUS = 10;
const SUN_Y = 170;
const SUN_X = -60;
const SUN_WOBBLE = 6;
export const Sun = forwardRef(function Sun(props, forwardRef) {
  useFrame(({ clock }) => {
    (forwardRef as any).current.position.x =
      Math.sin(clock.getElapsedTime()) * -SUN_WOBBLE + SUN_X;
    (forwardRef as any).current.position.z =
      Math.cos(clock.getElapsedTime()) * -SUN_WOBBLE - 500;
  });

  return (
    <mesh ref={forwardRef as any} position={[0, SUN_Y, 0]}>
      <sphereGeometry args={[SUN_RADIUS, 36, 36]} />
      <meshBasicMaterial color={"#00FF00"} />
    </mesh>
  );
});

function randBetween(min, max) {
  return Math.random() * (max - min) + min;
}
function DebugInDev({ children }) {
  return false && process.env.NODE_ENV !== "production" ? (
    <Debug>{children}</Debug>
  ) : (
    <>{children}</>
  );
}
// const getVertices = (numNodes) => {
//   const tooBig = numNodes > 92;
//   const y = new THREE.IcosahedronGeometry(tooBig ? 65 : 60, tooBig ? 3 : 2);
//   // Get float array of all coordinates of vertices
//   const float32array = y.attributes.position.array;
//   // run loop,  each step of loop need increment by 3, because each vertex has 3 coordinates, X, Y and Z
//   let vertices: [number, number, number][] = [];
//   for (let i = 0; i < float32array.length; i += 3) {
//     // inside the loop you can get coordinates
//     const x = float32array[i];
//     const y = float32array[i + 1];
//     const z = float32array[i + 2];
//     vertices.push([x, y, z]);
//   }
//   return uniqBy(vertices, JSON.stringify);
// };

function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  useMount(() => {
    setIsMounted(true);
  });
  return isMounted;
}

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}
