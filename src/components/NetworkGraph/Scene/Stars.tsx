import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

// https://codesandbox.io/s/9y8vkjykyy?file=/src/index.js
const WIDTH = 200;
export function Stars({ count }) {
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
      transmission: 1,
      roughness: 0,
      envMapIntensity: 4,
      transparent: true,
      opacity: 0.4,
      // transparent:true,opacity
    });
    // const nMat = new THREE.MeshBasicMaterial({
    //   color: new THREE.Color("cornflowerblue"),
    // });
    const nCoords = new Array(count)
      .fill(null)
      .map((i) => [
        Math.random() * 2 * WIDTH - WIDTH,
        Math.random() * 2 * WIDTH - WIDTH,
        Math.random() * 2 * WIDTH - WIDTH,
      ]);
    return [nGeo, nMat, nCoords];
  }, [count]);

  return (
    // <points
    //   ref={group}
    //   position={[0, 10, 0]}
    //   rotation={[-Math.PI / 4, 0, Math.PI / 6]}
    // >
    //   <sphereBufferGeometry args={[1, 10, 10]}>
    //     <bufferAttribute
    //       attachObject={["attributes", "position"]}
    //       count={coords.length / 3}
    //       array={coords as any}
    //       // itemSize={3}
    //     />
    //   </sphereBufferGeometry>
    // </points>
    <group ref={group}>
      {coords.map(([p1, p2, p3], i) => {
        const rand = Math.random() * 1.4;
        return (
          <mesh
            key={i}
            geometry={geo}
            material={mat}
            position={[p1, p2, p3]}
            scale={[rand, rand, rand]}
          />
        );
      })}
    </group>
  );
}
