import React, { useState } from "react";
import "./App.css";
import NetworkGraph from "./components/NetworkGraph";
import { COLOR_BY } from "./utils/constants";
import Controls from "./components/Controls";

function App() {
  const [is3d, setIs3d] = useState(false);
  const [colorBy, setColorBy] = useState(
    COLOR_BY.mediaType as keyof typeof COLOR_BY | null
  );

  const handleSelectColor = (event) => {
    setColorBy(event.target.value);
  };

  return (
    <div className="App">
      <Controls
        setIs3d={setIs3d}
        colorBy={colorBy}
        handleSelectColor={handleSelectColor}
      />
      <NetworkGraph is3d={is3d} colorBy={colorBy} />
    </div>
  );
}

export default App;
