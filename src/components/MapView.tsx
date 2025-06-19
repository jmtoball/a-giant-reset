import { lazy } from 'react';

import { capsFont } from '../app/fonts';
import { KPIs, processGPX } from '../lib/gpx';
import styles from './MapView.module.css';

function KPIView({ kpis }: { kpis: KPIs }) {
  return (
    <div className={[styles.kpiContainer, capsFont.className].join(' ')}>
      <span>
        Distance:
        <span className={styles.kpi}>{Math.ceil(kpis.distance / 1000)}km</span>
      </span>
      <span>
        Duration:
        <span className={styles.kpi}>
          {Math.floor(kpis.duration / 60 / 60)}:
          {Math.ceil((kpis.duration / 60) % 60)}
        </span>
      </span>
      <span>
        Elevation:
        <span className={styles.kpi}>
          +{Math.ceil(kpis.elevationGain)}m -{Math.ceil(kpis.elevationLoss)}m
        </span>
      </span>
    </div>
  );
}

export default async function MapView({ gpxUrl }: { gpxUrl?: string }) {
  if (!gpxUrl) return;
  const ClientMapView = lazy(() => import('./MapView.client'));

  const { positions, kpis } = await processGPX(gpxUrl);
  return (
    <div>
      {gpxUrl && <KPIView kpis={kpis} />}
      <ClientMapView positions={positions} />
    </div>
  );
}
