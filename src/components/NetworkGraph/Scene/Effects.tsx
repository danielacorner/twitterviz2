import { useRef } from "react";
import { Bloom, EffectComposer, GodRays } from "@react-three/postprocessing";
import { BlendFunction, Resizer, KernelSize } from "postprocessing";
import { getHourOfDay, Sun } from "./Scene";

export function Effects() {
  // const [sun, set] = useState(null);
  const sun = useRef(null);
  const hourOfDay = getHourOfDay();
  console.log("🌟🚨 ~ Effects ~ hourOfDay", hourOfDay);

  return (
    <>
      <Sun ref={sun} />
      {sun.current && (
        <EffectComposer multisampling={0}>
          <GodRays
            sun={sun.current as any}
            blendFunction={BlendFunction.Screen}
            samples={30}
            density={0.95}
            decay={1.0}
            weight={0.24}
            exposure={0.16}
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
        </EffectComposer>
      )}
    </>
  );
}
