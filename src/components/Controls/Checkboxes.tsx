import React from "react";
import {
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { FILTER_LEVELS } from "../../utils/constants";
import { useConfig } from "../../providers/store";
import { Body1 } from "../common/styledComponents";
import styled from "styled-components/macro";

const RadioBtnsStyles = styled.div``;

export function RecentPopularMixedRadioBtns() {
  const { resultType, setConfig } = useConfig();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ resultType: event.target.value as any });
  };
  return (
    <RadioBtnsStyles>
      <RadioGroup
        aria-label="result type"
        name="resultType"
        value={resultType}
        onChange={handleChange}
        row={true}
      >
        <FormControlLabel
          value="mixed"
          control={<Radio />}
          label={<Body1>Mixed</Body1>}
        />
        <FormControlLabel
          value="recent"
          control={<Radio />}
          label={<Body1>Recent</Body1>}
        />
        <FormControlLabel
          value="popular"
          control={<Radio />}
          label={<Body1>Popular</Body1>}
        />
      </RadioGroup>
    </RadioBtnsStyles>
  );
}

export function FilterLevelCheckboxes() {
  const { filterLevel, setConfig } = useConfig();
  const handleChange = (event) => {
    setConfig({
      filterLevel: event.target.value as keyof typeof FILTER_LEVELS,
    });
  };
  return (
    <RadioBtnsStyles>
      <RadioGroup
        aria-label="filter level"
        name="filterLevel"
        value={filterLevel}
        onChange={handleChange}
        row={true}
      >
        <FormControlLabel
          value={FILTER_LEVELS.medium}
          control={<Radio />}
          label={<Body1>Medium</Body1>}
        />
        <FormControlLabel
          value={FILTER_LEVELS.low}
          control={<Radio />}
          label={<Body1>Low</Body1>}
        />
        <FormControlLabel
          value={FILTER_LEVELS.none}
          control={<Radio />}
          label={<Body1>None</Body1>}
        />
      </RadioGroup>
    </RadioBtnsStyles>
  );
}
const MediaTypeCheckboxesStyles = styled.div`
  display: grid;
  max-width: 200px;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
`;

export function MediaTypeCheckboxes() {
  const {
    isVideoChecked,
    isImageChecked,
    setConfig,
    isAllChecked,
  } = useConfig();

  return (
    <MediaTypeCheckboxesStyles className="checkboxes">
      <FormControlLabel
        control={
          <Checkbox
            checked={isAllChecked}
            onChange={() => setConfig({ isAllChecked: !isAllChecked })}
            name="checkedA"
          />
        }
        label={<Body1>All</Body1>}
      />
      <FormControlLabel
        control={
          <Checkbox
            disabled={isAllChecked}
            checked={isVideoChecked || isAllChecked}
            onChange={() => setConfig({ isVideoChecked: !isVideoChecked })}
            name="checkedA"
          />
        }
        label={<Body1>Video</Body1>}
      />
      <FormControlLabel
        control={
          <Checkbox
            disabled={isAllChecked}
            checked={isImageChecked || isAllChecked}
            onChange={() => setConfig({ isImageChecked: !isImageChecked })}
            name="checkedA"
          />
        }
        label={<Body1>Image</Body1>}
      />
    </MediaTypeCheckboxesStyles>
  );
}
