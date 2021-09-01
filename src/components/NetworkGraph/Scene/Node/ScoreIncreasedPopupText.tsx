import { useSpring, animated } from "@react-spring/three";
import { useState } from "react";
import { Text } from "@react-three/drei";
import { getScoreFromBotScore } from "components/Game/getScoreFromBotScore";
import { MouseoverTooltipContent } from "./MouseoverTooltipContent";

export function ScoreIncreasedPopupText({ isMounted, botScore }) {
  const { scoreIncrease, color, maxBotScore, maxBotType } =
    getScoreFromBotScore(botScore);
  console.log("🌟🚨 ~ ScoreIncreasedPopupText ~ maxBotType", maxBotType);

  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const { position, opacity } = useSpring({
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
    <animated.mesh position={position as any}>
      <MouseoverTooltipContent
        {...{
          tooltipText: (
            <>
              <div>
                {maxBotScore}
                {maxBotType}
              </div>
              <div>+{scoreIncrease.toFixed(0)}</div>
            </>
          ),
          customCss: `
          .tooltipContent{
            color: ${color};
            border-radius: 99999px;
            background: #0000007b;
            font-size: 2em;
            padding: 0.3em 0.6em;

          }
          `,
        }}
      />
    </animated.mesh>
  );
}
