import styled from "styled-components/macro";

export const ControlsStyles = styled.div`
  display: grid;
  align-items: start;
  background: ${(props) => (props.isLight ? "hsl(0,0%,90%)" : "hsl(0,0%,15%)")};
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
  .controlsContainer {
    h3 {
      margin-bottom: 1em;
    }
  }
  padding: 12px;
  border-right: 1px solid black;
`;

export const TwoColFormStyles = styled.form`
  display: grid;
  grid-auto-flow: column;
  place-items: center;
`;
