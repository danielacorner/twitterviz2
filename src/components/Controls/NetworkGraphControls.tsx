import React from "react";
import {
  MenuItem,
  Switch,
  Select,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import { COLOR_BY } from "../../utils/constants";
import { useConfig, AppConfig } from "../../providers/store";
import { Div } from "../DivStyles";
import styled from "styled-components/macro";

const NetworkGraphControlsStyles = styled.div`
  display: grid;
`;

const NetworkGraphControls = () => {
  return (
    <NetworkGraphControlsStyles className="networkGraphControls controlsContainer">
      <h3>Network Graph Controls</h3>
      <Switch3D />
      <SelectColorBy />
    </NetworkGraphControlsStyles>
  );
};

export default NetworkGraphControls;

function Switch3D() {
  const { is3d, setConfig } = useConfig();
  return (
    <Div css={``}>
      <span>
        2D
        <Switch onChange={() => setConfig({ is3d: !is3d })} checked={is3d} />
        3D
      </span>
    </Div>
  );
}

function SelectColorBy() {
  const { setConfig, colorBy } = useConfig();
  return (
    <FormControl>
      <InputLabel id="color-by">Color by...</InputLabel>
      <Select
        labelId="color-by"
        onChange={(event) => {
          setConfig({ colorBy: event.target.value as AppConfig["colorBy"] });
        }}
        value={colorBy}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={COLOR_BY.mediaType}>Media type</MenuItem>
        <MenuItem value={COLOR_BY.media}>Media</MenuItem>
        <MenuItem value={COLOR_BY.textLength}>Text length</MenuItem>
        <MenuItem value={COLOR_BY.sentiment}>Sentiment</MenuItem>
        <MenuItem value={COLOR_BY.profilePhoto}>Profile Photo</MenuItem>
      </Select>
    </FormControl>
  );
}
