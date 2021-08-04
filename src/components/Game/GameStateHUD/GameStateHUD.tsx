import Score from "../Score";
import { ShotsRemaining } from "./ShotsRemaining";

export function GameStateHUD() {
  return (
    <>
      <Score />
      <ShotsRemaining />
    </>
  );
}
