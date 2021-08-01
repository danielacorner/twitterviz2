import { useAtom } from "jotai";
import { scoreAtom } from "providers/store/store";
import { useSpring, animated, config } from "react-spring";
import { HighScores } from "./HighScores";
import { ScoreStyles } from "./ScoreStyles";
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
export default Score;
