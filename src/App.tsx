import React, { useState, useEffect } from "react";
import "./App.css";
import NetworkGraph from "./components/NetworkGraph/NetworkGraph";
import { COLOR_BY, FILTER_BY, CONTROLS_WIDTH } from "./utils/constants";
import Controls from "./components/Controls";
import styled from "styled-components/macro";
import BottomDrawer from "./components/BottomDrawer/BottomDrawer";
import useStore from "./store";

const AppStyles = styled.div`
  display: grid;
  grid-template-columns: ${CONTROLS_WIDTH}px 1fr;
`;

function App() {
  const setSelectedNode = useStore((state) => state.setSelectedNode);
  const [is3d, setIs3d] = useState(true);
  const [colorBy, setColorBy] = useState(
    COLOR_BY.profilePhoto as keyof typeof COLOR_BY | null
  );
  const [isVideoChecked, setIsVideoChecked] = useState(false);
  const [isImageChecked, setIsImageChecked] = useState(false);
  const [countryCode, setCountryCode] = useState("All");
  const [lang, setLang] = useState("All");
  const allowedMediaTypes = [
    ...(isVideoChecked ? ["video"] : []),
    ...(isImageChecked ? ["photo"] : []),
  ];
  useEffect(() => {
    function handleKeydown(event) {
      if (event.key === "Backspace") {
        setSelectedNode(null);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [setSelectedNode]);

  const mediaType =
    allowedMediaTypes.length === 2
      ? FILTER_BY.imageAndVideo
      : allowedMediaTypes.includes("photo")
      ? FILTER_BY.imageOnly
      : allowedMediaTypes.includes("video")
      ? FILTER_BY.videoOnly
      : null;

  return (
    <AppStyles className="App">
      <Controls
        {...{
          setIs3d,
          colorBy,
          setColorBy,
          setIsVideoChecked,
          setIsImageChecked,
          isVideoChecked,
          isImageChecked,
          mediaType,
          countryCode,
          setCountryCode,
          is3d,
          lang,
          setLang,
        }}
      />
      <NetworkGraph
        {...{
          is3d,
          colorBy,
          allowedMediaTypes,
        }}
      />
      <BottomDrawer />
    </AppStyles>
  );
}

export default App;
