import { useLatestTaggedNode } from "components/NetworkGraph/Scene/Node/useLatestTaggedNode";
import { Box, Html, Text } from "@react-three/drei";
import { useControls } from "leva";
import { getScoreFromBotScore } from "../getScoreFromBotScore";
import { BotScore } from "types";
import {
  BOT_LABELS,
  BOT_TYPE_MORE_INFO,
  INFO_CARD_INITIAL_Y,
  INFO_CARD_MAX_Y,
  INFO_CARD_MIN_Y,
} from "utils/constants";
import { useThree } from "@react-three/fiber";
import { useGesture } from "react-use-gesture";
import { animated } from "@react-spring/three";
import { createPortal } from "react-dom";

export function BotScoreInfoCard({ set, springProps, currentY }) {
  const { latestBotScore, node, lastNode, clearLastNode } =
    useLatestTaggedNode();
  // const latestBotScore = {
  //   astroturf: 0.33,
  //   fake_follower: 0.51,
  //   financial: 0,
  //   other: 0.63,
  //   overall: 0.63,
  //   self_declared: 0.1,
  //   spammer: 0.09,
  // };
  // -- drag to change position --

  // https://codesandbox.io/s/react-three-fiber-gestures-forked-qi8xq?file=/src/App.js:351-672

  // Set up a spring with values we're going to modify

  // Create a gesture that contains drag and hover, set the spring accordingly
  const { size } = useThree();

  const bind = useGesture({
    onDrag: ({ event, delta, ...rest }) => {
      if (!lastNode) {
        return;
      }
      const dy = (-delta[1] / size.height) * 11;
      const newY = Math.min(INFO_CARD_MAX_Y, currentY.current + dy);
      currentY.current = newY;
      set({
        position: [0, newY, 0],
      });
      if (newY <= INFO_CARD_MIN_Y) {
        // close the popup
        currentY.current = INFO_CARD_INITIAL_Y;
        set({ position: [0, INFO_CARD_INITIAL_Y, 0] });
        clearLastNode();
      }
    },
    onHover: ({ hovering }) =>
      set({ scale: hovering ? [1.05, 1.05, 1.05] : [1, 1, 1] }),
  });

  const {
    x,
    x3,
    x4,
    y,
    y2,
    y3,
    y4,
    z,
    sx,
    sy,
    sz,
    fontSize,
    fontSize2,
    fontColor,
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
    fontColor: "#cbebec",
    fontSize2: 0.26,
    legendHeight: 0,
    metalness: 0.36,
    roughness: 0.62,
    clearcoat: 0,
    maxWidth: 4,
    color: "#000000",
    x3: 1.55,
    x4: 3.55,
    y2: -0.4,
    y3: -1.56,
    y4: -2.06,
  });
  const colorByBotScore = latestBotScore
    ? getScoreFromBotScore(latestBotScore).color
    : "#000000";
  const { botTypeText, botTypeInfo } = latestBotScore
    ? getMostLikelyBotTypeText(latestBotScore)
    : { botTypeText: null, botTypeInfo: null };
  return (
    /* !lastNode ? null : */
    <animated.mesh
      position={springProps.position as any}
      scale={springProps.scale as any}
    >
      <Html>
        {createPortal(
          <div
            {...bind()}
            style={{
              position: "fixed",
              bottom: 0,
              width: window.innerWidth,
              height: 276,
              ...(process.env.NODE_ENV !== "production"
                ? { border: "1px solid tomato" }
                : {}),
              pointerEvents: node || lastNode ? "auto" : "none",
            }}
          >
            {process.env.NODE_ENV !== "production" ? "DRAG AREA" : ""}
          </div>,
          document.body
        )}
      </Html>
      <mesh position={[x, y, z]} receiveShadow={true}>
        <Box args={[sx, sy, sz]} receiveShadow={true}>
          <meshPhysicalMaterial
            attach="material"
            {...{ metalness, color, roughness, clearcoat }}
            clearcoatRoughness={0.5}
          />
        </Box>
      </mesh>
      {latestBotScore && (
        <>
          <Text
            position={[x4, y2, z + 0.15]}
            color={colorByBotScore}
            fontSize={fontSize}
            maxWidth={200}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign={"left"}
            // font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            anchorX="right"
            anchorY="middle"
          >
            +{getScoreFromBotScore(latestBotScore).scoreIncrease}
          </Text>
          <Text
            position={[x3, y3, z + 0.15]}
            color={fontColor}
            fontSize={fontSize2}
            maxWidth={maxWidth}
            lineHeight={1.3}
            letterSpacing={0.02}
            textAlign={"left"}
            anchorX="center"
            anchorY="middle"
          >
            {lastNode?.user.screen_name} {botTypeText}
          </Text>
          <Text
            position={[x3, y4, z + 0.15]}
            color={fontColor}
            fontSize={fontSize2}
            maxWidth={maxWidth}
            lineHeight={1.3}
            letterSpacing={0.02}
            textAlign={"left"}
            anchorX="center"
            anchorY="middle"
          >
            {botTypeInfo}
          </Text>
        </>
      )}
    </animated.mesh>
  );
}
function getMostLikelyBotTypeText(botScore: BotScore) {
  let botTypeText = "";
  let botTypeInfo = "";

  const {
    // overall,
    fake_follower,
    astroturf,
    financial,
    other,
    self_declared,
    spammer,
  } = botScore;
  const maxScore = Math.max(
    // overall,
    fake_follower,
    astroturf,
    financial,
    self_declared,
    spammer
  );

  const scorePercent = `(${(maxScore * 100).toFixed(0)}%)`;

  if (maxScore > 0.8) {
    botTypeText += "is very likely ";
  } else if (maxScore > 0.6) {
    botTypeText += "is likely ";
  } else if (maxScore > 0.4) {
    botTypeText += "could be ";
  } else {
    botTypeText += `is probably not a bot ${scorePercent}`;
    return { botTypeText, botTypeInfo };
  }

  /*  if (maxScore === overall) {
    botTypeText += BOT_LABELS.OVERALL;
  } else */ if (maxScore === fake_follower) {
    botTypeText += "a " + BOT_LABELS.FAKE_FOLLOWER;
    botTypeInfo += BOT_TYPE_MORE_INFO.FAKE_FOLLOWER;
  } else if (maxScore === astroturf) {
    botTypeText += "an " + BOT_LABELS.ASTROTURF;
    botTypeInfo += BOT_TYPE_MORE_INFO.ASTROTURF;
  } else if (maxScore === financial) {
    botTypeText += "a " + BOT_LABELS.FINANCIAL;
    botTypeInfo += BOT_TYPE_MORE_INFO.FINANCIAL;
  } else if (maxScore === other) {
    botTypeText += "an " + BOT_LABELS.OTHER;
    botTypeInfo += BOT_TYPE_MORE_INFO.OTHER;
  } else if (maxScore === self_declared) {
    botTypeText += "a " + BOT_LABELS.SELF_DECLARED;
    botTypeInfo += BOT_TYPE_MORE_INFO.SELF_DECLARED;
  } else if (maxScore === spammer) {
    botTypeText += "a " + BOT_LABELS.SPAMMER;
    botTypeInfo += BOT_TYPE_MORE_INFO.SPAMMER;
  }

  botTypeText += ` bot ${scorePercent}`;

  return { botTypeText, botTypeInfo };
}
