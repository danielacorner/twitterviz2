import HUD from "../../NetworkGraph/Scene/HUD";
import { useThree } from "@react-three/fiber";
import { NodeBotScoreAntenna } from "../../NetworkGraph/Scene/Node/NodeBotScoreAntenna";
import { useSpring, animated } from "@react-spring/three";
import {
  gameStateAtom,
  GameStepsEnum,
  scanningNodeIdAtom,
} from "providers/store/store";
import { atom, useAtom } from "jotai";
import { useLatestTaggedNode } from "components/NetworkGraph/Scene/Node/useLatestTaggedNode";
import { useControls } from "leva";
import { BotScoreInfoCard } from "./BotScoreInfoCard";
import { INFO_CARD_INITIAL_Y, INFO_CARD_MAX_Y } from "utils/constants";
import { useEffect, useRef, useState } from "react";

const SCALE = 0.15;
const RADIUS = 40;
export const isBotScoreExplainerUpAtom = atom<boolean>(false);

/** displays at the bottom when you get a bot score */
export function BotScoreLegendHUD() {
  const {
    size: { width, height },
  } = useThree();

  const [isUp] = useAtom(isBotScoreExplainerUpAtom);

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
  const { latestBotScore, lastNode } = useLatestTaggedNode();
  const [scanningNodeId] = useAtom(scanningNodeIdAtom);
  const isDoneScanning = !scanningNodeId && lastNode;
  const [infoCardSpringProps, set] = useSpring(() => ({
    scale: [1, 1, 1],
    position: [0, INFO_CARD_INITIAL_Y, 0],
    rotation: [0, 0, 0],
  }));

  const currentY = useRef(INFO_CARD_MAX_Y);
  const [currentYActual, setCurrentYActual] = useState(INFO_CARD_MAX_Y);
  // pop it up when we're done scanning
  useEffect(() => {
    if (isDoneScanning) {
      set({ position: [0, INFO_CARD_MAX_Y, 0] });
      currentY.current = INFO_CARD_MAX_Y;
      setCurrentYActual(INFO_CARD_MAX_Y);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDoneScanning]);
  // when we close it, pop it back down

  return (
    <>
      {!isInStartMenu && (
        <BotScoreInfoCard
          {...{
            set,
            springProps: infoCardSpringProps,
            currentY,
            currentYActual,
            setCurrentYActual,
          }}
        />
      )}
      <animated.mesh
        castShadow={true}
        scale={
          isInStartMenu ? springProps.scale : (infoCardSpringProps.scale as any)
        }
        position={
          (isInStartMenu ? position : infoCardSpringProps.position) as any
        }
        // position={position as any}
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
              botScore:
                isInStartMenu || !latestBotScore
                  ? {
                      overall: 1,
                      fake_follower: 1,
                      astroturf: 1,
                      financial: 1,
                      other: 1,
                      self_declared: 1,
                      spammer: 1,
                    }
                  : latestBotScore,
            }}
          />
        </mesh>
        <directionalLight position={[-7, 14.28, 12.18]} intensity={5} />
      </animated.mesh>
    </>
  );
}
