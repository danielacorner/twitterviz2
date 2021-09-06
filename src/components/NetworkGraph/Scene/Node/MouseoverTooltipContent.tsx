import styled from "styled-components/macro";
import {
  useSpring as useSpringDom,
  animated as animatedDom,
} from "@react-spring/web";
import { Html } from "@react-three/drei";
import { useIsMounted } from "../useIsMounted";

export function MouseoverTooltipContent({ tooltipText, customcss = "" }) {
  const isMounted = useIsMounted();
  const springOnMount = useSpringDom({
    transform: `translate3d(0,${isMounted ? -30 : -20}px,0)`,
    opacity: isMounted ? 1 : 0,
    config: { tension: 400, mass: 1, friction: 27 },
    clamp: true,
  });
  return (
    <>
      <Html center={true} style={{ pointerEvents: "none" }}>
        <AnimatedTooltipStyles style={springOnMount} {...{ customcss }}>
          <div className="tooltipContent">{tooltipText}</div>
        </AnimatedTooltipStyles>
      </Html>
    </>
  );
}
const AnimatedTooltipStyles = styled(animatedDom.div)`
  width: 155px;
  .tooltipContent {
    margin: auto;
    width: fit-content;
    padding: 0.6em 0.8em;
    font-size: 12px;
    line-height: 1.5em;
    color: white;
    background: #444;
    border-radius: 8px;
  }
  ${(p) => p.customcss || ""}
`;
