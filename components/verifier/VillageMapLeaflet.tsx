'use client';

import {
  MapContainer as RawMapContainer,
  TileLayer as RawTileLayer,
  CircleMarker as RawCircleMarker,
  Polyline as RawPolyline,
  Tooltip as RawTooltip,
  Circle as RawCircle,
} from 'react-leaflet';
import type { ComponentType } from 'react';
import {
  ATTESTERS,
  NEIGHBOR_VILLAGES,
  SIDOREJO_CENTER,
  type LatLng,
} from '@/lib/geo';

const MapContainer = RawMapContainer as ComponentType<any>;
const TileLayer = RawTileLayer as ComponentType<any>;
const CircleMarker = RawCircleMarker as ComponentType<any>;
const Polyline = RawPolyline as ComponentType<any>;
const Tooltip = RawTooltip as ComponentType<any>;
const Circle = RawCircle as ComponentType<any>;

const VERDICT_COLOR: Record<string, string> = {
  approve: '#7a9b6a', // sage-2
  pending: '#c8a558', // gold
  reject: '#c4633c',  // terracotta
};

export default function VillageMapLeaflet() {
  const center: LatLng = [
    (SIDOREJO_CENTER[0] + NEIGHBOR_VILLAGES.Bayat.center[0]) / 2,
    (SIDOREJO_CENTER[1] + NEIGHBOR_VILLAGES.Cawas.center[1]) / 2,
  ];

  return (
    <MapContainer
      center={center}
      zoom={12}
      minZoom={10}
      maxZoom={15}
      scrollWheelZoom
      doubleClickZoom={false}
      zoomControl={false}
      attributionControl={false}
      style={{ width: '100%', height: '100%', background: 'var(--bone-2)' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* 25 km audit radius around the target */}
      <Circle
        center={SIDOREJO_CENTER}
        radius={25000}
        pathOptions={{
          color: 'var(--ink-3)',
          weight: 0.5,
          dashArray: '4 4',
          fillOpacity: 0.02,
        }}
      />

      {/* Lines from each neighbor village to Sidorejo */}
      {Object.values(NEIGHBOR_VILLAGES).map((v) => (
        <Polyline
          key={`line-${v.name}`}
          positions={[v.center, SIDOREJO_CENTER]}
          pathOptions={{
            color: '#8a7a5a',
            weight: 0.8,
            dashArray: '4 3',
            opacity: 0.7,
          }}
        />
      ))}

      {/* Target village (Sidorejo) — terracotta */}
      <CircleMarker
        center={SIDOREJO_CENTER}
        radius={11}
        pathOptions={{
          color: '#c4633c',
          weight: 1.5,
          fillColor: '#e8c0a8',
          fillOpacity: 0.85,
        }}
      >
        <Tooltip direction="bottom" offset={[0, 12]} permanent>
          <span style={{ fontFamily: 'var(--f-display)', fontWeight: 600, fontSize: 11 }}>
            Sidorejo
          </span>
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 9, color: '#6a6258', marginLeft: 6 }}>
            target
          </span>
        </Tooltip>
      </CircleMarker>

      {/* Neighbor villages */}
      {Object.values(NEIGHBOR_VILLAGES).map((v) => (
        <CircleMarker
          key={`village-${v.name}`}
          center={v.center}
          radius={8}
          pathOptions={{
            color: '#6a6258',
            weight: 0.8,
            fillColor: '#f0ece4',
            fillOpacity: 0.9,
          }}
        >
          <Tooltip direction="top" offset={[0, -10]} permanent>
            <span style={{ fontFamily: 'var(--f-display)', fontSize: 10 }}>{v.name}</span>
          </Tooltip>
        </CircleMarker>
      ))}

      {/* Attester dots — sage / gold / terracotta */}
      {ATTESTERS.map((a) => {
        const v = NEIGHBOR_VILLAGES[a.village];
        const pos: LatLng = [v.center[0] + a.offset[0], v.center[1] + a.offset[1]];
        return (
          <CircleMarker
            key={a.id}
            center={pos}
            radius={3}
            pathOptions={{
              color: VERDICT_COLOR[a.verdict],
              fillColor: VERDICT_COLOR[a.verdict],
              fillOpacity: 1,
              weight: 0,
            }}
          />
        );
      })}
    </MapContainer>
  );
}
