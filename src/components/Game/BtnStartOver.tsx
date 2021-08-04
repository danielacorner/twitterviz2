import { useAtom } from "jotai";
import { gameStateAtom, GameStepsEnum } from "providers/store/store";
import styled from "styled-components/macro";
import { IconButton, Tooltip } from "@material-ui/core";
import { Replay } from "@material-ui/icons";

export function BtnStartOver() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  return (
    <BtnStartOverStyles>
      <Tooltip title="Start Over">
        <IconButton
          className="btnStartOver"
          onClick={() => {
            setGameState({ ...gameState, step: GameStepsEnum.welcome });
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
    bottom: 0;
    left: 0;
  }
`;
