import styled from "styled-components/macro";

export const ScoreStyles = styled.div`
  .high-scores {
    position: fixed;
    inset: 0;
    .content {
      margin-top: 128px;
    }
  }
  .submit-high-score {
    .content {
      font-size: 16px;
      display: flex;
      gap: 10px;
      margin: auto;
      margin-top: 360px;
      place-items: center;
      place-content: center;
    }
  }
`;
