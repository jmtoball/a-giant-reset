import { Point, parseGPXWithCustomParser } from '@we-gold/gpxjs';
import { DOMParser } from 'xmldom-qsa';

import { toFullUrl } from './util';

export type Positions = [number, number][];

export type KPIs = {
  distance: number;
  elevationGain: number;
  elevationLoss: number;
  duration: number;
};

export type TrackData = {
  positions: Positions;
  kpis: KPIs;
};

export async function processGPX(gpxUrl: string): Promise<TrackData> {
  const gpxXML = await (await fetch(toFullUrl(gpxUrl))).text();
  const [gpxData, error] = parseGPXWithCustomParser(gpxXML, (gpx) =>
    new DOMParser().parseFromString(gpx, 'text/xml'),
  );
  if (!gpxData || error) {
    console.error('Failed to parse GPX data:', error);
    throw new Error('Failed to parse GPX data');
  }
  return {
    positions: gpxData.tracks[0].points.map((p: Point) => [
      p.latitude,
      p.longitude,
    ]),
    kpis: {
      distance: gpxData.tracks[0].distance.total,
      elevationGain: gpxData.tracks[0].elevation.positive!,
      elevationLoss: gpxData.tracks[0].elevation.negative!,
      duration: gpxData.tracks[0].duration.movingDuration,
    },
  };
}
