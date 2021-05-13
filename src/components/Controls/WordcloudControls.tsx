import React from "react";
import { Slider, Typography } from "@material-ui/core";
import { useWordcloudConfig } from "../../providers/store/useSelectors";

export default function WordcloudControls() {
  return (
    <div className="wordcloudControls controlsContainer">
      <WordcloudCharsSlider />
      <WordcloudAnglesSlider />
      <WordcloudMinInstancesSlider />
    </div>
  );
}

function valuetextInstances(value: string | number) {
  return `${value} instances`;
}
function WordcloudMinInstancesSlider() {
  const { minInstances, setWordcloudConfig } = useWordcloudConfig();
  const handleChange = (event, newMin) => {
    setWordcloudConfig({ minInstances: newMin });
  };
  return (
    <div className="wordcloudMinInstancesSlider">
      <Typography id="instances-slider" gutterBottom={true}>
        Minimum instances
      </Typography>
      <Slider
        min={1}
        max={5}
        value={minInstances}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="instances-slider"
        getAriaValueText={valuetextInstances}
      />
    </div>
  );
}

function valuetextAngles(value: string | number) {
  return `${value} angles`;
}
function WordcloudAnglesSlider() {
  const { numAngles, setWordcloudConfig } = useWordcloudConfig();
  const handleChange = (event, [newNum]: any) => {
    setWordcloudConfig({ numAngles: newNum });
  };
  return (
    <div className="wordcloudAnglesSlider">
      <Typography id="angles-slider" gutterBottom={true}>
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

function valuetextLetters(value: string | number) {
  return `${value} letters`;
}
function WordcloudCharsSlider() {
  const { minChars, maxChars, setWordcloudConfig } = useWordcloudConfig();
  const handleChange = (event, [newMin, newMax]: any) => {
    setWordcloudConfig({ minChars: newMin, maxChars: newMax });
  };
  return (
    <div className="wordcloudCharsSlider">
      <Typography id="chars-slider" gutterBottom={true}>
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
