import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import Search from "./Search";

const theme = createTheme({
  typography: {
    fontFamily: "Sono",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontSize: "1rem",
          color: "black",
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Search />
    </ThemeProvider>
  </React.StrictMode>
);
