import { useAtom } from "jotai";
import { scoreAtom } from "providers/store/store";
import { animated } from "react-spring";
import styled from "styled-components/macro";
const Score = () => {
  const [score] = useAtom(scoreAtom);

  // // whenever we fetch a bot score, add points to the score
  // const { number } = useSpring({
  // 	reset: true,
  // 	number: score,
  // 	config: config.molasses,
  // 	// onRest: () => set(!flip),
  // });
  return (
    <ScoreStyles>
      <div className="scoreIcon">
        <img src="humanoid.png" alt="" />
      </div>
      <div className="scoreNum">{score.toFixed(0)}</div>
      {/* Score: {number.to((n) => n.toFixed(0))} */}
    </ScoreStyles>
  );
};
export default Score;
const ScoreStyles = styled(animated.div)`
  position: fixed;
  top: 13px;
  right: 26px;
  width: 92px;
  font-size: 24px;
  pointer-events: none;
  display: grid;
  align-items: center;
  grid-template-columns: 32px 1fr;
  .scoreNum {
    text-align: right;
  }
  .scoreIcon {
    margin-bottom: -6px;
    img {
      height: auto;
      width: 100%;
    }
  }
`;
