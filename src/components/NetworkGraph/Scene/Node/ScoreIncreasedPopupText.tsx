import { useSpring, animated } from "@react-spring/three";
import { useState } from "react";
import { Text } from "@react-three/drei";
import { getScoreFromBotScore } from "components/Game/getScoreFromBotScore";

export function ScoreIncreasedPopupText({ isMounted, botScore }) {
  const { scoreIncrease, scorePercent } = getScoreFromBotScore(botScore);
  const maxHue = 130;
  const minHue = 0;
  const color = `hsl(${((maxHue - minHue) * scorePercent).toFixed(
    0
  )},100%,50%)`;

  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const springProps = useSpring({
    position: [0, isMounted ? 10 : 0, 0],
    opacity: isAnimationComplete ? 0 : isMounted ? 1 : 0,
    delay: 200,
    onRest: () => {
      if (!isAnimationComplete) {
        setIsAnimationComplete(true);
      }
    },
  });
  return (
    <animated.mesh position={springProps.position as any}>
      <AnimatedText
        {...({} as any)}
        color={color}
        textAlign={"center"}
        anchorY={"top"}
        maxWidth={0.5}
        fontSize={2}
        fillOpacity={springProps.opacity}
      >
        +{scoreIncrease.toFixed(0)}
      </AnimatedText>
    </animated.mesh>
  );
}
const AnimatedText = animated(Text);
