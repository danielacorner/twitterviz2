import DiceIcon from "@material-ui/icons/Casino";
import { BREAKPOINTS } from "../../utils/constants";
import { StyledButton } from "../Controls/Buttons/StyledButton";
import { useStreamNewTweets } from "./useStreamNewTweets";

export function BtnStreamNewTweets() {
  const { loading, fetchNewTweetsFromTwitterApi } = useStreamNewTweets();

  return (
    <StyledButton
      css={`
        width: fit-content;
        width: 60px;
        transform: translateY(10px);
        &&& {
          padding: 8px;
        }
        .MuiButton-label {
          font-size: 12px;
          line-height: 1.2em;
        }
        justify-self: center;
        align-self: start;
        @media (min-width: ${BREAKPOINTS.TABLET}px) {
          transform: none;
          align-self: unset;
          width: fit-content;
          white-space: nowrap;
          &&& {
            padding: 8px 16px;
          }
          .MuiButton-label {
            font-size: 16px;
          }
        }
      `}
      icon={<DiceIcon className="diceIcon" />}
      disabled={loading}
      onClick={fetchNewTweetsFromTwitterApi}
      className="btnFetch"
      variant="contained"
      color="primary"
    >
      Twitter Stream
    </StyledButton>
  );
}
