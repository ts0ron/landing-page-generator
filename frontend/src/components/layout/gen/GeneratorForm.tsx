import React, { useState } from "react";
import { Box, Button, Paper, Snackbar, Alert } from "@mui/material";
import { createLandingPage } from "../../../services/api";
import PlacesAutocomplete from "../../places/autocomplete1/PlacesAutocomplete";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const GeneratorForm: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const [placeId, setPlaceId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleLocationChange = (newLocation: string, newPlaceId: string) => {
    setLocation(newLocation);
    setPlaceId(newPlaceId);
  };

  const handleSubmit = async () => {
    if (!location || !placeId) return;

    console.log("Submit clicked with location:", { location, placeId });

    setLoading(true);
    try {
      await createLandingPage({
        placeId,
        location,
      });
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error creating landing page:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxWidth: "600px",
        mx: "auto",
        width: "100%",
      }}
    >
      <Paper sx={{ p: 3 }}>
        <PlacesAutocomplete value={location} onChange={handleLocationChange} />
      </Paper>

      <Paper
        sx={{
          height: "400px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <iframe
          title="Google Maps"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
            location || "Tel Aviv"
          )}`}
        />
      </Paper>

      <Button
        variant="contained"
        size="large"
        onClick={handleSubmit}
        disabled={loading || !location || !placeId}
        sx={{
          mt: 2,
          py: 1.5,
        }}
      >
        {loading ? "Creating..." : "Generate Landing Page"}
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Congratulations! Landing page creation is in progress.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GeneratorForm;
