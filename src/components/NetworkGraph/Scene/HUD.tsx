import { Scene, Matrix4 } from "three";
import { useRef, useMemo } from "react";
import { useFrame, useThree, createPortal, Vector3 } from "@react-three/fiber";
import { OrthographicCamera, useCamera } from "@react-three/drei";

/** displays a set of 3d components in a fixed position based on Viewcube https://codesandbox.io/s/react-three-fiber-viewcube-py4db */
const HUD = ({ children, position }) => {
  const { gl, camera, size } = useThree();
  const virtualScene = useMemo(() => new Scene(), []);
  const virtualCam = useRef();
  const ref = useRef(null as any);
  const matrix = new Matrix4();

  useFrame(() => {
    matrix.copy(camera.matrix).invert();
    ref.current?.quaternion.setFromRotationMatrix(matrix);
    gl.autoClear = true;
    // gl.render(scene, camera); // cancels out Effects
    gl.autoClear = false;
    gl.clearDepth();
    gl.render(virtualScene, virtualCam.current as any);
  }, 2);

  const meshPosition: Vector3 = [0, 0, -size.width / 2];

  return createPortal(
    <>
      <OrthographicCamera
        {...({} as any)}
        ref={virtualCam}
        makeDefault={false}
        position={position}
      />
      <mesh
        ref={ref}
        raycast={useCamera(virtualCam as any)}
        position={meshPosition}
        scale={[70, 70, 70]}
        renderOrder={2}
      >
        {children}
      </mesh>
      <pointLight
        position={[meshPosition[0], meshPosition[1], 400]}
        intensity={2}
      />
    </>,
    virtualScene
  ) as any;
};

export default HUD;
