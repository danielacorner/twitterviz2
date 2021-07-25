import { TextField } from "@material-ui/core";
import { useConfig } from "../../providers/store/useConfig";
import { Body1 } from "../common/styledComponents";
import styled from "styled-components/macro";
import { BREAKPOINTS } from "utils/constants";

export default function HowManyTweets() {
  const { numTweets, setConfig } = useConfig();

  return (
    <HowManyTweetsStyles>
      <div className="fetchTweets">
        <Body1>Fetch</Body1>
        <TextField
          className="textField"
          value={numTweets}
          onChange={(e) => setConfig({ numTweets: +e.target.value })}
          type="number"
          inputProps={{
            step: 10,
            min: 1,
            max: 500,
          }}
        />
        <Body1 className="tweetOrTweets">
          tweet{numTweets === 1 ? "" : "s"} from
        </Body1>
      </div>
    </HowManyTweetsStyles>
  );
}
const HowManyTweetsStyles = styled.div`
  .MuiFormLabel-root {
    white-space: nowrap;
  }
  display: flex;
  align-items: baseline;
  justify-content: center;
  .textField {
    width: 60px;
    padding-left: 4px;
  }
  .fetchTweets {
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translate(-8px, -26px) scale(0.9);
  }
  input {
    text-align: center;
  }
  p {
    font-size: 12px;
  }
  .from {
    font-size: 10px;
    margin-left: -4px;
  }
  .tweetOrTweets {
    text-align: right;
  }
  @media (min-width: ${BREAKPOINTS.TABLET}px) {
    .from {
      margin-left: auto;
      margin-right: auto;
    }
    .textField {
      width: 60px;
      padding: 0 10px;
    }
    .fetchTweets {
      flex-direction: row;
      transform: none;
    }
    p {
      font-size: 16px;
    }
  }
`;
