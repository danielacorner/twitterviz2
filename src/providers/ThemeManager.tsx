import {
  createMuiTheme,
  ThemeProvider,
  useTheme,
} from "@material-ui/core/styles";
import { NightsStayOutlined, WbSunny } from "@material-ui/icons";
import React, { useState } from "react";
import styled from "styled-components/macro";

export default function ThemeManager({ children }) {
  const [darkState, setDarkState] = useState(true);
  const palletType = darkState ? "dark" : "light";
  const mainPrimaryColor = darkState ? `hsl(200,70%,40%)` : `hsl(200,70%,50%)`;
  const mainSecondaryColor = darkState
    ? `hsl(270,50%,45%)`
    : `hsl(270,50%,60%)`;
  // ? `hsl(270,50%,45%)`
  // : `hsl(270,50%,60%)`;
  const textPrimaryColor = darkState ? `hsl(0,0%,100%)` : `hsl(0,0%,0%)`;
  const textSecondaryColor = darkState ? `hsl(0,0%,60%)` : `hsl(0,0%,40%)`;
  const darkTheme = createMuiTheme({
    palette: {
      type: palletType,
      primary: {
        main: mainPrimaryColor,
      },
      secondary: {
        main: mainSecondaryColor,
      },
      text: {
        primary: textPrimaryColor,
        secondary: textSecondaryColor,
      },
    },
  });
  const handleThemeChange = () => {
    setDarkState(!darkState);
  };

  return (
    <ThemeManagerStyles darkState={darkState}>
      <ThemeProvider theme={darkTheme}>
        <SwitchStyles className="switchWrapper" onClick={handleThemeChange}>
          {darkState ? <WbSunny /> : <NightsStayOutlined />}
        </SwitchStyles>
        {children}
      </ThemeProvider>
    </ThemeManagerStyles>
  );
}

export const useIsLight = () => {
  const theme = useTheme();
  return theme.palette.type === "light";
};

const ThemeManagerStyles = styled.div`
  color: ${(props) => (props.darkState ? "white" : "black")};
  .switchWrapper {
    position: fixed;
    bottom: 4px;
    right: 12px;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
  }
`;
const SwitchStyles = styled.button`
  border: none;
  background: none;
`;
