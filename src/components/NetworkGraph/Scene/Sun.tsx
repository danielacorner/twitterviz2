import { useFrame } from "@react-three/fiber";
import { forwardRef } from "react";

const SUN_RADIUS = 10;
const SUN_Y = 150;
const SUN_X = 60;
const SUN_Z = -500;
const SUN_WOBBLE = 6;
export const Sun = forwardRef(function Sun(props, forwardRef) {
  useFrame(({ clock }) => {
    (forwardRef as any).current.position.x =
      Math.sin(clock.getElapsedTime()) * -SUN_WOBBLE + SUN_X;
    (forwardRef as any).current.position.z =
      Math.cos(clock.getElapsedTime()) * -SUN_WOBBLE + SUN_Z;
  });

  return (
    <mesh ref={forwardRef as any} position={[0, SUN_Y, 0]} {...props}>
      <sphereGeometry args={[SUN_RADIUS, 36, 36]} />
      <meshBasicMaterial color={"#00FF00"} />
    </mesh>
  );
});
