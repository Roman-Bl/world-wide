import { useState } from "react";

export function useGeolocation(defaultPosition = null) {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  //   const [position, setPosition] = useState({});
  const [error, setError] = useState(null);

  //   const { lat, lng } = position;
  // console.log("inside custom hook");
  function getPosition() {
    // console.log("inside getPos");

    if (!navigator.geolocation)
      return setError("Your browser does not support geolocation");

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  //   return { lat, lng, isLoading, error, getPosition };
  return { position, isLoading, error, getPosition };
}
