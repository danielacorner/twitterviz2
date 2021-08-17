import HUD from "../../NetworkGraph/Scene/HUD";
import { useThree } from "@react-three/fiber";
import { NodeBotScoreAntenna } from "../../NetworkGraph/Scene/Node/NodeBotScoreAntenna";
import { useSpring, animated } from "@react-spring/three";
import { gameStateAtom, GameStepsEnum } from "providers/store/store";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { useLatestTaggedNode } from "components/NetworkGraph/Scene/Node/useLatestTaggedNode";

const SCALE = 0.15;
const RADIUS = 40;
export const isBotScoreExplainerUpAtom = atom<boolean>(false);

/** displays at the bottom when you get a bot score */
export function BotScoreLegendHUD({
  position = [0, 0, 0],
  scale = [1, 1, 1],
}: {
  position?: number[];
  scale?: number[];
}) {
  const {
    size: { width, height },
  } = useThree();
  const { latestBotScore, node, nodeDisplay } = useLatestTaggedNode();

  const [isUp, setIsUp] = useAtom(isBotScoreExplainerUpAtom);

  // when we get a new bot score, raise the alert
  useEffect(() => {
    setIsUp(true);
  }, [setIsUp, latestBotScore]);

  const springProps = useSpring({
    position: [0, isUp ? 0 : -2, 0],
  });

  return (
    <HUD position={[width / 2 - RADIUS * 2, height / 2 - RADIUS * 2.5, 0]}>
      <animated.mesh position={springProps.position as any} renderOrder={9999}>
        <BotScoreLegend {...{ isInStartMenu: true, position, scale }} />
      </animated.mesh>
    </HUD>
  );
}

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
    <animated.mesh scale={springProps.scale as any} position={position as any}>
      <mesh>
        <meshPhysicalMaterial
          {...{ metalness: 1, color: "#316c83" }}
          clearcoat={1}
          clearcoatRoughness={0.5}
          depthTest={false}
        />
        <sphereBufferGeometry args={[RADIUS * 0.007, 26, 26]} />
      </mesh>
      <mesh scale={[SCALE, SCALE, SCALE]}>
        <NodeBotScoreAntenna
          {...{
            showLabels: true,
            forceOpaque: true,
            isInStartMenu,
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
  );
}
