import { useSpring, animated } from "@react-spring/three";
import { useState } from "react";
import { getScoreFromBotScore } from "components/Game/getScoreFromBotScore";
import { MouseoverTooltipContent } from "./MouseoverTooltipContent";
import { startCase } from "lodash";

export function ScoreIncreasedPopupText({ isMounted, botScore }) {
  const { scoreIncrease, color, maxBotScore, maxBotType } =
    getScoreFromBotScore(botScore);
  console.log("🌟🚨 ~ ScoreIncreasedPopupText ~ maxBotType", maxBotType);

  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const { position } = useSpring({
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
              <div className="popupTextPercent">
                {startCase(maxBotType)} – {maxBotScore * 100}%
              </div>
              <div className="popupTextBotType"></div>
              <div className="popupTextScoreIncrease">
                <div className="popupTextScoreIcon">
                  <img src="humanoid.png" alt="" />
                </div>
                +{scoreIncrease.toFixed(0)}{" "}
              </div>
            </>
          ),
          customCss: `
            width: fit-content;
            white-space: nowrap;
            .tooltipContent {
              color: ${color};
              border-radius: 99999px;
              background: #0000007b;
              padding: 12px 12px 18px;
              position: relative;
              .popupTextPercent {
                font-size: 2em;
              }
              .popupTextBotType {
              }
              .popupTextScoreIncrease {
                display: flex;
                gap: 4px;
                position: absolute;
                top: -0.6em;
                right: 1em;
                font-size: 1.5em;
                white-space: nowrap;
              }
              .popupTextScoreIcon {
                width: 24px;
                height: 24px;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
          `,
        }}
      />
    </animated.mesh>
  );
}
