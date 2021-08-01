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
      {shotsRemaining} shot{shotsRemaining === 1 ? "" : "s"} left
      {gameState.step === GameStepsEnum.gameOver ? " - game over" : ""}
    </ShotsRemainingStyles>
  );
}
const ShotsRemainingStyles = styled.div`
  position: fixed;
  top: 13px;
  left: 0;
  right: 0;
  pointer-events: none;
  text-align: center;
`;
