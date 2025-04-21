import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    gradients: {
      primary: string;
      hover: string;
    };
  }
  interface PaletteOptions {
    gradients: {
      primary: string;
      hover: string;
    };
  }
}

const theme = createTheme({
  palette: {
    background: {
      default: "#f5f5f5",
      paper: "#f5f5f5",
    },
    primary: {
      main: "#2196F3",
      light: "#21CBF3",
      dark: "#1976D2",
    },
    gradients: {
      primary: "linear-gradient(45deg, #2196F3 75%, #21CBF3 90%)",
      hover: "linear-gradient(45deg, #1976D2 75%, #2196F3 90%)",
    },
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: "#f5f5f5",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: "linear-gradient(45deg, #2196F3 75%, #21CBF3 90%)",
          boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
          "&:hover": {
            background: "linear-gradient(45deg, #1976D2 75%, #2196F3 90%)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(45deg, #2196F3 75%, #21CBF3 90%)",
        },
      },
    },
  },
});

export default theme;
