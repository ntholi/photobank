import { MapLocation } from './MapLocation';

export const getLocation = async (position: GeolocationPosition) => {
  const { latitude, longitude } = position.coords;
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
  );
  const data: MapLocation = await response.json();
  return data;
};
