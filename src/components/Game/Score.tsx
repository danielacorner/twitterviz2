import { useAtom } from "jotai";
import { gameStateAtom, GameStepsEnum, scoreAtom } from "providers/store/store";
import styled from "styled-components/macro";
import { useSpring, animated, config } from "react-spring";
const Score = () => {
  const [gameState] = useAtom(gameStateAtom);
  const isGameOver = gameState.step === GameStepsEnum.gameOver;
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
    </ScoreStyles>
  );
};
const ScoreStyles = styled.div`
  .score {
    position: fixed;
    top: 13px;
    right: 56px;
    width: 100px;
    pointer-events: none;
  }
`;

export default Score;
