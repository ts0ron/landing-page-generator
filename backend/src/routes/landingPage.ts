import express from "express";
import { generateLandingPage } from "../controllers/landingPage";

const router = express.Router();

router.post("/gen", generateLandingPage);

export default router;
