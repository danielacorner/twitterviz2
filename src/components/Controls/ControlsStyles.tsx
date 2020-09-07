import styled from "styled-components/macro";

export const ControlsStyles = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 32px;
  align-content: start;
  .styleTweets {
    display: grid;
    grid-gap: 8px;
  }
  .filters {
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 1fr 1fr;
  }
  .checkboxes {
    display: grid;
    max-width: 200px;
    grid-template-columns: 1fr 1fr;
  }
  padding: 8px;
  border-right: 1px solid black;
`;

export const Div = styled.div`
  display: grid;
  place-items: center;
`;

export const FetchUserTweetsFormStyles = styled.form`
  display: grid;
  grid-auto-flow: column;
  place-items: center;
`;
