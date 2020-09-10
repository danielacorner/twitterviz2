import React from "react";
import styled from "styled-components/macro";
import { Typography, Switch } from "@material-ui/core";

export const Div = styled.div`
  display: grid;
  place-items: center;
`;

export const H5 = ({ children }) => (
  <Typography color="textPrimary" variant="h5">
    {children}
  </Typography>
);
export const H6 = ({ children }) => (
  <Typography color="textPrimary" variant="h6">
    {children}
  </Typography>
);
export const Body1 = ({ children }) => (
  <Typography color="textPrimary" variant="body1">
    {children}
  </Typography>
);
export const SwitchWithLabels = ({
  labelLeft,
  labelRight,
  onChange,
  checked,
  ...props
}) => (
  <Div
    css={`
      display: grid;
      grid-auto-flow: column;
      align-items: center;
      justify-content: center;
    `}
  >
    <Body1>{labelLeft}</Body1>
    <Switch onChange={onChange} checked={checked} {...props} />
    <Body1>{labelRight}</Body1>
  </Div>
);
