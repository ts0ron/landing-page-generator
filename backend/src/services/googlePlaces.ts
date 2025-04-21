import { Client } from "@googlemaps/google-maps-services-js";
import { IPlaceDetails } from "../models/PlaceDetails";

export class GooglePlacesService {
  private client: Client;
  private apiKey: string;

  constructor() {
    this.client = new Client({});
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || "";
    console.log(
      "GooglePlacesService initialized with API key:",
      this.apiKey ? "Present" : "Missing"
    );
  }

  async getPlaceDetails(placeId: string): Promise<IPlaceDetails> {
    try {
      console.log("Fetching place details for placeId:", placeId);

      // Get place details with all possible fields
      const placeDetailsResponse = await this.client.placeDetails({
        params: {
          place_id: placeId,
          key: this.apiKey,
          fields: [
            "address_components",
            "adr_address",
            "business_status",
            "formatted_address",
            "formatted_phone_number",
            "geometry",
            "icon",
            "icon_background_color",
            "icon_mask_base_uri",
            "international_phone_number",
            "name",
            "opening_hours",
            "photos",
            "place_id",
            "plus_code",
            "price_level",
            "rating",
            "reference",
            "reviews",
            "types",
            "url",
            "user_ratings_total",
            "utc_offset",
            "vicinity",
            "website",
            "wheelchair_accessible_entrance",
          ],
        },
      });

      console.log(
        "Received place details response. Available fields:",
        Object.keys(placeDetailsResponse.data.result || {}).join(", ")
      );

      const place = placeDetailsResponse.data.result;
      console.log("Full place details:", JSON.stringify(place, null, 2));

      // Get photo URLs for all photos
      console.log(
        `Fetching photos for place. Found ${place.photos?.length || 0} photos`
      );
      const photos = await Promise.all(
        (place.photos || []).map(async (photo, index) => {
          console.log(`Fetching photo ${index + 1}/${place.photos?.length}`);
          const photoUrl = await this.client.placePhoto({
            params: {
              photoreference: photo.photo_reference,
              maxwidth: photo.width,
              key: this.apiKey,
            },
            responseType: "arraybuffer",
          });
          console.log(`Successfully fetched photo ${index + 1}`);

          return {
            photoReference: photo.photo_reference,
            width: photo.width,
            height: photo.height,
            htmlAttributions: photo.html_attributions,
            url: photoUrl.request.res.responseUrl,
          };
        })
      );

      console.log("Successfully processed all photos");

      const result: IPlaceDetails = {
        _id: place.place_id || "",
        name: place.name || "",
        address: place.formatted_address || "",
        phoneNumber: place.formatted_phone_number,
        internationalPhoneNumber: place.international_phone_number,
        website: place.website,
        rating: place.rating,
        userRatingsTotal: place.user_ratings_total,
        types: place.types || [],
        photos: photos.map((photo) => ({
          photoReference: photo.photoReference,
          width: photo.width,
          height: photo.height,
          htmlAttributions: photo.htmlAttributions,
        })),
        openingHours: place.opening_hours
          ? {
              openNow: place.opening_hours.open_now,
              periods: place.opening_hours.periods?.map((period) => ({
                open: {
                  day: period.open.day,
                  time: period.open.time || "",
                },
                close: period.close
                  ? {
                      day: period.close.day,
                      time: period.close.time || "",
                    }
                  : undefined,
              })),
              weekdayText: place.opening_hours.weekday_text,
            }
          : undefined,
        priceLevel: place.price_level,
        reviews: place.reviews?.map((review) => ({
          authorName: review.author_name,
          rating: review.rating,
          text: review.text,
          time: parseInt(review.time.toString(), 10),
        })),
        geometry: {
          location: {
            lat: place.geometry?.location.lat || 0,
            lng: place.geometry?.location.lng || 0,
          },
          viewport: place.geometry?.viewport
            ? {
                northeast: {
                  lat: place.geometry.viewport.northeast.lat,
                  lng: place.geometry.viewport.northeast.lng,
                },
                southwest: {
                  lat: place.geometry.viewport.southwest.lat,
                  lng: place.geometry.viewport.southwest.lng,
                },
              }
            : undefined,
        },
        businessStatus: place.business_status,
        url: place.url,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("Successfully processed place details:", {
        name: result.name,
        address: result.address,
        photosCount: result.photos.length,
      });

      return result;
    } catch (error) {
      console.error("Error in GooglePlacesService:", {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }
}
