'use client';

// react-leaflet 4.x + @types/leaflet 1.9 have a known prop-inheritance type bug;
// cast MapContainer to a permissive component to keep MapOptions props (zoom,
// minZoom, scrollWheelZoom, etc.) callable from TSX.
import {
  MapContainer as RawMapContainer,
  TileLayer as RawTileLayer,
  Rectangle as RawRectangle,
  LayersControl as RawLayersControl,
} from 'react-leaflet';
import type { ComponentType } from 'react';
import {
  PARCEL_BOUNDS,
  PARCEL_GRID,
  cellBounds,
  deterministicNDVI,
  FLOODED_CELL_KEYS,
  ndviColor,
} from '@/lib/geo';

const MapContainer = RawMapContainer as ComponentType<any>;
const TileLayer = RawTileLayer as ComponentType<any>;
const Rectangle = RawRectangle as ComponentType<any>;
const LayersControl = RawLayersControl as ComponentType<any> & {
  BaseLayer: ComponentType<any>;
};

const FLOOD_OUTLINE_BOUNDS: [[number, number], [number, number]] = [
  cellBounds(2, 3)[0],
  cellBounds(4, 5)[1],
];

export default function ParcelMapLeaflet() {
  const ndvi = deterministicNDVI();
  const cells: { key: string; row: number; col: number; ndvi: number; flooded: boolean }[] = [];
  for (let r = 0; r < PARCEL_GRID.rows; r++) {
    for (let c = 0; c < PARCEL_GRID.cols; c++) {
      const key = `${r}-${c}`;
      const flooded = FLOODED_CELL_KEYS.has(key);
      cells.push({
        key,
        row: r,
        col: c,
        ndvi: flooded ? 0.22 : ndvi[r * PARCEL_GRID.cols + c],
        flooded,
      });
    }
  }

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

      {cells.map((cell) => {
        const cb = cellBounds(cell.row, cell.col);
        return (
          <Rectangle
            key={cell.key}
            bounds={cb}
            pathOptions={{
              color: ndviColor(cell.ndvi, cell.flooded),
              fillColor: ndviColor(cell.ndvi, cell.flooded),
              fillOpacity: 0.55,
              weight: 0.4,
              opacity: 0.7,
            }}
          />
        );
      })}

      <Rectangle
        bounds={FLOOD_OUTLINE_BOUNDS}
        pathOptions={{
          color: '#f5f3ee',
          weight: 1.2,
          dashArray: '4 3',
          fillOpacity: 0,
        }}
      />
    </MapContainer>
  );
}
