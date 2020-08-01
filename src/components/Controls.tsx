import React from "react";
import { MenuItem, Switch, Select } from "@material-ui/core";
import styled from "styled-components/macro";
import { COLOR_BY } from "../utils/constants";

const Switch3D = ({ onChange }) => (
  <span>
    2D
    <Switch onChange={onChange} />
    3D
  </span>
);

const ControlsStyles = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;
`;

const Controls = ({ handleSelectColor, colorBy, setIs3d }) => (
  <ControlsStyles>
    <Select onChange={handleSelectColor} value={colorBy}>
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      <MenuItem value={COLOR_BY.mediaType}>Media type</MenuItem>
      <MenuItem value={COLOR_BY.textLength}>Text length</MenuItem>
    </Select>
    <Switch3D onChange={() => setIs3d((prev) => !prev)} />
  </ControlsStyles>
);

export default Controls;
