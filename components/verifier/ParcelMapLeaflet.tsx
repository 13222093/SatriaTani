'use client';

// react-leaflet 4.x + @types/leaflet 1.9 have a known prop-inheritance type bug;
// cast each primitive to a permissive component so MapOptions props (zoom,
// minZoom, scrollWheelZoom, etc.) stay callable from TSX.
import {
  MapContainer as RawMapContainer,
  TileLayer as RawTileLayer,
  Polygon as RawPolygon,
  LayersControl as RawLayersControl,
} from 'react-leaflet';
import type { ComponentType } from 'react';
import {
  PARCEL_BOUNDS,
  generatePaddies,
  ndviColor,
} from '@/lib/geo';

const MapContainer = RawMapContainer as ComponentType<any>;
const TileLayer = RawTileLayer as ComponentType<any>;
const Polygon = RawPolygon as ComponentType<any>;
const LayersControl = RawLayersControl as ComponentType<any> & {
  BaseLayer: ComponentType<any>;
};

export default function ParcelMapLeaflet() {
  const paddies = generatePaddies();

  // Outline around the contiguous flooded cluster — derived from the flooded
  // paddy polygons' combined bbox.
  const floodedPaddies = paddies.filter((p) => p.flooded);
  const floodedLats = floodedPaddies.flatMap((p) => p.polygon.map((c) => c[0]));
  const floodedLngs = floodedPaddies.flatMap((p) => p.polygon.map((c) => c[1]));
  const floodOutline =
    floodedPaddies.length > 0
      ? [
          [Math.min(...floodedLats), Math.min(...floodedLngs)],
          [Math.min(...floodedLats), Math.max(...floodedLngs)],
          [Math.max(...floodedLats), Math.max(...floodedLngs)],
          [Math.max(...floodedLats), Math.min(...floodedLngs)],
        ]
      : null;

  const bounds: [[number, number], [number, number]] = [
    [PARCEL_BOUNDS.south, PARCEL_BOUNDS.west],
    [PARCEL_BOUNDS.north, PARCEL_BOUNDS.east],
  ];

  return (
    <MapContainer
      bounds={bounds}
      zoom={18}
      minZoom={16}
      maxZoom={20}
      maxBounds={[
        [PARCEL_BOUNDS.south - 0.005, PARCEL_BOUNDS.west - 0.005],
        [PARCEL_BOUNDS.north + 0.005, PARCEL_BOUNDS.east + 0.005],
      ]}
      maxBoundsViscosity={1.0}
      scrollWheelZoom
      doubleClickZoom={false}
      zoomControl={false}
      attributionControl={false}
      style={{ width: '100%', height: '100%', background: '#1a2e2a' }}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Satelit (Esri)">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
            maxZoom={20}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Jalan (OSM)">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {paddies.map((p) => (
        <Polygon
          key={p.id}
          positions={p.polygon}
          pathOptions={{
            color: ndviColor(p.ndvi, p.flooded),
            fillColor: ndviColor(p.ndvi, p.flooded),
            fillOpacity: 0.55,
            weight: 0.6,
            opacity: 0.85,
          }}
        />
      ))}

      {floodOutline && (
        <Polygon
          positions={floodOutline}
          pathOptions={{
            color: '#f5f3ee',
            weight: 1.2,
            dashArray: '4 3',
            fillOpacity: 0,
          }}
        />
      )}
    </MapContainer>
  );
}
