import { OrbitControls, Stats, useDetectGPU, useGLTF } from "@react-three/drei";
import { Debug, Physics } from "@react-three/cannon";
import { useFrame, useThree } from "@react-three/fiber";
import { animated } from "@react-spring/three";
import { CAMERA_POSITION } from "utils/constants";
import { useSpring } from "react-spring";
import { Suspense, useRef } from "react";
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
import { useHoverAnimation } from "./useHoverAnimation";
import { Nodes } from "./Nodes";
import { BotScoreInfoCard } from "components/Game/GameStateHUD/BotScoreInfoCard";
import { useIsMounted } from "./useIsMounted";

export function Scene() {
  // const vertices = getVertices(nodes.length);
  const [areOrbitControlsEnabled] = useAtom(areOrbitControlsEnabledAtom);

  const { isMountAnimationEnabled } = useControls({
    isMountAnimationEnabled: true,
  });
  const orbitControlsRef = useMountAnimation();

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
      <mesh scale={[20, 20, 20]}></mesh>
      <directionalLight position={[-2.15, 5, 0.1]} intensity={4} />
      <OrbitControls
        ref={isMountAnimationEnabled ? orbitControlsRef : null}
        {...{}}
        minPolarAngle={degToRad(45)}
        maxPolarAngle={degToRad(135)}
        minDistance={40}
        maxDistance={500}
        enablePan={!isMountAnimationEnabled}
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
      <BotScoreInfoCard />
      {/* <BotScoreLegendHUD /> */}
      {process.env.NODE_ENV === "development" && <Stats />}
      <Effects />
    </Suspense>
  );
}

/** zoom in camera on mount */
function useMountAnimation() {
  const { camera } = useThree();
  const [gameState] = useAtom(gameStateAtom);
  const isGameOver = gameState.step === GameStepsEnum.gameOver;
  const isMounted = useIsMounted();

  const cameraPosition = isGameOver
    ? CAMERA_POSITION.gameOver
    : isMounted
    ? CAMERA_POSITION.final
    : CAMERA_POSITION.initial;
  const orbitControlsRef = useRef(null as any);
  useSpring({
    x: cameraPosition[0],
    y: cameraPosition[1],
    z: cameraPosition[2],
    onChange(state) {
      if (!orbitControlsRef.current) {
        return;
      }
      // orbitControls.target is like camera.lookAt since orbitcontrols controls the camera
      orbitControlsRef.current.target.set(0, state.value.y, 0);
      camera.position.set(state.value.x, state.value.y, state.value.z);
    },
    config: { tension: 28, mass: 6, friction: 28 },
  });
  return orbitControlsRef;
}

export function getHourOfDay() {
  const now = new Date();
  const hours = now.getHours();
  return hours;
}

function DebugInDev({ children }) {
  return process.env.NODE_ENV !== "production" ? (
    <Debug>{children}</Debug>
  ) : (
    <>{children}</>
  );
}

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function GLTFModel() {
  const gltf = useGLTF("/sea_life_challenge_pack/scene.gltf");
  const { viewport } = useThree();
  // TODO: ensure wide to cover entire floor enough on mobile
  const { scale } = useControls({ scale: 6 });
  const hoverAnimationRef = useHoverAnimation();

  return (
    <animated.mesh ref={hoverAnimationRef}>
      <primitive
        scale={0.01 * scale}
        position={[1.09, -38.44, -6.45]}
        object={gltf.scene}
        //  material={nodes.ATP___Gaussian_surface.material}
        //  geometry={nodes.ATP___Gaussian_surface.geometry}
      />
    </animated.mesh>
  );
}
