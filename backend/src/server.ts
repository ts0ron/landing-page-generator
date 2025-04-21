import "dotenv/config";
import express from "express";
import cors from "cors";
import { mongodbService } from "./services/mongodb";
import landingPageRoutes from "./routes/landingPage";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", landingPageRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    mongodb: mongodbService.getConnection() ? "connected" : "disconnected",
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  await mongodbService.disconnect();
  process.exit(0);
});
