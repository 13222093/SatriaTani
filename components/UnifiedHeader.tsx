'use client';

/* Unified header — locked across Pusat, Verifier, Koperasi, Storyboard.
   Pattern: ROW1 identity+breadcrumb+status+user · ROW2 cross-surface nav · ROW3 ⌘K search.
   Row 2 changed from per-surface visual tabs to pathname-aware cross-surface
   navigation so the four product surfaces are reachable from any of them. */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, type CSSProperties } from 'react';

const NAVY = '#0E1A2B';
const PARCH = '#F4EDD8';
const TERR = '#C2502A';
const GOLD = '#B8860B';
const EM = '#1F6B3A';

export interface UnifiedHeaderUser {
  name: string;
  org: string;
  role: string;
  initials: string;
}

export interface UnifiedHeaderProps {
  scope: string[];
  user: UnifiedHeaderUser;
  accent?: string;
}

const SURFACES: Array<{ label: string; href: string; matchPrefix: string }> = [
  { label: 'Pusat Nasional', href: '/pusat-nasional', matchPrefix: '/pusat-nasional' },
  { label: 'Konsol Verifier', href: '/klaim/STN-2026-04-1183', matchPrefix: '/klaim' },
  { label: 'Dasbor Koperasi', href: '/koperasi/sidorejo-makmur', matchPrefix: '/koperasi' },
  { label: 'Storyboard', href: '/storyboard', matchPrefix: '/storyboard' },
];

function MiniLogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <rect width="32" height="32" fill={NAVY} rx="2" />
      <path d="M 16 6 L 22 16 L 16 26 L 10 16 Z" fill={GOLD} />
      <circle cx="16" cy="16" r="2" fill={NAVY} />
    </svg>
  );
}

function Breadcrumb({ parts }: { parts: string[] }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--f-mono)',
        fontSize: 10,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--muted)',
        fontWeight: 500,
      }}
    >
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && <span style={{ color: '#aab', fontWeight: 400 }}>›</span>}
          <span style={{ color: i === parts.length - 1 ? NAVY : 'var(--muted)' }}>{p}</span>
        </Fragment>
      ))}
    </div>
  );
}

function StatusPill() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        background: '#fff',
        border: `1px solid ${EM}66`,
        borderRadius: 'var(--r-control)',
        fontFamily: 'var(--f-mono)',
        fontSize: 11,
        color: 'var(--muted)',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: EM,
          boxShadow: `0 0 0 3px ${EM}22`,
        }}
      />
      <span style={{ color: NAVY, fontWeight: 500 }}>Protokol sehat</span>
      <span style={{ color: '#aab' }}>·</span>
      <span className="tnum">99,98% uptime</span>
      <span style={{ color: '#aab' }}>·</span>
      <span>30h</span>
    </div>
  );
}

function UserChip({
  name,
  org,
  role,
  initials,
  accent = NAVY,
}: UnifiedHeaderUser & { accent?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        paddingLeft: 14,
        borderLeft: '1px solid var(--line-navy)',
      }}
    >
      <div style={{ textAlign: 'right', lineHeight: 1.25 }}>
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: NAVY,
            fontFamily: 'var(--f-sans)',
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 10.5,
            color: 'var(--muted)',
            fontFamily: 'var(--f-sans)',
          }}
        >
          {org} · {role}
        </div>
      </div>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: accent,
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'var(--f-sans)',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.02em',
        }}
      >
        {initials}
      </div>
    </div>
  );
}

function SurfaceNav() {
  const pathname = usePathname() ?? '';
  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        padding: '0 28px',
        borderBottom: '1px solid var(--line-navy)',
        background: '#fff',
      }}
    >
      {SURFACES.map((s) => {
        const on = pathname.startsWith(s.matchPrefix);
        return (
          <Link
            key={s.href}
            href={s.href}
            style={{
              padding: '12px 16px',
              fontFamily: 'var(--f-sans)',
              fontSize: 13,
              fontWeight: on ? 600 : 500,
              color: on ? NAVY : 'var(--muted)',
              borderBottom: on ? `2px solid ${NAVY}` : '2px solid transparent',
              marginBottom: -1,
              cursor: 'pointer',
              letterSpacing: '0.005em',
              textDecoration: 'none',
            }}
          >
            {s.label}
          </Link>
        );
      })}
    </div>
  );
}

const kbdStyle: CSSProperties = {
  display: 'inline-grid',
  placeItems: 'center',
  minWidth: 18,
  height: 18,
  padding: '0 4px',
  background: 'var(--bone-2)',
  border: '1px solid var(--line-navy)',
  borderRadius: 3,
  fontFamily: 'var(--f-mono)',
  fontSize: 10,
  color: NAVY,
  fontWeight: 500,
};

function CmdKBar() {
  return (
    <div
      style={{
        padding: '10px 28px',
        borderBottom: '1px solid var(--line-navy)',
        background: 'var(--bone-2)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          flex: 1,
          maxWidth: 720,
          background: '#fff',
          border: '1px solid var(--line-navy)',
          borderRadius: 'var(--r-control)',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: 'var(--f-sans)',
          fontSize: 13,
          color: 'var(--muted)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span>Cari klaim, polis, koperasi, anggota, peraturan…</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <kbd style={kbdStyle}>⌘</kbd>
          <kbd style={kbdStyle}>K</kbd>
        </span>
      </div>
      <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
        <span className="chip" style={{ background: '#fff', borderColor: 'var(--line-navy)' }}>
          <span style={{ width: 6, height: 6, background: GOLD, borderRadius: '50%' }} />
          Mangsa Kanem · 28 Apr–6 Mei
        </span>
        <span className="chip" style={{ background: '#fff', borderColor: 'var(--line-navy)' }}>
          <span style={{ width: 6, height: 6, background: TERR, borderRadius: '50%' }} />
          12 hotspot aktif
        </span>
      </div>
    </div>
  );
}

export function UnifiedHeader({ scope, user, accent }: UnifiedHeaderProps) {
  return (
    <div
      style={{
        flexShrink: 0,
        background: '#fff',
        borderBottom: '1px solid var(--line-navy)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '12px 28px',
          background: '#fff',
        }}
      >
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
        >
          <MiniLogoMark size={26} />
          <div style={{ lineHeight: 1.2 }}>
            <div
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: 17,
                fontWeight: 500,
                letterSpacing: '-0.01em',
                color: NAVY,
              }}
            >
              Satria Tani
            </div>
            <div
              style={{
                fontFamily: 'var(--f-mono)',
                fontSize: 9,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
              }}
            >
              Protokol Asuransi Padi
            </div>
          </div>
        </Link>

        <div style={{ width: 1, height: 28, background: 'var(--line-navy)' }} />
        <Breadcrumb parts={scope} />

        <div style={{ flex: 1 }} />

        <StatusPill />
        <UserChip {...user} accent={accent} />
      </div>

      <SurfaceNav />
      <CmdKBar />
    </div>
  );
}
