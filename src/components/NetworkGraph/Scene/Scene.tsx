import { OrbitControls } from "@react-three/drei";
import { useGraphWithUsersAndLinks } from "../useGraphWithUsersAndLinks";
import { Physics } from "@react-three/cannon";
import { Node } from "./Node";
import * as THREE from "three";
import { uniqBy } from "lodash";
import { BotScoreLegend } from "./BotScoreLegend";
import { useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { CAMERA_POSITION } from "utils/constants";
import { useSpring } from "react-spring";
import { Suspense, useState } from "react";
import { useMount } from "utils/utils";
import { Sky /* Stars */ } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTurbidityByTimeOfDay } from "./useTurbidityByTimeOfDay";

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
      <Stars count={2000} />
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
      <directionalLight
        position={[0.2, 0.5, -1]}
        intensity={1}
        color="cornflowerblue"
      />
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

// https://codesandbox.io/s/9y8vkjykyy?file=/src/index.js
export function Stars({ count = 2000 }) {
  let group = useRef(null as any);
  let spin = 0.1;
  const speed = 0.0001;
  let scale = 1;
  useFrame(() => {
    // Some things maybe shouldn't be declarative, we're in the render-loop here with full access to the instance
    // const r = 5 * Math.sin(degToRad((speed += 0.1)));
    // const s = Math.cos(degToRad(speed * 2));
    group.current.rotation.set(spin, spin, (spin += speed));
    group.current.scale.set(scale, scale, scale);
  });
  const [geo, mat, coords] = useMemo(() => {
    const nGeo = new THREE.SphereBufferGeometry(1, 10, 10);
    const nMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("cornflowerblue"),
      metalness: 0.9,
      roughness: 0.2,
    });
    // const nMat = new THREE.MeshBasicMaterial({
    //   color: new THREE.Color("cornflowerblue"),
    // });
    const nCoords = new Array(count)
      .fill(null)
      .map((i) => [
        Math.random() * 800 - 400,
        Math.random() * 800 - 400,
        Math.random() * 800 - 400,
      ]);
    return [nGeo, nMat, nCoords];
  }, [count]);

  return (
    <group ref={group}>
      {coords.map(([p1, p2, p3], i) => (
        <mesh key={i} geometry={geo} material={mat} position={[p1, p2, p3]} />
      ))}
    </group>
  );
}

function degToRad(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}
