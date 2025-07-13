import { useTranslations } from 'next-intl';

import { capsFont } from '../app/fonts';
import { KPIs, Positions } from '../lib/gpx';
import ClientMapView from './MapView.client';
import styles from './MapView.module.css';

function KPIView({ kpis }: { kpis: KPIs }) {
  const t = useTranslations();
  return (
    <div className={[styles.kpis, capsFont.className].join(' ')}>
      <span>
        {t('kpi.distance')}:
        <span className={styles.kpi}>{Math.ceil(kpis.distance / 1000)}km</span>
      </span>
      <span>
        {t('kpi.duration')}:
        <span className={styles.kpi}>
          {Math.floor(kpis.duration / 60 / 60)}:
          {Math.ceil((kpis.duration / 60) % 60)
            .toString()
            .padStart(2, '0')}
        </span>
      </span>
      <span>
        {t('kpi.elevation')}:
        <span className={styles.kpi}>
          +{Math.ceil(kpis.elevationGain)}m -{Math.ceil(kpis.elevationLoss)}m
        </span>
      </span>
    </div>
  );
}

type Props = {
  kpis: KPIs;
  positions: Positions;
};

export default function MapView({ kpis, positions }: Props) {
  return (
    <div className={styles.container}>
      <KPIView kpis={kpis} />
      <ClientMapView positions={positions} />
    </div>
  );
}
