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

  const [[x2, y2, z2], setPos2] = useState([
    Math.random(),
    Math.random(),
    Math.random(),
  ]);
  const [toggle, setToggle] = useState(false);
  const initial = (Math.PI / 180) * 30;
  const springSpin = useSpring({
    rotation: toggle
      ? [initial, 0, 0]
      : [2 * Math.PI * x2 + initial, 2 * Math.PI * y2, 2 * Math.PI * z2],
    delay: 500,
    onRest: () => {
      setPos2([Math.random(), Math.random(), Math.random()]);
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
          <meshBasicMaterial wireframe={true} color={"#5a8694"} />
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
