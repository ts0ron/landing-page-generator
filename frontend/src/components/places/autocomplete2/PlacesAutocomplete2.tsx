import React, { useState, useEffect, useRef } from "react";
import { Autocomplete, TextField, styled } from "@mui/material";
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

const StyledOption = styled("li")({
  backgroundColor: "white",
  padding: "8px 16px",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
});

const StyledAutocomplete = styled(
  Autocomplete<PlaceOption, false, false, true>
)({
  "& .MuiAutocomplete-paper": {
    backgroundColor: "white",
  },
});

const PlacesAutocomplete2: React.FC<PlacesAutocompleteProps> = ({
  value,
  onChange,
}) => {
  const [options, setOptions] = useState<PlaceOption[]>([]);
  const [inputValue, setInputValue] = useState(value);
  const searchTimeout = useRef<number | undefined>(undefined);
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handleLocationSearch = async (searchValue: string) => {
    if (!searchValue || !isLoaded || loadError) {
      setOptions([]);
      return;
    }

    try {
      const autocompleteService = new google.maps.places.AutocompleteService();

      const results = await new Promise<
        google.maps.places.AutocompletePrediction[]
      >((resolve, reject) => {
        autocompleteService.getPlacePredictions(
          {
            input: searchValue,
            types: ["establishment", "address"],
          },
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
        results.map((prediction) => ({
          description: prediction.description,
          place_id: prediction.place_id,
        }))
      );
    } catch (error) {
      console.error("Error fetching place predictions:", error);
      setOptions([]);
    }
  };

  useEffect(() => {
    if (searchTimeout.current !== undefined) {
      window.clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = window.setTimeout(() => {
      handleLocationSearch(inputValue);
    }, 300);

    return () => {
      if (searchTimeout.current !== undefined) {
        window.clearTimeout(searchTimeout.current);
      }
    };
  }, [inputValue]);

  if (loadError) {
    return <TextField error label="Error loading Google Maps" fullWidth />;
  }

  if (!isLoaded) {
    return <TextField disabled label="Loading..." fullWidth />;
  }

  return (
    <StyledAutocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      value={value}
      inputValue={inputValue}
      renderOption={(props, option) => (
        <StyledOption {...props}>{option.description}</StyledOption>
      )}
      onInputChange={(_, newValue) => {
        setInputValue(newValue);
        onChange(newValue, "");
      }}
      onChange={(_, newValue) => {
        if (typeof newValue === "string") {
          onChange(newValue, "");
        } else if (newValue) {
          onChange(newValue.description, newValue.place_id);
        } else {
          onChange("", "");
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search for a place"
          variant="outlined"
          fullWidth
        />
      )}
    />
  );
};

export default PlacesAutocomplete2;
