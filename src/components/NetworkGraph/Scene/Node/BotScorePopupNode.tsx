import { animated, useSpring } from "@react-spring/three";
import { NodeContent } from "components/NetworkGraph/Scene/Node/Node";
import { Canvas, useFrame } from "@react-three/fiber";
import styled from "styled-components/macro";
import { useAtom } from "jotai";
import { botScorePopupNodeAtom } from "providers/store/store";
import { Suspense, useEffect, useRef, useState } from "react";
import { UserNode } from "../../useGraphWithUsersAndLinks";
import { useWindowSize } from "utils/hooks";
import { Environment } from "@react-three/drei";

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
          <animated.mesh scale={springProps.scale} position={[0, 0, -2]}>
            {nodeDisplay ? (
              <>
                <NodeContent
                  {...{
                    node: nodeDisplay,
                    isTooltipNode: false,
                    isPointerOver: false,
                    isRightClickingThisNode: false,
                    forceOpaque: true,
                  }}
                />
                {nodeDisplay.user.botScore ? null : <ScanningAnimation />}
                <ambientLight intensity={4} />
                <directionalLight position={[0, 5, -4]} intensity={6} />
              </>
            ) : null}
          </animated.mesh>
        </Canvas>
      </ContentStyles>
    </PopupStyles>
  );
}
const WIDTH = 4;
const SCAN_SPEED = 2;
function ScanningAnimation() {
  const ref = useRef<any>(null);
  const ref2 = useRef<any>(null);

  useFrame(({ clock }) => {
    const seconds = clock.getElapsedTime();
    if (ref.current && ref2.current) {
      const progress = (seconds % (Math.PI * 2)) * SCAN_SPEED;
      const y = Math.sin(progress) * WIDTH * 0.5;
      ref.current.position.set(0, y, 0);

      ref2.current.rotation.y += 0.01;
      ref2.current.rotation.z += 0.01;
    }
  });

  return (
    <mesh>
      {/* scanning box */}
      <mesh ref={ref}>
        <boxBufferGeometry args={[WIDTH, 0.02 * WIDTH, WIDTH]} />
        <meshPhysicalMaterial
          color={"#99dffa"}
          transmission={0.98}
          roughness={0}
          thickness={10}
        />
      </mesh>
      <Suspense fallback="null">
        <Environment preset="forest" />
      </Suspense>
      {/* Background plane w. scanning effect?  */}

      {/* scanning icosahedron */}
      <mesh ref={ref2}>
        <icosahedronBufferGeometry args={[2.5, 1]} />
        <meshBasicMaterial
          wireframe={true}
          transparent={true}
          opacity={0.15}
          color={"#3ac7ff"}
        />
      </mesh>
    </mesh>
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
