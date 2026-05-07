'use client';

// Pixel-raster NDVI overlay over Esri satellite imagery — the canonical
// agritech viz pattern (Sentinel Hub, Climate Engine, NASA GIBS). Generated
// client-side via canvas, stretched to fit the parcel bbox. NDVI rasters are
// satellite pixel data and do NOT follow field boundaries by design.

import { useEffect, useState } from 'react';
import {
  MapContainer as RawMapContainer,
  TileLayer as RawTileLayer,
  ImageOverlay as RawImageOverlay,
  LayersControl as RawLayersControl,
} from 'react-leaflet';
import type { ComponentType } from 'react';
import { PARCEL_BOUNDS } from '@/lib/geo';

const MapContainer = RawMapContainer as ComponentType<any>;
const TileLayer = RawTileLayer as ComponentType<any>;
const ImageOverlay = RawImageOverlay as ComponentType<any>;
const LayersControl = RawLayersControl as ComponentType<any> & {
  BaseLayer: ComponentType<any>;
};

// Continuous NDVI color ramp — terracotta (flooded/dead) → gold → green.
function ndviRGB(ndvi: number): [number, number, number] {
  const stops: Array<[number, [number, number, number]]> = [
    [0.0, [139, 58, 26]],   // dark terracotta — submerged / dead
    [0.25, [196, 99, 60]],  // terracotta — flood damage
    [0.4, [212, 168, 75]],  // gold — stressed
    [0.55, [168, 196, 104]], // yellow-green — moderate
    [0.7, [123, 196, 74]],  // vibrant green — healthy
    [1.0, [70, 145, 42]],   // dark green — dense vegetation
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    const [a, ca] = stops[i];
    const [b, cb] = stops[i + 1];
    if (ndvi <= b) {
      const t = (ndvi - a) / (b - a);
      return [
        Math.round(ca[0] + (cb[0] - ca[0]) * t),
        Math.round(ca[1] + (cb[1] - ca[1]) * t),
        Math.round(ca[2] + (cb[2] - ca[2]) * t),
      ];
    }
  }
  return stops[stops.length - 1][1];
}

function generateNDVIDataURL(): string {
  const W = 320;
  const H = 320;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const imgData = ctx.createImageData(W, H);

  // Flood centroid in normalized [0,1] image space — slightly south-east of
  // the parcel center, matches the original "flooded cluster" placement.
  const fcx = 0.52;
  const fcy = 0.55;
  const floodRadius = 0.28;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const u = x / W;
      const v = y / H;
      const dx = u - fcx;
      const dy = v - fcy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Smooth radial falloff: 0 at flood center, ~0.85 at edges.
      const radial = Math.min(1, dist / floodRadius);
      const baseNdvi = 0.12 + radial * 0.7;

      // Multi-frequency noise for raster texture (no plugin — sin/cos sum).
      const n1 = Math.sin(x * 0.07) * Math.cos(y * 0.06);
      const n2 = Math.sin(x * 0.19 + y * 0.17) * 0.6;
      const n3 = Math.cos(x * 0.035 - y * 0.045) * 0.8;
      const n4 = Math.sin((x + y) * 0.31) * 0.4;
      const noise = (n1 + n2 + n3 + n4) * 0.035;

      const ndvi = Math.max(0, Math.min(1, baseNdvi + noise));
      const [r, g, b] = ndviRGB(ndvi);

      // Slight per-pixel alpha jitter so the overlay reads as raster data
      // rather than a flat translucent layer.
      const alphaJitter = (Math.sin(x * 0.13 + y * 0.11) + 1) * 8;
      const alpha = 142 + alphaJitter;

      const idx = (y * W + x) * 4;
      imgData.data[idx] = r;
      imgData.data[idx + 1] = g;
      imgData.data[idx + 2] = b;
      imgData.data[idx + 3] = alpha;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}

export default function ParcelMapLeaflet() {
  const [ndviUrl, setNdviUrl] = useState<string | null>(null);

  useEffect(() => {
    setNdviUrl(generateNDVIDataURL());
  }, []);

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

      {ndviUrl && (
        <ImageOverlay
          url={ndviUrl}
          bounds={bounds}
          opacity={1}
          interactive={false}
          zIndex={400}
        />
      )}
    </MapContainer>
  );
}
