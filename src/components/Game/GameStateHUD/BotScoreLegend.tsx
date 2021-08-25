import HUD from "../../NetworkGraph/Scene/HUD";
import { useThree } from "@react-three/fiber";
import { NodeBotScoreAntenna } from "../../NetworkGraph/Scene/Node/NodeBotScoreAntenna";
import { useSpring, animated } from "@react-spring/three";
import {
  gameStateAtom,
  GameStepsEnum,
  isBotScoreExplainerUpAtom,
} from "providers/store/store";
import { useAtom } from "jotai";
import { useLatestTaggedNode } from "components/NetworkGraph/Scene/Node/useLatestTaggedNode";
import { useControls } from "leva";
import { Circle, useTexture } from "@react-three/drei";

const SCALE = 0.15;
const RADIUS = 40;

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
            showAvatar: false,
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
  showAvatar,
  position,
  scale,
}: {
  isInStartMenu: boolean;
  showAvatar: boolean;
  position: number[];
  scale: number[];
}) {
  const [gameState] = useAtom(gameStateAtom);
  const showBotScore =
    isInStartMenu || gameState.step !== GameStepsEnum.welcome;

  const scaleDisplay = showBotScore ? scale : [0, 0, 0];
  console.log("🌟🚨 ~ scaleDisplay", scaleDisplay);
  const springProps = useSpring({
    scale: scaleDisplay,
  });
  const { latestBotScore, lastNode } = useLatestTaggedNode();

  return (
    <>
      <animated.mesh
        castShadow={true}
        scale={isInStartMenu ? springProps.scale : ([1, 1, 1] as any)}
        position={(isInStartMenu ? position : [0, 0, 0]) as any}
        // position={position as any}
      >
        <group>
          {/* sphere in the middle */}
          <mesh castShadow={true}>
            <meshPhysicalMaterial
              {...{ metalness: 1, color: "#316c83" }}
              clearcoat={1}
              clearcoatRoughness={0.5}
            />
            <sphereBufferGeometry args={[RADIUS * 0.007, 26, 26]} />
          </mesh>
          {lastNode && showAvatar && <AvatarCircle {...{ lastNode }} />}
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
        </group>

        <directionalLight position={[-7, 14.28, 12.18]} intensity={5} />
      </animated.mesh>
    </>
  );
}
function AvatarCircle({ lastNode }) {
  const { posz, radius } = useControls({ posz: 0.18, radius: 0.17 });

  const avatarTexture = useTexture(
    lastNode.user.profile_image_url_https ||
      lastNode.user.profile_image_url ||
      ""
  );
  return (
    <Circle position={[0, 0, posz]} args={[radius, 32]}>
      <meshBasicMaterial depthTest={false} map={avatarTexture as any} />
    </Circle>
  );
}
