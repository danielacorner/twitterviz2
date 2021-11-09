import {
  OrbitControls,
  Stats,
  useDetectGPU,
  useGLTF,
  Stars,
  Loader,
} from "@react-three/drei";
import { Debug, Physics } from "@react-three/cannon";
import { useFrame, useThree } from "@react-three/fiber";
import { animated } from "@react-spring/three";
import { CAMERA_POSITION } from "utils/constants";
import { useSpring } from "react-spring";
import { Suspense, useRef, useState } from "react";
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
import { useIsMounted } from "./useIsMounted";
import { shuffle } from "lodash";
import * as THREE from "three";
import { Bubbles } from "./Bubbles";
import { useMount } from "utils/utils";
import { atomWithStorage } from "jotai/utils";

const showExtraStuffAtom = atomWithStorage("showAllModels", false);
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
  // const [autoRotateDirection, setAutoRotateDirection] = useState("left");
  // useInterval({
  //   callback: () => {
  //     setAutoRotateDirection((p) =>
  //       p === "one"
  //         ? "two"
  //         : p === "two"
  //         ? "three"
  //         : p === "three"
  //         ? "four"
  //         : p === "four"
  //         ? "one"
  //         : "one"
  //     );
  //   },
  //   delay: 4 * 1000,
  //   immediate: false,
  // });

  const [showExtraStuff, setShow] = useAtom(showExtraStuffAtom);
  useMount(() => {
    setTimeout(() => {
      setShow(true);
    }, 18 * 1000);
  });

  const { px, py, pz } = useControls({ px: -2.15, py: 5, pz: 0.1 });

  const gltfModelBackground = shuffle([
    // 8.4MB
    <GLTFModelCoral />,
    // 7.4MB
    <GLTFModelTerrain />,
    // 10MB
    <GLTFModelFishTreasureBackground />,
  ])[0];
  return (
    <Suspense fallback={null}>
      {/* <ambientLight intensity={0.75} /> */}
      {/* <spotLight
        position={[20, 20, 25]}
        penumbra={1}
        angle={0.2}
        color="blue"
      /> */}
      {gltfModelBackground}

      <Bubbles count={gpuInfo.tier > 2 ? 2000 : 1000} />
      <mesh renderOrder={100000}>
        <Stars count={2000} />
      </mesh>
      {showExtraStuff && process.env.NODE_ENV === "production" && (
        <ExtraStuff />
      )}
      <mesh scale={[20, 20, 20]}></mesh>
      <directionalLight position={[px, py, pz]} intensity={4} />
      <OrbitControls
        ref={isMountAnimationEnabled ? orbitControlsRef : null}
        {...{}}
        minPolarAngle={degToRad(45)}
        maxPolarAngle={degToRad(135)}
        minDistance={40}
        maxDistance={500}
        enablePan={!isMountAnimationEnabled}
        enabled={areOrbitControlsEnabled}
        autoRotate={false}
        // autoRotate={gameState.step !== "lookingAtTweetsWithBotScores"}
        // autoRotate={["one", "three"].includes(autoRotateDirection)} // camera's too bouncy
        autoRotateSpeed={0.08}
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
      {/* <BotScoreLegendHUD /> */}
      {process.env.NODE_ENV === "development" && <Stats />}
      <Effects />
    </Suspense>
  );
}
function ExtraStuff() {
  const gpuInfo = useDetectGPU();

  const showMany = gpuInfo.tier > 2;
  return (
    <Suspense fallback={null}>
      {showMany && <GLTFModelGuppy />}
      {/* 5MB */}
      {showMany && <GLTFModelclownfish />}
      {/* 1MB */}
      <GLTFModelschooloffish />
      {/* 1MB */}
      <GLTFModelyellowfish />
      {/* 18MB */}
      {/* <GLTFModelhammerhead /> */}
      {/* 2MB */}
      <GLTFModelgreatwhite />
      {/* <Stars /> */}
      {/* 5MB */}
      {showMany && <GLTFModelballena />}
      {/* 0.5MB */}
      <GLTFModelsailfish />
      {/* 2MB */}
      <GLTFModelLeviathan />
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
    position: { t: Date.now() },
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
  const { debug } = useControls({ debug: false });
  return debug && process.env.NODE_ENV !== "production" ? (
    <Debug>{children}</Debug>
  ) : (
    <>{children}</>
  );
}

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function GLTFModelFishTreasureBackground() {
  const gltf = useGLTF("/sea_life_challenge_pack/scene.gltf");
  const { scale } = { scale: 4.5 };
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

function GLTFModelCoral() {
  const gltf = useGLTF("/coral/coral_draco.glb");
  // const hoverAnimationRef = useHoverAnimation();
  // const { x, y, z } = useControls({ x: 0, y: -32, z: 0 });

  return (
    <animated.mesh>
      <primitive scale={2} position={[-0, -30, 0]} object={gltf.scene} />
    </animated.mesh>
  );
}

function GLTFModelTerrain() {
  const model = useGLTF("/terrain/terrain_draco.glb");
  return (
    <animated.mesh>
      <primitive scale={14} position={[0, -32, 0]} object={model.scene} />
    </animated.mesh>
  );
}

const SECONDS_PER_ROTATION = 240;
const SECONDS_PER_UP_DOWN_WAVE = 20;
const WAVE_DY = -60;

// swims in a circle
function GLTFModelLeviathan() {
  const { x, y, z } = { x: 740, y: -500, z: 0 };
  const { scaleKelp } = { scaleKelp: 89 };

  const swimAnimationRef = useRef(null as any);

  useFrame(({ clock }) => {
    if (!swimAnimationRef.current) {
      return;
    }
    const rotY =
      ((Math.PI * clock.getElapsedTime()) / SECONDS_PER_ROTATION) * -1;
    swimAnimationRef.current.rotation.set(0, rotY, 0);

    const deltaY =
      Math.sin(clock.getElapsedTime() / SECONDS_PER_UP_DOWN_WAVE) * WAVE_DY;
    swimAnimationRef.current.position.set(0, deltaY, 0);
  });

  const model = useGLTF("/leviathan/scene.gltf");
  // const hoverAnimationRef = useHoverAnimation();

  // Here's the animation part
  // *************************
  let mixer;
  if (model.animations.length) {
    mixer = new THREE.AnimationMixer(model.scene);
    model.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.play();
    });
  }

  useFrame((state, delta) => {
    mixer?.update(delta);
  });
  // *************************

  model.scene.traverse((child) => {
    if ((child as any).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      (child as any).material.side = THREE.FrontSide;
    }
  });

  return (
    <animated.mesh ref={swimAnimationRef}>
      <primitive
        scale={10 * scaleKelp}
        position={[x, y, z]}
        object={model.scene}
      />
    </animated.mesh>
  );
}

const guppy_SECONDS_PER_ROTATION = 180;
const guppy_SECONDS_PER_UP_DOWN_WAVE = 20;
const guppy_WAVE_DY = 12;
const INITIAL_ROTATION_Y = Math.random() * Math.PI;

// swims in a circle
function GLTFModelGuppy() {
  const { x, y, z } = { x: -50, y: 20, z: 0 };

  const swimAnimationRef = useRef(null as any);

  useFrame(({ clock }) => {
    if (!swimAnimationRef.current) {
      return;
    }
    const rotY =
      -(Math.PI * clock.getElapsedTime()) / guppy_SECONDS_PER_ROTATION;
    swimAnimationRef.current.rotation.set(0, rotY + INITIAL_ROTATION_Y, 0);

    const deltaY =
      Math.sin(clock.getElapsedTime() / guppy_SECONDS_PER_UP_DOWN_WAVE) *
      guppy_WAVE_DY;
    swimAnimationRef.current.position.set(deltaY / 2, deltaY, 0);
  });

  const model = useGLTF("/guppy/scene.gltf");
  // const hoverAnimationRef = useHoverAnimation();

  // Here's the animation part
  // *************************
  let mixer;
  if (model.animations.length) {
    mixer = new THREE.AnimationMixer(model.scene);
    model.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.play();
    });
  }

  useFrame((state, delta) => {
    mixer?.update(delta);
  });
  // *************************

  model.scene.traverse((child) => {
    if ((child as any).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      (child as any).material.side = THREE.FrontSide;
    }
  });

  return (
    <animated.mesh ref={swimAnimationRef}>
      <primitive scale={1} position={[x, y, z]} object={model.scene} />
    </animated.mesh>
  );
}
// swims in a circle
function GLTFModelclownfish() {
  const {
    clownfish_SECONDS_PER_ROTATION,
    clownfish_SECONDS_PER_UP_DOWN_WAVE,
    clownfish_WAVE_DY,
    clownfishScale,
  } = useControls({
    clownfish_SECONDS_PER_ROTATION: 60,
    clownfish_SECONDS_PER_UP_DOWN_WAVE: 20,
    clownfish_WAVE_DY: 10,
    clownfishScale: 0.2,
  });
  const { x, y, z, clownfish_INITIAL_ROTATION_Y } = {
    x: -20,
    y: -2,
    z: 0,
    clownfish_INITIAL_ROTATION_Y: Math.random() * Math.PI,
  };

  const swimAnimationRef = useRef(null as any);

  useFrame(({ clock }) => {
    if (!swimAnimationRef.current) {
      return;
    }
    const rotY =
      -(Math.PI * clock.getElapsedTime()) / clownfish_SECONDS_PER_ROTATION;
    swimAnimationRef.current.rotation.set(
      0,
      rotY + clownfish_INITIAL_ROTATION_Y,
      0
    );

    const deltaY =
      Math.sin(clock.getElapsedTime() / clownfish_SECONDS_PER_UP_DOWN_WAVE) *
      clownfish_WAVE_DY;
    swimAnimationRef.current.position.set(-deltaY / 2, deltaY, 0);
  });

  const model = useGLTF("/clownfish/scene.gltf");
  // const hoverAnimationRef = useHoverAnimation();

  // Here's the animation part
  // *************************
  let mixer;
  if (model.animations.length) {
    mixer = new THREE.AnimationMixer(model.scene);
    model.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.play();
    });
  }

  useFrame((state, delta) => {
    mixer?.update(delta);
  });
  // *************************

  model.scene.traverse((child) => {
    if ((child as any).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      (child as any).material.side = THREE.FrontSide;
    }
  });

  return (
    <animated.mesh ref={swimAnimationRef}>
      <primitive
        scale={clownfishScale}
        position={[x, y, z]}
        object={model.scene}
      />
    </animated.mesh>
  );
}
const schooloffish_SECONDS_PER_ROTATION = 50;
const schooloffish_SECONDS_PER_UP_DOWN_WAVE = 25;
const schooloffish_WAVE_DY = 16;

// swims in a circle
function GLTFModelschooloffish() {
  const { x, y, z, schooloffish_INITIAL_ROTATION_Y, schooloffishScale } = {
    x: -27,
    y: -6,
    z: 0,
    schooloffish_INITIAL_ROTATION_Y: Math.random() * Math.PI,
    schooloffishScale: 2.8,
  };

  const swimAnimationRef = useRef(null as any);

  useFrame(({ clock }) => {
    if (!swimAnimationRef.current) {
      return;
    }
    const rotY =
      -(Math.PI * clock.getElapsedTime()) / schooloffish_SECONDS_PER_ROTATION;
    swimAnimationRef.current.rotation.set(
      0,
      rotY + schooloffish_INITIAL_ROTATION_Y,
      0
    );

    const deltaY =
      Math.sin(clock.getElapsedTime() / schooloffish_SECONDS_PER_UP_DOWN_WAVE) *
      schooloffish_WAVE_DY;
    swimAnimationRef.current.position.set(-deltaY / 2, deltaY, 0);
  });

  const model = useGLTF("/schooloffish/scene.gltf");
  // const hoverAnimationRef = useHoverAnimation();

  // Here's the animation part
  // *************************
  let mixer;
  if (model.animations.length) {
    mixer = new THREE.AnimationMixer(model.scene);
    model.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.play();
    });
  }

  useFrame((state, delta) => {
    mixer?.update(delta);
  });
  // *************************

  model.scene.traverse((child) => {
    if ((child as any).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      (child as any).material.side = THREE.FrontSide;
    }
  });

  return (
    <animated.mesh ref={swimAnimationRef}>
      <primitive
        scale={schooloffishScale}
        position={[x, y, z]}
        object={model.scene}
      />
    </animated.mesh>
  );
}

// swims in a circle
function GLTFModelyellowfish() {
  const {
    x,
    y,
    z,
    yellowfish_WAVE_DY,
    yellowfish_INITIAL_ROTATION_Y,
    yellowfish_SECONDS_PER_ROTATION,
    yellowfish_SECONDS_PER_UP_DOWN_WAVE,
    yellowfishScale,
  } = {
    x: 34,
    y: -40,
    z: 0,
    yellowfish_WAVE_DY: 10,
    yellowfish_INITIAL_ROTATION_Y: Math.random() * Math.PI,
    yellowfish_SECONDS_PER_ROTATION: 25,
    yellowfish_SECONDS_PER_UP_DOWN_WAVE: 21,
    yellowfishScale: 0.02,
  };

  const swimAnimationRef = useRef(null as any);

  useFrame(({ clock }) => {
    if (!swimAnimationRef.current) {
      return;
    }
    const rotY =
      -(Math.PI * clock.getElapsedTime()) / yellowfish_SECONDS_PER_ROTATION;
    swimAnimationRef.current.rotation.set(
      0,
      rotY + yellowfish_INITIAL_ROTATION_Y,
      0
    );

    const deltaY =
      Math.sin(clock.getElapsedTime() / yellowfish_SECONDS_PER_UP_DOWN_WAVE) *
      yellowfish_WAVE_DY;
    swimAnimationRef.current.position.set(-deltaY / 2, deltaY, 0);
  });

  const model = useGLTF("/yellowfish/scene.gltf");
  // const hoverAnimationRef = useHoverAnimation();

  // Here's the animation part
  // *************************
  let mixer;
  if (model.animations.length) {
    mixer = new THREE.AnimationMixer(model.scene);
    model.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.play();
    });
  }

  useFrame((state, delta) => {
    mixer?.update(delta);
  });
  // *************************

  model.scene.traverse((child) => {
    if ((child as any).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      (child as any).material.side = THREE.FrontSide;
    }
  });

  return (
    <animated.mesh ref={swimAnimationRef}>
      <primitive
        scale={yellowfishScale}
        position={[x, y, z]}
        object={model.scene}
      />
    </animated.mesh>
  );
}

// // swims in a circle
// function GLTFModelhammerhead() {
//   const {
//     x,
//     y,
//     z,
//     hammerhead_WAVE_DY,
//     hammerhead_INITIAL_ROTATION_Y,
//     hammerhead_SECONDS_PER_ROTATION,
//     hammerhead_SECONDS_PER_UP_DOWN_WAVE,
//     hammerheadScale,
//   } = {
//     x: 89,
//     y: 18,
//     z: 0,
//     hammerhead_WAVE_DY: 10,
//     hammerhead_INITIAL_ROTATION_Y: Math.random() * Math.PI,
//     hammerhead_SECONDS_PER_ROTATION: 76,
//     hammerhead_SECONDS_PER_UP_DOWN_WAVE: 21,
//     hammerheadScale: 7,
//   };

//   const swimAnimationRef = useRef(null as any);

//   useFrame(({ clock }) => {
//     if (!swimAnimationRef.current) {
//       return;
//     }
//     const rotY =
//       -(Math.PI * clock.getElapsedTime()) / hammerhead_SECONDS_PER_ROTATION;
//     swimAnimationRef.current.rotation.set(
//       0,
//       rotY + hammerhead_INITIAL_ROTATION_Y,
//       0
//     );

//     const deltaY =
//       Math.sin(clock.getElapsedTime() / hammerhead_SECONDS_PER_UP_DOWN_WAVE) *
//       hammerhead_WAVE_DY;
//     swimAnimationRef.current.position.set(-deltaY / 2, deltaY, 0);
//   });

//   const model = useGLTF("/hammerhead/scene.gltf");
//   // const hoverAnimationRef = useHoverAnimation();

//   // Here's the animation part
//   // *************************
//   let mixer;
//   if (model.animations.length) {
//     mixer = new THREE.AnimationMixer(model.scene);
//     model.animations.forEach((clip) => {
//       const action = mixer.clipAction(clip);
//       action.play();
//     });
//   }

//   useFrame((state, delta) => {
//     mixer?.update(delta);
//   });
//   // *************************

//   model.scene.traverse((child) => {
//     if ((child as any).isMesh) {
//       child.castShadow = true;
//       child.receiveShadow = true;
//       (child as any).material.side = THREE.FrontSide;
//     }
//   });

//   return (
//     <animated.mesh ref={swimAnimationRef}>
//       <primitive
//         scale={hammerheadScale}
//         position={[x, y, z]}
//         object={model.scene}
//       />
//     </animated.mesh>
//   );
// }

// swims in a circle
function GLTFModelgreatwhite() {
  const {
    x,
    y,
    z,
    greatwhite_WAVE_DY,
    greatwhite_INITIAL_ROTATION_Y,
    greatwhite_SECONDS_PER_ROTATION,
    greatwhite_SECONDS_PER_UP_DOWN_WAVE,
    greatwhiteScale,
  } = {
    x: 413,
    y: -86,
    z: 0,
    greatwhite_WAVE_DY: 24,
    greatwhite_INITIAL_ROTATION_Y: Math.random() * Math.PI,
    greatwhite_SECONDS_PER_ROTATION: 91,
    greatwhite_SECONDS_PER_UP_DOWN_WAVE: 21,
    greatwhiteScale: 4.1,
  };

  const swimAnimationRef = useRef(null as any);

  useFrame(({ clock }) => {
    if (!swimAnimationRef.current) {
      return;
    }
    const rotY =
      -(Math.PI * clock.getElapsedTime()) / greatwhite_SECONDS_PER_ROTATION;
    swimAnimationRef.current.rotation.set(
      0,
      rotY + greatwhite_INITIAL_ROTATION_Y,
      0
    );

    const deltaY =
      Math.sin(clock.getElapsedTime() / greatwhite_SECONDS_PER_UP_DOWN_WAVE) *
      greatwhite_WAVE_DY;
    swimAnimationRef.current.position.set(-deltaY / 2, deltaY, 0);
  });

  const model = useGLTF("/greatwhite/scene.gltf");
  // const hoverAnimationRef = useHoverAnimation();

  // Here's the animation part
  // *************************
  let mixer;
  if (model.animations.length) {
    mixer = new THREE.AnimationMixer(model.scene);
    model.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.play();
    });
  }

  useFrame((state, delta) => {
    mixer?.update(delta);
  });
  // *************************

  model.scene.traverse((child) => {
    if ((child as any).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      (child as any).material.side = THREE.FrontSide;
    }
  });

  return (
    <animated.mesh ref={swimAnimationRef}>
      <primitive
        scale={greatwhiteScale}
        position={[x, y, z]}
        object={model.scene}
      />
    </animated.mesh>
  );
}
// swims in a circle
function GLTFModelballena() {
  const {
    x,
    y,
    z,
    ballena_WAVE_DY,
    ballena_INITIAL_ROTATION_Y,
    ballena_SECONDS_PER_ROTATION,
    ballena_SECONDS_PER_UP_DOWN_WAVE,
    ballenaScale,
  } = {
    x: 0,
    y: 260,
    z: 980,
    ballena_WAVE_DY: 24,
    ballena_INITIAL_ROTATION_Y: Math.random() * Math.PI,
    ballena_SECONDS_PER_ROTATION: 180,
    ballena_SECONDS_PER_UP_DOWN_WAVE: 21,
    ballenaScale: 1.8,
  };

  const swimAnimationRef = useRef(null as any);

  useFrame(({ clock }) => {
    if (!swimAnimationRef.current) {
      return;
    }
    const rotY =
      -(Math.PI * clock.getElapsedTime()) / ballena_SECONDS_PER_ROTATION;
    swimAnimationRef.current.rotation.set(
      0,
      rotY + ballena_INITIAL_ROTATION_Y,
      0
    );

    const deltaY =
      Math.sin(clock.getElapsedTime() / ballena_SECONDS_PER_UP_DOWN_WAVE) *
      ballena_WAVE_DY;
    swimAnimationRef.current.position.set(-deltaY / 2, deltaY, 0);
  });

  const model = useGLTF("/ballena/scene.gltf");
  // const hoverAnimationRef = useHoverAnimation();

  // Here's the animation part
  // *************************
  let mixer;
  if (model.animations.length) {
    mixer = new THREE.AnimationMixer(model.scene);
    model.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.play();
    });
  }

  useFrame((state, delta) => {
    mixer?.update(delta);
  });
  // *************************

  model.scene.traverse((child) => {
    if ((child as any).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      (child as any).material.side = THREE.FrontSide;
    }
  });

  return (
    <animated.mesh ref={swimAnimationRef}>
      <primitive
        scale={ballenaScale}
        position={[x, y, z]}
        object={model.scene}
      />
    </animated.mesh>
  );
}

// swims in a circle
function GLTFModelsailfish() {
  const {
    x,
    y,
    z,
    sailfish_WAVE_DY,
    sailfish_INITIAL_ROTATION_Y,
    sailfish_SECONDS_PER_ROTATION,
    sailfish_SECONDS_PER_UP_DOWN_WAVE,
    sailfishScale,
  } = {
    x: 91,
    y: 6,
    z: 0,
    sailfish_WAVE_DY: -9,
    sailfish_INITIAL_ROTATION_Y: Math.random() * Math.PI,
    sailfish_SECONDS_PER_ROTATION: 45,
    sailfish_SECONDS_PER_UP_DOWN_WAVE: -12,
    sailfishScale: 1.8,
  };

  const swimAnimationRef = useRef(null as any);

  useFrame(({ clock }) => {
    if (!swimAnimationRef.current) {
      return;
    }
    const rotY =
      -(Math.PI * clock.getElapsedTime()) / sailfish_SECONDS_PER_ROTATION;
    swimAnimationRef.current.rotation.set(
      0,
      rotY + sailfish_INITIAL_ROTATION_Y,
      0
    );

    const deltaY =
      Math.sin(clock.getElapsedTime() / sailfish_SECONDS_PER_UP_DOWN_WAVE) *
      sailfish_WAVE_DY;
    swimAnimationRef.current.position.set(-deltaY / 2, deltaY, 0);
  });

  const model = useGLTF("/sailfish/scene.gltf");
  // const hoverAnimationRef = useHoverAnimation();

  // Here's the animation part
  // *************************
  let mixer;
  if (model.animations.length) {
    mixer = new THREE.AnimationMixer(model.scene);
    model.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.play();
    });
  }

  useFrame((state, delta) => {
    mixer?.update(delta);
  });
  // *************************

  model.scene.traverse((child) => {
    if ((child as any).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      (child as any).material.side = THREE.FrontSide;
    }
  });

  return (
    <animated.mesh ref={swimAnimationRef}>
      <primitive
        scale={sailfishScale}
        position={[x, y, z]}
        object={model.scene}
      />
    </animated.mesh>
  );
}

// function GLTFModelXNoAnimations() {
//   const { x, y, z } = useControls({ x: -19, y: -55, z: 16 });

//   const gltf = useGLTF("/terrain/scene.gltf");
//   const { scaleKelp } = useControls({ scaleKelp: 0.6 });
//   // const hoverAnimationRef = useHoverAnimation();
//   return (
//     <animated.mesh>
//       <primitive
//         scale={10 * scaleKelp}
//         position={[x, y, z]}
//         object={gltf.scene}
//         //  material={nodes.ATP___Gaussian_surface.material}
//         //  geometry={nodes.ATP___Gaussian_surface.geometry}
//       />
//     </animated.mesh>
//   );
// }
