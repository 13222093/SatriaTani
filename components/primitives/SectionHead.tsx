import type { ReactNode } from 'react';

export function SectionHead({
  eyebrow,
  title,
  sub,
  right,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--line)',
        padding: '0 0 14px 0',
        marginBottom: 18,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--terracotta-2)',
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 30,
            lineHeight: 1.1,
            fontWeight: 500,
            marginTop: 6,
            color: 'var(--ink)',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </div>
        {sub ? (
          <div style={{ marginTop: 6, color: 'var(--ink-3)', fontSize: 13 }}>{sub}</div>
        ) : null}
      </div>
      {right}
    </div>
  );
}
