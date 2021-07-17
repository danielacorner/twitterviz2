import {
  createMuiTheme,
  ThemeProvider,
  useTheme,
} from "@material-ui/core/styles";
import { NightsStayOutlined, WbSunny } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

import styled from "styled-components/macro";
import { useLocalStorageState } from "utils/useLocalStorageState";
import useStore from "./store/store";

export default function ThemeManager({ children }: { children: any }) {
  const isDarkTheme = useStore((s) => s.config.isDarkTheme);
  const [darkState, setDarkState] = useLocalStorageState(
    "theme:isDark",
    isDarkTheme
  );

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
        {children}
        <SwitchStyles className="switchWrapper" onClick={handleThemeChange}>
          {darkState ? <WbSunny /> : <NightsStayOutlined />}
        </SwitchStyles>
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
`;
const SwitchStyles = styled(IconButton)`
  border: none;
  background: none;
  position: fixed !important;
  z-index: 10;
  cursor: pointer;
  opacity: 0.8;
  bottom: 2px;
  right: 2px;
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  width: fit-content;
`;
