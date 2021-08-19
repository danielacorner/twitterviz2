import { useAtom } from "jotai";
import {
  gameStateAtom,
  GameStepsEnum,
  shotsRemainingAtom,
} from "providers/store/store";
import styled from "styled-components/macro";

export function ShotsRemaining() {
  const [shotsRemaining] = useAtom(shotsRemainingAtom);
  const [gameState] = useAtom(gameStateAtom);
  return (
    <ShotsRemainingStyles>
      <div className="shots">{"🏀".repeat(shotsRemaining)}</div>
      {gameState.step === GameStepsEnum.gameOver ? null : (
        <div className="shotsLeft">
          {shotsRemaining} shot
          {shotsRemaining === 1 ? "" : "s"} left
        </div>
      )}
    </ShotsRemainingStyles>
  );
}
const ShotsRemainingStyles = styled.div`
  position: fixed;
  text-align: left;
  font-size: 24px;
  .shots {
    height: 1em;
    letter-spacing: 0.3em;
  }
  .shotsLeft {
    font-size: 14px;
    margin-left: 4px;
  }
  gap: 12px;
  display: grid;
  top: 13px;
  left: 13px;
  pointer-events: none;
`;
