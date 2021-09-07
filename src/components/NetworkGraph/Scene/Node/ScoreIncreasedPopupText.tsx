import { useSpring, animated } from "@react-spring/three";
import {
  useSpring as useSpringDom,
  animated as animatedDom,
} from "@react-spring/web";
import { config } from "react-spring";
import { useState } from "react";
import { getScoreFromBotScore } from "components/Game/getScoreFromBotScore";
import { MouseoverTooltipContent } from "./MouseoverTooltipContent";
import { startCase } from "lodash";
import styled from "styled-components/macro";
import { colorSecondary } from "utils/colors";
import { getMostLikelyBotTypeText } from "components/Game/GameStateHUD/getMostLikelyBotTypeText";

export function ScoreIncreasedPopupText({ isMounted, botScore }) {
  const { scoreIncrease, color, maxBotScore } = getScoreFromBotScore(botScore);

  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const { position } = useSpring({
    position: [0, isMounted ? 7 : 0, 0],
    opacity: isAnimationComplete ? 0 : isMounted ? 1 : 0,
    delay: 200,
    onRest: () => {
      if (!isAnimationComplete) {
        setIsAnimationComplete(true);
      }
    },
  });

  const springExpandOnMount = useSpringDom({
    width: `${isMounted ? maxBotScore * 100 : 0}%`,
    config: config.molasses,
  });

  const { botType, scorePercent } = getMostLikelyBotTypeText(botScore);

  return botType && maxBotScore ? (
    <animated.mesh position={position as any}>
      <MouseoverTooltipContent
        {...{
          tooltipText: (
            <>
              <div className="popupTextPercent">
                <BotTypePercentStyles>
                  <animatedDom.div
                    style={{
                      ...springExpandOnMount,
                    }}
                    className="percentWidth"
                  ></animatedDom.div>
                  <div className="percentWidthOutline"></div>
                  <div className="botTypeText">{startCase(botType)}</div>
                  <span className="scorePercent">{scorePercent}%</span>
                </BotTypePercentStyles>
              </div>
              <div className="popupTextScoreIncrease">
                <div className="popupTextScoreIcon">
                  <img src="humanoid.png" alt="" />
                </div>
                +{scoreIncrease.toFixed(0)}
              </div>
            </>
          ),
          customcss: `
            width: fit-content;
            white-space: nowrap;
            .tooltipContent {
              color: ${color};
              border-radius: 99999px;
              background: none;
              padding: 12px 12px 18px;
              position: relative;
              .popupTextPercent {
                font-size: 1.5em;
              }
              .popupTextScoreIncrease {
                display: flex;
                gap: 4px;
                position: absolute;
                top: -18px;
                right: 12px;
                font-size: 1.4em;
                white-space: nowrap;
              }
              .popupTextScoreIcon {
                width: 18px;
                height: 18px;
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
  ) : null;
}

const BOTTYPE_PADDING_INNER = 6;
const BOTTYPE_BORDER_RADIUS = 14;

const HEIGHT = 32;
const BotTypePercentStyles = styled.div`
  font-family: "Poiret One", cursive;
  position: relative;
  width: 160px;
  height: ${HEIGHT}px;
  .botTypeText {
    position: absolute;
    left: 6px;
    top: 2px;
  }
  .scorePercent {
    font-family: "Roboto", sans-serif;
    font-size: 0.8em;
    position: absolute;
    right: 4px;
    top: 2px;
  }
  .percentWidth {
    position: absolute;
    height: ${HEIGHT}px;
    background: ${colorSecondary};
    opacity: 0.2;
    border-bottom-left-radius: ${BOTTYPE_BORDER_RADIUS}px;
    border-top-left-radius: ${BOTTYPE_BORDER_RADIUS}px;
    top: -6px;
    bottom: -6px;
    left: -${BOTTYPE_PADDING_INNER}px;
    right: -${BOTTYPE_PADDING_INNER}px;
  }
  .percentWidthOutline {
    background: #0000004e;
    z-index: -1;
    border-radius: ${BOTTYPE_BORDER_RADIUS}px;
    position: absolute;
    height: ${HEIGHT}px;
    padding: ${HEIGHT / 2}px;
    left: -${BOTTYPE_PADDING_INNER}px;
    right: -${BOTTYPE_PADDING_INNER}px;
    top: -6px;
    border: 1px solid #ffffff30;
    margin: -0.5px;
    box-shadow: 0px 1px 4px #000000cc;
  }
`;
