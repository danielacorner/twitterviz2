import React, { useState } from "react";
import "./App.css";
import tweets from "./tweets.json";
import NetworkGraph from "./components/NetworkGraph";
import { Switch } from "@material-ui/core";

const Switch3D = ({ onChange }) => (
  <span>
    2D
    <Switch onChange={onChange} />
    3D
  </span>
);

function App() {
  const [is3d, setIs3d] = useState(false);

  return (
    <div className="App">
      <Switch3D onChange={() => setIs3d((prev) => !prev)} />
      <NetworkGraph tweets={tweets} is3d={is3d} />
    </div>
  );
}

export default App;
