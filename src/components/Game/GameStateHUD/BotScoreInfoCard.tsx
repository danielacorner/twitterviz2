import { useLatestTaggedNode } from "components/NetworkGraph/Scene/Node/useLatestTaggedNode";
import { Box, Html, Text } from "@react-three/drei";
import { useControls } from "leva";
import { getScoreFromBotScore } from "../getScoreFromBotScore";
import { BotScore } from "types";
import { BOT_LABELS } from "utils/constants";
import { useThree } from "@react-three/fiber";
import { set } from "lodash";
import { useGesture } from "react-use-gesture";
import { areOrbitControlsEnabledAtom } from "providers/store/store";
import { useAtom } from "jotai";
import { useSpring, animated } from "@react-spring/three";

export function BotScoreInfoCard() {
  const { /* latestBotScore, */ node, lastNode, clearLastNode } =
    useLatestTaggedNode();
  const latestBotScore = {
    astroturf: 0.33,
    fake_follower: 0.51,
    financial: 0,
    other: 0.63,
    overall: 0.63,
    self_declared: 0.1,
    spammer: 0.09,
  };
  const [, setAreOrbitControlsEnabled] = useAtom(areOrbitControlsEnabledAtom);
  // -- drag to change position --

  // https://codesandbox.io/s/react-three-fiber-gestures-forked-qi8xq?file=/src/App.js:351-672

  // Set up a spring with values we're going to modify
  const [{ rotation, ...rest }, set] = useSpring(() => ({
    scale: [1, 1, 1],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    config: { mass: 3, friction: 40, tension: 800 },
  }));
  // Create a gesture that contains drag and hover, set the spring accordingly
  const { size, viewport } = useThree();
  const aspect = (size.width / viewport.width) * 5;
  const bind = useGesture({
    onDrag: ({ event, offset: [x, y] }) => {
      console.log("🌟🚨 ~ BotScoreInfoCard ~ event", event);
      event.stopPropagation();
      set({
        position: [x / aspect, -y / aspect, 0],
        rotation: [y / aspect, x / aspect, 0],
      });
    },
    onDragStart: () => {
      setAreOrbitControlsEnabled(false);
      console.log("🌟🚨 ~ BotScoreInfoCard ~ onDragStart");
    },
    onDragEnd: () => {
      console.log("🌟🚨 ~ BotScoreInfoCard ~ onDragEnd");
      setAreOrbitControlsEnabled(true);
    },
    onHover: ({ hovering }) =>
      set({ scale: hovering ? [1.2, 1.2, 1.2] : [1, 1, 1] }),
  });

  const {
    x,
    x2,
    x3,
    x4,
    y,
    y2,
    y3,
    z,
    sx,
    sy,
    sz,
    fontSize,
    fontSize2,
    legendHeight,
    metalness,
    maxWidth,
    color,
    clearcoat,
    roughness,
  } = useControls({
    x: 1.56,
    y: -1.38,
    z: -0.45,
    sx: 4.78,
    sy: -2.77,
    sz: -0.13,
    fontSize: 0.37,
    fontSize2: 0.28,
    legendHeight: 0,
    metalness: 0.15,
    roughness: 0.78,
    clearcoat: 0,
    maxWidth: 4,
    color: "#316c83",
    x2: 1.32,
    x3: 1.55,
    x4: 3.55,
    y2: -0.4,
    y3: -1.56,
  });
  return (
    /* !lastNode ? null : */
    <animated.mesh {...bind}>
      <mesh position={[x, y, z]} receiveShadow={true}>
        <Box args={[sx, sy, sz]} receiveShadow={true}>
          <meshPhysicalMaterial
            attach="material"
            {...{ metalness, color, roughness, clearcoat }}
            clearcoatRoughness={0.5}
          />
        </Box>
      </mesh>
      <Text
        position={[x2, y2, z + 0.15]}
        color={"#000000"}
        fontSize={fontSize}
        maxWidth={200}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign={"left"}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="left"
        anchorY="middle"
      >
        xX
      </Text>
      <Text
        position={[x4, y2, z + 0.15]}
        color={"#000000"}
        fontSize={fontSize}
        maxWidth={200}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign={"left"}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="right"
        anchorY="middle"
      >
        {getScoreFromBotScore(latestBotScore).scoreIncrease}
      </Text>
      <Text
        position={[x3, y3, z + 0.15]}
        color={"#000000"}
        fontSize={fontSize2}
        maxWidth={maxWidth}
        lineHeight={1.3}
        letterSpacing={0.02}
        textAlign={"left"}
        anchorX="center"
        anchorY="middle"
      >
        {lastNode?.user.screen_name} is most likely a{" "}
        {getMostLikelyBotType(latestBotScore)}
      </Text>
    </animated.mesh>
  );
}
function getMostLikelyBotType(botScore: BotScore) {
  const {
    overall,
    fake_follower,
    astroturf,
    financial,
    // other,
    self_declared,
    spammer,
  } = botScore;
  const maxScore = Math.max(
    overall,
    fake_follower,
    astroturf,
    financial,
    self_declared,
    spammer
  );

  if (maxScore === overall) {
    return BOT_LABELS.OVERALL;
  } else if (maxScore === fake_follower) {
    return BOT_LABELS.FAKE_FOLLOWER;
  } else if (maxScore === astroturf) {
    return BOT_LABELS.ASTROTURF;
  } else if (maxScore === financial) {
    return BOT_LABELS.FINANCIAL;
  } else if (maxScore === self_declared) {
    return BOT_LABELS.SELF_DECLARED;
  } else if (maxScore === spammer) {
    return BOT_LABELS.SPAMMER;
  }
}
