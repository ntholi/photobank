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

  if (!window.google || !window.google.maps) {
    throw new Error('Google Maps API not loaded');
  }

  const geocoder = new window.google.maps.Geocoder();

  try {
    const result = await new Promise<google.maps.GeocoderResult>(
      (resolve, reject) => {
        geocoder.geocode(
          { location: { lat: latitude, lng: longitude } },
          (results, status) => {
            if (status === 'OK' && results && results[0]) {
              resolve(results[0]);
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          },
        );
      },
    );

    return {
      id: result.place_id || `${latitude},${longitude}`,
      name: result.formatted_address || 'Unknown location',
      latitude,
      longitude,
      formatted_address: result.formatted_address,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    throw error;
  }
};
