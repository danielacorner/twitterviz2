import { animated, useSpring } from "@react-spring/three";
import {
  animated as animatedDom,
  useSpring as useSpringDom,
} from "react-spring";
import { NodeContent } from "components/NetworkGraph/Scene/Node/Node";
import { Canvas } from "@react-three/fiber";

import Alert from "@material-ui/lab/Alert";
import styled from "styled-components/macro";
import { useAtom } from "jotai";
import { UserNode } from "../../useUserNodes";
import { useWindowSize } from "utils/hooks";
import Background from "../Background";
import { ScanningAnimation } from "./ScanningAnimation";
import { isBotScoreExplainerUpAtom } from "components/Game/GameStateHUD/BotScoreLegend";
import { useLatestTaggedNode } from "./useLatestTaggedNode";
/** pops up and animates when you get a new bot score */
export function BotScorePopupNode() {
  const { latestBotScore, node, nodeDisplay } = useLatestTaggedNode();

  const springProps = useSpring({
    scale: node
      ? latestBotScore
        ? [0.3, 0.3, 0.3]
        : [0.6, 0.6, 0.6]
      : [0, 0, 0],
  });
  const windowSize = useWindowSize();
  return (
    <PopupStyles>
      <ContentStyles>
        <BotScorePopupNodeAnimation
          {...{ windowSize, nodeDisplay, springProps }}
        />
        <Alerts />
      </ContentStyles>
    </PopupStyles>
  );
}
// https://codesandbox.io/s/arkanoid-under-60-loc-forked-rmfcq?file=/src/App.js:2616-2788
// const Background = (props) => (
//   <mesh scale={useAspect(5000, 3800, 3)} {...props}>
//     <planeGeometry />
//     <meshBasicMaterial map={useTexture("/bg.jpg")} />
//   </mesh>
// )

const ContentStyles = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 9999999999999999999;
`;
const PopupStyles = styled.div`
  pointer-events: none;
`;
function Alerts() {
  const { latestBotScore, node, nodeDisplay } = useLatestTaggedNode();
  const [isUp, setIsUp] = useAtom(isBotScoreExplainerUpAtom);
  const springUp = useSpringDom({
    position: "fixed",
    bottom: isUp ? 24 : -500,
    right: 24,
    pointerEvents: "auto",
  });
  return (
    <animatedDom.div style={springUp as any} className="alerts">
      <Alert
        severity="success"
        onClose={() => {
          setIsUp(false);
        }}
      >
        <AlertContentStyles>
          <div className="title">
            You got a bot score woop {latestBotScore?.overall}
          </div>
          <div className="score">
            <div className="category">Overall: </div>
            <div className="value">{latestBotScore?.overall}</div>
          </div>
          <div className="score">
            <div className="category">Astroturf: </div>
            <div className="value">{latestBotScore?.astroturf}</div>
          </div>
          <div className="score">
            <div className="category"> Fake follower:</div>{" "}
            <div className="value">{latestBotScore?.fake_follower} </div>
          </div>
          <div className="score">
            <div className="category">Financial: </div>
            <div className="value">{latestBotScore?.financial}</div>
          </div>
          <div className="score">
            <div className="category">Other: </div>
            <div className="value">{latestBotScore?.other}</div>
          </div>
          <div className="score">
            <div className="category"> Self declared:</div>{" "}
            <div className="value">{latestBotScore?.self_declared} </div>
          </div>
          <div className="score">
            <div className="category">Spammer: </div>
            <div className="value">{latestBotScore?.spammer}</div>
          </div>
        </AlertContentStyles>
      </Alert>
    </animatedDom.div>
  );
}
const AlertContentStyles = styled.div`
  .title {
    font-size: 2em;
  }

  .score {
    font-size: 1.5em;
    color: #fff;
    font-weight: bold;
    display: grid;
    grid-template-columns: 1fr auto;
  }

  .score:hover {
    color: #fff;
  }

  .score:active {
    color: #fff;
  }
`;

function BotScorePopupNodeAnimation({
  windowSize,
  nodeDisplay,
  springProps,
}: {
  windowSize: { width: number; height: number };
  nodeDisplay: UserNode | null;
  springProps;
}) {
  return (
    <Canvas
      style={{
        width: windowSize.width,
        height: windowSize.height,
        zIndex: 999999999999999,
      }}
    >
      {nodeDisplay ? (
        <>
          <Background background={false} />
          <ambientLight intensity={4} />
          <directionalLight position={[0, 5, -4]} intensity={6} />
        </>
      ) : null}
      <animated.mesh scale={springProps.scale as any} position={[0, 0, -2]}>
        {nodeDisplay ? (
          <>
            <NodeContent
              {...{
                node: nodeDisplay,
                isTooltipNode: false,
                isScanningNode: true,
                isPointerOver: false,
                isRightClickingThisNode: false,
                forceOpaque: true,
              }}
            />
            {nodeDisplay.user.botScore ? null : <ScanningAnimation />}
          </>
        ) : null}
      </animated.mesh>
    </Canvas>
  );
}
