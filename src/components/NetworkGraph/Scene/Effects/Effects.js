import { useEffect, useRef } from "react";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  GodRays,
  Scanline,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, Resizer, KernelSize } from "postprocessing";
import { Sun } from "../Sun";
import { useDetectGPU } from "@react-three/drei";
import { extend, useFrame, useLoader, useThree } from "@react-three/fiber";
import { LUTPass } from "three/examples/jsm/postprocessing/LUTPass";
import { LUTCubeLoader } from "three/examples/jsm/loaders/LUTCubeLoader";
import { useControls } from "leva";
import { useAtom } from "jotai";
import { scanningUserNodeIdAtom } from "providers/store/store";
import { NewWaterPass } from "./NewWaterPass";
import { WaterPassEffect } from "./WaterPass";

export function Effects() {
  const sun = useRef(null);
  const gpuInfo = useDetectGPU();
  const { viewport: { width, height } } = useThree() // prettier-ignore
  const { texture3D } = useLoader(LUTCubeLoader, "/cubemap/cubicle-99.CUBE");
  const { focalLength, focusDistance, bokehScale } = useControls({
    focalLength: 1,
    focusDistance: 0.2,
    bokehScale: 2,
  });
  const [scanningNodeId] = useAtom(scanningUserNodeIdAtom);
  const composer = useRef();
  const { scene, gl, size, camera } = useThree();
  // const waterpassRef = useRef();
  // useEffect(() => {
  //   if (!composer.current) {
  //     return;
  //   }
  //   void composer.current.setSize(size.width, size.height);
  // }, [size]);
  // useFrame(() => {
  //   if (!waterpassRef.current) {
  //     return;
  //   }
  //   waterpassRef.current.factor += (1 - waterpassRef.current.factor) * 0.01;
  //   composer.current.render();
  // }, 2);
  const isScanning = Boolean(scanningNodeId);
  return gpuInfo.tier > 2 ? (
    <>
      <Sun ref={sun} />
      {sun.current && (
        <EffectComposer ref={composer} multisampling={0} renderPriority={1}>
          {/* react-postprocessing docs https://github.com/pmndrs/react-postprocessing/blob/master/api.md */}
          {/* postprocessing docs https://vanruesc.github.io/postprocessing/public/docs/ */}
          <GodRays
            sun={sun.current}
            blendFunction={BlendFunction.Screen}
            samples={30}
            density={0.95}
            decay={1.0}
            weight={0.24}
            exposure={0.5}
            clampMax={1}
            width={Resizer.AUTO_SIZE}
            height={Resizer.AUTO_SIZE}
            kernelSize={KernelSize.SMALL}
            blur={0.1}
          />
          <Bloom
            kernelSize={2}
            luminanceThreshold={0}
            luminanceSmoothing={0.4}
            intensity={0.6}
          />
          <Bloom
            kernelSize={KernelSize.VERY_LARGE}
            luminanceThreshold={0.4} // only bloom the centermost nodes
            luminanceSmoothing={0}
            intensity={0.5}
          />
          <Vignette />
          {/* <WaterPassEffect ref={waterpassRef} /> */}
          {/* <StereoEffect /> */}
          {/* <lUTPass attachArray="passes" lut={texture3D} /> */}
        </EffectComposer>
      )}
    </>
  ) : null;
}
