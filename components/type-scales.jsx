/* Typography scale exploration — 3 alternatives for unified header system */

const TYPE_SCALES = [
  {
    id: 'A',
    name: 'Editorial Institutional',
    sub: 'Fraunces display + Inter UI · generous · for executive readers',
    display: 'Fraunces',
    sans: 'Inter',
    mono: 'IBM Plex Mono',
    scale: {
      'KPI big number': { size: 36, weight: 500, family: 'Fraunces', lh: 1.0, ls: '-0.015em' },
      'Page title':     { size: 28, weight: 500, family: 'Fraunces', lh: 1.05, ls: '-0.01em' },
      'Section title':  { size: 18, weight: 600, family: 'Inter',    lh: 1.2,  ls: '-0.005em' },
      'Body':           { size: 14, weight: 400, family: 'Inter',    lh: 1.55, ls: '0' },
      'Body small':     { size: 12, weight: 400, family: 'Inter',    lh: 1.5,  ls: '0' },
      'Eyebrow / label':{ size: 10, weight: 500, family: 'IBM Plex Mono', lh: 1.3, ls: '0.16em', upper: true },
      'Tabular data':   { size: 13, weight: 400, family: 'IBM Plex Mono', lh: 1.4, ls: '0' },
    },
  },
  {
    id: 'B',
    name: 'Technical Console',
    sub: 'Plex Sans + Plex Mono · dense · for verifiers and operators',
    display: 'IBM Plex Sans',
    sans: 'IBM Plex Sans',
    mono: 'IBM Plex Mono',
    scale: {
      'KPI big number': { size: 30, weight: 600, family: 'IBM Plex Sans', lh: 1.05, ls: '-0.02em' },
      'Page title':     { size: 22, weight: 600, family: 'IBM Plex Sans', lh: 1.1,  ls: '-0.01em' },
      'Section title':  { size: 15, weight: 600, family: 'IBM Plex Sans', lh: 1.25, ls: '0' },
      'Body':           { size: 13, weight: 400, family: 'IBM Plex Sans', lh: 1.5,  ls: '0' },
      'Body small':     { size: 11, weight: 400, family: 'IBM Plex Sans', lh: 1.45, ls: '0.005em' },
      'Eyebrow / label':{ size: 10, weight: 500, family: 'IBM Plex Mono', lh: 1.3,  ls: '0.14em', upper: true },
      'Tabular data':   { size: 12, weight: 400, family: 'IBM Plex Mono', lh: 1.4,  ls: '0' },
    },
  },
  {
    id: 'C',
    name: 'Civic Authority',
    sub: 'Fraunces title + Plex Sans body · government-document feel',
    display: 'Fraunces',
    sans: 'IBM Plex Sans',
    mono: 'IBM Plex Mono',
    scale: {
      'KPI big number': { size: 40, weight: 400, family: 'Fraunces', lh: 1.0,  ls: '-0.02em', italic: false, opsz: 144 },
      'Page title':     { size: 26, weight: 400, family: 'Fraunces', lh: 1.05, ls: '-0.01em', opsz: 72 },
      'Section title':  { size: 16, weight: 600, family: 'IBM Plex Sans', lh: 1.2, ls: '0' },
      'Body':           { size: 14, weight: 400, family: 'IBM Plex Sans', lh: 1.55, ls: '0' },
      'Body small':     { size: 12, weight: 400, family: 'IBM Plex Sans', lh: 1.5, ls: '0' },
      'Eyebrow / label':{ size: 10, weight: 500, family: 'IBM Plex Mono', lh: 1.3, ls: '0.18em', upper: true },
      'Tabular data':   { size: 13, weight: 400, family: 'IBM Plex Mono', lh: 1.4, ls: '0' },
    },
  },
];

const NAVY = '#0E1A2B';
const PARCH = '#F4EDD8';
const TERR = '#C2502A';
const GOLD = '#B8860B';
const EM = '#1F6B3A';

function ScaleCard({ s }) {
  return (
    <div style={{
      background: '#fff', border: `1px solid ${NAVY}22`, borderRadius: 4,
      padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 12,
        paddingBottom: 14, borderBottom: `1px solid ${NAVY}22`, marginBottom: 18,
      }}>
        <div style={{
          fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '0.18em',
          color: TERR, fontWeight: 600,
        }}>OPSI {s.id}</div>
        <div style={{ fontFamily: s.display, fontSize: 24, fontWeight: 500, letterSpacing: '-0.01em', color: NAVY }}>
          {s.name}
        </div>
      </div>
      <div style={{ fontSize: 12, color: '#5a6a73', marginBottom: 22, fontFamily: s.sans }}>
        {s.sub}
      </div>

      {/* Sample header preview */}
      <div style={{ background: PARCH, border: `1px solid ${NAVY}22`, borderRadius: 4, padding: '14px 16px', marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div style={{ width: 22, height: 22, background: NAVY, borderRadius: 2 }} />
          <div style={{ fontFamily: s.display, fontSize: 15, fontWeight: 600, letterSpacing: '-0.005em', color: NAVY }}>
            Satria Tani
          </div>
          <div style={{ width: 1, height: 18, background: `${NAVY}33` }} />
          <div style={{ fontFamily: s.mono, fontSize: 10, letterSpacing: '0.16em', color: '#5a6a73', fontWeight: 500 }}>
            PUSAT NASIONAL <span style={{ color: '#aab' }}>›</span> PULAU JAWA <span style={{ color: '#aab' }}>›</span> APR–JUL 2026
          </div>
        </div>
        <div style={{ fontFamily: s.display, fontSize: s.scale['Page title'].size, fontWeight: s.scale['Page title'].weight, lineHeight: s.scale['Page title'].lh, letterSpacing: s.scale['Page title'].ls, color: NAVY }}>
          184.220 polis aktif di enam provinsi
        </div>
      </div>

      {/* Scale table */}
      {Object.entries(s.scale).map(([role, t]) => (
        <div key={role} style={{
          display: 'grid', gridTemplateColumns: '130px 60px 1fr',
          gap: 16, alignItems: 'baseline',
          padding: '10px 0', borderBottom: `1px dashed ${NAVY}15`,
        }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5a6a73' }}>
            {role}
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#9aa6b0' }}>
            {t.size}/{t.weight}
          </div>
          <div style={{
            fontFamily: t.family, fontSize: t.size, fontWeight: t.weight,
            lineHeight: t.lh, letterSpacing: t.ls,
            textTransform: t.upper ? 'uppercase' : 'none',
            color: NAVY,
          }}>
            {t.upper ? 'Klaim aktif · 30 hari' : role === 'KPI big number' ? 'Rp 184,2 Mrd' : role === 'Page title' ? 'Konsol Verifier' : role === 'Section title' ? 'Pemicu Geospasial' : role === 'Tabular data' ? '1.207   Rp 41.840.000   2,8h' : 'Sebelas tetangga sudah memberi atestasi atas klaim banjir Sidorejo.'}
          </div>
        </div>
      ))}

      {/* Verdict line */}
      <div style={{
        marginTop: 18, paddingTop: 14, borderTop: `1px solid ${NAVY}22`,
        fontSize: 12, lineHeight: 1.55, color: '#3a4a53', fontFamily: s.sans,
      }}>
        <strong style={{ color: NAVY }}>Cocok untuk: </strong>
        {s.id === 'A' && 'audiens menteri & reasuransi · ringkasan eksekutif · cetak laporan kuartalan'}
        {s.id === 'B' && 'verifier OJK & operator koperasi · banyak kolom data · banyak interaksi per hari'}
        {s.id === 'C' && 'kombinasi dua dunia · serius seperti dokumen negara · tetap modern'}
      </div>
    </div>
  );
}

function TypeScaleExplore() {
  return (
    <div style={{
      width: '100%', minHeight: '100vh', background: '#e8e3d4',
      padding: '40px 48px', fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ maxWidth: 1640, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '0.18em', color: TERR, fontWeight: 600 }}>
            STEP 1 · TYPOGRAPHY SCALE — PILIH SATU SEBELUM MENGUNCI HEADER
          </div>
          <div style={{ fontFamily: 'Fraunces', fontSize: 38, fontWeight: 500, color: NAVY, letterSpacing: '-0.015em', marginTop: 6 }}>
            Tiga alternatif tata huruf
          </div>
          <div style={{ fontSize: 14, color: '#3a4a53', maxWidth: 760, marginTop: 8, lineHeight: 1.6 }}>
            Sebelum saya kunci sistem header/nav/breadcrumb pada ketiga permukaan,
            pilih satu skala. Pengaturan token (sudut 4px, palet semantik, hierarki tombol) akan diterapkan setelah skala ini disetujui.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {TYPE_SCALES.map(s => <ScaleCard key={s.id} s={s} />)}
        </div>

        <div style={{
          marginTop: 28, padding: '18px 22px',
          background: PARCH, border: `1px solid ${NAVY}22`, borderRadius: 4,
          fontSize: 13, lineHeight: 1.65, color: '#3a4a53',
        }}>
          <strong style={{ color: NAVY }}>Rekomendasi saya: Opsi C (Civic Authority).</strong> Fraunces yang dipakai
          hanya untuk angka besar dan judul halaman membawa wibawa dokumen kementerian; Plex Sans
          untuk seluruh body & nav membuat tampilan padat-data tetap dapat dibaca; Plex Mono untuk eyebrow
          & data tabular menegaskan ini adalah konsol kerja, bukan brosur. Cocok untuk semua tiga permukaan
          tanpa harus menukar font per peran pengguna.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TypeScaleExplore });
