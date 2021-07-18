import {
  createMuiTheme,
  ThemeProvider,
  useTheme,
} from "@material-ui/core/styles";
import { NightsStayOutlined, WbSunny } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

import styled from "styled-components/macro";
import { useAtom } from "jotai";
import { isDarkModeAtom } from "./store/store";
import { useMount } from "utils/utils";

export default function ThemeManager({ children }: { children: any }) {
  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);
  console.log("🌟🚨 ~ ThemeManager ~ isDarkMode", isDarkMode);

  const palletType = isDarkMode ? "dark" : "light";
  const mainPrimaryColor = isDarkMode ? `hsl(200,70%,40%)` : `hsl(200,70%,50%)`;
  const mainSecondaryColor = isDarkMode
    ? `hsl(270,50%,45%)`
    : `hsl(270,50%,60%)`;
  // ? `hsl(270,50%,45%)`
  // : `hsl(270,50%,60%)`;
  const textPrimaryColor = isDarkMode ? `hsl(0,0%,100%)` : `hsl(0,0%,0%)`;
  const textSecondaryColor = isDarkMode ? `hsl(0,0%,60%)` : `hsl(0,0%,40%)`;
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
    setIsDarkMode(!isDarkMode);
  };

  // ? not sure why this reset is needed to get it working?
  useMount(() => {
    setIsDarkMode(!isDarkMode);
    setTimeout(() => {
      setIsDarkMode(isDarkMode);
    }, 500);
  });

  return (
    <ThemeManagerStyles isDarkMode={isDarkMode}>
      <ThemeProvider theme={darkTheme}>
        {children}
        <SwitchStyles className="switchWrapper" onClick={handleThemeChange}>
          {isDarkMode ? <WbSunny /> : <NightsStayOutlined />}
        </SwitchStyles>
      </ThemeProvider>
    </ThemeManagerStyles>
  );
}

export const useIsLight = () => {
  const [isDarkMode] = useAtom(isDarkModeAtom);
  return !isDarkMode;
};

const ThemeManagerStyles = styled.div`
  color: ${(props) => (props.isDarkMode ? "white" : "black")};
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
