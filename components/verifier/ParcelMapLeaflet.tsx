'use client';

// Static aerial paddy image (public/parcel-aerial.png, 2048×2048) with
// hand-positioned hex polygons aligned to visible paddy interiors. No
// Leaflet — pixel-perfect alignment trumps interactive pan/zoom for this
// scale. SVG viewBox 0..600 in both axes; image preserves aspect via
// objectFit: cover; hex centers chosen to land inside actual paddy strips
// (not on canal/road junctions).

import { Fragment } from 'react';

const VBOX = 600;
const HEX_SIZE = 24;

function hexPoints(cx: number, cy: number, size: number = HEX_SIZE): string {
  // Pointy-top hexagon: vertices every 60° starting at -30° (top vertex up)
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(' ');
}

type Hex = {
  id: string;
  cx: number;
  cy: number;
  ndvi: number;
  flooded: boolean;
};

// Coords in 600×600 viewBox space. Each hex center lies inside a visible
// paddy strip in /public/parcel-aerial.png — verified against the image.
const HEXES: Hex[] = [
  // Healthy paddies — emerald, scattered across the image, low opacity
  { id: 'h-tl-1', cx: 75, cy: 100, ndvi: 0.71, flooded: false },
  { id: 'h-t-1', cx: 200, cy: 75, ndvi: 0.78, flooded: false },
  { id: 'h-t-2', cx: 350, cy: 90, ndvi: 0.74, flooded: false },
  { id: 'h-tr-1', cx: 495, cy: 100, ndvi: 0.69, flooded: false },
  { id: 'h-l-1', cx: 75, cy: 260, ndvi: 0.72, flooded: false },
  { id: 'h-r-1', cx: 510, cy: 230, ndvi: 0.75, flooded: false },
  { id: 'h-bl-1', cx: 105, cy: 480, ndvi: 0.68, flooded: false },
  { id: 'h-b-1', cx: 220, cy: 520, ndvi: 0.70, flooded: false },
  { id: 'h-b-2', cx: 440, cy: 510, ndvi: 0.73, flooded: false },
  { id: 'h-br-1', cx: 530, cy: 470, ndvi: 0.71, flooded: false },

  // Flooded paddies — terracotta, clustered on the brown soil-exposed
  // patches around the central canal X-junction
  { id: 'f-c-1', cx: 255, cy: 300, ndvi: 0.31, flooded: true },
  { id: 'f-c-2', cx: 340, cy: 290, ndvi: 0.28, flooded: true },
  { id: 'f-c-3', cx: 375, cy: 365, ndvi: 0.30, flooded: true },
  { id: 'f-c-4', cx: 300, cy: 395, ndvi: 0.33, flooded: true },
];

// Convex hull around the flooded cluster — dashed parchment outline marks
// the SAR-detected flood zone boundary.
const FLOOD_HULL = '230,275 360,260 410,340 330,425 250,410';

export default function ParcelMapLeaflet() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#1a2e2a',
      }}
    >
      <img
        src="/parcel-aerial.png"
        alt="Citra aerial sawah Sidorejo, Klaten"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
      <svg
        viewBox={`0 0 ${VBOX} ${VBOX}`}
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {/* Flood zone hull — dashed parchment outline */}
        <polygon
          points={FLOOD_HULL}
          fill="none"
          stroke="#f5f3ee"
          strokeWidth="1.4"
          strokeDasharray="5 4"
          opacity="0.7"
        />

        {HEXES.map((hex) => {
          const fill = hex.flooded ? '#C2502A' : '#1F6B3A';
          const stroke = hex.flooded ? '#9a3e1f' : '#155028';
          const fillOpacity = hex.flooded ? 0.55 : 0.28;
          const strokeOpacity = hex.flooded ? 0.9 : 0.6;
          return (
            <Fragment key={hex.id}>
              <polygon
                points={hexPoints(hex.cx, hex.cy)}
                fill={fill}
                fillOpacity={fillOpacity}
                stroke={stroke}
                strokeWidth={1.2}
                strokeOpacity={strokeOpacity}
              />
              {/* Center accent dot — the "data probe" pin */}
              <circle
                cx={hex.cx}
                cy={hex.cy}
                r={1.8}
                fill="#f5f3ee"
                opacity={0.8}
              />
            </Fragment>
          );
        })}
      </svg>
    </div>
  );
}
