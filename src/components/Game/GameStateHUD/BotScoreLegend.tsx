import { useTweets } from "providers/store/useSelectors";
import HUD from "../../NetworkGraph/Scene/HUD";
import { useThree } from "@react-three/fiber";
import { NodeBotScoreAntenna } from "../../NetworkGraph/Scene/Node/NodeBotScoreAntenna";
import { useSpring, animated } from "@react-spring/three";
import { gameStateAtom, GameStepsEnum } from "providers/store/store";
import { useAtom } from "jotai";
import Background from "components/NetworkGraph/Scene/Background";

const SCALE = 0.15;
const RADIUS = 40;

export function BotScoreLegend({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  isInStartMenu = false,
}: {
  position?: number[];
  scale?: number[];
  isInStartMenu?: boolean;
}) {
  const tweets = useTweets();
  const showBotScore =
    isInStartMenu || Boolean(tweets.find((t) => t.user.botScore));
  const {
    size: { width, height },
  } = useThree();
  const [gameState] = useAtom(gameStateAtom);
  const isGameOver = gameState.step === GameStepsEnum.gameOver;

  const show = !isGameOver && showBotScore;
  const scaleDisplay = show ? scale : [0, 0, 0];
  const springProps = useSpring({
    scale: scaleDisplay,
  });

  return (
    <HUD position={[width / 2 - RADIUS * 2, height / 2 - RADIUS * 2.5, 0]}>
      <animated.mesh
        scale={springProps.scale as any}
        position={position as any}
      >
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
    </HUD>
  );
}
