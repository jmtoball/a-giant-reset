'use client';

import { lazy, useEffect, useState } from 'react';

import { Positions } from '../lib/gpx';
import './MapView.leafletOverride.css';
import styles from './MapView.module.css';

const MapContainer = lazy(() =>
  import('react-leaflet').then(({ MapContainer }) => ({
    default: MapContainer,
  })),
);
const TileLayer = lazy(() =>
  import('react-leaflet').then(({ TileLayer }) => ({ default: TileLayer })),
);
const Polyline = lazy(() =>
  import('react-leaflet').then(({ Polyline }) => ({ default: Polyline })),
);

function calculateCenter(positions: Positions): [number, number] {
  const sum = positions.reduce(
    (acc, pos) => [acc[0] + pos[0], acc[1] + pos[1]],
    [0, 0],
  );
  return [sum[0] / positions.length, sum[1] / positions.length];
}

function getBounds(positions: Positions): {
  north: number;
  south: number;
  east: number;
  west: number;
} {
  return positions.reduce(
    (acc, pos) => ({
      north: Math.max(acc.north, pos[0]),
      south: Math.min(acc.south, pos[0]),
      east: Math.max(acc.east, pos[1]),
      west: Math.min(acc.west, pos[1]),
    }),
    { north: -90, south: 90, east: -180, west: 180 },
  );
}

function calculateZoom(positions: Positions): number {
  const bounds = getBounds(positions);

  const latSpan = bounds.north - bounds.south;
  const lngSpan = bounds.east - bounds.west;
  const maxSpan = Math.max(latSpan, lngSpan);

  const zoom = Math.floor(Math.log2(360 / maxSpan));

  return Math.min(Math.max(zoom, 1), 18);
}

export default function ClientMapView({ positions }: { positions: Positions }) {
  const [isClientSide, setClientSide] = useState(false);

  useEffect(() => {
    setClientSide(true);
  }, []);

  const center = calculateCenter(positions);
  const zoom = calculateZoom(positions);

  return isClientSide ? (
    <MapContainer center={center} zoom={zoom} className={styles.map}>
      <TileLayer
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        attribution='<a href="http://opentopomap.org/">OpenTopoMap</a>'
      />
      <Polyline
        pathOptions={{ color: '#aa3333', weight: 6 }}
        positions={positions}
      />
    </MapContainer>
  ) : undefined;
}
