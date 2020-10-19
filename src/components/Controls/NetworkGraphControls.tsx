import React from "react";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  Grid,
} from "@material-ui/core";
import { COLOR_BY } from "../../utils/constants";
import { useConfig, AppConfig } from "../../providers/store";
import {
  H5,
  CollapsibleSwitchWithLabels,
  Body1,
} from "../common/styledComponents";
import { FormControlLabelCollapsible } from "./Checkboxes";
import { Typography } from "@material-ui/core";
import { ForceSimulationControls } from "./ForceSimulationControls";
/** react-force-graph docs
 * https://www.npmjs.com/package/react-force-graph
 */
const NetworkGraphControls = () => {
  return (
    <div className="networkGraphControls controlsContainer">
      <H5 style={{ pointerEvents: "none" }}>Graph</H5>
      <Switch3D />
      <SwitchGridMode />
      <H5 style={{ pointerEvents: "none" }}>Nodes</H5>
      <SwitchUserNodes />
      <SelectColorBy />
      <H5 style={{ pointerEvents: "none" }}>Force Simulation</H5>
      <ForceSimulationControls />
    </div>
  );
};

export default NetworkGraphControls;

function Switch3D() {
  const { is3d, setConfig } = useConfig();
  return (
    <CollapsibleSwitchWithLabels
      labelLeft="2D"
      labelRight="3D"
      onChange={() => setConfig({ is3d: !is3d })}
      checked={is3d}
    />
  );
}

function SwitchGridMode() {
  const { isGridMode, setConfig } = useConfig();
  return (
    <CollapsibleSwitchWithLabels
      labelLeft="Force"
      labelRight="Grid"
      onChange={() => setConfig({ isGridMode: !isGridMode })}
      checked={isGridMode}
    />
  );
}

function SwitchUserNodes() {
  const { showUserNodes, setConfig } = useConfig();
  return (
    <FormControlLabelCollapsible
      groupTitle="Media"
      control={<Checkbox checked={showUserNodes} />}
      onChange={() => {
        setConfig({ showUserNodes: !showUserNodes });
      }}
      label={<Body1>Show Users</Body1>}
    />
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

export function TitleWithIcon({ title, icon }) {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item>{icon}</Grid>
      <Grid item>
        <Typography gutterBottom>{title}</Typography>
      </Grid>
    </Grid>
  );
}
