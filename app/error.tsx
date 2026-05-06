'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error to console for debugging.
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bone)',
        color: 'var(--ink)',
        fontFamily: 'var(--f-sans)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
      }}
    >
      <div
        style={{
          maxWidth: 520,
          padding: '32px 36px',
          background: '#fff',
          border: '1px solid var(--line-navy)',
          borderRadius: 'var(--r-card)',
          borderLeft: '3px solid var(--terracotta)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--terracotta-2)',
          }}
        >
          Terjadi galat
        </div>
        <div
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 26,
            fontWeight: 500,
            marginTop: 6,
            letterSpacing: '-0.01em',
          }}
        >
          Halaman ini tidak dapat dimuat.
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.55 }}>
          Coba muat ulang. Jika masalah berlanjut, hubungi tim pengembang dengan kode galat di
          bawah.
        </div>
        {error.digest && (
          <div
            className="mono"
            style={{
              marginTop: 12,
              padding: '8px 10px',
              background: 'var(--bone-2)',
              border: '1px solid var(--line)',
              fontSize: 11,
              color: 'var(--ink-3)',
            }}
          >
            digest: {error.digest}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={reset} className="btn btn-primary btn-sm">
            Muat ulang
          </button>
          <a href="/" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
            Kembali ke beranda
          </a>
        </div>
      </div>
    </div>
  );
}
