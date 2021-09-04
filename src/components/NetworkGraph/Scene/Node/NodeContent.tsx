import { UserNode } from "../../useUserNodes";
import NodeBillboard from "./NodeBillboard";
import { useSpring, animated } from "@react-spring/three";
import { NodeBotScoreAntennae } from "./NodeBotScoreAntenna";
import { CONFIG_FADE_IN, CONFIG_POP_OUT } from "utils/constants";
import { ScoreIncreasedPopupText } from "./ScoreIncreasedPopupText";
import { useState } from "react";
import { MeshWobbleMaterial } from "@react-three/drei";
import { useControls } from "leva";
import { useMounted } from "utils/hooks";
import { useHoverAnimation } from "../useHoverAnimation";
import {
  notABotMaterial,
  defaultNodeMaterial,
  opacityMaterial,
  rightClickNodeMaterial,
  pointerOverMaterial,
  tooltipNodeMaterial,
  nodeGeometry,
} from "./Node";

export function NodeContent({
  node,
  isTooltipNode,
  isPointerOver,
  isScanningNode,
  isRightClickingThisNode,
  forceOpaque = false,
  brightenBalls = false,
  isPopupNode = false,
}: {
  node: UserNode;
  isTooltipNode: boolean;
  isPointerOver: boolean;
  isScanningNode: boolean;
  isRightClickingThisNode: boolean;
  forceOpaque?: boolean;
  brightenBalls?: boolean;
  isPopupNode?: boolean;
}) {
  const hasBotScore = Boolean(node.user.botScore);
  const isNotABot = node.user.isNotABot;

  const [doneAnimating, setDoneAnimating] = useState(false);

  const material = isNotABot
    ? notABotMaterial
    : isPopupNode
    ? defaultNodeMaterial
    : !doneAnimating
    ? opacityMaterial
    : isScanningNode
    ? null
    : isRightClickingThisNode
    ? rightClickNodeMaterial
    : isPointerOver && isTooltipNode
    ? pointerOverMaterial
    : isTooltipNode
    ? tooltipNodeMaterial
    : defaultNodeMaterial;

  const mounted = useMounted();

  // fade in on mount
  const springProps = useSpring({
    opacity: isNotABot ? 0 : mounted || isPopupNode ? 1 : 0,
    onRest() {
      setDoneAnimating(true);
    },
    config: isNotABot ? CONFIG_POP_OUT : CONFIG_FADE_IN,
    immediate: isPopupNode,
    clamp: true,
  });
  const { metalness } = useControls({ metalness: 0 });
  return (
    <>
      <animated.mesh>
        <animated.mesh ref={isPopupNode ? null : null}>
          {isScanningNode ? null : (
            <animated.mesh
              {...(material ? { material } : {})}
              geometry={nodeGeometry}
              material-transparent={true}
              material-opacity={springProps.opacity}
            ></animated.mesh>
          )}
          {node.user.botScore ? (
            <>
              <NodeBotScoreAntennae
                {...{
                  botScore: node.user.botScore,
                  forceOpaque,
                  brightenBalls,
                }}
              />
              <ScoreIncreasedPopupText
                isMounted={hasBotScore}
                {...{ botScore: node.user.botScore }}
              />
            </>
          ) : null}
          {node ? (
            <NodeBillboard
              {...{
                node,
              }}
            />
          ) : null}
          {isScanningNode && <ScanningNodeAnimation />}
        </animated.mesh>
      </animated.mesh>
    </>
  );
}
function ScanningNodeAnimation() {
  return (
    <>
      <mesh geometry={nodeGeometry}>
        <MeshWobbleMaterial
          skinning={true}
          factor={20}
          speed={8}
          {...{
            metalness: 0.94,
            roughness: 0.1,
            color: "#1fd5db",
            transparent: true,
            opacity: 0.2,
          }}
        />
      </mesh>
    </>
  );
}
