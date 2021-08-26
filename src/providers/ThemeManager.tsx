import { createTheme, ThemeProvider } from "@material-ui/core/styles";
// import { IconButton } from "@material-ui/core";

import { colorPrimary, colorSecondary } from "utils/colors";

export default function ThemeManager({ children }: { children: any }) {
  const palletType = "dark";
  const textPrimaryColor = `hsl(0,0%,100%)`;
  const textSecondaryColor = `hsl(0,0%,60%)`;
  const darkTheme = createTheme({
    palette: {
      type: palletType,
      primary: {
        main: colorPrimary,
      },
      secondary: {
        main: colorSecondary,
      },
      text: {
        primary: textPrimaryColor,
        secondary: textSecondaryColor,
      },
    },
  });

  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
}

export const useIsLight = () => {
  // const [isDarkMode] = useAtom(isDarkModeAtom);
  return false;
  // return !isDarkMode;
};
