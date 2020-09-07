import React, { useEffect } from "react";
import {
  MenuItem,
  Switch,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { COLOR_BY } from "../../utils/constants";
import { useConfig, AppConfig } from "../../providers/store";
import { Div } from "../DivStyles";

const NetworkGraphControls = () => {
  return (
    <div className="networkGraphControls controlsContainer">
      <h3>Network Graph Controls</h3>
      <SelectColorBy />
      <MediaTypeCheckboxes />
      <Switch3D />
    </div>
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

function MediaTypeCheckboxes() {
  const {
    isVideoChecked,
    isImageChecked,
    colorBy,
    setConfig,
    mediaType,
  } = useConfig();

  useEffect(() => {
    // if searching for media, reduce num tweets
    if (mediaType) {
      setConfig({ numTweets: 25 });
    }
  }, [mediaType, setConfig]);

  return colorBy === COLOR_BY.mediaType ? (
    <div className="checkboxes">
      <FormControlLabel
        control={
          <Checkbox
            checked={isVideoChecked}
            onChange={() => setConfig({ isVideoChecked: !isVideoChecked })}
            name="checkedA"
          />
        }
        label="Video"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={isImageChecked}
            onChange={() => setConfig({ isImageChecked: !isImageChecked })}
            name="checkedA"
          />
        }
        label="Image"
      />
    </div>
  ) : null;
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
