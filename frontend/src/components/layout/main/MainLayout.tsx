import React from "react";
import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f5f5f5",
        m: "-8px",
        p: 0,
        overflowX: "hidden",
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "linear-gradient(45deg, #2196F3 75%, #21CBF3 90%)",
          color: "white",
          width: "100%",
          px: 0,
          mt: 0,
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            maxWidth: "lg",
            mx: 0,
            px: 2,
          }}
        >
          <Toolbar disableGutters sx={{ minHeight: { xs: 56 } }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: "bold",
                textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              {title}
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          maxWidth: "lg",
          flexGrow: 1,
          py: 3,
          px: 2,
          mx: 0,
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default MainLayout;
