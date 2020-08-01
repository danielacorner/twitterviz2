import React, { useState } from "react";
import {
  MenuItem,
  Switch,
  Select,
  Button,
  TextField,
  CircularProgress,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import styled from "styled-components/macro";
import { COLOR_BY } from "../utils/constants";

const Div = styled.div`
  display: grid;
  place-items: center;
`;

const Switch3D = ({ onChange }) => (
  <Div css={``}>
    <span>
      2D
      <Switch onChange={onChange} />
      3D
    </span>
  </Div>
);

const ControlsStyles = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;
  .styleTweets {
    display: grid;
    grid-gap: 8px;
  }
  .fetchTweets {
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 1fr 100px;
  }
  padding: 8px;
`;

const Controls = ({ colorBy, setIs3d, setTweetsFromServer, setColorBy }) => {
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
      <div className="styleTweets">
        <FormControl>
          <InputLabel id="color-by">Color by...</InputLabel>
          <Select
            labelId="color-by"
            onChange={(event) => {
              setColorBy(event.target.value);
            }}
            value={colorBy}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={COLOR_BY.mediaType}>Media type</MenuItem>
            <MenuItem value={COLOR_BY.textLength}>Text length</MenuItem>
            <MenuItem value={COLOR_BY.sentiment}>Sentiment</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Switch3D onChange={() => setIs3d((prev) => !prev)} />
      <div className="fetchTweets">
        <Button
          className="btnFetch"
          disabled={loading}
          onClick={fetchNewTweets}
          variant="outlined"
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
