import styled from "styled-components/macro";
import { useSpring, animated } from "react-spring";
import { MARGIN_TOP } from "utils/constants";
import { useControls } from "leva";

export function Title({ isMinimized, scaleY }) {
  const { x, y, cx, cy } = useControls({ x: -2.8, y: 0.86, cx: -252, cy: 51 });
  const springContainer = useSpring({
    top: -MARGIN_TOP,
    transform: `scale(${isMinimized ? 0.5 : 1}) translate(${
      isMinimized ? cx : 0
    }px,${isMinimized ? cy : 0}px) `,
    marginTop: isMinimized ? 0 : -12,
    transformOrigin: "top right",
  });
  const springX = useSpring({
    transform: `translateX(${isMinimized ? 100 * x : 0}px)`,
  });
  const springY = useSpring({
    transform: `translateY(${isMinimized ? -100 * y : 0}px)`,
  });

  return (
    <TitleStyles style={springContainer}>
      <animated.div className="topEmoji" style={springX}>
        🎣
      </animated.div>
      <animated.h1
        className="title font-effect-shadow-multiple"
        style={springY}
      >
        Plenty of Bots
      </animated.h1>
    </TitleStyles>
  );
}
const TitleStyles = styled(animated.div)`
  display: grid;
  justify-items: center;
  .title {
    font-family: "Rancho", cursive;
    font-size: 4em;
    margin: 0em 0 32px;
    line-height: 1em;
  }
  margin: auto;
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  transform-origin: top left;
  height: 100px;
  .content {
  }
  .topEmoji {
    z-index: 10;
    font-size: 4em;
    text-shadow: 0 2px 5px black;
  }
`;
