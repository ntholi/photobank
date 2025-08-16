'use server';

import { locations } from '@/db/schema';
import { locationsService as service } from './service';

type Location = typeof locations.$inferInsert;

export type PlaceSuggestion = {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText?: string;
};

export async function upsertLocationByPlaceId(input: {
  placeId: string;
  name: string;
  address?: string | null;
}) {
  return service.upsertByPlaceId(input);
}

export async function getLocation(id: string) {
  return service.get(id);
}

export async function getLocations(page: number = 1, search = '') {
  return service.getAll({ page, search });
}

export async function createLocation(location: Location) {
  return service.create(location);
}

export async function updateLocation(id: string, location: Partial<Location>) {
  return service.update(id, location);
}

export async function deleteLocation(id: string) {
  return service.delete(id);
}

export async function searchPlaces(input: string): Promise<PlaceSuggestion[]> {
  const key = process.env.GOOGLE_MAPS_API_KEY as string;
  if (!key) return [];
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${key}`;
  const res = await fetch(url);
  const json: {
    predictions?: Array<{
      description: string;
      place_id: string;
      structured_formatting?: { main_text: string; secondary_text?: string };
    }>;
  } = await res.json();
  const preds = json.predictions ?? [];
  return preds.map((p) => ({
    placeId: p.place_id,
    description: p.description,
    mainText: p.structured_formatting?.main_text ?? p.description,
    secondaryText: p.structured_formatting?.secondary_text,
  }));
}

export async function getPlaceDetails(placeId: string): Promise<{
  placeId: string;
  name: string;
  address?: string | null;
}> {
  const key = process.env.GOOGLE_MAPS_API_KEY as string;
  if (!key) throw new Error('Missing Google Maps API key');
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&key=${key}&fields=place_id,name,formatted_address`;
  const res = await fetch(url);
  const json: {
    result?: { place_id: string; name: string; formatted_address?: string };
  } = await res.json();
  const r = json.result;
  if (!r) throw new Error('No place details');
  return {
    placeId: r.place_id,
    name: r.name,
    address: r.formatted_address ?? null,
  };
}
