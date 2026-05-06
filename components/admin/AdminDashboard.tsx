'use client';

/* Admin Pusat — Command Center.
   Top of fold = "what needs my attention NOW".
   Section order: ActionQueue → KPI strip → Filters → Map (with right rail)
                  → Province table → Trigger chart. */

import { useState, type CSSProperties, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { UnifiedHeader } from '@/components/UnifiedHeader';
import actionQueueRaw from '@/lib/mock-data/action-queue.json';
import provincesRaw from '@/lib/mock-data/provinces.json';
import hotspotsRaw from '@/lib/mock-data/hotspots.json';
import kpisRaw from '@/lib/mock-data/kpis.json';

const NAVY = '#0E1A2B';
const PARCH = '#F4EDD8';
const TERR = '#C2502A';
const GOLD = '#B8860B';
const EM = '#1F6B3A';

type Severity = 'high' | 'med' | 'low';
type ProvinceStatus = 'sehat' | 'pantau' | 'siaga';
type ColorKey = 'navy' | 'terracotta' | 'emerald';

interface ActionItem {
  id: string;
  region: string;
  village: string;
  fired: string;
  age: string;
  sev: Severity;
  ctx: string;
  kind: string;
}
interface Province {
  code: string;
  name: string;
  members: number;
  ha: number;
  claims: number;
  claims30: number;
  payout: string;
  risk: number;
  status: ProvinceStatus;
}
interface Hotspot {
  id: string;
  name: string;
  x: number;
  y: number;
  sev: Severity;
  count: number;
  kind: string;
  fired: string;
  exposure: string;
}
interface Kpi {
  eyebrow: string;
  value: string;
  delta: string;
  dir: 'pos' | 'neg';
  context: string;
  seed: number;
  trend: number;
  color: ColorKey;
  alert?: boolean;
}

const ACTION_QUEUE = actionQueueRaw as ActionItem[];
const PROVINCES = provincesRaw as Province[];
const HOTSPOTS = hotspotsRaw as Hotspot[];
const KPIS = kpisRaw as Kpi[];

const colorHex = (c: ColorKey): string =>
  c === 'navy' ? NAVY : c === 'terracotta' ? TERR : EM;

// 30-day sparkline series (synthesized — matches source/admin.jsx spark())
function spark(seed: number, trend = 0): number[] {
  return Array.from({ length: 30 }, (_, i) => {
    const noise =
      Math.sin((i + seed) * 0.6) * 0.18 + Math.cos((i + seed * 2) * 0.4) * 0.12;
    return 0.55 + noise + (i / 29) * trend;
  });
}

// ─────────────────────────── Section 1 — Action Queue ───────────────────────────
function ActionQueueCard({ q, onClick }: { q: ActionItem; onClick?: () => void }) {
  const sevColor = q.sev === 'high' ? TERR : q.sev === 'med' ? GOLD : 'var(--line-2)';
  const kindIcon = q.kind === 'banjir' ? '≋' : q.kind === 'hama' ? '✺' : '◬';
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid var(--line-navy)',
        borderRadius: 'var(--r-card)',
        borderLeft: `3px solid ${sevColor}`,
        padding: '12px 14px',
        minWidth: 268,
        flex: '1 1 268px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        cursor: 'pointer',
        transition: 'background 120ms ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: 14,
              color: sevColor,
              lineHeight: 1,
            }}
          >
            {kindIcon}
          </span>
          <span
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 15,
              fontWeight: 500,
              color: NAVY,
            }}
          >
            {q.region} <span style={{ color: 'var(--muted)' }}>·</span> {q.village}
          </span>
        </div>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            padding: '2px 6px',
            background:
              q.fired === '3/3'
                ? `${TERR}1a`
                : q.fired === '2/3'
                  ? `${GOLD}22`
                  : 'var(--bone-2)',
            color:
              q.fired === '3/3' ? TERR : q.fired === '2/3' ? GOLD : 'var(--muted)',
            fontWeight: 600,
          }}
        >
          {q.fired} fired
        </div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{q.ctx}</div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 4,
          paddingTop: 8,
          borderTop: '1px dashed var(--line)',
          fontFamily: 'var(--f-mono)',
          fontSize: 10,
          color: 'var(--muted)',
        }}
      >
        <span>fired {q.age} lalu</span>
        <span style={{ color: NAVY, fontWeight: 600 }}>buka klaim →</span>
      </div>
    </div>
  );
}

function ActionQueue() {
  const router = useRouter();
  return (
    <div style={{ padding: '20px 28px 0' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <div
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: TERR,
              fontWeight: 600,
            }}
          >
            Antrian Aksi · prioritas hari ini
          </div>
          <div
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 22,
              fontWeight: 500,
              color: NAVY,
              letterSpacing: '-0.01em',
            }}
          >
            8 klaim memerlukan perhatian Anda
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            dari 184.220 polis aktif · Pulau Jawa
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-secondary btn-sm">Filter</button>
          <button className="btn btn-secondary btn-sm">Tugaskan ke verifier</button>
          <button className="btn btn-primary btn-sm">Lihat semua (47) →</button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
        {ACTION_QUEUE.map((q) => (
          <ActionQueueCard
            key={q.id}
            q={q}
            onClick={() => router.push(`/klaim/${q.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────── Section 2 — KPI strip ───────────────────────────
function Sparkline({
  data,
  color = NAVY,
  height = 24,
  fill = true,
}: {
  data: number[];
  color?: string;
  height?: number;
  fill?: boolean;
}) {
  const w = 90;
  const h = height;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map<[number, number]>((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * (h - 2) - 1,
  ]);
  const path = pts
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ');
  const area = path + ` L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display: 'block' }}>
      {fill && <path d={area} fill={color} opacity="0.10" />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2" fill={color} />
    </svg>
  );
}

function KpiStrip() {
  return (
    <div style={{ padding: '14px 28px 0' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          background: '#fff',
          border: '1px solid var(--line-navy)',
          borderRadius: 'var(--r-card)',
          overflow: 'hidden',
        }}
      >
        {KPIS.map((k, i) => (
          <div
            key={i}
            style={{
              padding: '14px 16px',
              borderRight: i === KPIS.length - 1 ? 'none' : '1px solid var(--line-navy)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div
              className="kpi-eyebrow"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>{k.eyebrow}</span>
              {k.alert && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: TERR,
                  }}
                />
              )}
            </div>
            <div
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: 26,
                fontWeight: 400,
                letterSpacing: '-0.015em',
                lineHeight: 1.0,
                color: NAVY,
                fontVariantNumeric: 'tabular-nums',
                marginTop: 2,
              }}
            >
              {k.value}
            </div>
            <Sparkline data={spark(k.seed, k.trend)} color={colorHex(k.color)} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, fontSize: 11 }}>
              <span
                style={{
                  color: k.dir === 'pos' ? EM : TERR,
                  fontWeight: 600,
                  fontFamily: 'var(--f-mono)',
                }}
              >
                {k.dir === 'pos' ? '▲' : '▼'} {k.delta}
              </span>
              <span style={{ color: 'var(--muted)' }}>{k.context}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────── Section · Global filter strip ───────────────────────────
function FilterDropdown({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 12px',
        background: '#fff',
        border: '1px solid var(--line-navy)',
        borderRadius: 'var(--r-control)',
        fontSize: 12,
        fontFamily: 'var(--f-sans)',
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 9.5,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}
      >
        {label}
      </span>
      <span style={{ color: NAVY, fontWeight: 500 }}>{value}</span>
      <svg width="10" height="10" viewBox="0 0 10 10">
        <path d="M 1 3 L 5 7 L 9 3" stroke={NAVY} strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
}

function FilterStrip() {
  return (
    <div
      style={{
        padding: '12px 28px',
        background: 'var(--bone-2)',
        borderTop: '1px solid var(--line-navy)',
        borderBottom: '1px solid var(--line-navy)',
        marginTop: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 9.5,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          marginRight: 4,
        }}
      >
        Workspace ›
      </span>
      <FilterDropdown label="Region" value="Pulau Jawa · semua provinsi" />
      <FilterDropdown label="Periode" value="30 hari terakhir" />
      <FilterDropdown label="Kombinasi pemicu" value="Apa saja" />
      <FilterDropdown label="Status" value="Aktif + butuh perhatian" />
      <FilterDropdown label="Peristiwa iklim" value="Banjir + hama" />
      <div style={{ flex: 1 }} />
      <button className="btn btn-secondary btn-sm">Reset</button>
      <button className="btn btn-secondary btn-sm">Simpan tampilan</button>
    </div>
  );
}

// ─────────────────────────── Section 3 — Map ───────────────────────────
const LAYERS: Array<{ id: string; label: string; desc: string; accent: string }> = [
  { id: 'risk', label: 'Risiko aktif', desc: 'klaim aktif per regency', accent: TERR },
  { id: 'loss', label: 'Loss ratio', desc: 'rasio klaim/premi', accent: GOLD },
  { id: 'density', label: 'Densitas polis', desc: 'polis per ha', accent: EM },
  { id: 'climate', label: 'Anomali iklim', desc: 'curah hujan + suhu', accent: '#5a7a9a' },
];

function JavaMap() {
  const router = useRouter();
  const [activeLayer, setActiveLayer] = useState('risk');
  const [selected, setSelected] = useState<string | null>(null);
  const [liveOn, setLiveOn] = useState(true);

  const sevColor = (s: Severity) => (s === 'high' ? TERR : s === 'med' ? GOLD : '#a0a8b4');
  const sevR = (s: Severity) => (s === 'high' ? 9 : s === 'med' ? 7 : 5);
  const sevHeat = (s: Severity) => (s === 'high' ? 42 : s === 'med' ? 28 : 18);

  const sel = HOTSPOTS.find((h) => h.id === selected);

  return (
    <div
      style={{
        background: 'var(--navy)',
        color: 'var(--bone)',
        border: '1px solid var(--line-navy)',
        borderRadius: 'var(--r-card)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Date/time filter row */}
      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid rgba(244,237,216,0.12)',
          background: 'rgba(244,237,216,0.04)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 9.5,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: GOLD,
            fontWeight: 600,
          }}
        >
          Peta Risiko · Pulau Jawa
        </div>
        <div style={{ flex: 1 }} />

        {/* Date range pills */}
        <div
          style={{
            display: 'flex',
            gap: 0,
            border: '1px solid rgba(244,237,216,0.2)',
            borderRadius: 'var(--r-control)',
            overflow: 'hidden',
          }}
        >
          {['24 jam', '7 hari', '30 hari', 'Musim ini'].map((d, i) => (
            <div
              key={d}
              style={{
                padding: '6px 12px',
                fontSize: 11,
                fontFamily: 'var(--f-sans)',
                fontWeight: 500,
                cursor: 'pointer',
                background: i === 1 ? PARCH : 'transparent',
                color: i === 1 ? NAVY : 'rgba(244,237,216,0.7)',
                borderRight: i === 3 ? 'none' : '1px solid rgba(244,237,216,0.2)',
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Date range picker */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            border: '1px solid rgba(244,237,216,0.2)',
            borderRadius: 'var(--r-control)',
            fontFamily: 'var(--f-mono)',
            fontSize: 11,
            color: 'rgba(244,237,216,0.85)',
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="16" y1="2" x2="16" y2="6" />
          </svg>
          28 Apr — 5 Mei 2026
        </div>

        {/* Live toggle */}
        <div
          onClick={() => setLiveOn(!liveOn)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            border: `1px solid ${liveOn ? EM : 'rgba(244,237,216,0.2)'}`,
            borderRadius: 'var(--r-control)',
            background: liveOn ? `${EM}33` : 'transparent',
            fontFamily: 'var(--f-mono)',
            fontSize: 11,
            fontWeight: 600,
            color: liveOn ? '#9adfb0' : 'rgba(244,237,216,0.7)',
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: liveOn ? EM : '#7a8a90',
              boxShadow: liveOn ? `0 0 0 3px ${EM}44` : 'none',
              animation: liveOn ? 'pulse 2s infinite' : 'none',
            }}
          />
          LIVE
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <svg
          viewBox="0 0 950 360"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <pattern id="batikDot2" patternUnits="userSpaceOnUse" width="14" height="14">
              <circle cx="2" cy="2" r="0.6" fill="#2a3a52" />
              <circle cx="9" cy="9" r="0.6" fill="#2a3a52" />
            </pattern>
            <radialGradient id="hotHigh2">
              <stop offset="0%" stopColor={TERR} stopOpacity="0.85" />
              <stop offset="60%" stopColor={TERR} stopOpacity="0.32" />
              <stop offset="100%" stopColor={TERR} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="hotMed2">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.85" />
              <stop offset="60%" stopColor={GOLD} stopOpacity="0.28" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="hotLow2">
              <stop offset="0%" stopColor="#a0a8b4" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#a0a8b4" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#a0a8b4" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="950" height="360" fill="#0a1322" />
          <rect width="950" height="360" fill="url(#batikDot2)" />

          {/* Madura */}
          <path
            d="M 798 152 Q 820 142 860 138 Q 905 135 938 145 Q 942 156 922 162 Q 880 168 840 168 Q 808 167 795 160 Z"
            fill="#1c2c40"
            stroke="#4a5e7a"
            strokeWidth="0.5"
          />
          <text
            x="868"
            y="155"
            fontSize="8.5"
            fill="#5a7090"
            fontFamily="var(--f-mono)"
            textAnchor="middle"
            letterSpacing="1"
          >
            MADURA
          </text>

          {/* Banten */}
          <path
            d="M 70 215 L 76 198 L 96 182 L 122 178 L 156 184 L 184 188 L 198 208 L 212 232 L 218 258 L 200 272 L 168 274 L 138 268 L 108 252 L 88 238 L 78 226 Z"
            fill="#1c2c40"
            stroke="#4a5e7a"
            strokeWidth="0.7"
          />

          {/* DKI Jakarta */}
          <path
            d="M 218 200 L 244 198 L 252 212 L 248 224 L 224 222 L 215 212 Z"
            fill="#243854"
            stroke="#4a5e7a"
            strokeWidth="0.7"
          />

          {/* Jawa Barat */}
          <path
            d="M 198 208 L 212 232 L 218 258 L 232 268 L 258 274 L 290 270 L 322 264 L 358 268 L 398 272 L 432 268 L 446 252 L 452 232 L 444 212 L 422 196 L 388 188 L 348 184 L 308 188 L 280 196 L 252 212 L 248 224 L 224 222 L 215 212 Z"
            fill="#1c2c40"
            stroke="#4a5e7a"
            strokeWidth="0.7"
          />

          {/* Jawa Tengah */}
          <path
            d="M 446 212 L 452 232 L 446 252 L 458 264 L 484 268 L 518 270 L 552 268 L 588 264 L 622 264 L 654 260 L 670 248 L 678 230 L 672 208 L 656 188 L 632 178 L 600 174 L 562 178 L 528 184 L 498 192 L 472 200 Z"
            fill="#1c2c40"
            stroke="#4a5e7a"
            strokeWidth="0.7"
          />

          {/* DI Yogyakarta */}
          <path
            d="M 642 248 L 678 244 L 684 264 L 668 274 L 644 270 Z"
            fill="#243854"
            stroke="#4a5e7a"
            strokeWidth="0.7"
          />

          {/* Jawa Timur */}
          <path
            d="M 670 248 L 678 230 L 700 218 L 728 208 L 762 200 L 798 198 L 826 204 L 858 218 L 884 234 L 902 248 L 906 268 L 884 280 L 854 286 L 818 286 L 782 282 L 750 276 L 718 268 L 690 262 L 678 254 Z"
            fill="#1c2c40"
            stroke="#4a5e7a"
            strokeWidth="0.7"
          />

          {/* Mountain ridge highlight */}
          <path
            d="M 200 220 Q 280 210 360 218 T 520 218 T 700 224 T 880 246"
            stroke="#3a4e72"
            strokeWidth="0.6"
            fill="none"
            opacity="0.6"
            strokeDasharray="1 2"
          />

          {activeLayer === 'risk' &&
            HOTSPOTS.map((h) => (
              <circle
                key={`heat-${h.id}`}
                cx={h.x}
                cy={h.y}
                r={sevHeat(h.sev)}
                fill={
                  h.sev === 'high'
                    ? 'url(#hotHigh2)'
                    : h.sev === 'med'
                      ? 'url(#hotMed2)'
                      : 'url(#hotLow2)'
                }
              />
            ))}

          {activeLayer === 'density' &&
            PROVINCES.map((p) => {
              const cxMap: Record<string, number> = {
                BTN: 144,
                JKT: 234,
                JBR: 322,
                JTG: 560,
                DIY: 660,
                JTM: 798,
              };
              const cx = cxMap[p.code];
              const r = Math.sqrt(p.members) / 7;
              return cx ? (
                <circle
                  key={p.code}
                  cx={cx}
                  cy={228}
                  r={r}
                  fill={EM}
                  opacity="0.35"
                  stroke={EM}
                  strokeWidth="0.6"
                />
              ) : null;
            })}

          {activeLayer === 'climate' && (
            <g opacity="0.35">
              <rect x="430" y="170" width="280" height="110" fill="url(#batikDot2)" />
              <text
                x="570"
                y="220"
                fill={GOLD}
                fontSize="11"
                fontFamily="var(--f-mono)"
                textAnchor="middle"
                letterSpacing="2"
              >
                +2,1°C ANOMALI
              </text>
            </g>
          )}

          {/* Hotspot pins */}
          {HOTSPOTS.map((h) => {
            const isSel = selected === h.id;
            return (
              <g
                key={h.id}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(isSel ? null : h.id);
                }}
              >
                <circle
                  cx={h.x}
                  cy={h.y}
                  r={sevR(h.sev) + 4}
                  fill="none"
                  stroke={sevColor(h.sev)}
                  strokeWidth="1"
                  opacity={isSel ? 1 : 0.5}
                />
                <circle
                  cx={h.x}
                  cy={h.y}
                  r={sevR(h.sev)}
                  fill={sevColor(h.sev)}
                  stroke={PARCH}
                  strokeWidth="1.4"
                />
                <text
                  x={h.x}
                  y={h.y + 2.5}
                  fontSize="7.5"
                  fontFamily="var(--f-mono)"
                  fontWeight="600"
                  fill="#fff"
                  textAnchor="middle"
                >
                  {h.count}
                </text>
              </g>
            );
          })}

          {/* Province labels */}
          <text
            x="138"
            y="232"
            fontSize="10"
            fontFamily="var(--f-display)"
            fontWeight="500"
            fill={PARCH}
            opacity="0.85"
          >
            Banten
          </text>
          <text x="232" y="216" fontSize="8" fontFamily="var(--f-display)" fill={PARCH} opacity="0.75">
            DKI
          </text>
          <text
            x="318"
            y="244"
            fontSize="11"
            fontFamily="var(--f-display)"
            fontWeight="500"
            fill={PARCH}
            opacity="0.9"
          >
            Jawa Barat
          </text>
          <text
            x="558"
            y="232"
            fontSize="11"
            fontFamily="var(--f-display)"
            fontWeight="500"
            fill={PARCH}
            opacity="0.9"
          >
            Jawa Tengah
          </text>
          <text x="660" y="262" fontSize="8" fontFamily="var(--f-display)" fill={PARCH} opacity="0.85">
            DIY
          </text>
          <text
            x="790"
            y="248"
            fontSize="11"
            fontFamily="var(--f-display)"
            fontWeight="500"
            fill={PARCH}
            opacity="0.9"
          >
            Jawa Timur
          </text>

          {/* Compass */}
          <g transform="translate(34, 32)">
            <circle r="14" fill={PARCH} opacity="0.08" />
            <text
              y="-2"
              fontSize="9"
              fontFamily="var(--f-display)"
              fontWeight="600"
              fill={PARCH}
              textAnchor="middle"
            >
              N
            </text>
            <path d="M 0 -10 L 3 5 L 0 2 L -3 5 Z" fill={GOLD} />
          </g>

          {/* Scale */}
          <g transform="translate(820, 332)">
            <line x1="0" y1="0" x2="80" y2="0" stroke={PARCH} strokeWidth="0.8" />
            <line x1="0" y1="-3" x2="0" y2="3" stroke={PARCH} strokeWidth="0.8" />
            <line x1="40" y1="-3" x2="40" y2="3" stroke={PARCH} strokeWidth="0.8" />
            <line x1="80" y1="-3" x2="80" y2="3" stroke={PARCH} strokeWidth="0.8" />
            <text
              x="40"
              y="-7"
              fontSize="8"
              fill={PARCH}
              fontFamily="var(--f-mono)"
              textAnchor="middle"
              opacity="0.7"
            >
              100 km
            </text>
          </g>
        </svg>

        {/* Layer toggles */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            width: 196,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: 9,
              letterSpacing: '0.18em',
              color: 'rgba(244,237,216,0.5)',
              marginBottom: 2,
            }}
          >
            LAYER
          </div>
          {LAYERS.map((l) => {
            const on = activeLayer === l.id;
            return (
              <div
                key={l.id}
                onClick={() => setActiveLayer(l.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 10px',
                  background: on ? PARCH : 'rgba(244,237,216,0.06)',
                  border: on ? `1px solid ${PARCH}` : '1px solid rgba(244,237,216,0.18)',
                  borderRadius: 'var(--r-control)',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: on ? l.accent : 'rgba(244,237,216,0.3)',
                  }}
                />
                <div style={{ flex: 1, lineHeight: 1.3 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: on ? NAVY : PARCH }}>
                    {l.label}
                  </div>
                  <div
                    style={{
                      fontSize: 9.5,
                      color: on ? 'var(--muted)' : 'rgba(244,237,216,0.45)',
                      fontFamily: 'var(--f-mono)',
                    }}
                  >
                    {l.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Severity legend */}
        <div
          style={{
            position: 'absolute',
            bottom: 14,
            left: 14,
            background: 'rgba(10,19,34,0.85)',
            border: '1px solid rgba(244,237,216,0.15)',
            borderRadius: 'var(--r-control)',
            padding: '10px 12px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: 9,
              letterSpacing: '0.18em',
              color: 'rgba(244,237,216,0.6)',
              marginBottom: 6,
            }}
          >
            SEVERITY · KLAIM AKTIF
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            {[
              { l: 'Tinggi', c: TERR, s: 16, opacity: 1.0, range: '30+ klaim' },
              { l: 'Sedang', c: GOLD, s: 12, opacity: 0.85, range: '15–29' },
              { l: 'Rendah', c: '#a0a8b4', s: 8, opacity: 0.65, range: '<15' },
            ].map((s) => (
              <div
                key={s.l}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: s.s,
                    height: s.s,
                    borderRadius: 2,
                    background: s.c,
                    opacity: s.opacity,
                  }}
                />
                <div style={{ fontSize: 10, color: PARCH, fontWeight: 500 }}>{s.l}</div>
                <div
                  style={{
                    fontSize: 9,
                    color: 'rgba(244,237,216,0.55)',
                    fontFamily: 'var(--f-mono)',
                  }}
                >
                  {s.range}
                </div>
              </div>
            ))}
          </div>
        </div>

        {sel && (
          <div
            style={{
              position: 'absolute',
              left: `${(sel.x / 950) * 100}%`,
              top: `${(sel.y / 360) * 100}%`,
              transform: 'translate(14px, -50%)',
              background: '#fff',
              color: NAVY,
              border: `2px solid ${sevColor(sel.sev)}`,
              borderRadius: 'var(--r-card)',
              padding: '12px 14px',
              minWidth: 220,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              zIndex: 5,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 15, fontWeight: 500 }}>
                {sel.name}
              </div>
              <div
                onClick={() => setSelected(null)}
                style={{
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  fontSize: 16,
                  lineHeight: 1,
                }}
              >
                ×
              </div>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 8 }}>
              {sel.kind} · severity {sel.sev}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                fontSize: 12,
              }}
            >
              <div>
                <div style={{ color: 'var(--muted)', fontSize: 10 }}>Pemicu</div>
                <div
                  style={{
                    fontFamily: 'var(--f-mono)',
                    fontWeight: 600,
                    color: sel.fired === '3/3' ? TERR : NAVY,
                  }}
                >
                  {sel.fired} fired
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: 10 }}>Klaim</div>
                <div style={{ fontWeight: 600 }}>{sel.count}</div>
              </div>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: 10 }}>Exposure</div>
                <div style={{ fontWeight: 600 }}>{sel.exposure}</div>
              </div>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: 10 }}>Status</div>
                <div
                  style={{
                    color: sel.fired === '3/3' ? TERR : GOLD,
                    fontWeight: 600,
                  }}
                >
                  {sel.fired === '3/3' ? 'siaga' : 'pantau'}
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => router.push('/klaim/STN-2026-04-1183')}
              style={{ width: '100%', marginTop: 10, justifyContent: 'center' }}
            >
              Buka klaim →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────── Right rail ───────────────────────────
const swatchSt = (c: string): CSSProperties => ({
  width: 8,
  height: 8,
  background: c,
  display: 'inline-block',
  marginRight: 6,
  verticalAlign: 'middle',
  borderRadius: 1,
});

function RightRail({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  if (!open) {
    return (
      <div
        onClick={onToggle}
        style={{
          background: '#fff',
          border: '1px solid var(--line-navy)',
          borderRadius: 'var(--r-card)',
          width: 36,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '14px 0',
          gap: 14,
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            letterSpacing: '0.18em',
            color: 'var(--muted)',
            textTransform: 'uppercase',
          }}
        >
          ‹ Iklim · Reasuransi
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div className="kpi-eyebrow">Konteks · Sinyal & Modal</div>
        <div
          onClick={onToggle}
          style={{ cursor: 'pointer', color: 'var(--muted)', fontSize: 16, lineHeight: 1 }}
        >
          ›
        </div>
      </div>

      {/* Climate signals */}
      <div className="card" style={{ padding: 14 }}>
        <div className="kpi-eyebrow" style={{ marginBottom: 10 }}>
          Sinyal Iklim · 7 hari
        </div>
        {[
          { l: 'Curah Hujan', v: '187 mm', s: 'BMKG · ekstrem', delta: '+82%', color: TERR },
          { l: 'NDVI Rerata', v: '0,58', s: 'Sentinel-2', delta: '−0,06', color: GOLD },
          { l: 'Anomali Suhu', v: '+2,1°C', s: 'BMKG · 20-th', delta: '+0,4', color: TERR },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: 10,
              alignItems: 'baseline',
              padding: '8px 0',
              borderTop: i ? '1px dashed var(--line)' : 'none',
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: NAVY, fontWeight: 500 }}>{s.l}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>{s.s}</div>
            </div>
            <div
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: 18,
                fontWeight: 400,
                color: NAVY,
              }}
            >
              {s.v}
            </div>
            <div
              style={{
                fontFamily: 'var(--f-mono)',
                fontSize: 11,
                color: s.color,
                fontWeight: 600,
              }}
            >
              {s.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Capital pool */}
      <div className="card" style={{ padding: 14 }}>
        <div className="kpi-eyebrow" style={{ marginBottom: 8 }}>
          Kapasitas Reasuransi · Q2 2026
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <div
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 28,
              fontWeight: 400,
              color: NAVY,
            }}
          >
            92%
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>tersisa · Rp 1,8 T</div>
        </div>
        <div
          style={{
            display: 'flex',
            height: 10,
            marginTop: 10,
            border: '1px solid var(--line-navy)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div style={{ width: '42%', background: NAVY }} />
          <div style={{ width: '28%', background: TERR }} />
          <div style={{ width: '18%', background: GOLD }} />
          <div style={{ width: '12%', background: EM }} />
        </div>
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            color: 'var(--muted)',
          }}
        >
          <div>
            <span style={swatchSt(NAVY)} />
            Swiss Re · 42%
          </div>
          <div>
            <span style={swatchSt(TERR)} />
            Munich Re · 28%
          </div>
          <div>
            <span style={swatchSt(GOLD)} />
            Jakarta Re · 18%
          </div>
          <div>
            <span style={swatchSt(EM)} />
            pool publik · 12%
          </div>
        </div>
        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: '1px dashed var(--line)',
            fontSize: 10.5,
            color: 'var(--muted)',
            lineHeight: 1.55,
          }}
        >
          Retro otomatis · ambang 65% · saat ini 22,7% (sehat).
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── Section 5 — Province table ───────────────────────────
type SortKey = 'name' | 'members' | 'ha' | 'claims' | 'claims30' | 'payout';

function ProvinceTable() {
  const [sortKey, setSortKey] = useState<SortKey>('claims30');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<'all' | ProvinceStatus>('all');
  const [query, setQuery] = useState('');

  let rows = [...PROVINCES];
  if (statusFilter !== 'all') rows = rows.filter((p) => p.status === statusFilter);
  if (query) rows = rows.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  rows.sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp =
      typeof av === 'string' && typeof bv === 'string'
        ? av.localeCompare(bv)
        : (av as number) - (bv as number);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const Th = ({ k, children }: { k: SortKey; children: ReactNode }) => (
    <div
      onClick={() => {
        if (sortKey === k) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        else {
          setSortKey(k);
          setSortDir('desc');
        }
      }}
      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
    >
      {children}
      {sortKey === k && (
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 9, color: NAVY }}>
          {sortDir === 'asc' ? '▲' : '▼'}
        </span>
      )}
    </div>
  );

  const statusColor = (s: ProvinceStatus) =>
    s === 'siaga' ? TERR : s === 'pantau' ? GOLD : EM;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div className="kpi-eyebrow">Rincian per Provinsi</div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 10px',
            background: '#fff',
            border: '1px solid var(--line-navy)',
            borderRadius: 'var(--r-control)',
          }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--muted)"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari provinsi…"
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 12,
              fontFamily: 'var(--f-sans)',
              width: 140,
              color: NAVY,
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            border: '1px solid var(--line-navy)',
            borderRadius: 'var(--r-control)',
            overflow: 'hidden',
          }}
        >
          {(
            [
              ['all', 'Semua'],
              ['siaga', 'Siaga'],
              ['pantau', 'Pantau'],
              ['sehat', 'Sehat'],
            ] as const
          ).map(([k, l]) => (
            <div
              key={k}
              onClick={() => setStatusFilter(k)}
              style={{
                padding: '6px 10px',
                fontSize: 11,
                fontFamily: 'var(--f-sans)',
                cursor: 'pointer',
                background: statusFilter === k ? NAVY : '#fff',
                color: statusFilter === k ? 'var(--bone)' : NAVY,
                fontWeight: statusFilter === k ? 600 : 500,
                borderRight: k === 'sehat' ? 'none' : '1px solid var(--line-navy)',
              }}
            >
              {l}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '50px 1.4fr 0.9fr 0.9fr 0.7fr 0.7fr 1.2fr 0.9fr 70px',
            padding: '10px 14px',
            background: 'var(--bone-2)',
            borderBottom: '1px solid var(--line-navy)',
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            gap: 12,
            alignItems: 'center',
            fontWeight: 600,
          }}
        >
          <div>Kode</div>
          <Th k="name">Provinsi</Th>
          <Th k="members">Anggota</Th>
          <Th k="ha">Hektare</Th>
          <Th k="claims">Klaim</Th>
          <Th k="claims30">Klaim 30h</Th>
          <Th k="payout">Pencairan</Th>
          <div>Risiko / Status</div>
          <div style={{ textAlign: 'right' }}>Aksi</div>
        </div>
        {rows.length === 0 ? (
          <div
            style={{
              padding: '32px 14px',
              textAlign: 'center',
              fontSize: 13,
              color: 'var(--muted)',
              fontFamily: 'var(--f-sans)',
            }}
          >
            Tidak ada provinsi yang cocok dengan filter.
          </div>
        ) : (
          rows.map((p, i) => (
            <div
              key={p.code}
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '50px 1.4fr 0.9fr 0.9fr 0.7fr 0.7fr 1.2fr 0.9fr 70px',
                padding: '11px 14px',
                gap: 12,
                alignItems: 'center',
                fontSize: 13,
                borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--line)',
                background: i % 2 ? 'var(--bone-2)' : '#fff',
              }}
            >
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                {p.code}
              </div>
              <div
                style={{
                  fontFamily: 'var(--f-display)',
                  fontWeight: 500,
                  fontSize: 14,
                  color: NAVY,
                }}
              >
                {p.name}
              </div>
              <div className="tnum">{p.members.toLocaleString('id-ID')}</div>
              <div className="tnum">{p.ha.toLocaleString('id-ID')} ha</div>
              <div className="tnum">{p.claims}</div>
              <div
                className="tnum"
                style={{
                  fontWeight: 600,
                  color: p.claims30 > 50 ? TERR : p.claims30 > 20 ? GOLD : NAVY,
                }}
              >
                {p.claims30}
              </div>
              <div className="tnum" style={{ fontWeight: 500, color: NAVY }}>
                {p.payout}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    height: 6,
                    background: 'var(--bone-3)',
                    position: 'relative',
                    flex: 1,
                    borderRadius: 1,
                  }}
                >
                  <div
                    style={{
                      width: `${p.risk * 100}%`,
                      height: '100%',
                      background: statusColor(p.status),
                      borderRadius: 1,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--f-mono)',
                    fontSize: 10,
                    color: statusColor(p.status),
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    minWidth: 44,
                  }}
                >
                  {p.status}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    color: NAVY,
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  buka →
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────── Section 6 — Trigger breakdown ───────────────────────────
function TriggerBreakdown() {
  const days = 30;
  const series = {
    geo: Array.from({ length: days }, (_, i) =>
      4 + Math.round(Math.sin(i * 0.4) * 3 + 4) + (i > 22 ? 18 : 0),
    ),
    peer: Array.from({ length: days }, (_, i) =>
      3 + Math.round(Math.sin(i * 0.3) * 2 + 3) + (i > 22 ? 14 : 0),
    ),
    pranata: Array.from({ length: days }, (_, i) =>
      5 + Math.round(Math.cos(i * 0.5) * 2 + 3) + (i > 22 ? 11 : 0),
    ),
  };
  const max = Math.max(...series.geo, ...series.peer, ...series.pranata);

  return (
    <div>
      <div className="kpi-eyebrow" style={{ marginBottom: 8 }}>
        Pemicu yang Terpicu · 30 hari · ringkasan deskriptif
      </div>
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 28, marginBottom: 12 }}>
          {(
            [
              ['Geospasial', EM, series.geo],
              ['Atestasi', TERR, series.peer],
              ['Pranata Mangsa', GOLD, series.pranata],
            ] as const
          ).map(([l, c, s], i) => {
            const total = s.reduce((a, b) => a + b, 0);
            return (
              <div key={i} style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11,
                    color: 'var(--muted)',
                  }}
                >
                  <span style={{ width: 8, height: 8, background: c }} />
                  {l}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--f-display)',
                    fontSize: 24,
                    fontWeight: 400,
                    color: NAVY,
                    marginTop: 2,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {total}
                </div>
              </div>
            );
          })}
        </div>

        <svg
          viewBox="0 0 600 100"
          preserveAspectRatio="none"
          style={{ width: '100%', height: 100 }}
        >
          {(Object.entries(series) as Array<[keyof typeof series, number[]]>).map(
            ([k, s]) => {
              const c = k === 'geo' ? EM : k === 'peer' ? TERR : GOLD;
              const path = s
                .map((v, i) => {
                  const x = (i / (days - 1)) * 600;
                  const y = 100 - (v / max) * 92;
                  return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
                })
                .join(' ');
              return <path key={k} d={path} fill="none" stroke={c} strokeWidth="1.6" />;
            },
          )}
          <line x1="0" y1="99" x2="600" y2="99" stroke="var(--line-2)" strokeWidth="0.4" />
          <line
            x1="452"
            y1="0"
            x2="452"
            y2="100"
            stroke={TERR}
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
          <text x="456" y="9" fontSize="7" fontFamily="var(--f-mono)" fill={TERR}>
            curah hujan ekstrem · 19 Apr
          </text>
        </svg>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--f-mono)',
            fontSize: 9.5,
            color: 'var(--muted)',
            marginTop: 4,
          }}
        >
          <span>5 Apr</span>
          <span>15 Apr</span>
          <span>25 Apr</span>
          <span>5 Mei</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── Page ───────────────────────────
export function AdminDashboard({ density = 'comfortable' }: { density?: 'comfortable' | 'compact' }) {
  const [railOpen, setRailOpen] = useState(true);
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: 'var(--bone)',
        color: NAVY,
        fontFamily: 'var(--f-sans)',
        display: 'flex',
        flexDirection: 'column',
      }}
      data-density={density}
    >
      <UnifiedHeader
        scope={['Pusat Nasional', 'Pulau Jawa', 'Musim Tanam Apr–Jul 2026']}
        user={{
          name: 'Dr. Anindya Wirawan',
          org: 'Kementerian Pertanian',
          role: 'Direktur',
          initials: 'AW',
        }}
        accent={NAVY}
      />

      <div style={{ flex: 1 }}>
        <ActionQueue />
        <KpiStrip />
        <FilterStrip />

        <div
          style={{
            padding: '20px 28px',
            display: 'grid',
            gridTemplateColumns: railOpen ? '1fr 320px' : '1fr 36px',
            gap: 16,
          }}
        >
          <JavaMap />
          <RightRail open={railOpen} onToggle={() => setRailOpen(!railOpen)} />
        </div>

        <div style={{ padding: '0 28px 20px' }}>
          <ProvinceTable />
        </div>

        <div style={{ padding: '0 28px 28px' }}>
          <TriggerBreakdown />
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 3px ${EM}44; } 50% { box-shadow: 0 0 0 6px ${EM}11; } }
      `}</style>
    </div>
  );
}
