import React from "react";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Checkbox,
  Grid,
  Input,
} from "@material-ui/core";
import { COLOR_BY } from "../../utils/constants";
import { useConfig, AppConfig } from "../../providers/store";
import {
  H5,
  CollapsibleSwitchWithLabels,
  Body1,
} from "../common/styledComponents";
import { FormControlLabelCollapsible } from "./Checkboxes";
import { Slider, Typography } from "@material-ui/core";
import { SlowMotionVideo, Speed, Timer } from "@material-ui/icons";
/** react-force-graph docs
 * https://www.npmjs.com/package/react-force-graph
 */
const NetworkGraphControls = () => {
  // TODO
  const createLinks = () => {
    console.log("TODO");
  };
  return (
    <div className="networkGraphControls controlsContainer">
      <H5 style={{ pointerEvents: "none" }}>Network Graph Controls</H5>
      <Switch3D />
      <SwitchGridMode />
      <SwitchUserNodes />
      <SelectColorBy />
      <SimulationControls />
      <Button
        variant="contained"
        color="primary"
        disabled={true}
        onClick={createLinks}
      >
        Link Nodes
      </Button>
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

function valuetext(value) {
  return `${value}`;
}
function SimulationControls() {
  const {
    setConfig,
    d3VelocityDecay,
    d3AlphaDecay,
    cooldownTime,
    isPaused,
  } = useConfig();
  console.log("🌟🚨: SimulationControls -> d3VelocityDecay", d3VelocityDecay);
  return (
    <FormControl>
      <Typography gutterBottom>Velocity decay</Typography>
      <SliderWithInput
        {...{
          value: d3VelocityDecay,
          configKeyString: "d3VelocityDecay",
          icon: <Speed />,
          min: 0,
          max: 1,
          step: 0.05,
        }}
      />

      <Typography gutterBottom>Alpha decay</Typography>
      <SliderWithInput
        {...{
          value: d3AlphaDecay,
          configKeyString: "d3AlphaDecay",
          icon: <SlowMotionVideo />,
          min: 0,
          max: 0.2,
          step: 0.01,
        }}
      />

      <Typography gutterBottom>Cooldown time</Typography>
      <SliderWithInput
        {...{
          value: cooldownTime,
          configKeyString: "cooldownTime",
          icon: <Timer />,
          min: 0,
          max: 30 * 1000,
          step: 1000,
        }}
      />
      <CollapsibleSwitchWithLabels
        onChange={() => {
          setConfig({ isPaused: !isPaused });
        }}
        labelLeft={"Play"}
        labelRight={"Pause"}
        checked={isPaused}
      />
    </FormControl>
  );
}

function SliderWithInput({ value, configKeyString, min, max, step }) {
  const { setConfig } = useConfig();

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <SlowMotionVideo />
      </Grid>
      <Grid item xs>
        <Slider
          {...{ min, max, step, value }}
          getAriaValueText={valuetext}
          onChange={(event, newValue, ...rest) => {
            setConfig({ [configKeyString]: newValue as number });
          }}
          valueLabelDisplay="auto"
          aria-labelledby={`input-slider-${configKeyString}`}
        />
      </Grid>
      <Grid item>
        <Input
          value={value}
          margin="dense"
          onChange={(event) => {
            const newValue = event.target.value;
            if (typeof newValue === "number") {
              console.log("🌟🚨: SimulationControls -> newValue", newValue);
              setConfig({ [configKeyString]: newValue as number });
            }
          }}
          inputProps={{
            step,
            min,
            max,
            type: "number",
            "aria-labelledby": `input-slider-${configKeyString}`,
          }}
        />
      </Grid>
    </Grid>
  );
}
