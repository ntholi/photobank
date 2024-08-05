'use client';

import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Location } from '@prisma/client';

type Props = { location: Location };
export default function MapDisplay({ location }: Props) {
  const mapStyles = {
    height: '300px',
    width: '100%',
  };
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const defaultCenter = {
    lat: location.latitude,
    lng: location.longitude,
  };

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={defaultCenter}>
        <Marker position={defaultCenter} />
      </GoogleMap>
    </LoadScript>
  );
}
