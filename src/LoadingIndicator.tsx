import { useState } from "react";
import styled from "styled-components/macro";
import { useLoading } from "./providers/store/useSelectors";
import { Canvas } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import { useMount } from "utils/utils";

export function LoadingIndicator() {
  const isLoading = useLoading();

  const springProps = useSpring({
    opacity: isLoading ? 1 : 0,
    position: isLoading ? [0, 0, 0] : [0, -5, 0],
  });

  const [toggle, setToggle] = useState(true);
  const initial = (Math.PI / 180) * 30;
  const springSpin = useSpring({
    rotation: toggle
      ? [initial, 0, 0]
      : [Math.PI * 2 + initial, 0, Math.PI * 2],
    delay: 500,
    onRest: () => {
      setToggle(!toggle);
    },
    config: { tension: 300, mass: 30, friction: 170 },
  });
  useMount(() => {
    setToggle(!toggle);
  });

  return (
    <LoadingIndicatorStyles>
      <Canvas style={{ width: "100%", height: 180 }}>
        <animated.mesh {...springProps} rotation={springSpin.rotation}>
          <icosahedronBufferGeometry args={[1, 0]} />
          <meshBasicMaterial wireframe={true} />
        </animated.mesh>
      </Canvas>
    </LoadingIndicatorStyles>
  );
}
const LoadingIndicatorStyles = styled.div`
  z-index: 999999999;
  pointer-events: none;
  position: fixed;
  height: 128px;
  bottom: 0;
  left: 0;
  right: 0;
`;
