import React from "react";
import { Switch, Slider, Typography } from "@material-ui/core";
import { useConfig } from "../../providers/store";
import { Div } from "./ControlsStyles";
import { useWordcloudConfig } from "../../providers/store";

export default function WordcloudControls() {
  const { isWordcloud } = useConfig();

  return (
    <div className="wordcloudControls">
      <SwitchWordcloud />
      {isWordcloud && (
        <>
          <WordcloudCharsSlider />
          <WordcloudCharsSlider />
          <WordcloudAnglesSlider />
          <WordcloudMinInstancesSlider />
        </>
      )}
    </div>
  );
}

function SwitchWordcloud() {
  const { isWordcloud, setConfig } = useConfig();
  return (
    <Div css={``}>
      <span>
        Word Cloud
        <Switch
          onChange={() => setConfig({ isWordcloud: !isWordcloud })}
          checked={isWordcloud}
        />
      </span>
    </Div>
  );
}

function valuetextInstances(value) {
  return `${value} instances`;
}
function WordcloudMinInstancesSlider() {
  const { minInstances, setWordcloudConfig } = useWordcloudConfig();
  const handleChange = (event, [newMin]) => {
    setWordcloudConfig({ minInstances: newMin });
  };
  return (
    <div className="wordcloudMinInstancesSlider">
      <Typography id="instances-slider" gutterBottom>
        Minimum instances
      </Typography>
      <Slider
        min={1}
        max={5}
        value={[minInstances]}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="instances-slider"
        getAriaValueText={valuetextInstances}
      />
    </div>
  );
}

function valuetextAngles(value) {
  return `${value} angles`;
}
function WordcloudAnglesSlider() {
  const { numAngles, setWordcloudConfig } = useWordcloudConfig();
  const handleChange = (event, [newNum]) => {
    setWordcloudConfig({ numAngles: newNum });
  };
  return (
    <div className="wordcloudAnglesSlider">
      <Typography id="angles-slider" gutterBottom>
        Number of angles
      </Typography>
      <Slider
        min={1}
        max={5}
        value={[numAngles]}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="angles-slider"
        getAriaValueText={valuetextAngles}
      />
    </div>
  );
}

function valuetextLetters(value) {
  return `${value} letters`;
}
function WordcloudCharsSlider() {
  const { minChars, maxChars, setWordcloudConfig } = useWordcloudConfig();
  const handleChange = (event, [newMin, newMax]) => {
    setWordcloudConfig({ minChars: newMin, maxChars: newMax });
  };
  return (
    <div className="wordcloudCharsSlider">
      <Typography id="chars-slider" gutterBottom>
        Number of letters
      </Typography>
      <Slider
        min={1}
        max={25}
        value={[minChars, maxChars]}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="chars-slider"
        getAriaValueText={valuetextLetters}
      />
    </div>
  );
}
