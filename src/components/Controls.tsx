import React, { useState } from "react";
import {
  MenuItem,
  Switch,
  Select,
  Button,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import styled from "styled-components/macro";
import { COLOR_BY } from "../utils/constants";

const Switch3D = ({ onChange }) => (
  <span>
    2D
    <Switch onChange={onChange} />
    3D
  </span>
);

const ControlsStyles = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;
  .fetchTweets {
    display: grid;
    grid-template-columns: 1fr 100px;
  }
`;

const Controls = ({
  handleSelectColor,
  colorBy,
  setIs3d,
  setTweetsFromServer,
}) => {
  const [numTweets, setNumTweets] = useState(100);
  const [loading, setLoading] = useState(false);
  const fetchNewTweets = async () => {
    setLoading(true);
    const resp = await fetch(`/api/stream?num=${numTweets}`);
    const data = await resp.json();
    setLoading(false);
    setTweetsFromServer(data);
  };
  return (
    <ControlsStyles>
      <Select onChange={handleSelectColor} value={colorBy}>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={COLOR_BY.mediaType}>Media type</MenuItem>
        <MenuItem value={COLOR_BY.textLength}>Text length</MenuItem>
      </Select>
      <Switch3D onChange={() => setIs3d((prev) => !prev)} />
      <div className="fetchTweets">
        <Button
          className="btnFetch"
          disabled={loading}
          onClick={fetchNewTweets}
        >
          {loading ? <CircularProgress /> : "Fetch New Tweets"}
        </Button>
        <TextField
          label="How many?"
          value={numTweets}
          onChange={(e) => setNumTweets(+e.target.value)}
          type="number"
          inputProps={{ step: 50 }}
        />
      </div>
    </ControlsStyles>
  );
};

export default Controls;
