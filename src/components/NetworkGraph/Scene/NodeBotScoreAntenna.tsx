import { useSpring, animated } from "@react-spring/three";
import { Text, Billboard } from "@react-three/drei";
import { useState } from "react";
import { useMount } from "utils/utils";

export function NodeBotScoreAntenna({ showLabels = false, botScore }) {
  useMount(() => {
    console.log("🌟🚨 ~ NodeBotScoreAntenna ~ botScore", botScore);
  });
  const antennae = [
    // top
    {
      label: "Overall",
      score: botScore.overall,
      color: "#ff0000",
      rotation: [0, 0, 0],
    },
    // top right
    {
      label: "Astroturf",
      score: botScore.astroturf,
      color: "#09ff00",
      rotation: [0, 0, -Math.PI / 3],
    },
    // top left
    {
      label: "Financial",
      score: botScore.financial,
      color: "#75d87a",
      rotation: [0, 0, Math.PI / 3],
    },
    // bottom right
    {
      label: "Fake Follower",
      score: botScore.fake_follower,
      color: "#de70f1",
      rotation: [0, 0, (-Math.PI / 3) * 2],
    },
    // bottom left
    {
      label: "Spammer",
      score: botScore.spammer,
      color: "#f19244",
      rotation: [0, 0, (Math.PI / 3) * 2],
    },
    // bottom
    {
      label: "Self Declared",
      score: botScore.self_declared,
      color: "#dadada",
      rotation: [0, 0, Math.PI],
    },
  ];
  return (
    <mesh>
      {antennae.map(({ rotation, color, score, label }, idx) => (
        <mesh key={color} rotation={rotation} scale={[score, score, score]}>
          <Antenna
            {...{
              color,
              score,
              label,
              showLabels,
              isBottom: idx > 2,
            }}
          />
        </mesh>
      ))}
    </mesh>
  );
}
function Antenna({ color, score, label, showLabels, isBottom }) {
  const [mounted, setMounted] = useState(false);
  useMount(() => {
    setMounted(true);
  });
  const springProps = useSpring({
    scale: [0.7, mounted ? 0.7 : 0, 0.7],
    position: [0, mounted ? 5 : 0, 0],
  });
  return (
    <>
      {/* stick */}
      <animated.mesh position={[0, 2, 0]} scale={springProps.scale}>
        <cylinderBufferGeometry args={[0.2, 0.2, 7.2, 26, 1]} />
        <meshLambertMaterial
          metalness={0.8}
          roughness={0.1}
          color="#a3a3a3"
          transparent={true}
          opacity={showLabels ? 0.5 : score}
        />
      </animated.mesh>
      {/* ball */}
      <animated.mesh position={springProps.position}>
        <Billboard {...({} as any)} args={[0, 0]}>
          <Text
            {...({} as any)}
            color="white"
            textAlign={"center"}
            anchorY={isBottom ? "top" : "bottom"}
            maxWidth={0.5}
            position={[
              showLabels ? 0 : 0.3,
              (isBottom ? -1.2 : 1.2) * (showLabels ? 1 : 0.7),
              0,
            ]}
            fontSize={1}
          >
            {showLabels ? label : (score * 100).toFixed(0) + "%"}
          </Text>
        </Billboard>
        <sphereBufferGeometry args={[0.5, 26, 26]} />
        <meshLambertMaterial
          metalness={0.8}
          roughness={0.1}
          color={color}
          transparent={true}
          opacity={showLabels ? 0.5 : score}
        />
      </animated.mesh>
    </>
  );
}
