import React from "react";
import LandLayout from "../components/layout/land/LandLayout";
import { Typography } from "@mui/material";

const LandPage: React.FC = () => {
  return (
    <LandLayout>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Landing Pages
      </Typography>
    </LandLayout>
  );
};

export default LandPage;
