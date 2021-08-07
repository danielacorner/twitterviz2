import { usePlane } from "@react-three/cannon";
import { useThree } from "@react-three/fiber";

const DEPTH = 9;
export function Collisions() {
  // back, front
  usePlane(() => ({ position: [0, 0, -DEPTH], rotation: [0, 0, 0] }));
  usePlane(() => ({ position: [0, 0, DEPTH], rotation: [0, -Math.PI, 0] }));

  // left, right
  const { viewport } = useThree();
  console.log("🌟🚨 ~ Collisions ~ viewport", viewport);
  const width = viewport.width / 8;
  usePlane(() => ({
    position: [width * 1.2, 0, 0],
    rotation: [0, -Math.PI / 2, 0],
  }));
  usePlane(() => ({
    position: [-width * 1.2, 0, 0],
    rotation: [0, Math.PI / 2, 0],
  }));
  return null;
}
