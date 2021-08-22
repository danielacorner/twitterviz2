import { OrbitControls, useDetectGPU, useGLTF } from "@react-three/drei";
import { useUserNodes } from "../useUserNodes";
import { Debug, Physics } from "@react-three/cannon";
import { Node } from "./Node/Node";
import { BotScoreLegendHUD } from "../../Game/GameStateHUD/BotScoreLegend";
import { useFrame, useThree } from "@react-three/fiber";
import { CAMERA_POSITION } from "utils/constants";
import { useSpring } from "react-spring";
import { Suspense, useEffect, useState } from "react";
import { useMount } from "utils/utils";
import { Stars } from "./Stars";
import {
  areOrbitControlsEnabledAtom,
  gameStateAtom,
  GameStepsEnum,
} from "providers/store/store";
import { useAtom } from "jotai";
import { Collisions } from "./Collisions";
import { HighScores } from "components/Game/HighScores/HighScores";
import Background from "./Background";
import { Effects } from "./Effects/Effects";
import { useControls } from "leva";

export function Scene() {
  // const vertices = getVertices(nodes.length);
  const { camera } = useThree();
  const [gameState] = useAtom(gameStateAtom);
  const [areOrbitControlsEnabled] = useAtom(areOrbitControlsEnabledAtom);

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
  const gpuInfo = useDetectGPU();

  // since we're rendering HUD with priotity > 0,
  // we must explicitly render the scene with a specified priority in its own useFrame
  // https://github.com/pmndrs/react-three-fiber/blob/master/markdown/api.md#useframe
  useFrame(({ gl, scene, camera }) => gl.render(scene, camera), 1);

  return (
    <Suspense fallback={null}>
      {/* <ambientLight intensity={0.75} /> */}
      {/* <spotLight
        position={[20, 20, 25]}
        penumbra={1}
        angle={0.2}
        color="blue"
      /> */}
      <Stars count={gpuInfo.tier > 2 ? 2000 : 1000} />
      <GLTFModel />
      <mesh scale={[20, 20, 20]}>
        {/* <Sky
          rayleigh={7}
          mieCoefficient={0.1}
          mieDirectionalG={1}
          turbidity={0.2}
        /> */}
      </mesh>
      <directionalLight position={[-2.15, 5, 0.1]} intensity={4} />
      <OrbitControls
        {...{}}
        minPolarAngle={degToRad(45)}
        maxPolarAngle={degToRad(135)}
        minDistance={40}
        maxDistance={500}
        enablePan={false}
        enabled={areOrbitControlsEnabled}
      />
      <Physics
        {...{ gravity: [0, 0, 0] }}
        defaultContactMaterial={{ friction: 10, restitution: 0.8 }}
      >
        <DebugInDev>
          <Collisions />
          <Nodes />
        </DebugInDev>
      </Physics>
      <HighScores />
      <Background background={true} />

      <BotScoreLegendHUD />
      <Effects />
    </Suspense>
  );
}

function Nodes() {
  const nodes = useUserNodes();
  const { viewport } = useThree();

  const [nodesMemo, setNodesMemo] = useState(nodes);
  useEffect(() => {
    const newNodes = nodes.filter(
      (t) =>
        !nodesMemo.map((nt) => nt.id_str).includes(t.id_str) ||
        !nodes.map((nt) => nt.id_str).includes(t.id_str)
    );
    console.log("🌟🚨 ~ useEffect ~ newNodes", newNodes);
    const deletedNodes = nodesMemo.filter(
      (t) => !nodes.map((nt) => nt.id_str).includes(t.id_str)
    );
    if (newNodes.length > 0) {
      setNodesMemo((prev) => [...prev, ...newNodes]);
    } else if (deletedNodes.length > 0) {
      setNodesMemo((prev) =>
        prev.filter(
          (t) => !deletedNodes.map((nt) => nt.id_str).includes(t.id_str)
        )
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);
  return (
    <>
      {nodesMemo.map((node, idx) => {
        return <Node key={node.id_str} node={node} />;
      })}
    </>
  );
}

export function getHourOfDay() {
  const now = new Date();
  const hours = now.getHours();
  return hours;
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

function GLTFModel() {
  const gltf = useGLTF("/sea_life_challenge_pack/scene.gltf");
  const { viewport } = useThree();
  console.log("🌟🚨 ~ GLTFModel ~ viewport", viewport);
  const { scale } = useControls({ scale: 6 });
  return (
    <mesh>
      <primitive
        scale={0.01 * scale}
        position={[1.09, -38.44, -6.45]}
        object={gltf.scene}
        //  material={nodes.ATP___Gaussian_surface.material}
        //  geometry={nodes.ATP___Gaussian_surface.geometry}
      />
    </mesh>
  );
}
