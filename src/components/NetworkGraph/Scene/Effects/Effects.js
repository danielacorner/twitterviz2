import { useRef } from "react";
import {
  Bloom,
  EffectComposer,
  GodRays,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, Resizer, KernelSize } from "postprocessing";
import { Sun } from "../Sun";
import { useDetectGPU } from "@react-three/drei";

export function Effects() {
  const sun = useRef(null);
  const gpuInfo = useDetectGPU();
  const composer = useRef();
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
            samples={20}
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
          {/* <Bloom
            kernelSize={2}
            luminanceThreshold={0}
            luminanceSmoothing={0.4}
            intensity={0.6}
          /> */}
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
