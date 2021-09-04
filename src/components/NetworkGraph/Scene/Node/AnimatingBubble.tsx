import { useSphere } from "@react-three/cannon";
import { useSpring, animated } from "@react-spring/three";
import { CONFIG_POP_OUT, NODE_RADIUS } from "utils/constants";
import { useState } from "react";
import { useMount } from "utils/utils";
import { getRandomPosition, notABotMaterial } from "./Node";

const V1 = 0.001;
const BUBBLE_RADIUS_MULT = 0.18;
export function AnimatingBubble({ handleUnmount }) {
  const [sphereRef /*, api */] = useSphere(() => ({
    mass: 0.007,
    position: getRandomPosition(-1.5 * NODE_RADIUS, 1.5 * NODE_RADIUS) as any,
    velocity: [
      0,
      // Math.random() * V1 - V1 / 2,
      Math.random() * V1,
      0,
      // Math.random() * V1 - V1 / 2,
    ],
    // onRest: handleUnmount,
  }));
  // useFrame(()=>{
  //   sphereRef.current.velocity
  // })
  // usespring
  const [isOpaque, setIsOpaque] = useState(true);
  // useMount(() => {
  //   setIsOpaque(true);
  // });
  useMount(() => {
    window.setTimeout(() => {
      setIsOpaque(false);
    }, Math.random() * 300 + 100);
  });
  const { opacity } = useSpring({
    opacity: isOpaque ? 1 : 0,
    config: CONFIG_POP_OUT,
  });
  return (
    <mesh ref={sphereRef} material={notABotMaterial}>
      <sphereBufferGeometry
        attach="geometry"
        args={[NODE_RADIUS * Math.random() * BUBBLE_RADIUS_MULT, 32, 32]}
      />
      <animated.meshPhysicalMaterial
        {...{
          metalness: 0.4,
          transmission: 1,
          roughness: 0,
          envMapIntensity: 4,
          transparent: true,
        }}
        opacity={opacity}
      />
    </mesh>
  );
}
