import type { ReactNode } from 'react';

export function StatCell({
  label,
  value,
  sub,
  accent,
}: {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  accent?: string;
}) {
  return (
    <div style={{ flex: 1, padding: '14px 16px', borderRight: '1px solid var(--line)' }}>
      <div
        style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 10,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--ink-3)',
        }}
      >
        {label}
      </div>
      <div
        className="serif tnum"
        style={{
          fontWeight: 500,
          marginTop: 6,
          color: accent || 'var(--ink)',
          fontSize: '24px',
        }}
      >
        {value}
      </div>
      {sub ? (
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>
      ) : null}
    </div>
  );
}
