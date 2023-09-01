'use client';
import React, { useEffect } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import { Location } from '@prisma/client';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

type LocationWithCount = Location & { photoCount: number };

export default function Map() {
  const [locations, setLocations] = React.useState<LocationWithCount[]>([]);
  useEffect(() => {
    axios.get('/api/photos/locations').then((res) => {
      setLocations(res.data.locations);
    });
  }, []);

  return (
    <div>
      <MapContainer center={[-29.652, 28.57]} zoom={8} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <CircleMarker
            key={location.id}
            center={[location.lat, location.lng]}
            fillOpacity={0.5}
            stroke={false}
            radius={10 * location.photoCount}
          >
            <Popup>{location.photoCount}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
