import { useRef } from "react";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  GodRays,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, Resizer, KernelSize } from "postprocessing";
import { Sun } from "../Sun";
import { useDetectGPU } from "@react-three/drei";
import { extend, useLoader, useThree } from "@react-three/fiber";
import { LUTPass } from "three/examples/jsm/postprocessing/LUTPass";
import { LUTCubeLoader } from "three/examples/jsm/loaders/LUTCubeLoader";
import { useControls } from "leva";
extend({ LUTPass });

export function Effects() {
  const sun = useRef(null);
  const gpuInfo = useDetectGPU();
  const { viewport: { width, height } } = useThree() // prettier-ignore
  const { texture3D } = useLoader(LUTCubeLoader, "/cubemap/cubicle-99.CUBE");
  const { focalLength, focusDistance } = useControls({
    focalLength: 1,
    focusDistance: 0.2,
  });
  return gpuInfo.tier > 2 ? (
    <>
      <Sun ref={sun} />
      {sun.current && (
        <EffectComposer multisampling={0} renderPriority={1}>
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
            luminanceThreshold={0}
            luminanceSmoothing={0}
            intensity={0.5}
          />
          <DepthOfField
            /* ref={ref}  */ bokehScale={4}
            focalLength={focalLength}
            focusDistance={focusDistance}
            width={(width * 5) / 2}
            height={(height * 5) / 2}
          />
          <Vignette />
          {/* <lUTPass attachArray="passes" lut={texture3D} /> */}
        </EffectComposer>
      )}
    </>
  ) : null;
}
