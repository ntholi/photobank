'use client';
import React, { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Location } from '@prisma/client';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Icon } from 'leaflet';

export default function Map() {
  const [locations, setLocations] = React.useState<Location[]>([]);
  useEffect(() => {
    axios.get('/api/photos/locations').then((res) => {
      setLocations(res.data.locations);
    });
  }, []);

  const icon = new Icon({
    iconUrl: '/images/location.png',
    iconSize: [25, 25],
  });

  return (
    <div>
      <MapContainer center={[-29.652, 28.57]} zoom={8} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={icon}
          >
            <Popup>{location.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
