import React, { useState } from "react";
import "./App.css";
import NetworkGraph from "./components/NetworkGraph";
import { COLOR_BY } from "./utils/constants";
import Controls from "./components/Controls";
import { transformTweetsIntoGraphData } from "./utils/transformData";

function App() {
  const [is3d, setIs3d] = useState(false);
  const [colorBy, setColorBy] = useState(
    COLOR_BY.mediaType as keyof typeof COLOR_BY | null
  );
  const [tweetsFromServer, setTweetsFromServer] = useState(null);

  return (
    <div className="App">
      <Controls
        setTweetsFromServer={setTweetsFromServer}
        setIs3d={setIs3d}
        colorBy={colorBy}
        setColorBy={setColorBy}
      />
      <NetworkGraph
        is3d={is3d}
        colorBy={colorBy}
        graphDataFromServer={
          tweetsFromServer && transformTweetsIntoGraphData(tweetsFromServer)
        }
      />
    </div>
  );
}

export default App;
