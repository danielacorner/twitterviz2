import { useSpring, animated } from "@react-spring/three";
import { Text, Billboard } from "@react-three/drei";
import { useState } from "react";
import { NODE_RADIUS } from "utils/constants";
import { useMount } from "utils/utils";

export function NodeBotScoreAntenna({
  showLabels = false,
  botScore,
  forceOpaque = false,
  isInStartMenu = false,
}) {
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
        <mesh key={color} rotation={rotation} scale={[1, 1, 1]}>
          <Antenna
            {...{
              color,
              forceOpaque,
              isInStartMenu,
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

const STICK_HEIGHT = 3.6;
const STICK_SCALE = 0.7;
const SPHERE_RADIUS = 0.5;

function Antenna({
  color,
  score,
  label,
  showLabels,
  isBottom,
  forceOpaque,
  isInStartMenu,
}) {
  const [mounted, setMounted] = useState(false);
  useMount(() => {
    setMounted(true);
  });

  const stickHeightActual = STICK_HEIGHT * STICK_SCALE * score;

  const springProps = useSpring({
    stickScale: [STICK_SCALE, mounted ? STICK_SCALE * score : 0, STICK_SCALE],
    spherePosition: [
      0,
      mounted ? NODE_RADIUS + stickHeightActual + SPHERE_RADIUS : 0,
      0,
    ],
  });
  const brightnessPct = 0;
  const textLightness = 1 - brightnessPct;
  return (
    <>
      {/* stick */}
      <animated.mesh
        position={[0, NODE_RADIUS + stickHeightActual / 2, 0]}
        scale={springProps.stickScale}
      >
        <cylinderBufferGeometry args={[0.2, 0.2, STICK_HEIGHT, 26, 1]} />
        <meshPhysicalMaterial
          metalness={0.8}
          roughness={0.1}
          color="#a3a3a3"
          transparent={true}
          opacity={forceOpaque ? 1 : showLabels ? 0.5 : score ** 0.7}
        />
      </animated.mesh>
      {/* ball */}
      <animated.mesh position={springProps.spherePosition}>
        <Billboard {...({} as any)} args={[0, 0]}>
          <Text
            {...({} as any)}
            color={
              isInStartMenu
                ? "white"
                : `hsl(0,0%,${(textLightness * 100).toFixed(0)}%)`
            }
            outlineColor={`hsl(0,0%,${(brightnessPct * 100).toFixed(0)}%)`}
            outlineWidth={0.000001}
            outlineBlur={0.2}
            outlineOpacity={0.4}
            outlineOffsetY={0.05}
            outlineOffsetX={0}
            textAlign={"center"}
            anchorY={isBottom ? "top" : "bottom"}
            maxWidth={0.5}
            position={[
              showLabels ? 0 : 0.3,
              (isBottom ? -1.2 : 1.2) * (showLabels ? 1 : 0.7),
              0,
            ]}
            fontSize={1}
            fillOpacity={score ** 0.3}
          >
            {showLabels ? label : (score * 100).toFixed(0) + "%"}
          </Text>
        </Billboard>
        <sphereBufferGeometry args={[SPHERE_RADIUS, 26, 26]} />
        <meshPhysicalMaterial
          metalness={0.8}
          roughness={0.1}
          color={color}
          transparent={true}
          opacity={forceOpaque ? 1 : showLabels ? 0.5 : score ** 0.4}
        />
      </animated.mesh>
    </>
  );
}
