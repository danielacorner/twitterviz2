import { usePlane } from "@react-three/cannon";

const DEPTH = 9;
export function Collisions() {
  usePlane(() => ({ position: [0, 0, -DEPTH], rotation: [0, 0, 0] }));
  usePlane(() => ({ position: [0, 0, DEPTH], rotation: [0, -Math.PI, 0] }));
  // usePlane(() => ({ position: [0, -4, 0], rotation: [-Math.PI / 2, 0, 0] }));
  // usePlane(() => ({ position: [0, 4, 0], rotation: [Math.PI / 2, 0, 0] }));
  return null;
}
