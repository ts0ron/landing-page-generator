import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import GenPage from "./pages/GenPage";
import LandPage from "./pages/LandPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/gen" element={<GenPage />} />
          <Route path="/land" element={<LandPage />} />
          <Route path="/" element={<Navigate to="/gen" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
