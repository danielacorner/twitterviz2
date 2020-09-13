import React from "react";
import { Button, useTheme } from "@material-ui/core";
import { useConfig } from "../../providers/store";
import WordcloudControls from "./WordcloudControls";
import NetworkGraphControls from "./NetworkGraphControls";
import FetchTweetsControls from "./FetchTweetsControls";
import styled from "styled-components/macro";

const CONTROLS_PADDING_INNER = 12;

const ControlsStyles = styled.div`
  background: ${(props) => (props.isLight ? "hsl(0,0%,90%)" : "hsl(0,0%,15%)")};
  width: 100%;
  overflow: hidden auto;
  max-height: 100vh;
  input {
    margin: auto;
  }
  h3 {
    margin-bottom: 1rem;
  }
  h5 {
    font-size: 1.5em;
    position: relative;
    margin: 2rem 0 1rem;
    text-align: left;
    &:after {
      content: "";
      position: absolute;
      bottom: -8px;
      left: ${-CONTROLS_PADDING_INNER}px;
      right: ${-CONTROLS_PADDING_INNER}px;
      height: 1px;
      background: hsl(0, 12%, ${(props) => (props.isLight ? "20" : "50")}%);
    }
  }
  .MuiFormControl-root {
    min-width: 140px !important;
    margin: 0.5rem 0;
  }
  padding: ${CONTROLS_PADDING_INNER}px;
  border-right: 1px solid black;
`;

const Controls = () => {
  // TODO
  const createLinks = () => {
    console.log("TODO");
  };
  const theme = useTheme();
  return (
    <ControlsStyles isLight={theme.palette.type === "light"}>
      <VizSpecificControls />
      <FetchTweetsControls />
      <Button onClick={createLinks}>Link Nodes</Button>
    </ControlsStyles>
  );
};

export default Controls;

function VizSpecificControls() {
  const { isWordcloud, isNetworkGraph } = useConfig();
  return isWordcloud ? (
    <WordcloudControls />
  ) : isNetworkGraph ? (
    <NetworkGraphControls />
  ) : null;
}
