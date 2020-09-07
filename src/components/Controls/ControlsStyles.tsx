import styled from "styled-components/macro";

export const ControlsStyles = styled.div`
  display: grid;
  align-items: start;
  align-content: start;
  grid-gap: 16px;
  width: 100%;
  overflow: hidden auto;
  max-height: 100vh;
  .displayControls,
  .tweetFilterControls {
    display: grid;
    grid-gap: 8px;
  }
  .checkboxes {
    display: grid;
    max-width: 200px;
    grid-template-columns: 1fr 1fr;
  }
  padding: 12px;
  border-right: 1px solid black;
`;

export const Div = styled.div`
  display: grid;
  place-items: center;
`;

export const TwoColFormStyles = styled.form`
  display: grid;
  grid-auto-flow: column;
  place-items: center;
`;
