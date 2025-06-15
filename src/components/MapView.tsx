import { parseGPXWithCustomParser, Point } from "@we-gold/gpxjs";
import { capsFont } from "../app/fonts";
import { DOMParser } from "xmldom-qsa";
import { lazy, useEffect, useState } from "react";

export type TrackData = {
  positions: [number, number][];
  distance: number;
  elevationGain: number | null;
  elevationLoss: number | null;
  duration: number;
}


export default async function MapView({gpxUrl}: {gpxUrl?:string}) {
  const ClientMapView = lazy(() => import("./MapView.client"));

  if (!gpxUrl) return;
  const gpxXML = await (await fetch(gpxUrl!.startsWith('//') ? `https:${gpxUrl!}` : gpxUrl!)).text();
  const [gpxData, error] = parseGPXWithCustomParser(gpxXML, (gpx) => new DOMParser().parseFromString(gpx, "text/xml"));
  if (!gpxData || error) {
    console.error("Failed to parse GPX data:", error);
    return;
  }
  const trackData: TrackData = {
    positions: gpxData.tracks[0].points.map((p: Point) => [p.latitude, p.longitude]),
    distance: gpxData.tracks[0].distance.total,
    elevationGain: gpxData.tracks[0].elevation.positive,
    elevationLoss: gpxData.tracks[0].elevation.negative,
    duration: gpxData.tracks[0].duration.movingDuration,
  };
	return trackData && 
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className={capsFont.className}>Distance: <span className="highlight">{Math.ceil(trackData.distance/1000)}km</span></span>
        <span className={capsFont.className}>Duration: <span className="highlight">{Math.floor(trackData.duration/60/60)}:{Math.ceil(trackData.duration/60%60)}</span></span>
        <span className={capsFont.className}>
          Elevation:&nbsp;
          <span className="highlight">
            +{trackData.elevationGain ? Math.ceil(trackData.elevationGain) : 'N/A'}m
            -{trackData.elevationLoss ? Math.ceil(trackData.elevationLoss) : 'N/A'}m
          </span>
          </span>
      </div>
      <ClientMapView trackData={trackData} />
  </div>;
}