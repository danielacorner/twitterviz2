import { useAtom } from "jotai";
import { gameStateAtom, GameStepsEnum } from "providers/store/store";
import styled from "styled-components/macro";
import { IconButton, Tooltip } from "@material-ui/core";
import { Replay } from "@material-ui/icons";
import { usePlayAgain } from "./Game";

export function BtnStartOver() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const resetScoreAndFetchNewTweets = usePlayAgain();

  return (
    <BtnStartOverStyles>
      <Tooltip title="Start Over">
        <IconButton
          className="btnStartOver"
          onClick={() => {
            setGameState({ ...gameState, step: GameStepsEnum.welcome });
            resetScoreAndFetchNewTweets();
          }}
        >
          <Replay />
        </IconButton>
      </Tooltip>
    </BtnStartOverStyles>
  );
}
const BtnStartOverStyles = styled.div`
  .btnStartOver {
    position: fixed;
    z-index: 999999999999999999;
    bottom: 0;
    left: 0;
  }
`;
