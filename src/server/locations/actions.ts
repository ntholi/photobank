'use server';

import { locationsService as service } from './service';
import 'dotenv/config';

export type PlaceSuggestion = {
  placeId: string;
  description: string;
  mainText?: string;
  secondaryText?: string;
};

export async function upsertLocationByPlaceId(input: {
  placeId: string;
  name: string;
  formattedAddress?: string | null;
}) {
  return service.upsertByPlaceId(input);
}

export async function getLocation(id: string) {
  return service.get(id);
}

export async function searchPlaces(
  input: string,
  sessionToken?: string
): Promise<PlaceSuggestion[]> {
  const key = process.env.GOOGLE_MAPS_API_KEY as string;
  if (!key) return [];
  const res = await fetch(
    'https://places.googleapis.com/v1/places:autocomplete',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask':
          'suggestions.placePrediction.placeId,suggestions.placePrediction.text',
      },
      cache: 'no-store',
      body: JSON.stringify({ input, sessionToken }),
    }
  );
  console.log('----------------> Res:', res);
  const json: {
    suggestions?: Array<{
      placePrediction?: { placeId?: string; text?: { text?: string } };
    }>;
  } = await res.json();
  const suggestions = json.suggestions ?? [];
  return suggestions
    .map((s) => ({
      placeId: s.placePrediction?.placeId ?? '',
      description: s.placePrediction?.text?.text ?? '',
      mainText: s.placePrediction?.text?.text ?? '',
    }))
    .filter((s) => s.placeId && s.description);
}

export async function getPlaceDetails(
  placeId: string,
  sessionToken?: string
): Promise<{
  placeId: string;
  name: string;
  formattedAddress?: string | null;
}> {
  const key = process.env.GOOGLE_MAPS_API_KEY as string;
  if (!key) throw new Error('Missing Google Maps API key');
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}${sessionToken ? `?sessionToken=${encodeURIComponent(sessionToken)}` : ''}`,
    {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress',
      },
      cache: 'no-store',
    }
  );
  const json: {
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
  } = await res.json();
  if (!json.id) throw new Error('No place details');
  return {
    placeId: json.id,
    name: json.displayName?.text ?? '',
    formattedAddress: json.formattedAddress ?? null,
  };
}
