import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

// const JITTER_EVERY_N_SECONDS = 1;
const mu = 0.5;
export function useHoverAnimation({
  deltaX = 0.01,
  deltaY = 0.02,
  deltaZ = 0.01,
  randomize = false,
} = {}) {
  // initialize a random number, then change it each frame
  const rand = useRef(randomize ? Math.random() : 1);

  const ref = useRef(null as any);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.x =
        Math.sin(mu * rand.current * clock.getElapsedTime()) * deltaX;
      ref.current.position.y =
        Math.sin(mu * rand.current * clock.getElapsedTime()) * deltaY;
      ref.current.position.z =
        Math.sin(mu * rand.current * clock.getElapsedTime()) * deltaZ;

      ref.current.rotation.x =
        Math.sin(mu * rand.current * clock.getElapsedTime()) * 0.01;
      ref.current.rotation.y =
        Math.sin(mu * rand.current * clock.getElapsedTime() - 2000) * 0.01;
      ref.current.rotation.z =
        Math.sin(mu * rand.current * clock.getElapsedTime() + 1000) * 0.01;
    }
    // if (Math.floor(clock.getElapsedTime()) % JITTER_EVERY_N_SECONDS === 0) {
    const randNum = Math.random() - 0.5;
    rand.current = rand.current + (randomize ? 0.0003 * randNum : 0);
    // }
  });
  return ref;
}
