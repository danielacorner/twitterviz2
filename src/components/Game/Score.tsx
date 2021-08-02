import { useAtom } from "jotai";
import { scoreAtom } from "providers/store/store";
import { useSpring, animated, config } from "react-spring";
import { HighScores } from "./HighScores/HighScores";
import styled from "styled-components/macro";
const Score = () => {
  const [score] = useAtom(scoreAtom);

  // whenever we fetch a bot score, add points to the score
  const { number } = useSpring({
    reset: true,
    number: score,
    config: config.molasses,
    // onRest: () => set(!flip),
  });
  console.log("🌟🚨 ~ file: Score.tsx ~ line 11 ~ Score ~ number", number);

  return (
    <AnimatedScoreStyles>
      <div className="scoreText">Score:</div>
      <div className="scoreNum">{score.toFixed(0)}</div>
      {/* Score: {number.to((n) => n.toFixed(0))} */}
      <HighScores />
    </AnimatedScoreStyles>
  );
};
export default Score;
const AnimatedScoreStyles = styled(animated.div)`
  position: fixed;
  top: 13px;
  right: 26px;
  width: 100px;
  pointer-events: none;
  display: grid;
  grid-template-columns: auto 1fr;
  .scoreText {
  }
  .scoreNum {
    text-align: end;
  }
`;
