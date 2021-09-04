import styled from "styled-components/macro";
import { useLatestTaggedNode } from "components/NetworkGraph/Scene/Node/useLatestTaggedNode";
import { Html } from "@react-three/drei";
import { useControls } from "leva";
import { Canvas } from "@react-three/fiber";
import {
  gameStateAtom,
  GameStepsEnum,
  isBotScoreExplainerUpAtom,
  scanningUserNodeIdAtom,
  shotsRemainingAtom,
} from "providers/store/store";
import { useAtom } from "jotai";
import { useSetNodesInDbForUser } from "providers/faunaProvider";
import { useTweets } from "providers/store/useSelectors";
import {
  BOT_SCORE_POPUP_TIMEOUT,
  latestNodeWithBotScoreAtom,
} from "../TagTheBotButton";
import { IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { getMostLikelyBotTypeText } from "./getMostLikelyBotTypeText";
import { useSpring, animated, config } from "react-spring";
import { BotScoreLegend } from "./BotScoreLegend";
import { Suspense, useEffect, useState } from "react";
import { CUSTOM_SCROLLBAR_CSS } from "components/RightDrawer/CUSTOM_SCROLLBAR_CSS";
import {
  colorPrimary,
  colorSecondary,
  textSecondaryColor,
  darkBackground,
} from "utils/colors";
import { AvatarStyles } from "components/NetworkGraph/NodeTooltip";

const PADDING = 20;
const WIDTH = 420;
const HEIGHT = 480;
const TRANSFORM = false;
const mu = TRANSFORM ? 0.1 : 1;

/** pops up from the bottom when we receive a bot score */
export function BotScoreInfoCard() {
  const [latestNodeWithBotScore] = useAtom(latestNodeWithBotScoreAtom);
  console.log(
    "🌟🚨 ~ BotScoreInfoCard ~ latestNodeWithBotScore",
    latestNodeWithBotScore
  );
  const [scanningNodeId] = useAtom(scanningUserNodeIdAtom);
  const tweets = useTweets();
  const setNodesInDb = useSetNodesInDbForUser();
  const [, setGameState] = useAtom(gameStateAtom);
  const [shotsRemaining] = useAtom(shotsRemainingAtom);
  const { latestBotScore, node, lastNode, clearLastNode } =
    useLatestTaggedNode();
  const isDoneScanning = !scanningNodeId && lastNode;
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
    clearLastNode();
    setIsUp(false);
    // game over if 0 shots remaining
    if (shotsRemaining === 0) {
      setTimeout(endGame, BOT_SCORE_POPUP_TIMEOUT);
    }
  }

  const { fx, fy, fz } = useControls({ fx: 0, fy: 0, fz: 0 });

  const [isDoneAnimating, setIsDoneAnimating] = useState(false);
  const springUpDown = useSpring({
    transform: `translate3d(0,${isUp ? 0 : HEIGHT * 0.75}px,0)`,
    opacity: isUp ? 1 : 0,
    position: "fixed" as any,
    zIndex: 9999999999999999,
    onRest: () => {
      if (isUp && latestNodeWithBotScore) {
        setIsDoneAnimating(true);
      }
    },
  });

  const AVATAR_WIDTH = 92;
  const springExpandOnMount = useSpring({
    width: `calc(${
      isUp && latestNodeWithBotScore && isDoneAnimating ? scorePercent : 0
    }% - 12px)`,
    immediate: !isUp,
    config: config.molasses,
  });
  useEffect(() => {
    if (!isUp) {
      setIsDoneAnimating(false);
    }
  }, [isUp]);

  return (
    <Html
      // occlude={[]}
      transform={TRANSFORM}
      position={[fx, fy, fz]}
      calculatePosition={(group, camera, size) => {
        return [
          PADDING + fx,
          size?.height - HEIGHT - PADDING,
          camera.position.z,
        ];
      }}
      style={{
        pointerEvents: "none",
        position: "fixed",
        top: 0,
        zIndex: 9999999999999999,
      }}
    >
      <animated.div style={springUpDown}>
        <HtmlBotScoreInfoOverlayStyles {...{ botTypeText, scorePercent, isUp }}>
          <div className="content">
            <AvatarStyles
              customCss={`
              z-index: 9999999999999;
              position: absolute;
              top: -${AVATAR_WIDTH / 2}px;
              left: calc(1.2em + 4px);
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
            <div className="scrollContent">
              <div className="displayName">{lastNode?.user.name}</div>
              <div className="screenName">{lastNode?.user.screen_name}</div>
              <div className="botType">
                <animated.div
                  style={{
                    ...springExpandOnMount,
                  }}
                  className="percentWidth"
                ></animated.div>
                <div className="percentWidthOutline"></div>
                {botType}
                <span className="scorePercent"> — {scorePercent}%</span>
              </div>
              {botTypeInfo && (
                <div className="botTypeInfo">
                  {"("}
                  {botTypeInfo}
                  {")"}
                </div>
              )}
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
    </Html>
  );
}

const HtmlBotScoreInfoOverlayStyles = styled.div`
  font-family: "Roboto", sans-serif;
  transition: transform 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  transform: translate3d(-20px, 18px, 0px);
  width: 100vw;
  text-align: left;
  background: none;
  /* border: ${process.env.NODE_ENV !== "production"
    ? "1px solid limegreen"
    : "none"}; */
  box-sizing: border-box;
  font-size: ${TRANSFORM ? 4 : 24}px;
  .content {
    pointer-events: ${(p) => (p.isUp ? "auto" : "none")};
    .scrollContent {
      width: 100%;
      height: fit-content;
      max-height: calc(100vh - 96px);
      ${CUSTOM_SCROLLBAR_CSS}
      padding: 0.5em 1em 1rem;
    }
    .botScoreLegendCanvas {
      height: 320px;
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
    top: 0px;
    right: 0px;
    /* background: #ffffff3d; */
  }
  .MuiSvgIcon-root {
    /* transform: scale(1.4); */
  }
  .botScoreInfo {
    margin-top: 1em;
  }
  .botTypeInfo {
    line-height: 1.6em;
    font-size: 16px;
    color: ${colorSecondary};
    margin-bottom: 1em;
  }
  .displayName {
    font-size: 1.2em;
    margin: 1.2em 0 0.2em;
    text-align: left;
  }
  .screenName {
    color: ${textSecondaryColor};
    font-size: 1em;
    margin: 0em 1em 0.5em;
    text-align: left;
    position: relative;
    width: fit-content;
    &:before {
      position: absolute;
      left: -1em;
      content: "@";
    }
  }
  .screenName,
  .botType {
    font-family: "Poiret One", cursive;
  }
  .botType {
    position: relative;
    left: 6px;
    .percentWidth {
      position: absolute;
      height: 40px;
      background: ${colorSecondary};
      opacity: 0.2;
      border-radius: 6px;
      top: -6px;
      bottom: -6px;
      left: -6px;
    }
    .percentWidthOutline {
      border-radius: 6px;
      position: absolute;
      height: 32px;
      width: 100%;
      padding: 20px;
      left: -6px;
      right: -6px;
      top: -6px;
      border: 1px solid #ffffff30;
      margin: -0.5px;
    }
    font-size: 1em;
    /* text-align: center; */
    color: ${colorSecondary};
    .scorePercent {
      font-family: "Roboto", sans-serif;
    }
  }
  @media (min-width: 768px) {
    transform: translate3d(-20px, -200px, 0px);
    .botTypeInfo {
      margin-top: 0.5em;
      font-size: 18px;
      line-height: 1.4em;
    }
    .content {
      padding: 0 0.5em;
      box-sizing: content-box;
      .scrollContent {
        box-sizing: border-box;
        padding: 0.5em 1.2em 2em;
      }
    }
  }
`;
