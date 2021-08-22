import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const mu = 0.5;
export function useHoverAnimation() {
  const ref = useRef(null as any);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(mu * clock.getElapsedTime()) * 0.02;
      ref.current.position.x = Math.sin(mu * clock.getElapsedTime()) * 0.01;
      ref.current.position.z = Math.sin(mu * clock.getElapsedTime()) * 0.01;

      ref.current.rotation.x = Math.sin(mu * clock.getElapsedTime()) * 0.01;
      ref.current.rotation.y =
        Math.sin(mu * clock.getElapsedTime() - 2000) * 0.01;
      ref.current.rotation.z =
        Math.sin(mu * clock.getElapsedTime() + 1000) * 0.01;
    }
  });
  return ref;
}
