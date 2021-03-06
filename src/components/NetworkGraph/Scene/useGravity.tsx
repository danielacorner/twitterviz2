import { WorkerApi } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useConfig } from "providers/store/useConfig";

const G = 0.008;

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

      // lower upward force, stronger downward force
      const vy = velocity.current[1];
      const gravityModified = gravityForce * (vy > 0 ? 0.6 : 1.4);

      api.applyForce(
        vec
          .set(...position.current)
          .normalize()
          .multiplyScalar(-gravityModified)
          .toArray(),
        [0, 0, 0]
      );

      // if we're near the center, slow down faster
      if (distanceFromCenter < MAX_DISTANCE_FROM_CENTER) {
        const [vx, vy, vz] = velocity.current.map((d) => d * 0.94);
        api.velocity.set(vx, vy, vz);
      } else {
        // slow down normally
        const [vx, vy, vz] = velocity.current.map((d) => d * 0.99);
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

/** inverse gravity = gets stronger farther from the center */
function getInverseGravityForce(distanceFromCenter, G) {
  return G * distanceFromCenter ** 2;
}
