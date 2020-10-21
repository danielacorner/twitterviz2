import React, { useEffect, useRef, useState } from "react";
import { FormControl, Grid, Input, Slider, Switch } from "@material-ui/core";
import { useConfig } from "../../providers/store";
import {
  GroupWork,
  GroupWorkOutlined,
  SlowMotionVideo,
  Speed,
  Timer,
} from "@material-ui/icons";
import { TitleWithIcon } from "./NetworkGraphControls";

export function ForceSimulationControls() {
  const {
    d3VelocityDecay,
    d3AlphaDecay,
    cooldownTime,
    gravity,
    charge,
  } = useConfig();

  return (
    <FormControl>
      <TitleWithIcon title={"Charge"} icon={<GroupWork />} />
      <SliderWithInputAndSwitch
        {...{
          value: charge,
          configKeyString: "charge",
          min: -1000,
          max: 0,
          disabledValue: 0,
          step: 10,
        }}
      />

      <TitleWithIcon title={"Gravity"} icon={<GroupWorkOutlined />} />
      <SliderWithInputAndSwitch
        {...{
          value: gravity,
          configKeyString: "gravity",
          min: 0,
          max: 1000,
          disabledValue: 0,
          step: 10,
        }}
      />

      <TitleWithIcon title={"Velocity decay"} icon={<Speed />} />
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

      <TitleWithIcon title={"Alpha decay"} icon={<SlowMotionVideo />} />
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

      <TitleWithIcon title={"Cooldown time"} icon={<Timer />} />
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

export function SliderWithInputAndSwitch({
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
      if (value !== disabledValue) {
        prevValue.current = value;
      }
      setConfig({ [configKeyString]: disabledValue as number });
    } else {
      // when we unpause, restore the previous value
      // * unless we're right-clicking
      const didPauseSimulationInGraphRightClickMenu = value === -999;
      if (!didPauseSimulationInGraphRightClickMenu) {
        setConfig({ [configKeyString]: prevValue.current as number });
      }
    }
  }, [disabled, setConfig, configKeyString, disabledValue, value]);

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs style={{ padding: 0 }}>
        <Switch onChange={() => setDisabled(!disabled)} checked={!disabled} />
      </Grid>
      <Grid item xs>
        <Slider
          {...{ min, max, step, value }}
          disabled={disabled}
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
