import OpenAI from "openai";
import { IPlaceDetails } from "../models/PlaceDetails";

export class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateLandingPage(placeDetails: IPlaceDetails): Promise<string> {
    try {
      const prompt = this.createPrompt(placeDetails);

      const completion = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [
          {
            role: "system",
            content:
              "You are a professional web designer and developer. Create a beautiful, modern, and responsive HTML landing page. Include all necessary CSS inline. The page should be mobile-first and follow best practices for accessibility and SEO.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      return completion.choices[0].message.content || "";
    } catch (error) {
      console.error("Error generating landing page:", error);
      throw error;
    }
  }

  private createPrompt(placeDetails: IPlaceDetails): string {
    return `
      Create a beautiful landing page for the following business:

      Name: ${placeDetails.name}
      Address: ${placeDetails.address}
      ${placeDetails.phoneNumber ? `Phone: ${placeDetails.phoneNumber}` : ""}
      ${placeDetails.website ? `Website: ${placeDetails.website}` : ""}
      ${
        placeDetails.rating
          ? `Rating: ${placeDetails.rating}/5 (${placeDetails.userRatingsTotal} reviews)`
          : ""
      }
      Type: ${placeDetails.types.join(", ")}

      The page should include:
      1. A hero section with the business name and main photo
      2. A section about the business
      3. Contact information
      4. A gallery of photos if available
      5. A map showing the location
      6. Social proof (ratings and reviews if available)

      Use modern design principles and ensure the page is fully responsive.
      Include all necessary CSS inline.
      Use semantic HTML5 elements.
      Make sure the page is accessible and SEO-friendly.
    `;
  }
}
