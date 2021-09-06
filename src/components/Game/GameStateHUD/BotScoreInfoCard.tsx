import styled from "styled-components/macro";
import { useLatestTaggedNode } from "components/NetworkGraph/Scene/Node/useLatestTaggedNode";
import { Canvas } from "@react-three/fiber";
import {
  gameStateAtom,
  GameStepsEnum,
  isBotScoreExplainerUpAtom,
  shotsRemainingAtom,
  latestNodeWithBotScoreAtom,
} from "providers/store/store";
import { useAtom } from "jotai";
import { useSetNodesInDbForUser } from "providers/faunaProvider";
import { useTweets } from "providers/store/useSelectors";
import { BOT_SCORE_POPUP_TIMEOUT } from "../TagTheBotButton";
import { IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { getMostLikelyBotTypeText } from "./getMostLikelyBotTypeText";
import { useSpring, animated, config } from "react-spring";
import { BotScoreLegend } from "./BotScoreLegend";
import { Suspense, useEffect, useState } from "react";
import { CUSTOM_SCROLLBAR_CSS } from "components/RightDrawer/CUSTOM_SCROLLBAR_CSS";
import {
  colorSecondary,
  textSecondaryColor,
  darkBackground,
} from "utils/colors";
import { AvatarStyles } from "components/NetworkGraph/NodeTooltip";
import { useWindowSize } from "utils/hooks";

const WIDTH = 420;
const TRANSFORM = false;
const AVATAR_WIDTH = 92;
const CARD_MIN_HEIGHT = 678;

/** pops up from the bottom when we receive a bot score */
export function BotScoreInfoCard() {
  const [latestNodeWithBotScore] = useAtom(latestNodeWithBotScoreAtom);
  const tweets = useTweets();
  const setNodesInDb = useSetNodesInDbForUser();
  const [, setGameState] = useAtom(gameStateAtom);
  const [shotsRemaining] = useAtom(shotsRemainingAtom);
  const { latestBotScore, lastNode } = useLatestTaggedNode();
  const { botTypeText, botTypeInfo, botType, scorePercent } = latestBotScore
    ? getMostLikelyBotTypeText(latestBotScore)
    : {
        botTypeText: null,
        botTypeInfo: null,
        botType: null,
        scorePercent: null,
      };
  const [isUp, setIsUp] = useAtom(isBotScoreExplainerUpAtom);

  const endGame = () => {
    setGameState((p) => ({ ...p, step: GameStepsEnum.gameOver }));
    const botTweets = tweets.filter((t) => Boolean(t.botScore));
    setNodesInDb(botTweets);
  };

  function handleCloseBotScoreInfoCard() {
    // close the popup
    // clearLastNode();
    setIsUp(false);
    // game over if 0 shots remaining
    if (shotsRemaining === 0) {
      setTimeout(endGame, BOT_SCORE_POPUP_TIMEOUT);
    }
  }

  const [isDoneAnimating, setIsDoneAnimating] = useState(false);
  const { height } = useWindowSize();
  const springUpDown = useSpring({
    transform: `translate3d(0,${
      isUp
        ? height > CARD_MIN_HEIGHT + 100
          ? (height - CARD_MIN_HEIGHT) / 2
          : 36
        : CARD_MIN_HEIGHT
    }px,0)`,
    opacity: isUp ? 1 : 0,
    position: "fixed" as any,
    zIndex: 9999999999999999,
    onRest: () => {
      if (isUp && latestNodeWithBotScore) {
        setIsDoneAnimating(true);
      }
    },
  });

  const springExpandOnMount = useSpring({
    width: `${
      isUp && latestNodeWithBotScore && isDoneAnimating ? scorePercent : 0
    }%`,
    immediate: !isUp,
    config: config.molasses,
  });
  useEffect(() => {
    if (!isUp) {
      setIsDoneAnimating(false);
    }
  }, [isUp]);

  return (
    <BotScoreInfoCardStyles>
      <animated.div style={springUpDown}>
        <HtmlBotScoreInfoOverlayStyles {...{ botTypeText, scorePercent, isUp }}>
          <div className="content">
            <div className="topRow">
              <div className="avatarWrapper col1">
                <AvatarStyles
                  customCss={`
                z-index: 9999999999999;
                height: ${AVATAR_WIDTH}px;
                width: ${AVATAR_WIDTH}px;
                img{width:100%;height:100%;}
                box-shadow: 0px 2px 3px rgba(0,0,0,0.5);
                border: 4px solid ${darkBackground};
            `}
                >
                  <img
                    src={latestNodeWithBotScore?.user?.profile_image_url_https}
                    alt=""
                  />
                </AvatarStyles>
              </div>

              <div className="col2">
                <div className="screenName cardTitle">
                  {lastNode?.user.screen_name}
                </div>
                <div className="displayName">{lastNode?.user.name}</div>
              </div>
            </div>
            <div className="scrollContent">
              <div className="botScoreLegendCanvas">
                <Suspense fallback={null}>
                  <Canvas style={{ overflow: "visible" }}>
                    <mesh scale={[2.5, 2.5, 2.5]} position={[0, 0.4, 0]}>
                      <BotScoreLegend
                        {...{
                          showTooltips: true,
                          showScorePercents: true,
                          showAvatar: true,
                          isInStartMenu: false,
                          position: [0, 0, 0],
                          scale: [1, 1, 1],
                        }}
                      />
                    </mesh>
                  </Canvas>
                </Suspense>
              </div>
              <div className="botType">
                <animated.div
                  style={{
                    ...springExpandOnMount,
                  }}
                  className="percentWidth"
                ></animated.div>
                <div className="percentWidthOutline"></div>
                {botType}
                <span className="scorePercent">{scorePercent}%</span>
              </div>
              {botTypeInfo && (
                <div className="botTypeInfoBorder">
                  <div className="botTypeInfo">{botTypeInfo}</div>
                </div>
              )}
              <div className="botScoreInfo">
                <span className="screenName" style={{ marginRight: 4 }}>
                  {latestNodeWithBotScore?.user.screen_name}
                </span>
                {botTypeText} bot
              </div>
            </div>
            <IconButton
              className="btnClose"
              onClick={handleCloseBotScoreInfoCard}
            >
              <Close />
            </IconButton>
          </div>
        </HtmlBotScoreInfoOverlayStyles>
      </animated.div>
    </BotScoreInfoCardStyles>
  );
}

const BOTTYPE_PADDING_INNER = 6;
const BOTTYPE_BORDER_RADIUS = 14;
const CARD_BORDER_WIDTH = 12;

const BotScoreInfoCardStyles = styled.div`
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 9999999999999999;
`;
const HtmlBotScoreInfoOverlayStyles = styled.div`
  font-family: "Roboto", sans-serif;
  transition: transform 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  width: 100vw;
  text-align: left;
  background: none;
  /* border: ${process.env.NODE_ENV !== "production"
    ? "1px solid limegreen"
    : "none"}; */
  box-sizing: border-box;
  font-size: ${TRANSFORM ? 4 : 24}px;
  .topRow {
    display: flex;
    gap: 16px;
    margin-bottom: -18px;
    height: 64px;
    margin-top: ${CARD_BORDER_WIDTH / 2}px;
    margin-left: ${-CARD_BORDER_WIDTH / 2}px;
  }
  .col1,
  .col2 {
    display: flex;
    flex-direction: column;
  }
  .col2 {
    justify-content: center;
    flex-grow: 1;
  }
  .content {
    min-height: ${CARD_MIN_HEIGHT}px;
    pointer-events: ${(p) => (p.isUp ? "auto" : "none")};
    border: ${CARD_BORDER_WIDTH}px solid #000;
    /* border-bottom-width: ${CARD_BORDER_WIDTH * 2}px; */

    .avatarWrapper {
      height: ${AVATAR_WIDTH}px;

      width: ${AVATAR_WIDTH}px;
      margin-top: ${-CARD_BORDER_WIDTH}px;
    }
    .scrollContent {
      width: 100%;
      height: fit-content;
      max-height: calc(100vh - 96px);
      ${CUSTOM_SCROLLBAR_CSS}
      padding: 0 ${CARD_BORDER_WIDTH * 0.8}px 0;
    }
    .botScoreLegendCanvas {
      height: 340px;
      padding-top: 36px;
      margin-bottom: 6px;
      border-right: 3px solid #555555;
      border-left: 3px solid #555555;
      box-shadow: 0px 0px 4px #000000cc;
    }
    box-shadow: 0px 1px 11px #0000009c;
    border-radius: 16px;
    box-sizing: border-box;
    /* border: ${process.env.NODE_ENV !== "production"
      ? "1px solid limegreen"
      : "none"}; */
    width: ${WIDTH}px;
    max-width: calc(100vw - 24px);
    height: fit-content;

    margin: auto;
    position: relative;
    background: ${darkBackground};
  }
  .btnClose {
    position: absolute;
    position: absolute;
    top: -19px;
    right: -21px;
    z-index: 2;
    opacity: 0.9;
    /* background: #ffffff3d; */
  }
  .MuiSvgIcon-root {
    /* transform: scale(1.4); */
  }
  .botScoreInfo {
    padding: 2.2em 0.7em 1em;
    margin-top: ${-26}px;
    margin-bottom: ${CARD_BORDER_WIDTH * 0.75}px;
    background: #1e1f20;
    position: relative;
    font-size: 0.8em;
    height: 200px;
    &:before {
      content: "";
      position: absolute;
      inset: 0;
      border-right: 3px solid #555555;
      border-left: 3px solid #555555;
      border-bottom: 3px solid #555555;
      border-bottom-left-radius: ${CARD_BORDER_WIDTH / 2}px;
      border-bottom-right-radius: ${CARD_BORDER_WIDTH / 2}px;
      box-shadow: 0px 2px 4px #0000006c;
    }
  }
  .botTypeInfoBorder {
    border-right: 3px solid #555555;
    border-left: 3px solid #555555;
    box-shadow: 0px 2px 4px #0000006c;
  }
  .botTypeInfo {
    font-style: italic;
    line-height: 1.6em;
    z-index: 999;
    position: relative;
    font-size: 16px;
    color: ${colorSecondary};
    margin-top: 0.5em;
    background: rgb(0, 0, 0);
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 1) calc(100% - 16px),
      rgba(0, 0, 0, 0) 100%
    );
    border-bottom-left-radius: 1em;
    padding: 0.25em 0.5em 0.5em 0.6em;
    margin-left: 3px;
    margin-right: 0px;
  }
  .screenName {
    color: ${textSecondaryColor};
    font-size: 1em;
    text-align: left;
    position: relative;
    width: 100%;
    text-shadow: 2px 2px 1px black;
    padding-left: 1em;
    z-index: 1;
    &:before {
      position: absolute;
      left: 0;
      content: "@";
    }
    &.cardTitle:after {
      position: absolute;
      left: -52px;
      right: ${CARD_BORDER_WIDTH / 2}px;
      border-top-right-radius: 52px;
      bottom: 0;
      top: 0;
      background: #0b1015;
      z-index: -1;
      content: "";
      box-shadow: 0px 1px 4px #000000cc;
    }
  }
  .displayName {
    font-size: 1em;
    width: 100%;
    text-align: left;
    position: relative;
    z-index: 1;
    &:after {
      position: absolute;
      left: -52px;
      right: ${CARD_BORDER_WIDTH / 2}px;
      border-bottom-right-radius: 26px;
      bottom: 0;
      top: 0;
      background: #2a4553;
      z-index: -1;
      content: "";
      box-shadow: 0px 1px 4px #000000cc;
    }
  }
  .screenName,
  .botType {
    font-family: "Poiret One", cursive;
  }
  .botType {
    position: relative;
    left: 0px;
    .percentWidth {
      position: absolute;
      height: 40px;
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
      border-radius: ${BOTTYPE_BORDER_RADIUS}px;
      position: absolute;
      height: 32px;
      padding: 20px;
      left: -${BOTTYPE_PADDING_INNER}px;
      right: -${BOTTYPE_PADDING_INNER}px;
      top: -6px;
      border: 1px solid #ffffff30;
      margin: -0.5px;
      box-shadow: 0px 1px 4px #000000cc;
    }
    font-size: 1em;
    /* text-align: center; */
    color: ${colorSecondary};
    .scorePercent {
      font-family: "Roboto", sans-serif;
      font-size: 0.8em;
      position: absolute;
      right: 6px;
      top: 4px;
    }
  }
  @media (min-width: 768px) {
    .botTypeInfo {
      margin-top: 0.5em;
      font-size: 18px;
      line-height: 1.4em;
    }
    .content {
      box-sizing: content-box;
      .scrollContent {
        box-sizing: border-box;
      }
    }
  }
`;
