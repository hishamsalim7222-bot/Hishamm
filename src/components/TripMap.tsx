'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  pickup: string;
  destination: string;
}

// Fix for marker icons in Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const mockLocations: { [key: string]: [number, number] } = {
  'دمشق': [33.5138, 36.2765],
  'حلب': [34.7212, 37.1592],
  'اللاذقية': [34.7397, 35.7795],
  'حمص': [34.7292, 36.7237],
  'حماة': [34.7330, 36.7554],
  'دير الزور': [35.3396, 40.1458],
  'القامشلي': [37.0504, 41.2226],
  'الرقة': [35.9461, 39.0080],
};

export function TripMap({ pickup, destination }: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="h-96 bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">جاري تحميل الخريطة...</p>
      </Card>
    );
  }

  const pickupCoords = mockLocations[pickup] || [33.5138, 36.2765];
  const destinationCoords = mockLocations[destination] || [34.7212, 37.1592];

  return (
    <Card className="h-96 overflow-hidden">
      <MapContainer
        center={pickupCoords}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        dir="rtl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={pickupCoords}>
          <Popup>{pickup}</Popup>
        </Marker>
        <Marker position={destinationCoords}>
          <Popup>{destination}</Popup>
        </Marker>
      </MapContainer>
    </Card>
  );
}