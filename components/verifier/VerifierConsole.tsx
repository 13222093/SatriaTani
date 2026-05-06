'use client';

/* Verifier Console — claim detail with 3 trigger panels.
   Single-claim view: parcel map + NDVI/SAR + peer attestation + Pranata Mangsa. */

import { useState, type CSSProperties, type ReactNode } from 'react';
import { UnifiedHeader } from '@/components/UnifiedHeader';
import { SectionHead } from '@/components/primitives/SectionHead';
import { StatCell } from '@/components/primitives/StatCell';
import { T } from '@/components/primitives/Glossary';
import { rupiah } from '@/lib/format';
import claim from '@/lib/mock-data/claim.json';
import triggersRaw from '@/lib/mock-data/triggers.json';
import auditRaw from '@/lib/mock-data/audit-trail.json';

type Voter = { v: string; n: string; ok: boolean | null; ts: string };
type Indicator = { k: string; state: 'anomali' | 'normal'; detail: string };
interface Triggers {
  geo: { name: string; fired: boolean; confidence: number; metric: string; delta: string; narr: string; sources: string[] };
  peer: { name: string; fired: boolean; confidence: number; metric: string; delta: string; narr: string; voters: Voter[] };
  pranata: { name: string; fired: boolean; confidence: number; metric: string; delta: string; narr: string; indicators: Indicator[] };
}
interface AuditEvent { t: string; who: string; what: string; hash: string }

const TRIGGERS = triggersRaw as Triggers;
const AUDIT = auditRaw as AuditEvent[];
const CLAIM = claim;

// ───────────────────── Top strip ─────────────────────

function ClaimSummaryStrip() {
  return (
    <div
      style={{
        display: 'flex',
        borderBottom: '1px solid var(--line)',
        background: 'var(--bone-2)',
      }}
    >
      <div style={{ padding: '20px 28px', borderRight: '1px solid var(--line)', minWidth: 360 }}>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--terracotta-2)',
          }}
        >
          Klaim · {CLAIM.id}
        </div>
        <div
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 26,
            fontWeight: 500,
            marginTop: 6,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}
        >
          Banjir bandang · <span style={{ color: 'var(--terracotta)' }}>{CLAIM.village}</span>, Klaten
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: 'var(--ink-3)',
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          <span>
            {CLAIM.farmerName} · <span className="mono">{CLAIM.farmerId}</span>
          </span>
          <span>
            {CLAIM.area} ha · {CLAIM.varietal}
          </span>
          <span>
            Polis <span className="mono">{CLAIM.policyId}</span>
          </span>
        </div>
      </div>

      <StatCell label="Pertanggungan" value={rupiah(CLAIM.coverage)} sub="Bundled · ACRE-style" />
      <StatCell label="Kejadian" value="19 Apr 2026" sub="BMKG · curah 187mm/24h" />
      <StatCell label="Konvergensi" value="3 / 3" accent="var(--sage-2)" sub="Pemicu terpicu" />
      <StatCell
        label="Status"
        value="Disetujui Otomatis"
        accent="var(--sage-2)"
        sub="22 Apr 06:14 WIB"
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 28px',
          gap: 10,
          background: 'var(--ink)',
          color: 'var(--bone)',
        }}
      >
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 500 }}>
          {rupiah(CLAIM.coverage)}
        </div>
        <div style={{ fontSize: 10, opacity: 0.7, lineHeight: 1.3 }}>
          Pencairan
          <br />
          terkonfirmasi
        </div>
      </div>
    </div>
  );
}

// ───────────────────── Trigger panels ─────────────────────

function TriggerHeader({
  idx,
  name,
  fired,
  conf,
}: {
  idx: number;
  name: string;
  fired: boolean;
  conf: number;
}) {
  return (
    <div
      style={{
        padding: '16px 18px',
        borderBottom: '1px solid var(--line)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: fired ? 'var(--sage-2)' : 'var(--bone-3)',
          color: fired ? 'var(--bone)' : 'var(--ink-3)',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'var(--f-display)',
          fontWeight: 600,
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        {idx}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 9.5,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--ink-3)',
          }}
        >
          Pemicu {idx}
        </div>
        <div
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 19,
            fontWeight: 500,
            marginTop: 2,
            letterSpacing: '-0.005em',
          }}
        >
          {name}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className={`chip ${fired ? 'ok' : ''}`}>
          <span className="dot" />
          {fired ? 'TERPICU' : 'TIDAK TERPICU'}
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            color: 'var(--ink-3)',
          }}
        >
          conf {(conf * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  );
}

function ParcelMap() {
  const cols = 9;
  const rows = 6;
  type Cell = { r: number; c: number; ndvi: number; flooded: boolean };
  const cells: Cell[] = [];
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ r, c, ndvi: 0.4 + rand() * 0.5, flooded: false });
    }
  }
  const highlight = new Set(['2-3', '2-4', '3-3', '3-4', '3-5', '4-4']);
  cells.forEach((c) => {
    if (highlight.has(`${c.r}-${c.c}`)) {
      c.flooded = true;
      c.ndvi = 0.22;
    }
  });

  return (
    <svg
      viewBox="0 0 540 220"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      style={{ display: 'block' }}
    >
      <rect width="540" height="220" fill="#1a2e2a" />
      <path
        d="M 0 38 C 80 60, 160 20, 260 50 S 460 80, 540 70 L 540 92 C 460 102, 360 70, 260 80 S 80 88, 0 60 Z"
        fill="#3a5e6e"
        opacity="0.6"
      />
      <path
        d="M 0 50 C 80 70, 160 30, 260 60 S 460 90, 540 80"
        stroke="#4a7a8a"
        strokeWidth="1"
        fill="none"
        opacity="0.7"
      />
      <path d="M 0 165 L 540 145" stroke="#7a6a4a" strokeWidth="1.5" fill="none" />
      <path
        d="M 0 165 L 540 145"
        stroke="#d4a84b"
        strokeWidth="0.4"
        fill="none"
        strokeDasharray="4 4"
        opacity="0.5"
      />

      {cells.map((c) => {
        const w = 540 / cols;
        const h = 220 / rows;
        const x = c.c * w + 2;
        const y = c.r * h + 2;
        const ww = w - 4;
        const hh = h - 4;
        let fill: string;
        if (c.flooded) fill = '#c4633c';
        else if (c.ndvi > 0.65) fill = '#7bc44a';
        else if (c.ndvi > 0.5) fill = '#a8c468';
        else if (c.ndvi > 0.4) fill = '#d4a84b';
        else fill = '#a08a4a';
        return <rect key={`${c.r}-${c.c}`} x={x} y={y} width={ww} height={hh} fill={fill} opacity={0.85} />;
      })}

      <rect
        x={2 * 60 + 2}
        y={2 * 36.6 + 2}
        width={3 * 60 - 4}
        height={3 * 36.6 - 4}
        fill="none"
        stroke="#f5f3ee"
        strokeWidth="1.2"
        strokeDasharray="3 3"
      />
      <rect
        x={3 * 60 + 2}
        y={3 * 36.6 + 2}
        width={3 * 60 - 4}
        height={36.6 - 4}
        fill="none"
        stroke="#f5f3ee"
        strokeWidth="1.2"
        strokeDasharray="3 3"
      />

      <g transform="translate(225, 130)">
        <circle r="14" fill="none" stroke="#f5f3ee" strokeWidth="1.5" />
        <circle r="3" fill="#f5f3ee" />
        <line x1="-22" y1="0" x2="-16" y2="0" stroke="#f5f3ee" strokeWidth="1.5" />
        <line x1="16" y1="0" x2="22" y2="0" stroke="#f5f3ee" strokeWidth="1.5" />
        <line x1="0" y1="-22" x2="0" y2="-16" stroke="#f5f3ee" strokeWidth="1.5" />
        <line x1="0" y1="16" x2="0" y2="22" stroke="#f5f3ee" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

function NdviChart() {
  const pts: number[] = [];
  for (let i = 0; i < 30; i++) {
    let v: number;
    if (i < 24) v = 0.55 + Math.sin(i * 0.6) * 0.04 + 0.16 * Math.min(1, i / 15);
    else v = 0.71 - (i - 23) * 0.1;
    v = Math.max(0.2, v);
    pts.push(v);
  }
  const W = 100;
  const H = 56;
  const path = pts
    .map((v, i) => {
      const x = (i / (pts.length - 1)) * W;
      const y = H - v * H;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
  const area = path + ` L ${W} ${H} L 0 ${H} Z`;
  const eventX = (24 / (pts.length - 1)) * W;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height: 56, marginTop: 6, background: 'var(--bone-2)' }}
    >
      <line x1="0" y1={H * 0.5} x2={W} y2={H * 0.5} stroke="var(--line-2)" strokeWidth="0.2" />
      <line
        x1="0"
        y1={H * 0.7}
        x2={W}
        y2={H * 0.7}
        stroke="var(--line-2)"
        strokeWidth="0.2"
        strokeDasharray="1 1"
      />
      <path d={area} fill="var(--sage)" opacity="0.25" />
      <path d={path} fill="none" stroke="var(--sage-2)" strokeWidth="0.8" />
      <line
        x1={eventX}
        y1="0"
        x2={eventX}
        y2={H}
        stroke="var(--terracotta)"
        strokeWidth="0.4"
        strokeDasharray="2 2"
      />
      <circle cx={eventX} cy={H - pts[24] * H} r="1.4" fill="var(--terracotta)" />
      <circle cx={W} cy={H - pts[pts.length - 1] * H} r="1.4" fill="var(--terracotta)" />
      <text x={eventX + 1} y="6" fontSize="3.5" fontFamily="var(--f-mono)" fill="var(--terracotta)">
        19 Apr
      </text>
      <text x="1" y="4.5" fontSize="3" fontFamily="var(--f-mono)" fill="var(--ink-3)">
        0.85
      </text>
      <text x="1" y={H - 1} fontSize="3" fontFamily="var(--f-mono)" fill="var(--ink-3)">
        0.20
      </text>
    </svg>
  );
}

function SarChart() {
  const pts: number[] = [];
  for (let i = 0; i < 30; i++) {
    let v = -13 + Math.sin(i * 0.4) * 0.6;
    if (i >= 24) v = -13 + (i - 23) * 1.2;
    pts.push(v);
  }
  const min = -15;
  const max = -4;
  const W = 100;
  const H = 40;
  const norm = (v: number) => H - ((v - min) / (max - min)) * H;
  const path = pts
    .map((v, i) => {
      const x = (i / (pts.length - 1)) * W;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${norm(v).toFixed(2)}`;
    })
    .join(' ');
  const eventX = (24 / (pts.length - 1)) * W;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height: 40, marginTop: 6, background: 'var(--bone-2)' }}
    >
      <line
        x1="0"
        y1={norm(-13)}
        x2={W}
        y2={norm(-13)}
        stroke="var(--line-2)"
        strokeWidth="0.2"
        strokeDasharray="1 1"
      />
      <path d={path} fill="none" stroke="var(--terracotta)" strokeWidth="0.8" />
      <line
        x1={eventX}
        y1="0"
        x2={eventX}
        y2={H}
        stroke="var(--terracotta)"
        strokeWidth="0.4"
        strokeDasharray="2 2"
      />
      <circle cx={W} cy={norm(pts[pts.length - 1])} r="1.4" fill="var(--terracotta)" />
    </svg>
  );
}

function ColorRampLegend({
  label,
  stops,
}: {
  label: string;
  stops: Array<{ c: string; v: string; d: string }>;
}) {
  const gradient = `linear-gradient(90deg, ${stops
    .map((s, i) => `${s.c} ${(i / (stops.length - 1)) * 100}%`)
    .join(', ')})`;
  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 9,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-3)',
          }}
        >
          {label}
        </div>
      </div>
      <div style={{ height: 8, background: gradient, border: '1px solid var(--line)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
        {stops.map((s, i) => (
          <div
            key={i}
            style={{
              textAlign: i === 0 ? 'left' : i === stops.length - 1 ? 'right' : 'center',
              fontSize: 10,
              lineHeight: 1.3,
            }}
          >
            <div className="mono" style={{ color: 'var(--ink-2)', fontWeight: 600 }}>
              {s.v}
            </div>
            <div style={{ color: 'var(--ink-3)', fontSize: 9.5 }}>{s.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GeoTrigger() {
  const t = TRIGGERS.geo;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TriggerHeader idx={1} name={t.name} fired={t.fired} conf={t.confidence} />

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <div
          style={{
            position: 'relative',
            height: 220,
            border: '1px solid var(--line)',
            background: '#1a2e2a',
            overflow: 'hidden',
          }}
        >
          <ParcelMap />
          <div
            style={{
              position: 'absolute',
              top: 8,
              left: 10,
              fontFamily: 'var(--f-mono)',
              fontSize: 9.5,
              color: 'var(--bone)',
              opacity: 0.85,
              letterSpacing: '0.12em',
            }}
          >
            6.9847°S · 110.5912°E · ZOOM 16
          </div>
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: 10,
              display: 'flex',
              gap: 4,
            }}
          >
            {['NDVI', 'SAR', 'RGB'].map((m, i) => (
              <span
                key={m}
                className="chip"
                style={{
                  background: i === 0 ? 'var(--gold)' : 'rgba(245,243,238,.15)',
                  color: i === 0 ? 'var(--ink)' : 'var(--bone)',
                  borderColor: 'transparent',
                }}
              >
                {m}
              </span>
            ))}
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 10,
              fontFamily: 'var(--f-mono)',
              fontSize: 9.5,
              color: 'var(--bone)',
              opacity: 0.85,
            }}
          >
            Polígon FRM-7741-0291 · 1.4 ha
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div
              style={{
                fontFamily: 'var(--f-mono)',
                fontSize: 9.5,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
              }}
            >
              <T>NDVI</T> · 90 hari · poligon petani
            </div>
            <div className="mono tnum" style={{ fontSize: 11, color: 'var(--ink)' }}>
              0.71 → <span style={{ color: 'var(--terracotta)', fontWeight: 600 }}>0.30</span>
              <span style={{ color: 'var(--terracotta)', marginLeft: 6 }}>{t.delta}</span>
            </div>
          </div>
          <NdviChart />
          <ColorRampLegend
            label="NDVI"
            stops={[
              { c: '#3a5e6e', v: '0,0', d: 'gundul · tergenang' },
              { c: '#a08a4a', v: '0,3', d: 'stres' },
              { c: '#7bc44a', v: '0,6', d: 'sehat' },
              { c: '#2e7d32', v: '0,9', d: 'lebat' },
            ]}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div
              style={{
                fontFamily: 'var(--f-mono)',
                fontSize: 9.5,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
              }}
            >
              <T>SAR</T> backscatter VV (dB)
            </div>
            <div className="mono tnum" style={{ fontSize: 11, color: 'var(--ink)' }}>
              −12.4 → <span style={{ color: 'var(--terracotta)', fontWeight: 600 }}>−6.2</span>
              <span style={{ color: 'var(--terracotta)', marginLeft: 6 }}>+6.2 dB</span>
            </div>
          </div>
          <SarChart />
          <ColorRampLegend
            label="SAR backscatter (dB)"
            stops={[
              { c: '#1a2e2a', v: '−15', d: 'kering · padat' },
              { c: '#5a8a7a', v: '−10', d: 'normal' },
              { c: '#d4a84b', v: '−8', d: 'lembab' },
              { c: '#c4633c', v: '−4', d: 'tergenang' },
            ]}
          />
        </div>

        <div style={{ fontSize: 11.5, lineHeight: 1.55, color: 'var(--ink-3)', marginTop: 'auto' }}>
          {t.narr.split(/(Sentinel-2|Sentinel-1|NDVI|SAR)/).map((s, i) => (
            <T key={i}>{s}</T>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            paddingTop: 10,
            borderTop: '1px dashed var(--line)',
          }}
        >
          {t.sources.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--f-mono)',
                fontSize: 10,
                color: 'var(--ink-3)',
              }}
            >
              <span style={{ width: 6, height: 6, background: 'var(--sage-2)' }} />
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VillageMap() {
  return (
    <svg
      viewBox="0 0 320 110"
      style={{ width: '100%', background: 'var(--bone-2)', border: '1px solid var(--line)' }}
    >
      <path
        d="M 0 70 Q 80 50 160 65 T 320 60"
        stroke="var(--line-2)"
        strokeWidth="0.6"
        fill="none"
      />
      <path
        d="M 80 0 Q 120 40 100 110"
        stroke="var(--line-2)"
        strokeWidth="0.6"
        fill="none"
      />

      <circle cx="160" cy="55" r="14" fill="var(--terracotta-soft)" stroke="var(--terracotta)" strokeWidth="0.8" />
      <circle cx="160" cy="55" r="3" fill="var(--terracotta)" />
      <text x="160" y="80" fontSize="8" fontFamily="var(--f-display)" fontWeight="500" fill="var(--ink)" textAnchor="middle">
        Sidorejo
      </text>
      <text x="160" y="89" fontSize="6" fontFamily="var(--f-mono)" fill="var(--ink-3)" textAnchor="middle">
        target
      </text>

      <circle cx="60" cy="35" r="10" fill="var(--bone)" stroke="var(--ink-3)" strokeWidth="0.4" />
      <text x="60" y="22" fontSize="7" fontFamily="var(--f-display)" fill="var(--ink)" textAnchor="middle">
        Trucuk
      </text>
      {(
        [
          ['var(--sage-2)', -5, -3],
          ['var(--sage-2)', 2, -2],
          ['var(--sage-2)', 5, 4],
          ['var(--sage-2)', -3, 4],
          ['var(--gold)', 0, 0],
        ] as const
      ).map(([c, dx, dy], i) => (
        <circle key={i} cx={60 + dx * 1.5} cy={35 + dy * 1.5} r="1.6" fill={c} />
      ))}

      <circle cx="260" cy="30" r="10" fill="var(--bone)" stroke="var(--ink-3)" strokeWidth="0.4" />
      <text x="260" y="17" fontSize="7" fontFamily="var(--f-display)" fill="var(--ink)" textAnchor="middle">
        Cawas
      </text>
      {(
        [
          ['var(--sage-2)', -5, -2],
          ['var(--sage-2)', 3, -3],
          ['var(--sage-2)', 4, 3],
          ['var(--sage-2)', -3, 4],
          ['var(--gold)', 0, 0],
        ] as const
      ).map(([c, dx, dy], i) => (
        <circle key={i} cx={260 + dx * 1.5} cy={30 + dy * 1.5} r="1.6" fill={c} />
      ))}

      <circle cx="200" cy="92" r="10" fill="var(--bone)" stroke="var(--ink-3)" strokeWidth="0.4" />
      <text x="200" y="106" fontSize="7" fontFamily="var(--f-display)" fill="var(--ink)" textAnchor="middle">
        Bayat
      </text>
      {(
        [
          ['var(--sage-2)', -4, -3],
          ['var(--terracotta)', 3, -3],
          ['var(--sage-2)', 4, 3],
          ['var(--sage-2)', -4, 3],
        ] as const
      ).map(([c, dx, dy], i) => (
        <circle key={i} cx={200 + dx * 1.5} cy={92 + dy * 1.5} r="1.6" fill={c} />
      ))}

      <line x1="70" y1="40" x2="148" y2="50" stroke="var(--ink-3)" strokeWidth="0.3" strokeDasharray="2 1" />
      <line x1="250" y1="35" x2="172" y2="50" stroke="var(--ink-3)" strokeWidth="0.3" strokeDasharray="2 1" />
      <line x1="195" y1="83" x2="165" y2="65" stroke="var(--ink-3)" strokeWidth="0.3" strokeDasharray="2 1" />

      <text x="6" y="105" fontSize="5.5" fontFamily="var(--f-mono)" fill="var(--ink-3)">
        radius 25 km
      </text>
    </svg>
  );
}

function VRFExplainer() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ paddingTop: 10, borderTop: '1px dashed var(--line)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--sage-2)"
          strokeWidth="2.2"
          style={{ flexShrink: 0, marginTop: 2 }}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
        <div style={{ flex: 1, fontSize: 12, lineHeight: 1.55, color: 'var(--ink-2)' }}>
          <strong style={{ fontWeight: 600 }}>Pemilihan acak terverifikasi.</strong> 14 saksi dari 3
          desa tetangga dipilih sistem secara acak yang dapat dibuktikan — petani, koperasi, atau
          verifier tidak dapat memilih siapa yang menjadi saksi.
        </div>
      </div>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          marginTop: 8,
          marginLeft: 22,
          fontFamily: 'var(--f-mono)',
          fontSize: 10,
          letterSpacing: '0.08em',
          color: 'var(--terracotta-2)',
          fontWeight: 600,
          cursor: 'pointer',
          textTransform: 'uppercase',
        }}
      >
        {open ? '▾' : '▸'} Detail teknis
      </div>
      {open && (
        <div
          style={{
            marginTop: 8,
            marginLeft: 22,
            padding: '10px 12px',
            background: 'var(--bone-2)',
            border: '1px solid var(--line)',
            fontFamily: 'var(--f-mono)',
            fontSize: 10.5,
            lineHeight: 1.65,
            color: 'var(--ink-3)',
          }}
        >
          <div>
            <span style={{ color: 'var(--ink-2)' }}>algoritma:</span> Fisher-Yates shuffle dengan benih VRF
          </div>
          <div>
            <span style={{ color: 'var(--ink-2)' }}>vrf_proof:</span> 0xc8d2…07 · diverifikasi on-chain
          </div>
          <div>
            <span style={{ color: 'var(--ink-2)' }}>kandidat:</span> registry petani aktif, radius 25 km
          </div>
          <div>
            <span style={{ color: 'var(--ink-2)' }}>ekslusi:</span> kerabat tingkat-1 ({'<'}25% kemiripan
            nama keluarga)
          </div>
          <div>
            <span style={{ color: 'var(--ink-2)' }}>ukuran sampel:</span> 14 saksi · ambang min 9 (64,3%)
          </div>
        </div>
      )}
    </div>
  );
}

function PeerTrigger() {
  const t = TRIGGERS.peer;
  const yes = t.voters.filter((v) => v.ok === true).length;
  const no = t.voters.filter((v) => v.ok === false).length;
  const pending = t.voters.filter((v) => v.ok === null).length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TriggerHeader idx={2} name={t.name} fired={t.fired} conf={t.confidence} />

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 12,
            paddingBottom: 12,
            borderBottom: '1px solid var(--line)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 56,
              lineHeight: 0.9,
              fontWeight: 500,
              color: 'var(--sage-2)',
            }}
          >
            11
          </div>
          <div
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 28,
              color: 'var(--ink-3)',
              fontWeight: 400,
            }}
          >
            / 14
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div className="mono" style={{ fontSize: 9.5, letterSpacing: '0.16em', color: 'var(--ink-3)' }}>
              AMBANG MIN
            </div>
            <div className="serif" style={{ fontSize: 16, fontWeight: 500 }}>
              9 / 14
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', height: 10, background: 'var(--bone-3)', position: 'relative' }}>
          <div style={{ width: `${(yes / 14) * 100}%`, background: 'var(--sage-2)' }} />
          <div style={{ width: `${(no / 14) * 100}%`, background: 'var(--terracotta)' }} />
          <div style={{ width: `${(pending / 14) * 100}%`, background: 'var(--gold)' }} />
          <div
            style={{
              position: 'absolute',
              left: `${(9 / 14) * 100}%`,
              top: -3,
              bottom: -3,
              width: 1,
              background: 'var(--ink)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: `${(9 / 14) * 100}%`,
              top: -14,
              fontFamily: 'var(--f-mono)',
              fontSize: 9,
              transform: 'translateX(-50%)',
            }}
          >
            9
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--ink-3)' }}>
          <span>
            <span style={{ width: 8, height: 8, background: 'var(--sage-2)', display: 'inline-block', marginRight: 4 }} />
            setuju · {yes}
          </span>
          <span>
            <span style={{ width: 8, height: 8, background: 'var(--terracotta)', display: 'inline-block', marginRight: 4 }} />
            menolak · {no}
          </span>
          <span>
            <span style={{ width: 8, height: 8, background: 'var(--gold)', display: 'inline-block', marginRight: 4 }} />
            tdk merespons · {pending}
          </span>
        </div>

        <div style={{ marginTop: 4 }}>
          <div
            className="mono"
            style={{
              fontSize: 9.5,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--ink-3)',
              marginBottom: 6,
            }}
          >
            Distribusi Antar-Desa
          </div>
          <VillageMap />
        </div>

        <div style={{ marginTop: 4, flex: 1, minHeight: 0 }}>
          <div
            className="mono"
            style={{
              fontSize: 9.5,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--ink-3)',
              marginBottom: 6,
            }}
          >
            Catatan Atestasi · ditandatangani
          </div>
          <div style={{ border: '1px solid var(--line)', maxHeight: 230, overflowY: 'auto' }}>
            {t.voters.map((v, i) => (
              <div
                key={i}
                className="row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '7px 10px',
                  borderBottom: i === t.voters.length - 1 ? 'none' : '1px solid var(--line)',
                  fontSize: 12,
                  background: i % 2 ? 'var(--bone-2)' : 'transparent',
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    marginRight: 8,
                    background:
                      v.ok === true
                        ? 'var(--sage-2)'
                        : v.ok === false
                          ? 'var(--terracotta)'
                          : 'var(--gold)',
                  }}
                />
                <span
                  style={{
                    width: 70,
                    fontFamily: 'var(--f-mono)',
                    fontSize: 10.5,
                    color: 'var(--ink-3)',
                  }}
                >
                  {v.v}
                </span>
                <span style={{ flex: 1, fontWeight: 500 }}>{v.n}</span>
                <span className="mono tnum" style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>
                  {v.ts}
                </span>
                <span
                  style={{
                    marginLeft: 10,
                    fontSize: 10.5,
                    fontWeight: 500,
                    color:
                      v.ok === true
                        ? 'var(--sage-2)'
                        : v.ok === false
                          ? 'var(--terracotta)'
                          : 'var(--gold-2)',
                  }}
                >
                  {v.ok === true ? 'setuju' : v.ok === false ? 'menolak' : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 11.5, lineHeight: 1.55, color: 'var(--ink-3)', marginTop: 'auto' }}>
          {t.narr}
        </div>

        <VRFExplainer />
      </div>
    </div>
  );
}

function MangsaWheel() {
  const names = [
    'Kasa', 'Karo', 'Katelu', 'Kapat', 'Kalima', 'Kanem',
    'Kapitu', 'Kawolu', 'Kasanga', 'Kadasa', 'Dhesta', 'Sadha',
  ];
  const active = 5;
  const cx = 110;
  const cy = 110;
  const r = 90;
  const ir = 56;
  type Arc = { d: string; name: string; isActive: boolean; isPast: boolean; mid: number };
  const arcs: Arc[] = [];
  for (let i = 0; i < 12; i++) {
    const a0 = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / 12) * Math.PI * 2 - Math.PI / 2;
    const x0 = cx + Math.cos(a0) * r;
    const y0 = cy + Math.sin(a0) * r;
    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + Math.sin(a1) * r;
    const x0i = cx + Math.cos(a0) * ir;
    const y0i = cy + Math.sin(a0) * ir;
    const x1i = cx + Math.cos(a1) * ir;
    const y1i = cy + Math.sin(a1) * ir;
    const d = `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L ${x1i} ${y1i} A ${ir} ${ir} 0 0 0 ${x0i} ${y0i} Z`;
    arcs.push({ d, name: names[i], isActive: i === active, isPast: i < active, mid: (a0 + a1) / 2 });
  }
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'center', padding: 6 }}>
      <svg viewBox="0 0 220 220" width="170" height="170">
        {arcs.map((a, i) => (
          <path
            key={i}
            d={a.d}
            fill={a.isActive ? 'var(--terracotta)' : a.isPast ? 'var(--sage-soft)' : 'var(--bone-2)'}
            stroke="var(--bone)"
            strokeWidth="0.8"
          />
        ))}
        {arcs.map((a, i) => {
          const tr = (90 + 56) / 2;
          const tx = 110 + Math.cos(a.mid) * tr;
          const ty = 110 + Math.sin(a.mid) * tr;
          return (
            <text
              key={`t${i}`}
              x={tx}
              y={ty}
              fontSize="8.5"
              fontFamily="var(--f-display)"
              fontWeight="500"
              fill={a.isActive ? 'var(--bone)' : 'var(--ink)'}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {a.name}
            </text>
          );
        })}
        <circle cx="110" cy="110" r="50" fill="var(--bone)" />
        <text x="110" y="100" fontSize="7" fontFamily="var(--f-mono)" fill="var(--ink-3)" textAnchor="middle" letterSpacing="1">
          PRANATA
        </text>
        <text x="110" y="113" fontSize="7" fontFamily="var(--f-mono)" fill="var(--ink-3)" textAnchor="middle" letterSpacing="1">
          MANGSA
        </text>
        <text
          x="110"
          y="128"
          fontSize="9"
          fontFamily="var(--f-display)"
          fontWeight="600"
          fill="var(--terracotta)"
          textAnchor="middle"
        >
          VI · Kanem
        </text>
      </svg>
      <div style={{ fontSize: 11, color: 'var(--ink-3)', maxWidth: 180, lineHeight: 1.5 }}>
        Kalender Jawa abad ke-10. Setiap mangsa ≈ 23–43 hari, ditandai oleh perilaku bio-indikator.
        Anomali = sinyal iklim ekstrem.
      </div>
    </div>
  );
}

function BioGlyph({ kind, anomaly }: { kind: string; anomaly: boolean }) {
  const c = anomaly ? 'var(--terracotta)' : 'var(--sage-2)';
  const bg = anomaly ? 'var(--terracotta-soft)' : 'var(--sage-soft)';
  const k = kind.toLowerCase();
  let glyph: ReactNode;
  if (k.includes('laron')) {
    glyph = (
      <g>
        <ellipse cx="14" cy="14" rx="2" ry="6" fill={c} />
        <ellipse cx="11" cy="13" rx="3.5" ry="1.5" fill={c} opacity="0.6" />
        <ellipse cx="17" cy="13" rx="3.5" ry="1.5" fill={c} opacity="0.6" />
      </g>
    );
  } else if (k.includes('randu')) {
    glyph = (
      <g>
        <circle cx="14" cy="9" r="2.5" fill={c} />
        <circle cx="11" cy="12" r="2" fill={c} />
        <circle cx="17" cy="12" r="2" fill={c} />
        <line x1="14" y1="11" x2="14" y2="20" stroke={c} strokeWidth="1.4" />
      </g>
    );
  } else if (k.includes('embun')) {
    glyph = (
      <g>
        <path d="M 14 6 Q 18 13 14 17 Q 10 13 14 6 Z" fill={c} />
      </g>
    );
  } else if (k.includes('suhu')) {
    glyph = (
      <g>
        <rect x="13" y="6" width="2" height="11" fill={c} />
        <circle cx="14" cy="19" r="3" fill={c} />
      </g>
    );
  } else {
    glyph = (
      <g>
        <path d="M 8 16 Q 12 8 14 14 Q 16 8 20 16" fill="none" stroke={c} strokeWidth="1.4" />
        <circle cx="14" cy="11" r="1" fill={c} />
      </g>
    );
  }
  return (
    <div style={{ width: 28, height: 28, background: bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
      <svg width="28" height="28" viewBox="0 0 28 28">
        {glyph}
      </svg>
    </div>
  );
}

function PranataTrigger() {
  const t = TRIGGERS.pranata;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TriggerHeader idx={3} name={t.name} fired={t.fired} conf={t.confidence} />

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <MangsaWheel />

        <div>
          <div
            className="mono"
            style={{
              fontSize: 9.5,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--ink-3)',
              marginBottom: 6,
            }}
          >
            Periode aktif · <T>Mangsa Kanem</T>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5 }}>
            9 Nov 2025 – 21 Des 2025 · musim hujan deras, petir, hama. Bio-indikator agregat dari 38 pelapor radius 25 km.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--line)' }}>
          {t.indicators.map((ind, i) => (
            <div
              key={i}
              className="row"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 12px',
                borderBottom: i === t.indicators.length - 1 ? 'none' : '1px solid var(--line)',
                background: ind.state === 'anomali' ? 'rgba(196,99,60,0.05)' : 'transparent',
              }}
            >
              <BioGlyph kind={ind.k} anomaly={ind.state === 'anomali'} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 13 }}>
                  {ind.k.includes('laron') ? (
                    <>
                      <T>laron</T> · kemunculan
                    </>
                  ) : ind.k.includes('randu') ? (
                    <>
                      pembungaan <T>randu</T>
                    </>
                  ) : ind.k.includes('embun') ? (
                    <>
                      <T>embun</T> pagi
                    </>
                  ) : (
                    ind.k
                  )}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{ind.detail}</div>
              </div>
              <span className={`chip ${ind.state === 'anomali' ? 'fire' : 'ok'}`}>
                <span className="dot" />
                {ind.state === 'anomali' ? 'anomali' : 'sesuai'}
              </span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11.5, lineHeight: 1.55, color: 'var(--ink-3)', marginTop: 'auto' }}>
          {t.narr}
        </div>

        <div
          style={{
            padding: '8px 12px',
            background: 'var(--terracotta-soft)',
            border: '1px solid var(--terracotta)',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--terracotta-2)',
              letterSpacing: '0.08em',
            }}
          >
            AMBANG
          </span>
          <span style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.4 }}>
            ≥3 dari 5 indikator menunjukkan anomali → pemicu aktif. Saat ini <strong>4/5</strong>.
          </span>
        </div>

        <div
          style={{
            paddingTop: 10,
            borderTop: '1px dashed var(--line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>
            38 pelapor · 142 observasi · 7 hari terakhir
          </div>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--terracotta-2)', cursor: 'pointer' }}>
            Lihat semua observasi →
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────── Decision strip + audit trail ─────────────────────

function ConvergenceMark() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="32" cy="32" r="22" fill="var(--sage-2)" opacity="0.7" />
      <circle cx="48" cy="32" r="22" fill="var(--terracotta)" opacity="0.7" />
      <circle cx="40" cy="50" r="22" fill="var(--gold)" opacity="0.7" />
      <text x="40" y="44" fontSize="13" fontFamily="var(--f-display)" fontWeight="700" fill="var(--bone)" textAnchor="middle">
        3/3
      </text>
    </svg>
  );
}

function DecisionStrip() {
  return (
    <div
      style={{
        display: 'flex',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
        background: 'var(--ink)',
        color: 'var(--bone)',
      }}
    >
      <div
        style={{
          width: 360,
          padding: '20px 24px',
          borderRight: '1px solid #2a423d',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <ConvergenceMark />
        <div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold)' }}>
            KONVERGENSI 3-DARI-3
          </div>
          <div
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 22,
              fontWeight: 500,
              marginTop: 4,
              lineHeight: 1.1,
            }}
          >
            Pencairan disetujui
            <br />
            secara otomatis
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          borderRight: '1px solid #2a423d',
        }}
      >
        <div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--muted-2)' }}>
            JUMLAH PENCAIRAN
          </div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 36, fontWeight: 500, marginTop: 2 }}>
            {rupiah(CLAIM.coverage)}
          </div>
        </div>
        <div style={{ width: 1, height: 50, background: '#2a423d' }} />
        <div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--muted-2)' }}>
            PENERIMA
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{CLAIM.farmerName}</div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--muted-2)' }}>
            {CLAIM.bankAccount}
          </div>
        </div>
        <div style={{ width: 1, height: 50, background: '#2a423d' }} />
        <div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--muted-2)' }}>
            WAKTU PROSES
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{CLAIM.processingTime}</div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--muted-2)' }}>
            {CLAIM.autpComparison}
          </div>
        </div>
      </div>

      <div
        style={{
          width: 320,
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--muted-2)' }}>
          HASH KEPUTUSAN
        </div>
        <div className="mono" style={{ fontSize: 13, marginTop: 4, color: 'var(--gold)' }}>
          {CLAIM.block}
        </div>
        <div style={{ fontSize: 11, marginTop: 6, color: 'var(--muted-2)' }}>
          Dapat diverifikasi publik · Polygon Mainnet
        </div>
      </div>
    </div>
  );
}

function ScenarioMatrix() {
  const scenarios = [
    {
      conv: '3/3',
      label: 'Konvergensi penuh',
      outcome: 'Pencairan otomatis',
      detail: 'Rp 9.240.000 · langsung ke rekening',
      color: 'var(--sage-2)',
      active: true,
      bg: 'var(--sage-soft)',
    },
    {
      conv: '2/3',
      label: 'Sebagian terpicu',
      outcome: 'Review manual oleh asuransi',
      detail: 'Verifier wilayah meninjau bukti dalam 5 hari',
      color: 'var(--gold-2)',
      active: false,
      bg: 'var(--gold-soft)',
    },
    {
      conv: '1/3',
      label: 'Sinyal tunggal',
      outcome: 'Tidak terpicu',
      detail: 'Polis tetap aktif · pemantauan dilanjutkan',
      color: 'var(--ink-3)',
      active: false,
      bg: 'var(--bone-2)',
    },
    {
      conv: '0/3',
      label: 'Tidak ada anomali',
      outcome: 'Musim normal',
      detail: 'Tidak ada peristiwa yang dipicu musim ini',
      color: 'var(--ink-3)',
      active: false,
      bg: 'var(--bone-2)',
    },
  ];
  return (
    <div style={{ padding: '0 28px' }}>
      <div
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--ink-3)',
          marginBottom: 8,
        }}
      >
        Logika Keputusan · jika konvergensi berbeda
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          border: '1px solid var(--line)',
          background: 'var(--bone)',
        }}
      >
        {scenarios.map((s, i) => (
          <div
            key={s.conv}
            style={{
              padding: '14px 16px',
              borderRight: i < scenarios.length - 1 ? '1px solid var(--line)' : 'none',
              background: s.active ? s.bg : 'transparent',
              borderTop: s.active ? `3px solid ${s.color}` : '3px solid transparent',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--f-display)',
                  fontSize: 22,
                  fontWeight: 600,
                  color: s.active ? s.color : 'var(--ink-3)',
                  letterSpacing: '-0.01em',
                }}
              >
                {s.conv}
              </div>
              {s.active && (
                <span
                  style={{
                    fontFamily: 'var(--f-mono)',
                    fontSize: 9,
                    letterSpacing: '0.12em',
                    fontWeight: 700,
                    color: 'var(--bone)',
                    background: s.color,
                    padding: '2px 6px',
                  }}
                >
                  SAAT INI
                </span>
              )}
            </div>
            <div
              style={{
                fontFamily: 'var(--f-mono)',
                fontSize: 9.5,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: s.active ? 600 : 500,
                color: s.active ? 'var(--ink)' : 'var(--ink-2)',
                marginTop: 6,
              }}
            >
              {s.outcome}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4, lineHeight: 1.45 }}>
              {s.detail}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SourceBadge({ kind }: { kind: string }) {
  const map: Record<string, { c: string; bg: string }> = {
    BMKG: { c: '#1f5d4c', bg: '#e7f3ee' },
    'Sentinel-1': { c: '#3d6a8f', bg: '#e6eef5' },
    'Sentinel-2': { c: '#3d6a8f', bg: '#e6eef5' },
    Protokol: { c: 'var(--terracotta-2)', bg: 'var(--terracotta-soft)' },
    Polygon: { c: '#5a3a8a', bg: '#ece6f5' },
    VRF: { c: '#5a3a8a', bg: '#ece6f5' },
    Mangsa: { c: '#7a5a14', bg: 'var(--gold-soft)' },
  };
  const s = map[kind] || { c: 'var(--ink-2)', bg: 'var(--bone-2)' };
  return (
    <span
      style={{
        fontFamily: 'var(--f-mono)',
        fontSize: 9.5,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        fontWeight: 700,
        color: s.c,
        background: s.bg,
        padding: '3px 7px',
        borderRadius: 2,
      }}
    >
      {kind}
    </span>
  );
}

function badgeForActor(who: string): string {
  const w = (who || '').toLowerCase();
  if (w.includes('bmkg')) return 'BMKG';
  if (w.includes('sentinel') || w.includes('sat')) return 'Sentinel-1';
  if (w.includes('mangsa') || w.includes('pranata') || w.includes('observ')) return 'Mangsa';
  if (w.includes('polygon') || w.includes('chain') || w.includes('block')) return 'Polygon';
  if (w.includes('vrf') || w.includes('atestasi') || w.includes('peer')) return 'VRF';
  return 'Protokol';
}

const btnPrimary: CSSProperties = {
  background: 'var(--ink)',
  color: 'var(--bone)',
  border: '1px solid var(--ink)',
  padding: '7px 14px',
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.02em',
  borderRadius: 2,
};
const btnGhost: CSSProperties = {
  background: 'transparent',
  color: 'var(--ink)',
  border: '1px solid var(--line-2)',
  padding: '7px 14px',
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.02em',
  borderRadius: 2,
};

function AuditTrail() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ padding: '16px 28px 24px' }}>
      <SectionHead
        eyebrow="Jejak Audit Publik"
        title="Setiap keputusan dapat diverifikasi"
        sub="Setiap evaluasi pemicu dan tindakan protokol ditandatangani secara kriptografis dan dipublikasikan ke mainnet — bisa diaudit oleh siapapun."
        right={
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={btnGhost}>Salin URL audit</button>
            <button style={btnPrimary}>Lihat di Polygonscan</button>
          </div>
        }
      />

      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: 8,
            top: 6,
            bottom: 6,
            width: 2,
            background:
              'linear-gradient(180deg, var(--sage-2) 0%, var(--sage-2) 70%, var(--terracotta) 100%)',
            opacity: 0.35,
          }}
        />
        {AUDIT.map((a, i) => {
          const isLast = i === AUDIT.length - 1;
          const dotColor = isLast ? 'var(--terracotta)' : 'var(--sage-2)';
          const badge = badgeForActor(a.who);
          return (
            <div
              key={i}
              style={{ position: 'relative', paddingLeft: 32, paddingTop: i ? 10 : 0, paddingBottom: 10 }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 2,
                  top: i ? 22 : 12,
                  width: 13,
                  height: 13,
                  background: dotColor,
                  border: '3px solid var(--bone)',
                  borderRadius: '50%',
                  boxShadow: `0 0 0 1px ${dotColor}`,
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  border: '1px solid var(--line)',
                  background: 'var(--bone)',
                  padding: '12px 14px',
                  display: 'flex',
                  gap: 14,
                  alignItems: 'center',
                  cursor: 'pointer',
                  borderLeft: `3px solid ${isLast ? 'var(--terracotta)' : 'var(--sage-2)'}`,
                }}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div className="mono tnum" style={{ fontSize: 11, color: 'var(--ink-3)', minWidth: 130 }}>
                  {a.t}
                </div>
                <SourceBadge kind={badge} />
                <div style={{ flex: 1, fontSize: 13, color: 'var(--ink)' }}>{a.what}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--terracotta-2)' }}>
                  {a.hash}
                </div>
                <span style={{ color: 'var(--ink-3)', fontSize: 11 }}>{open === i ? '▾' : '▸'}</span>
              </div>
              {open === i && (
                <div
                  style={{
                    marginTop: 0,
                    padding: '12px 16px',
                    background: 'var(--bone-2)',
                    border: '1px solid var(--line)',
                    borderTop: 0,
                    fontFamily: 'var(--f-mono)',
                    fontSize: 11,
                    lineHeight: 1.7,
                    color: 'var(--ink-3)',
                  }}
                >
                  <div>tx_hash: {a.hash}</div>
                  <div>
                    signer: 0x4f29a8…d712 ({a.who.toLowerCase()}.satriatani.eth)
                  </div>
                  <div>block: 48,291,772 · Polygon Mainnet</div>
                  <div>gas_used: 42,118</div>
                  <div>
                    payload:{' '}
                    {`{"trigger":"${a.who.toLowerCase()}","claim":"${CLAIM.id}","verdict":"signed"}`}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ───────────────────── Page ─────────────────────

export function VerifierConsole({
  density = 'comfortable',
  urlId,
}: {
  density?: 'comfortable' | 'compact';
  urlId?: string;
}) {
  // urlId is the route param /klaim/[id]; for hackathon MVP we always render
  // the hero claim data regardless of which id is in the URL. urlId stays
  // unused to make the param-passing explicit for future expansion.
  void urlId;
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: 'var(--bone)',
        color: 'var(--ink)',
        fontFamily: 'var(--f-sans)',
        display: 'flex',
        flexDirection: 'column',
      }}
      data-density={density}
    >
      <UnifiedHeader
        scope={['Konsol Verifier', 'Klaten', `Klaim ${CLAIM.id}`]}
        user={{
          name: 'Rina Pertiwi',
          org: 'OJK',
          role: 'Pengawas Wilayah III',
          initials: 'RP',
        }}
        accent="#0E1A2B"
      />
      <ClaimSummaryStrip />

      <div style={{ flex: 1 }}>
        <div style={{ padding: '20px 28px 0' }}>
          <SectionHead
            eyebrow="Mesin Triple-Trigger"
            title={<>Tiga pemicu independen, satu keputusan</>}
            sub="Setiap pemicu dievaluasi tanpa mengetahui pemicu lainnya — konvergensi adalah kondisi pencairan otomatis. Tidak ada manusia yang menyetujui atau menolak."
            right={
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={btnGhost}>Unduh berkas teknis</button>
                <button style={btnGhost}>Bagikan ke regulator</button>
              </div>
            }
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
            margin: '0 28px',
            border: '1px solid var(--line)',
            background: 'var(--bone)',
          }}
        >
          <div style={{ borderRight: '1px solid var(--line)', display: 'flex' }}>
            <GeoTrigger />
          </div>
          <div style={{ borderRight: '1px solid var(--line)', display: 'flex' }}>
            <PeerTrigger />
          </div>
          <div style={{ display: 'flex' }}>
            <PranataTrigger />
          </div>
        </div>

        <div style={{ height: 20 }} />
        <ScenarioMatrix />
        <div style={{ height: 8 }} />
        <DecisionStrip />
        <AuditTrail />
      </div>
    </div>
  );
}
