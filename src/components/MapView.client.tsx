"use client"
import { TrackData } from './MapView';

import styles from './MapView.module.css';
import './MapView.leafletOverride.css';
import { lazy, use, useEffect, useState } from 'react';

const MapContainer = lazy(() => import("react-leaflet").then(({MapContainer}) => ({default: MapContainer})));
const TileLayer = lazy(() => import("react-leaflet").then(({TileLayer}) => ({default: TileLayer})));
const Polyline = lazy(() => import("react-leaflet").then(({Polyline}) => ({default: Polyline})));

export default function ClientMapView({trackData}: {trackData: TrackData}) {
  const [isClientSide, setClientSide] = useState(false);

  useEffect(() => {
    setClientSide(true);
  }, []);
  
  return isClientSide ? <MapContainer
      center={[trackData.positions[0][0]-0.05, trackData.positions[0][1]]}
      zoom={11}
      className={styles.map}>
      <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" attribution='<a href="http://opentopomap.org/">OpenTopoMap</a>'/>
      <Polyline
        pathOptions={{ color: '#aa3333', weight: 6 }}
        positions={trackData.positions}
      />
    </MapContainer> : undefined
}