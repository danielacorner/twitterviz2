import { MeshWobbleMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const WIDTH = 4;
const SCAN_SPEED = 2.4;
export function ScanningAnimation() {
  const ref = useRef<any>(null);
  const ref2 = useRef<any>(null);
  const ref3 = useRef<any>(null);
  const ref4 = useRef<any>(null);
  const ref5 = useRef<any>(null);
  const ref6 = useRef<any>(null);

  useFrame(({ clock }) => {
    const seconds = clock.getElapsedTime();
    if (ref.current && ref2.current) {
      const progress = (seconds % (Math.PI * 2)) * SCAN_SPEED;
      const y = Math.sin(progress) * WIDTH * 0.5;

      ref5.current.opacity = y ** 2;
      ref6.current.opacity = 1 - y ** 2;

      ref.current.position.set(0, y, 0);
      const x = Math.sin(progress - 0.9) * WIDTH * 0.5;
      ref3.current.position.set(x, 0, 0);

      ref2.current.rotation.y += 0.01;
      ref2.current.rotation.z += y / 128;

      ref2.current.scale.x = y / 16 + 1;
      ref2.current.scale.y = y / 16 + 1;
      ref2.current.scale.z = y / 16 + 1;

      const opacity = (1 - (Math.round((y % 1) * 100) / 100 + 1) / 2) * 0.5;
      ref4.current.opacity = opacity;
    }
  });

  return (
    <mesh>
      {/* scanning box */}
      <mesh ref={ref}>
        <boxBufferGeometry args={[WIDTH, 0.02 * WIDTH, WIDTH]} />
        <MeshWobbleMaterial
          skinning={true}
          factor={0.6}
          speed={8}
          ref={ref5}
          {...{
            metalness: 0.94,
            roughness: 0.1,
            color: "#1fd5db",
            transparent: true,
            opacity: 0.8,
          }}
        />
        {/* <meshPhysicalMaterial
              transparent={true}
              ref={ref5}
              color={"#99dffa"}
              transmission={0.98}
              roughness={0.05}
            /> */}
      </mesh>

      {/* scanning box 2 */}
      <mesh ref={ref3}>
        <boxBufferGeometry args={[0.02 * WIDTH, WIDTH, WIDTH]} />
        {/* <MeshWobbleMaterial
          skinning={true}
          factor={0.6}
          speed={8}
          ref={ref6}
          {...{
            metalness: 0.94,
            roughness: 0.1,
            color: "#1fd5db",
            transparent: true,
            opacity: 0.8,
          }}
        /> */}
        <meshPhysicalMaterial
          transparent={true}
          ref={ref6}
          color={"#99dffa"}
          transmission={0.98}
          roughness={0.05}
        />
      </mesh>

      {/* Background plane w. scanning effect?  */}

      {/* scanning icosahedron */}
      <mesh ref={ref2}>
        <icosahedronBufferGeometry args={[2.5, 1]} />
        <meshBasicMaterial
          ref={ref4}
          wireframe={true}
          transparent={true}
          // opacity={0.15}
          color={"#3ac7ff"}
        />
      </mesh>
    </mesh>
  );
}
