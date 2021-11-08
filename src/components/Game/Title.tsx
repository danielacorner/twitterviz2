import styled from "styled-components/macro";
import { useSpring, animated } from "react-spring";
import { MARGIN_TOP } from "utils/constants";

export function Title({ isMinimized }) {
  console.log("🌟🚨 ~ Title ~ isMinimized", isMinimized);
  const { x, y, cx, cy } = { x: -2.8, y: 0.86, cx: -249, cy: 51 };
  const springContainer = useSpring({
    top: -MARGIN_TOP,
    transform: `scale(${isMinimized ? 0.5 : 1}) translate(${
      isMinimized ? cx : 0
    }px,${isMinimized ? cy : 0}px)`,
    marginTop: isMinimized ? 0 : -12,
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
  .title {
    font-family: "Rancho", cursive;
    font-size: 4em;
    margin: 0em 0 32px;
    line-height: 1em;
  }
  margin: auto;
  transform-origin: top center;
  position: fixed;
  z-index: 10;
  left: 0;
  right: 0;
  height: 100px;
  .content {
  }
  .topEmoji {
    z-index: 10;
    font-size: 4em;
    text-shadow: 0 2px 5px black;
  }
`;
