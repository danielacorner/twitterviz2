import React from "react";
import "./App.css";
import tweets from "./tweets.json";
import NetworkGraph from "./components/NetworkGraph";

function App() {
  return (
    <div className="App">
      <NetworkGraph tweets={tweets} />
    </div>
  );
}

export default App;
