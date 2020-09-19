import React from "react";
import {
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { FILTER_LEVELS } from "../../utils/constants";
import { useConfig, useIsLeftDrawerOpen } from "../../providers/store";
import { Body1 } from "../common/styledComponents";
import styled from "styled-components/macro";

const RadioBtnsStyles = styled.div``;

export function RecentPopularMixedRadioBtns() {
  const { resultType, setConfig } = useConfig();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ resultType: event.target.value as any });
  };
  const { isDrawerOpen } = useIsLeftDrawerOpen();

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
          label={isDrawerOpen ? <Body1>Mixed</Body1> : null}
        />
        <FormControlLabel
          value="recent"
          control={<Radio />}
          label={isDrawerOpen ? <Body1>Recent</Body1> : null}
        />
        <FormControlLabel
          value="popular"
          control={<Radio />}
          label={isDrawerOpen ? <Body1>Popular</Body1> : null}
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
  const { isDrawerOpen } = useIsLeftDrawerOpen();

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
          label={isDrawerOpen ? <Body1>Medium</Body1> : null}
        />
        <FormControlLabel
          value={FILTER_LEVELS.low}
          control={<Radio />}
          label={isDrawerOpen ? <Body1>Low</Body1> : null}
        />
        <FormControlLabel
          value={FILTER_LEVELS.none}
          control={<Radio />}
          label={isDrawerOpen ? <Body1>None</Body1> : null}
        />
      </RadioGroup>
    </RadioBtnsStyles>
  );
}
const MediaTypeCheckboxesStyles = styled.div``;

export function MediaTypeCheckboxes() {
  const {
    isVideoChecked,
    isImageChecked,
    setConfig,
    isAllChecked,
  } = useConfig();

  const { isDrawerOpen } = useIsLeftDrawerOpen();

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
        label={isDrawerOpen ? <Body1>All</Body1> : null}
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
        label={isDrawerOpen ? <Body1>Video</Body1> : null}
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
        label={isDrawerOpen ? <Body1>Image</Body1> : null}
      />
    </MediaTypeCheckboxesStyles>
  );
}
