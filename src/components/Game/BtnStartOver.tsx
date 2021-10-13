import { useAtom } from "jotai";
import { gameStateAtom, GameStepsEnum } from "providers/store/store";
import styled from "styled-components/macro";
import { Button, Tooltip } from "@material-ui/core";
import { Replay } from "@material-ui/icons";
import { usePlayAgain } from "./Game";

export function BtnStartOver() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const resetScoreAndFetchNewTweets = usePlayAgain();

  return (
    <BtnStartOverStyles>
      <Tooltip title="Start Over">
        <Button
          className="btnStartOver"
          onClick={() => {
            setGameState({ ...gameState, step: GameStepsEnum.welcome });
            resetScoreAndFetchNewTweets();
          }}
          startIcon={<Replay />}
        >
          Start Over
        </Button>
      </Tooltip>
    </BtnStartOverStyles>
  );
}
const BtnStartOverStyles = styled.div`
  .btnStartOver {
    opacity: 0.6;
    position: fixed;
    z-index: 999999999999999999;
    bottom: 0;
    left: 0;
  }
`;
