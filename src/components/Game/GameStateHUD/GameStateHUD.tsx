import { useAtom } from "jotai";
import { gameStateAtom, GameStepsEnum } from "providers/store/store";
import { BotScoreLegend } from "components/Game/GameStateHUD/BotScoreLegend";
import Score from "../Score";
import { ShotsRemaining } from "./ShotsRemaining";

export function GameStateHUD() {
  const [gameState] = useAtom(gameStateAtom);
  return (
    <>
      <Score />
      <ShotsRemaining />
      {gameState.step === GameStepsEnum.welcome && (
        <BotScoreLegend
          isInStartMenu={true}
          position={[0, 0.2, 0]}
          scale={[1.3, 1.3, 1.3]}
        />
      )}
    </>
  );
}
