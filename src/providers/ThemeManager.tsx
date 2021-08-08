import { createTheme, ThemeProvider } from "@material-ui/core/styles";
// import { IconButton } from "@material-ui/core";

import styled from "styled-components/macro";

export default function ThemeManager({ children }: { children: any }) {
  const palletType = "dark";
  const mainPrimaryColor = `#9e1840`;
  const mainSecondaryColor = `#1b90f0`;
  const textPrimaryColor = `hsl(0,0%,100%)`;
  const textSecondaryColor = `hsl(0,0%,60%)`;
  const darkTheme = createTheme({
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
  // const handleThemeChange = () => {
  //   setIsDarkMode(!isDarkMode);
  // };

  // ? not sure why this reset is needed to get it working?
  // useMount(() => {
  //   setIsDarkMode(!isDarkMode);
  //   setTimeout(() => {
  //     setIsDarkMode(isDarkMode);
  //   }, 500);
  // });

  return (
    <ThemeManagerStyles isDarkMode={true}>
      <ThemeProvider theme={darkTheme}>
        {children}
        {/* <SwitchStyles className="switchWrapper" onClick={handleThemeChange}>
          {isDarkMode ? <WbSunny /> : <NightsStayOutlined />}
        </SwitchStyles> */}
      </ThemeProvider>
    </ThemeManagerStyles>
  );
}

export const useIsLight = () => {
  // const [isDarkMode] = useAtom(isDarkModeAtom);
  return false;
  // return !isDarkMode;
};

const ThemeManagerStyles = styled.div`
  color: ${(props) => (props.isDarkMode ? "white" : "black")};
`;
// const SwitchStyles = styled(IconButton)`
//   border: none;
//   background: none;
//   position: fixed !important;
//   z-index: 10;
//   cursor: pointer;
//   opacity: 0.8;
//   bottom: 2px;
//   right: 2px;
//   display: grid;
//   grid-auto-flow: column;
//   align-items: center;
//   width: fit-content;
// `;
