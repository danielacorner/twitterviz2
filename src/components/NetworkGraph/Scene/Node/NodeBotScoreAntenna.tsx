import { useSpring, animated } from "@react-spring/three";
import { Text, Billboard, Html } from "@react-three/drei";
import { useState } from "react";
import { BOT_TYPES, NODE_RADIUS } from "utils/constants";
import { useMount } from "utils/utils";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import * as THREE from "three";

const colors = scaleOrdinal(schemeCategory10);

export function NodeBotScoreAntenna({
  showLabels = false,
  botScore,
  forceOpaque = false,
  isInStartMenu = false,
  brightenText = false,
  brightenBalls = false,
  showTooltips = false,
}) {
  const antennae = [
    // top
    {
      score: botScore.overall,
      label: BOT_TYPES.OVERALL.name,
      tooltipText: BOT_TYPES.OVERALL.tooltipText,
      color: colors("0"),
      // color: "#ff0000",
      rotation: [0, 0, 0],
    },
    // top right
    {
      score: botScore.astroturf,
      label: BOT_TYPES.ASTROTURF.name,
      tooltipText: BOT_TYPES.ASTROTURF.tooltipText,
      color: colors("1"),
      // color: "#09ff00",
      rotation: [0, 0, -Math.PI / 3],
    },
    // top left
    {
      score: botScore.financial,
      label: BOT_TYPES.FINANCIAL.name,
      tooltipText: BOT_TYPES.FINANCIAL.tooltipText,
      color: colors("2"),
      // color: "#75d87a",
      rotation: [0, 0, Math.PI / 3],
    },
    // bottom right
    {
      score: botScore.fake_follower,
      label: BOT_TYPES.FAKE_FOLLOWER.name,
      tooltipText: BOT_TYPES.FAKE_FOLLOWER.tooltipText,
      color: colors("3"),
      // color: "#de70f1",
      rotation: [0, 0, (-Math.PI / 3) * 2],
    },
    // bottom left
    {
      score: botScore.spammer,
      label: BOT_TYPES.SPAMMER.name,
      tooltipText: BOT_TYPES.SPAMMER.tooltipText,
      color: colors("4"),
      // color: "#f19244",
      rotation: [0, 0, (Math.PI / 3) * 2],
    },
    // bottom
    {
      score: botScore.self_declared,
      label: BOT_TYPES.SELF_DECLARED.name,
      tooltipText: BOT_TYPES.SELF_DECLARED.tooltipText,
      color: colors("5"),
      // color: "#dadada",
      rotation: [0, 0, Math.PI],
    },
  ];
  return (
    <mesh>
      {antennae.map(({ rotation, color, score, label, tooltipText }, idx) => (
        <mesh key={color} rotation={rotation as any} scale={[1, 1, 1]}>
          <Antenna
            {...{
              color,
              forceOpaque,
              isInStartMenu,
              tooltipText,
              score,
              label,
              showLabels,
              brightenText,
              showTooltips,
              brightenBalls,
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
  tooltipText,
  showLabels,
  isBottom,
  forceOpaque,
  showTooltips,
  isInStartMenu,
  brightenText,
  brightenBalls,
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
  const [isMouseOver, setIsMouseOver] = useState(false);
  const showTooltip = showTooltips && isMouseOver;
  console.log("🌟🚨 ~ showTooltip", showTooltip);
  return (
    <mesh>
      {/* big ol ball for mouseover */}

      {showTooltip && <MouseoverTooltip {...{ tooltipText }} />}

      {/* stick */}
      <animated.mesh
        castShadow={true}
        position={[0, NODE_RADIUS + stickHeightActual / 2, 0]}
        scale={springProps.stickScale as any}
      >
        <cylinderBufferGeometry args={[0.2, 0.2, STICK_HEIGHT, 26, 1]} />
        <meshPhysicalMaterial
          metalness={0.8}
          color="#464646"
          emissive={new THREE.Color("#272727")}
          transparent={true}
          opacity={0.5}
          transmission={0.98}
          roughness={0.05}
        />
      </animated.mesh>
      <animated.mesh
        position={springProps.spherePosition as any}
        castShadow={true}
      >
        {/* text */}
        <Billboard {...({} as any)} args={[0, 0]}>
          <Text
            {...({} as any)}
            color={
              brightenText
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
            fillOpacity={brightenText ? 1 : score ** 0.1}
          >
            {showLabels ? label : (score * 100).toFixed(0) + "%"}
          </Text>
        </Billboard>
        {/* ball */}
        <sphereBufferGeometry args={[SPHERE_RADIUS, 26, 26]} />
        <meshPhysicalMaterial
          metalness={0.8}
          roughness={0.1}
          {...(brightenBalls
            ? {
                color,
              }
            : {})}
          // color="#777"
          emissive={new THREE.Color(color)}
          transparent={forceOpaque ? false : true}
          opacity={forceOpaque ? 1 : showLabels ? 0.5 : score ** 0.5}
        />
      </animated.mesh>
      <animated.mesh
        onPointerEnter={() => {
          setIsMouseOver(true);
        }}
        onPointerLeave={() => {
          setIsMouseOver(false);
        }}
        position={springProps.spherePosition as any}
      >
        <sphereBufferGeometry args={[3, 0]} />
        {process.env.NODE_ENV !== "production" && (
          <meshBasicMaterial
            color={"#1e2847"}
            wireframe={true}
            transparent={true}
            opacity={0.2}
          />
        )}
      </animated.mesh>
    </mesh>
  );
}

function MouseoverTooltip({ tooltipText }) {
  return (
    <>
      <Html>{tooltipText}</Html>
    </>
  );
}
