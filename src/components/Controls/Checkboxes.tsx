import {
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { FILTER_LEVELS } from "../../utils/constants";
import { useConfig } from "../../providers/store/useConfig";
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

export function MediaTypeCheckboxes() {
  const { allowedMediaTypes, setConfig } = useConfig();
  const { video, photo, text, animated_gif } = allowedMediaTypes;

  return (
    <MediaTypeCheckboxesStyles>
      <FormControlLabel
        control={<Checkbox checked={text} name="checkedA" />}
        onChange={() =>
          setConfig({
            allowedMediaTypes: {
              ...allowedMediaTypes,
              text: !text,
            },
          })
        }
        label={<Body1>Text</Body1>}
      />
      <FormControlLabel
        control={<Checkbox checked={photo} name="checkedA" />}
        onChange={() =>
          setConfig({
            allowedMediaTypes: {
              ...allowedMediaTypes,
              photo: !photo,
            },
          })
        }
        label={<Body1>Image</Body1>}
      />
      <FormControlLabel
        control={<Checkbox checked={video} name="checkedA" />}
        onChange={() =>
          setConfig({
            allowedMediaTypes: {
              ...allowedMediaTypes,
              video: !allowedMediaTypes.video,
            },
          })
        }
        label={<Body1>Video</Body1>}
      />
      <FormControlLabel
        control={<Checkbox checked={animated_gif} name="checkedA" />}
        onChange={() =>
          setConfig({
            allowedMediaTypes: {
              ...allowedMediaTypes,
              animated_gif: !allowedMediaTypes.animated_gif,
            },
          })
        }
        label={<Body1>GIF</Body1>}
      />
    </MediaTypeCheckboxesStyles>
  );
}

const MediaTypeCheckboxesStyles = styled.div`
  display: grid;
`;
