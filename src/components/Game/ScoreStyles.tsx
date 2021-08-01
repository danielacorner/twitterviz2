import styled from "styled-components/macro";
import { popupBaseCss } from "./popupBaseCss";

export const ScoreStyles = styled.div`
  .score {
    position: fixed;
    top: 13px;
    right: 56px;
    width: 100px;
    pointer-events: none;
  }
  .high-scores {
    position: fixed;
    inset: 0;
    .content {
      margin-top: 128px;
    }
  }
  .submit-high-score {
    position: fixed;
    inset: 0;
    .content {
      ${popupBaseCss}
      margin: auto;
      margin-top: 360px;
    }
  }
`;
