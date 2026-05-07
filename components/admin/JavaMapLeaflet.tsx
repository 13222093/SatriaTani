'use client';

// Leaflet rendering of the Pusat Nasional risk map. Receives layer + selection
// state from the parent (AdminDashboard) so the existing right-panel LAYER
// toggles stay the source of truth.

import { useEffect } from 'react';
import {
  MapContainer as RawMapContainer,
  TileLayer as RawTileLayer,
  Marker as RawMarker,
  Circle as RawCircle,
  Popup as RawPopup,
  Tooltip as RawTooltip,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import type { ComponentType } from 'react';
import provinces from '@/lib/mock-data/provinces.json';
import hotspots from '@/lib/mock-data/hotspots.json';

const MapContainer = RawMapContainer as ComponentType<any>;
const TileLayer = RawTileLayer as ComponentType<any>;
const Marker = RawMarker as ComponentType<any>;
const Circle = RawCircle as ComponentType<any>;
const Popup = RawPopup as ComponentType<any>;
const Tooltip = RawTooltip as ComponentType<any>;

const TERR = '#C2502A';
const GOLD = '#B8860B';
const EM = '#1F6B3A';
const LOW = '#a0a8b4';

type Severity = 'high' | 'med' | 'low';

interface Hotspot {
  id: string; name: string; lat: number; lng: number;
  sev: Severity; count: number; kind: string; fired: string; exposure: string;
}
interface Province {
  code: string; name: string; lat: number; lng: number;
  members: number; risk: number;
}

const HOTSPOTS = hotspots as Hotspot[];
const PROVINCES = provinces as Province[];

const sevColor = (s: Severity) => (s === 'high' ? TERR : s === 'med' ? GOLD : LOW);
const sevSize = (s: Severity) => (s === 'high' ? 32 : s === 'med' ? 28 : 24);

// Bounds clamping the map to Pulau Jawa (lat south/north, lng west/east).
const JAVA_BOUNDS: [[number, number], [number, number]] = [
  [-9.0, 105.0],
  [-5.5, 115.0],
];

function makeHotspotIcon(h: Hotspot, isSelected: boolean) {
  const size = sevSize(h.sev);
  const color = sevColor(h.sev);
  const ringClass = h.sev === 'high' ? 'hotspot-marker sev-high' : 'hotspot-marker';
  const selectedRing = isSelected ? `box-shadow: 0 0 0 3px ${color}cc, 0 0 0 6px rgba(244,237,216,0.4);` : '';
  const html = `
    <div class="${ringClass}" style="
      width:${size}px;height:${size}px;
      background:${color};
      border:1.4px solid #F4EDD8;
      ${selectedRing}
    ">
      <span>${h.count}</span>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'hotspot-icon-wrapper',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function makeProvinceLabelIcon(name: string) {
  return L.divIcon({
    html: `<div class="province-label">${name}</div>`,
    className: 'province-label-wrapper',
    iconSize: [120, 18],
    iconAnchor: [60, 9],
  });
}

// Pops the Leaflet popup automatically when `selected` changes.
function PopupController({ selected, onClose }: { selected: string | null; onClose: () => void }) {
  const map = useMap();
  useEffect(() => {
    if (!selected) {
      map.closePopup();
    }
    const handler = () => onClose();
    map.on('popupclose', handler);
    return () => {
      map.off('popupclose', handler);
    };
  }, [selected, map, onClose]);
  return null;
}

// Loss-ratio risk color ramp: 0.0 cool → 1.0 hot
function lossColor(risk: number): string {
  // 0.0–0.4 emerald, 0.4–0.6 gold, 0.6+ terracotta
  if (risk >= 0.6) return TERR;
  if (risk >= 0.4) return GOLD;
  return EM;
}

interface JavaMapLeafletProps {
  activeLayer: 'risk' | 'loss' | 'density' | 'climate';
  selected: string | null;
  onSelect: (id: string | null) => void;
  onOpenClaim: (claimId: string) => void;
}

export default function JavaMapLeaflet({
  activeLayer,
  selected,
  onSelect,
  onOpenClaim,
}: JavaMapLeafletProps) {
  return (
    <MapContainer
      center={[-7.4, 110.5]}
      zoom={7}
      minZoom={6}
      maxZoom={10}
      zoomSnap={0.5}
      maxBounds={JAVA_BOUNDS}
      maxBoundsViscosity={1.0}
      scrollWheelZoom
      doubleClickZoom={false}
      zoomControl={false}
      attributionControl
      style={{ width: '100%', height: '100%', background: '#0a1322' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      />

      {/* Province name labels — always visible */}
      {PROVINCES.map((p) => (
        <Marker
          key={`label-${p.code}`}
          position={[p.lat, p.lng]}
          icon={makeProvinceLabelIcon(p.name)}
          interactive={false}
          keyboard={false}
        />
      ))}

      {/* Density layer — emerald circles sized by membership */}
      {activeLayer === 'density' &&
        PROVINCES.map((p) => (
          <Circle
            key={`dens-${p.code}`}
            center={[p.lat, p.lng]}
            radius={Math.sqrt(p.members) * 800}
            pathOptions={{
              color: EM,
              fillColor: EM,
              fillOpacity: 0.18,
              weight: 1,
              opacity: 0.55,
            }}
            interactive={false}
          />
        ))}

      {/* Loss-ratio layer — color-graded circles per province */}
      {activeLayer === 'loss' &&
        PROVINCES.map((p) => (
          <Circle
            key={`loss-${p.code}`}
            center={[p.lat, p.lng]}
            radius={45000 + p.risk * 50000}
            pathOptions={{
              color: lossColor(p.risk),
              fillColor: lossColor(p.risk),
              fillOpacity: 0.18 + p.risk * 0.18,
              weight: 1,
              opacity: 0.7,
            }}
            interactive={false}
          />
        ))}

      {/* Climate anomaly haze — central Java band + permanent label */}
      {activeLayer === 'climate' && (
        <>
          <Circle
            center={[-7.2, 110.5]}
            radius={120000}
            pathOptions={{ color: GOLD, fillColor: GOLD, fillOpacity: 0.15, weight: 0 }}
            interactive={false}
          />
          <Circle
            center={[-7.4, 111.5]}
            radius={90000}
            pathOptions={{ color: TERR, fillColor: TERR, fillOpacity: 0.12, weight: 0 }}
            interactive={false}
          />
          <Marker
            position={[-7.3, 111.0]}
            icon={L.divIcon({
              html: `<div class="climate-anomaly">+2,1°C ANOMALI</div>`,
              className: 'climate-anomaly-wrapper',
              iconSize: [120, 16],
              iconAnchor: [60, 8],
            })}
            interactive={false}
          />
        </>
      )}

      {/* Hotspot pins — visible on risk layer; faded on others for context */}
      {HOTSPOTS.map((h) => {
        const isSelected = selected === h.id;
        const onRiskLayer = activeLayer === 'risk';
        return (
          <Marker
            key={h.id}
            position={[h.lat, h.lng]}
            icon={makeHotspotIcon(h, isSelected)}
            opacity={onRiskLayer ? 1 : 0.45}
            eventHandlers={{
              click: () => onSelect(isSelected ? null : h.id),
            }}
          >
            {!isSelected && (
              <Tooltip direction="top" offset={[0, -16]} opacity={0.95}>
                <span style={{ fontFamily: 'var(--f-display)', fontWeight: 500 }}>{h.name}</span>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, marginLeft: 6, opacity: 0.7 }}>
                  {h.count} klaim · {h.fired}
                </span>
              </Tooltip>
            )}
            {isSelected && (
              <Popup
                offset={[0, -16]}
                closeButton={false}
                eventHandlers={{ remove: () => onSelect(null) }}
              >
                <div style={{ minWidth: 220 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 6,
                    }}
                  >
                    <div style={{ fontFamily: 'var(--f-display)', fontSize: 15, fontWeight: 500, color: '#0E1A2B' }}>
                      {h.name}
                    </div>
                    <div
                      onClick={() => onSelect(null)}
                      style={{ cursor: 'pointer', color: '#7a7a7a', fontSize: 16, lineHeight: 1, paddingLeft: 8 }}
                    >
                      ×
                    </div>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#6a6a6a', marginBottom: 8 }}>
                    {h.kind} · severity {h.sev}
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 8,
                      fontSize: 12,
                      color: '#0E1A2B',
                    }}
                  >
                    <div>
                      <div style={{ color: '#7a7a7a', fontSize: 10 }}>Pemicu</div>
                      <div
                        style={{
                          fontFamily: 'var(--f-mono)',
                          fontWeight: 600,
                          color: h.fired === '3/3' ? TERR : '#0E1A2B',
                        }}
                      >
                        {h.fired} fired
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#7a7a7a', fontSize: 10 }}>Klaim</div>
                      <div style={{ fontWeight: 600 }}>{h.count}</div>
                    </div>
                    <div>
                      <div style={{ color: '#7a7a7a', fontSize: 10 }}>Exposure</div>
                      <div style={{ fontWeight: 600 }}>{h.exposure}</div>
                    </div>
                    <div>
                      <div style={{ color: '#7a7a7a', fontSize: 10 }}>Status</div>
                      <div style={{ color: h.fired === '3/3' ? TERR : GOLD, fontWeight: 600 }}>
                        {h.fired === '3/3' ? 'siaga' : 'pantau'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenClaim('STN-2026-04-1183')}
                    style={{
                      width: '100%',
                      marginTop: 10,
                      padding: '8px 12px',
                      background: '#0E1A2B',
                      color: '#F4EDD8',
                      border: 'none',
                      borderRadius: 6,
                      fontFamily: 'var(--f-sans)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Buka klaim →
                  </button>
                </div>
              </Popup>
            )}
          </Marker>
        );
      })}

      <PopupController selected={selected} onClose={() => onSelect(null)} />
    </MapContainer>
  );
}
