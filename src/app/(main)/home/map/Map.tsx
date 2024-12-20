'use client';
import React, { useEffect, memo } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import { Location } from '@prisma/client';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Card } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

type LocationWithCount = Location & { photoCount: number };

const MapContainerMemo = memo(MapContainer);

export default function Map() {
  const [locations, setLocations] = React.useState<LocationWithCount[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/photos/locations').then((res) => {
      setLocations(res.data.locations);
    });

    // Cleanup function to handle map container cleanup
    return () => {
      const mapContainer = document.querySelector('.leaflet-container');
      if (mapContainer && (mapContainer as any)._leaflet_id) {
        delete (mapContainer as any)._leaflet_id;
      }
    };
  }, []);

  const calculateRadius = (location: LocationWithCount) => {
    const scalingFactor = 5; // 0.35;
    return Math.min(location.photoCount * scalingFactor, 30);
  };

  return (
    <Card>
      <MapContainerMemo center={[-29.652, 28.57]} zoom={8} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map(
          (
            location: any, //TODO: location should not be any
          ) => (
            <CircleMarker
              key={location.id}
              center={[location.lat, location.lng]}
              fillOpacity={0.5}
              stroke={false}
              radius={calculateRadius(location)}
              eventHandlers={{
                mouseover: (event) => event.target.openPopup(),
                mouseout: (event) => event.target.closePopup(),
                click: (event) => router.push(`/locations/${location.id}`),
              }}
            >
              <Popup>
                <h3 className="mb-0">{location.name}</h3>
                <p className="-mt-2 text-xs text-gray-600">
                  {location.photoCount} Photos
                </p>
              </Popup>
            </CircleMarker>
          ),
        )}
      </MapContainerMemo>
    </Card>
  );
}
