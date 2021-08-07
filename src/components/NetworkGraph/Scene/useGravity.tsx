import { WorkerApi } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useConfig } from "providers/store/useConfig";

/** within this distance, nodes slow down to 0 */
const MAX_DISTANCE_FROM_CENTER = 16;
/** apply force toward center
    copied from https://codesandbox.io/s/zxpv7?file=/src/App.js:1195-1404 */
export function useGravity(api: PublicApi, vec: any) {
  const position = useRef([0, 0, 0]);
  const velocity = useRef([0, 0, 0]);
  const { isPaused } = useConfig();

  useEffect(() => api.position.subscribe((v) => (position.current = v)), [api]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api]);
  useFrame(() => {
    if (isPaused) {
      api.velocity.set(0, 0, 0);
    } else {
      // speed lowers as we approach the center
      // max speed at position = Infinity
      // 0 speed at position = 0
      const distanceFromCenter = getDistanceBetweenPoints(
        [0, 0, 0],
        position.current
      );
      const gravityForce = getInverseGravityForce(distanceFromCenter, G);

      api.applyForce(
        vec
          .set(...position.current)
          .normalize()
          .multiplyScalar(-gravityForce)
          .toArray(),
        [0, 0, 0]
      );

      // if we're near the center, slow down
      if (distanceFromCenter < MAX_DISTANCE_FROM_CENTER) {
        const [vx, vy, vz] = velocity.current.map((d) => d * 0.95);
        api.velocity.set(vx, vy, vz);
      }
    }
  });
}
interface PublicApi extends WorkerApi {
  at: (index: number) => WorkerApi;
}

function getDistanceBetweenPoints(p1, p2) {
  const x = p1[0] - p2[0];
  const y = p1[1] - p2[1];
  const z = p1[2] - p2[2];
  return Math.sqrt(x * x + y * y + z * z);
}

const G = 0.008;

/** inverse gravity = gets stronger farther from the center */
function getInverseGravityForce(distanceFromCenter, G) {
  return G * distanceFromCenter ** 2;
}
