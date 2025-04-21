const API_BASE_URL = "http://localhost:3000/api"; // We'll update this later

export interface CreateLandingPageRequest {
  placeId: string;
  location: string;
}

export const createLandingPage = async (data: CreateLandingPageRequest) => {
  const response = await fetch(`${API_BASE_URL}/landing-pages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create landing page");
  }

  return response.json();
};
