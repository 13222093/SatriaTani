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

// Renders ONLY the flood zone as a soft feathered blob — no visible square,
// no synthetic green NDVI overlay competing with the real imagery. The
// healthy paddies show through directly via the underlying Esri tile.
function generateFloodOverlayDataURL(): string {
  const W = 384;
  const H = 384;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const imgData = ctx.createImageData(W, H);

  // Flood centroid (normalized image coords) and radii.
  const fcx = 0.5;
  const fcy = 0.52;
  const innerRadius = 0.08;   // fully opaque dark terracotta
  const outerRadius = 0.28;   // fades to fully transparent

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const u = x / W;
      const v = y / H;
      const dx = u - fcx;
      const dy = v - fcy;

      // Multi-frequency noise warps the radial distance so the blob has
      // organic, paddy-strip-aligned irregularity rather than a perfect circle.
      const n1 = Math.sin(x * 0.06) * Math.cos(y * 0.05) * 0.020;
      const n2 = Math.sin(x * 0.14 + y * 0.11) * 0.012;
      const n3 = Math.cos(x * 0.022 - y * 0.028) * 0.018;
      const distortedDx = dx + n1 + n3;
      const distortedDy = dy + n2;
      const dist = Math.sqrt(distortedDx * distortedDx + distortedDy * distortedDy);

      let alpha = 0;
      let r = 139;
      let g = 58;
      let b = 26;

      if (dist <= innerRadius) {
        // Deep terracotta core
        alpha = 200;
        r = 139;
        g = 50;
        b = 22;
      } else if (dist <= outerRadius) {
        // Smooth feather: alpha falls from 200 → 0; color shifts terracotta → orange-tint
        const t = (dist - innerRadius) / (outerRadius - innerRadius);
        // Smoothstep curve — gentler than linear, no hard edge
        const smoothT = t * t * (3 - 2 * t);
        alpha = 200 * (1 - smoothT);
        r = 139 + Math.round((196 - 139) * smoothT);
        g = 50 + Math.round((99 - 50) * smoothT);
        b = 22 + Math.round((60 - 22) * smoothT);
      }
      // Outside outerRadius: alpha = 0 (fully transparent — Esri imagery shows through)

      // Add slight alpha noise even within the blob for raster texture
      if (alpha > 0) {
        const texNoise = (Math.sin(x * 0.4 + y * 0.3) + Math.cos(x * 0.7 - y * 0.5)) * 6;
        alpha = Math.max(0, Math.min(220, alpha + texNoise));
      }

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
    setNdviUrl(generateFloodOverlayDataURL());
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
