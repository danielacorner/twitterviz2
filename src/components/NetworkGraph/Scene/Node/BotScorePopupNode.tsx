import { animated, useSpring } from "@react-spring/three";
import { NodeContent } from "components/NetworkGraph/Scene/Node/Node";
import { Canvas } from "@react-three/fiber";
import styled from "styled-components/macro";
import { useAtom } from "jotai";
import { botScorePopupNodeAtom } from "providers/store/store";
import { useEffect, useState } from "react";
import { UserNode } from "../../useNodes";
import { useWindowSize } from "utils/hooks";
import Background from "../Background";
import { ScanningAnimation } from "./ScanningAnimation";

/** pops up and animates when you get a new bot score */
export function BotScorePopupNode() {
  const [node] = useAtom(botScorePopupNodeAtom);
  const [lastNode, setLastNode] = useState<UserNode | null>(null);
  // const lastNode = useRef<UserNode | null>(null);
  useEffect(() => {
    if (node) {
      setLastNode(node);
    }
  }, [node]);
  const nodeDisplay = node || lastNode;
  const springProps = useSpring({
    scale: node
      ? nodeDisplay?.user.botScore
        ? [0.3, 0.3, 0.3]
        : [0.6, 0.6, 0.6]
      : [0, 0, 0],
  });
  const windowSize = useWindowSize();
  return (
    <PopupStyles>
      <ContentStyles>
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
