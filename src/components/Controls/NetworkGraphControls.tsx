import React, { useEffect, useRef, useState } from "react";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Checkbox,
  Grid,
  Input,
  Switch,
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
  } = useConfig();

  return (
    <FormControl>

<TitleWithIcon title={"Velocity decay"} icon={<Speed />}/>
      <SliderWithInputAndSwitch
        {...{
          value: d3VelocityDecay,
          configKeyString: "d3VelocityDecay",
          min: 0,
          max: 1,
          disabledValue: 1,
          step: 0.05,
        }}
      />

<TitleWithIcon title={"Alpha decay"} icon={<SlowMotionVideo />}/>
      <SliderWithInputAndSwitch
        {...{
          value: d3AlphaDecay,
          configKeyString: "d3AlphaDecay",
          min: 0,
          max: 0.1,
          disabledValue: 1,
          step: 0.01,
        }}
      />

<TitleWithIcon title={"Cooldown time"} icon={<Timer />}/>
      <SliderWithInputAndSwitch
        {...{
          value: cooldownTime,
          configKeyString: "cooldownTime",
          min: 0,
          max: 15 * 1000,
          disabledValue: 0,
          step: 1000,
        }}
      />
    </FormControl>
  );
}

function TitleWithIcon({title,icon}){
  return       <Grid container spacing={2} alignItems="center">
  <Grid item>
    {icon}
  </Grid>
  <Grid item>
<Typography gutterBottom>{title}}</Typography>
  </Grid>
</Grid>
}

function SliderWithInputAndSwitch({
  value,
  disabledValue,
  configKeyString,
  min,
  max,
  step,
}) {
  const { setConfig } = useConfig();
  const [disabled, setDisabled] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    // when we pause, remember the previous value & set to the disabled value
    if (disabled) {
      prevValue.current = value;
      setConfig({ [configKeyString]: disabledValue as number });
    } else {
      // when we unpause, restore the previous value
      setConfig({ [configKeyString]: prevValue.current as number });
    }
  }, [disabled, setConfig, configKeyString]);

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs>
        <Switch
          onChange={() => setDisabled(!disabled)}
          checked={!disabled}
        />
      </Grid>
      <Grid item xs>
        <Slider
          {...{ min, max, step, value }}
          disabled={disabled}
          getAriaValueText={valuetext}
          onChange={(event, newValue, ...rest) => {
            setConfig({ [configKeyString]: newValue as number });
          }}
          valueLabelDisplay="auto"
          aria-labelledby={`input-slider-${configKeyString}`}
        />
      </Grid>
      <Grid item xs>
        <Input
          value={disabled ? disabledValue : value}
          disabled={disabled}
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
