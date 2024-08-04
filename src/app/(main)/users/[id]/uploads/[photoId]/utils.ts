import { useJsApiLoader, Libraries } from '@react-google-maps/api';

export interface MapLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  formatted_address?: string;
}

const libraries: Libraries = ['places'];

export const useGoogleMapsApi = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  return { isLoaded, loadError };
};

export const getLocation = async (
  position: GeolocationPosition,
): Promise<MapLocation> => {
  const { latitude, longitude } = position.coords;

  if (!window.google || !window.google.maps || !window.google.maps.places) {
    throw new Error('Google Maps Places API not loaded');
  }

  const service = new window.google.maps.places.PlacesService(
    document.createElement('div'),
  );

  try {
    const result = await new Promise<google.maps.places.PlaceResult>(
      (resolve, reject) => {
        service.nearbySearch(
          {
            location: { lat: latitude, lng: longitude },
            radius: 500,
          },
          (results, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              results &&
              results[0]
            ) {
              resolve(results[0]);
            } else {
              reject(new Error(`Place search failed: ${status}`));
            }
          },
        );
      },
    );

    console.log('Location:', result);

    return {
      id: result.place_id || `${latitude},${longitude}`,
      name: result.name || 'Unknown location',
      latitude: result.geometry?.location?.lat() || latitude,
      longitude: result.geometry?.location?.lng() || longitude,
      formatted_address: result.vicinity || 'Unknown address',
    };
  } catch (error) {
    console.error('Error getting location:', error);
    throw error;
  }
};
