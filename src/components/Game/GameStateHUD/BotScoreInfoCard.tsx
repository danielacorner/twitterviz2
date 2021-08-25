import styled from "styled-components/macro";
import { useLatestTaggedNode } from "components/NetworkGraph/Scene/Node/useLatestTaggedNode";
import { Html } from "@react-three/drei";
import { useControls } from "leva";
import { Canvas } from "@react-three/fiber";
import {
  gameStateAtom,
  GameStepsEnum,
  isBotScoreExplainerUpAtom,
  scanningNodeIdAtom,
  shotsRemainingAtom,
} from "providers/store/store";
import { useAtom } from "jotai";
import { useSetNodesInDbForUser } from "providers/faunaProvider";
import { useTweets } from "providers/store/useSelectors";
import { BOT_SCORE_POPUP_TIMEOUT } from "../TagTheBotButton";
import { IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { getMostLikelyBotTypeText } from "./getMostLikelyBotTypeText";
import { useSpring, animated } from "react-spring";
import { BotScoreLegend } from "./BotScoreLegend";
import { Suspense } from "react";
import { CUSTOM_SCROLLBAR_CSS } from "components/RightDrawer/CUSTOM_SCROLLBAR_CSS";

const PADDING = 20;
const WIDTH = 350;
const HEIGHT = 280;
const TRANSFORM = false;
const mu = TRANSFORM ? 0.1 : 1;

/** pops up from the bottom when we receive a bot score */
export function BotScoreInfoCard() {
  const [scanningNodeId] = useAtom(scanningNodeIdAtom);
  const tweets = useTweets();
  const setNodesInDb = useSetNodesInDbForUser();
  const [, setGameState] = useAtom(gameStateAtom);
  const [shotsRemaining] = useAtom(shotsRemainingAtom);
  const { latestBotScore, node, lastNode, clearLastNode } =
    useLatestTaggedNode();
  const isDoneScanning = !scanningNodeId && lastNode;
  const { botTypeText, botTypeInfo } = latestBotScore
    ? getMostLikelyBotTypeText(latestBotScore)
    : { botTypeText: null, botTypeInfo: null };
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

  const springUpDown = useSpring({
    transform: `translate3d(0,${isUp ? 0 : HEIGHT * 2}px,0)`,
  });

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
    >
      <animated.div style={springUpDown}>
        <HtmlBotScoreInfoOverlayStyles {...{ botTypeText }}>
          <div className="content">
            <div className="scrollContent">
              <div className="botScoreLegendCanvas">
                <Suspense fallback={null}>
                  <Canvas>
                    <mesh scale={[3, 3, 3]} position={[0, 0.4, 0]}>
                      <BotScoreLegend
                        {...{
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
                {lastNode?.user.screen_name} {botTypeText}
              </div>
              {botTypeInfo && (
                <div className="botTypeInfo">
                  {"("}
                  {botTypeInfo}
                  {")"}
                </div>
              )}
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
  font-family: "Poiret One", cursive;
  transition: transform 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  transform: translate3d(-20px, 18px, 0px);
  width: 100vw;
  text-align: left;
  background: none;
  border: ${process.env.NODE_ENV !== "production"
    ? "1px solid limegreen"
    : "none"};
  box-sizing: border-box;
  font-size: ${TRANSFORM ? 4 : 24}px;
  .content {
    .scrollContent {
      width: 100%;
      height: 100%;
      ${CUSTOM_SCROLLBAR_CSS}
      padding: 0.5em 1em;
    }
    .botScoreLegendCanvas {
      height: 200px;
    }
    box-shadow: 0px 1px 11px #0000009c;
    border-radius: 16px;
    box-sizing: border-box;
    border: ${process.env.NODE_ENV !== "production"
      ? "1px solid limegreen"
      : "none"};
    width: ${WIDTH * mu}px;
    height: ${HEIGHT * mu}px;
    margin: auto;
    position: relative;
    background: #2a3731;
  }
  .btnClose {
    position: absolute;
    top: -24px;
    right: -24px;
    border: 1px solid #ffffff7d;
    background: #ffffff3d;
  }
  .MuiSvgIcon-root {
    transform: scale(1.4);
  }
  .botTypeInfo {
    font-size: ${TRANSFORM ? 3 : 16}px;
  }
`;
