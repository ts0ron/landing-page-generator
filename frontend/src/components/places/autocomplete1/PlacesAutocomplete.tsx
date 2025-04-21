import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useLoadScript } from "@react-google-maps/api";

const libraries: "places"[] = ["places"];

interface PlaceOption {
  description: string;
  place_id: string;
}

interface PlacesAutocompleteProps {
  value: string;
  onChange: (location: string, placeId: string) => void;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  value,
  onChange,
}) => {
  const [options, setOptions] = useState<PlaceOption[]>([]);
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handleLocationSearch = async (searchValue: string) => {
    if (!searchValue || !isLoaded || loadError) return;

    try {
      const autocompleteService = new google.maps.places.AutocompleteService();
      const predictions = await new Promise<
        google.maps.places.AutocompletePrediction[]
      >((resolve, reject) => {
        autocompleteService.getPlacePredictions(
          { input: searchValue },
          (results, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              results
            ) {
              resolve(results);
            } else {
              reject(status);
            }
          }
        );
      });

      setOptions(
        predictions.map((prediction) => ({
          description: prediction.description,
          place_id: prediction.place_id,
        }))
      );
    } catch (error) {
      console.error("Error fetching place predictions:", error);
      setOptions([]);
    }
  };

  if (loadError) {
    return <TextField error label="Error loading Google Maps" fullWidth />;
  }

  if (!isLoaded) {
    return <TextField disabled label="Loading..." fullWidth />;
  }

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      value={value}
      onChange={(_, newValue) => {
        if (typeof newValue === "string") {
          onChange(newValue, "");
        } else if (newValue) {
          onChange(newValue.description, newValue.place_id);
        } else {
          onChange("", "");
        }
      }}
      onInputChange={(_, newValue) => {
        onChange(newValue, "");
        handleLocationSearch(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Enter Location"
          variant="outlined"
          fullWidth
        />
      )}
    />
  );
};

export default PlacesAutocomplete;
