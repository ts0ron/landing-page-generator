import React from "react";
import GenLayout from "../components/layout/gen/GenLayout";
import GeneratorForm from "../components/layout/gen/GeneratorForm";
import { Typography, Box } from "@mui/material";

const GenPage: React.FC = () => {
  return (
    <GenLayout>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}
        >
          Create Your Landing Page
        </Typography>
        <GeneratorForm />
      </Box>
    </GenLayout>
  );
};

export default GenPage;
