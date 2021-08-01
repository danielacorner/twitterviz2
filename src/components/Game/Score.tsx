import { useAtom } from "jotai";
import { scoreAtom } from "providers/store/store";
import styled from "styled-components/macro";
import { useSpring, animated, config } from "react-spring";
import { useMount } from "utils/utils";
import { HighScores } from "./HighScores";
const Score = () => {
  const [score] = useAtom(scoreAtom);

  // whenever we fetch a bot score, add points to the score
  const { number } = useSpring({
    reset: true,
    number: score,
    config: config.molasses,
    // onRest: () => set(!flip),
  });

  return (
    <ScoreStyles>
      <animated.div className="score">
        Score: {score.toFixed(0)}
        {/* Score: {number.to((n) => n.toFixed(0))} */}
      </animated.div>
      <HighScores />
    </ScoreStyles>
  );
};
export const ScoreStyles = styled.div`
  .score {
    position: fixed;
    top: 13px;
    right: 56px;
    width: 100px;
    pointer-events: none;
  }
  .high-scores {
    position: fixed;
    inset: 0;
    .content {
      margin-top: 128px;
    }
  }
`;

export default Score;
