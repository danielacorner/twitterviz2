import { Typography } from "@material-ui/core";
import styled from "styled-components/macro";

export const TwoColRowStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  grid-gap: 0.5em;
  height: 100%;
`;

export const ControlTitle = styled(Typography).attrs({
  variant: "overline",
  color: "textSecondary",
})`
  white-space: nowrap;
  font-size: 1rem;
`;

export const TwoColFormStyles = styled.form`
  display: grid;
  grid-auto-flow: column;
  place-items: center;
  height: 100%;
  .MuiFormControl-root {
    height: 100%;
  }
  button {
    height: calc(100% - 12px);
  }
`;
