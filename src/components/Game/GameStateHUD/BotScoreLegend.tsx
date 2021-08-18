import HUD from "../../NetworkGraph/Scene/HUD";
import { useThree } from "@react-three/fiber";
import { NodeBotScoreAntenna } from "../../NetworkGraph/Scene/Node/NodeBotScoreAntenna";
import { useSpring, animated } from "@react-spring/three";
import { gameStateAtom, GameStepsEnum } from "providers/store/store";
import { atom, useAtom } from "jotai";
import { useLatestTaggedNode } from "components/NetworkGraph/Scene/Node/useLatestTaggedNode";
import {
  animated as animatedDom,
  useSpring as useSpringDom,
} from "react-spring";
import { useWindowSize } from "utils/hooks";
import Alert from "@material-ui/lab/Alert";
import styled from "styled-components/macro";
import { Html } from "@react-three/drei";
import { useControls } from "leva";
import { BotScoreInfoCard } from "./BotScoreInfoCard";

const SCALE = 0.15;
const RADIUS = 40;
export const isBotScoreExplainerUpAtom = atom<boolean>(false);

/** displays at the bottom when you get a bot score */
export function BotScoreLegendHUD() {
  const {
    size: { width, height },
  } = useThree();
  const { latestBotScore, node, lastNode } = useLatestTaggedNode();
  console.log("🌟🚨 ~ latestBotScore", latestBotScore);

  const isUp = true;
  // const [isUp] = useAtom(isBotScoreExplainerUpAtom);

  // const springPosition = [0, isUp ? 0 : -6, 0];
  const { yy } = useControls({ yy: 1.64 });
  const springProps = useSpring({
    position: [0, isUp ? yy : -8, 0],
  });

  return (
    <HUD position={[width / 2 - RADIUS * 2.5, height / 2 - RADIUS * 3, 0]}>
      <animated.mesh
        position={springProps.position as any}
        scale={[1.3, 1.3, 1.3]}
      >
        <BotScoreLegend
          {...{
            isInStartMenu: false,
            position: [0, 0, 0],
            scale: [1, 1, 1],
          }}
        />
      </animated.mesh>
    </HUD>
  );
}
function Alerts() {
  const { /* latestBotScore, */ node, lastNode } = useLatestTaggedNode();
  const latestBotScore = {
    astroturf: 0.33,
    fake_follower: 0.51,
    financial: 0,
    other: 0.63,
    overall: 0.63,
    self_declared: 0.1,
    spammer: 0.09,
  };
  console.log("🌟🚨 ~ Alerts ~ latestBotScore", latestBotScore);
  const isUp = true;
  const [, setIsUp] = useAtom(isBotScoreExplainerUpAtom);
  const springUp = useSpringDom({
    marginBottom: isUp ? 24 : -500,
    pointerEvents: "auto",
  });

  return (
    <AlertContentStyles>
      <animatedDom.div style={springUp as any} className="alerts">
        <Alert
          severity="info"
          onClose={() => {
            setIsUp(false);
          }}
        >
          {latestBotScore ? (
            <>
              <div className="scoreBar">
                <div className="category">Overall </div>
                <div
                  className="value"
                  style={{ width: latestBotScore.overall * 100 + "%" }}
                >
                  {latestBotScore.overall}
                </div>
              </div>
              <div className="scoreBar">
                <div className="category">Astroturf </div>
                <div
                  className="value"
                  style={{ width: latestBotScore.astroturf * 100 + "%" }}
                >
                  {latestBotScore.astroturf}
                </div>
              </div>
              <div className="scoreBar">
                <div className="category"> Fakefollower:</div>{" "}
                <div
                  className="value"
                  style={{ width: latestBotScore.fake_follower * 100 + "%" }}
                >
                  {latestBotScore.fake_follower}{" "}
                </div>
              </div>
              <div className="scoreBar">
                <div className="category">Financial </div>
                <div
                  className="value"
                  style={{ width: latestBotScore.financial * 100 + "%" }}
                >
                  {latestBotScore.financial}
                </div>
              </div>
              <div className="scoreBar">
                <div className="category">Other </div>
                <div
                  className="value"
                  style={{ width: latestBotScore.other * 100 + "%" }}
                >
                  {latestBotScore.other}
                </div>
              </div>
              <div className="scoreBar">
                <div className="category"> Self declared:</div>{" "}
                <div
                  className="value"
                  style={{ width: latestBotScore.self_declared * 100 + "%" }}
                >
                  {latestBotScore.self_declared}{" "}
                </div>
              </div>
              <div className="scoreBar">
                <div className="category">Spammer: </div>
                <div
                  className="value"
                  style={{ width: latestBotScore.spammer * 100 + "%" }}
                >
                  {latestBotScore.spammer}
                </div>
              </div>
            </>
          ) : null}
        </Alert>
      </animatedDom.div>
    </AlertContentStyles>
  );
}
const AlertContentStyles = styled.div`
  pointer-events: none;
  /* width: 100px;
  height: 60px; */
  .MuiAlert-standardInfo {
    background: hsla(0, 0%, 0%, 0.8);
  }
  .MuiAlert-icon {
    display: none;
  }
  .MuiAlert-action {
    align-items: flex-start;
    pointer-events: auto;
  }
  .title {
    font-size: 4px;
  }
  display: grid;
  grid-gap: 1em;
  .scoreBar {
    height: 24px;
    width: 100%;
    font-size: 4px;
    color: #fff;
    font-weight: bold;
    display: grid;
    grid-template-columns: 300px 1fr;
    position: relative;
    .category {
      text-align: left;
      position: absolute;
      left: -2em;
    }
    .value {
      position: absolute;
      left: -1em;
      text-align: right;
    }
  }

  .score:hover {
    color: #fff;
  }

  .score:active {
    color: #fff;
  }
`;

export function BotScoreLegend({
  isInStartMenu,
  position,
  scale,
}: {
  isInStartMenu: boolean;
  position: number[];
  scale: number[];
}) {
  const [gameState] = useAtom(gameStateAtom);
  const showBotScore =
    isInStartMenu || gameState.step !== GameStepsEnum.welcome;
  const isGameOver = gameState.step === GameStepsEnum.gameOver;

  const show = !isGameOver && showBotScore;
  const scaleDisplay = show ? scale : [0, 0, 0];
  const springProps = useSpring({
    scale: scaleDisplay,
  });

  return (
    <>
      {!isInStartMenu && <BotScoreInfoCard />}
      <animated.mesh
        castShadow={true}
        scale={springProps.scale as any}
        position={position as any}
      >
        {/* sphere in the middle */}
        <mesh castShadow={true}>
          <meshPhysicalMaterial
            {...{ metalness: 1, color: "#316c83" }}
            clearcoat={1}
            clearcoatRoughness={0.5}
          />
          <sphereBufferGeometry args={[RADIUS * 0.007, 26, 26]} />
        </mesh>
        <mesh castShadow={true} scale={[SCALE, SCALE, SCALE]}>
          <NodeBotScoreAntenna
            {...{
              showLabels: true,
              forceOpaque: true,
              isInStartMenu,
              brightenText: true,
              brightenBalls: true,
              botScore: {
                overall: 1,
                fake_follower: 1,
                astroturf: 1,
                financial: 1,
                other: 1,
                self_declared: 1,
                spammer: 1,
              },
            }}
          />
        </mesh>
        <directionalLight position={[-7, 14.28, 12.18]} intensity={5} />
      </animated.mesh>
    </>
  );
}
