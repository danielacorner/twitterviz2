import { animated, useSpring } from "@react-spring/three";

import { NodeContent } from "components/NetworkGraph/Scene/Node/NodeContent";
import { Canvas } from "@react-three/fiber";

import styled from "styled-components/macro";
import { UserNode } from "../../useUserNodes";
import Background from "../Background";
import { ScanningAnimation } from "./ScanningAnimation";
import { useLatestTaggedNode } from "./useLatestTaggedNode";
import { useWindowSize } from "utils/hooks";
import { useHoverAnimation } from "../useHoverAnimation";
import { defaultNodeMaterial } from "./materialsAndGeometries";
/** pops up and animates when you get a new bot score */
export function BotScorePopupNode() {
  const { latestBotScore, node, lastNode } = useLatestTaggedNode();

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
          {...{ windowSize, nodeDisplay: lastNode, springProps }}
        />
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

function BotScorePopupNodeAnimation({
  windowSize,
  nodeDisplay,
  springProps,
}: {
  windowSize: { width: number; height: number };
  nodeDisplay: UserNode | null;
  springProps;
}) {
  const hoverAnimationRefWave = useHoverAnimation({
    deltaX: 0.7,
    deltaY: 0.7,
    randomize: true,
  });
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
          <directionalLight
            castShadow={true}
            position={[0, 5, -4]}
            intensity={6}
          />
        </>
      ) : null}
      <animated.mesh
        scale={springProps.scale as any}
        position={[0, 0, -2]}
        ref={hoverAnimationRefWave}
      >
        {nodeDisplay ? (
          <mesh material={defaultNodeMaterial}>
            <NodeContent
              {...{
                node: nodeDisplay,
                isTooltipNode: false,
                isScanningNode: true,
                isPointerOver: false,
                isRightClickingThisNode: false,
                forceOpaque: true,
                isPopupNode: true,
                brightenBalls: true,
              }}
            />
            {nodeDisplay.user.botScore ? null : <ScanningAnimation />}
          </mesh>
        ) : null}
      </animated.mesh>
    </Canvas>
  );
}
