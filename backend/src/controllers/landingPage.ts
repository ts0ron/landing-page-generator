import { Request, Response } from "express";
import { GooglePlacesService } from "../services/googlePlaces";
import { OpenAIService } from "../services/openai";
import PlaceDetails, {
  IPlaceDetails,
  IPlaceDetailsDocument,
} from "../models/PlaceDetails";

const googlePlacesService = new GooglePlacesService();
const openAIService = new OpenAIService();

export const generateLandingPage = async (req: Request, res: Response) => {
  console.log("Received request to /gen with body:", req.body);

  try {
    const { placeId } = req.body;

    if (!placeId) {
      console.log("Error: Place ID is missing");
      return res.status(400).json({ error: "Place ID is required" });
    }

    console.log("Looking for existing place details for placeId:", placeId);
    // Check if we already have the place details
    let placeDetails: IPlaceDetailsDocument | null = await PlaceDetails.findOne(
      { _id: placeId }
    );

    if (!placeDetails) {
      console.log(
        "No existing place details found, fetching from Google Places API"
      );
      // Fetch place details from Google Places API
      const placeData: IPlaceDetails =
        await googlePlacesService.getPlaceDetails(placeId);
      console.log("Successfully fetched place details from Google Places API");

      // Save to MongoDB
      console.log(`Saving place details to MongoDB`, placeData);
      placeDetails = await PlaceDetails.findOneAndUpdate(
        { _id: placeId },
        placeData,
        { upsert: true, new: true }
      );
      console.log("Successfully saved place details to MongoDB");
    } else {
      console.log("Found existing place details in database");
    }

    console.log("Generating landing page HTML with OpenAI");
    // Generate landing page HTML
    if (!placeDetails) {
      throw new Error("Failed to get or create place details");
    }
    const htmlContent = await openAIService.generateLandingPage(placeDetails);
    console.log("Successfully generated landing page HTML");

    res.json({
      success: true,
      placeDetails,
      htmlContent,
    });
  } catch (error) {
    console.error("Error in /gen route:", error);
    res.status(500).json({
      error: "Failed to generate landing page",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
