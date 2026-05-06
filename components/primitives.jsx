/* Satria Tani — Shared primitives & sample data */

const COPY = {
  id: {
    appName: 'Satria Tani',
    tagline: 'Asuransi Padi Parametrik · Triple-Trigger',
    verifier: 'Konsol Verifier',
    coop: 'Dasbor Koperasi',
    farmer: 'Lapor Mangsa',
    activeClaims: 'Klaim Aktif',
    underReview: 'Dalam Verifikasi',
    paid: 'Telah Dibayar',
    rejected: 'Ditolak',
    triggers: 'Pemicu',
    geospatial: 'Geospasial',
    peerAttest: 'Atestasi Antar-Desa',
    pranata: 'Pranata Mangsa',
    decision: 'Keputusan Otomatis',
    payout: 'Pencairan',
    audit: 'Jejak Audit',
    fired: 'Terpicu',
    pending: 'Menunggu',
    notFired: 'Tidak Terpicu',
    member: 'Anggota',
    farmer_label: 'Petani',
    village: 'Desa',
    district: 'Kabupaten',
    province: 'Provinsi',
    season: 'Musim Tanam',
    coverage: 'Pertanggungan',
    voucher: 'Voucher',
    distributed: 'Disalurkan',
    pending_voucher: 'Tertunda',
    payouts: 'Pencairan',
    members: 'Anggota',
    addObs: 'Tambah Pengamatan',
    submit: 'Kirim',
    photo: 'Foto',
    yourTurn: 'Giliran Anda'
  }
};

// Glossary terms for tooltip
const GLOSSARY = {
  'Pranata Mangsa': 'Traditional Javanese agricultural calendar (10th c.) — 12 seasonal periods cued by bio-indicators',
  'Mangsa Kasa': 'First mangsa (Jun 22–Aug 1) — dry transition, leaves fall',
  'Mangsa Karo': 'Second mangsa (Aug 2–Aug 24) — wells dry, mango sprouts',
  'Mangsa Katelu': 'Third mangsa (Aug 25–Sep 17) — bamboo shoots, randu blooms',
  'Mangsa Kapat': 'Fourth mangsa (Sep 18–Oct 12) — birds nest, first showers',
  'Mangsa Kalima': 'Fifth mangsa (Oct 13–Nov 8) — rains arrive, fruit ripens',
  'Mangsa Kanem': 'Sixth mangsa (Nov 9–Dec 21) — rain, lightning, pests',
  'laron': 'Termite alates — mass emergence after first heavy rain marks Mangsa Kanem',
  'randu': 'Kapok / silk-cotton tree — flowering signals dry-to-wet transition',
  'embun': 'Morning dew — pattern indicates humidity regime',
  'sawah': 'Wet rice paddy field',
  'gabah': 'Unhusked rice (paddy)',
  'subak': 'Cooperative irrigation society',
  'gotong royong': 'Mutual cooperation — communal labor tradition',
  'Sentinel-1': 'ESA radar satellite — flood detection through cloud cover',
  'Sentinel-2': 'ESA optical satellite — NDVI vegetation index',
  'NDVI': 'Normalized Difference Vegetation Index — crop health from 0 (bare) to 1 (lush)',
  'SAR': 'Synthetic Aperture Radar — backscatter signature, water vs vegetation',
  'AUTP': 'Asuransi Usaha Tani Padi — failed national rice insurance, 2.77% coverage',
  'ACRE': 'Bundled premium model — premium baked into agri-input credit',
  'Kabupaten': 'Regency — second-level administrative division',
  'Hektare': 'Hectare — 10,000 m²',
  'gabungan kelompok tani': 'Federated farmers\u0027 cooperative (Gapoktan)'
};

// Term wrap component — auto-tooltip
function T({ children }) {
  const key = String(children).trim();
  const en = GLOSSARY[key];
  if (!en) return children;
  return <span className="gl" data-en={en}>{children}</span>;
}

// ── Sample claim
const CLAIM = {
  id: 'STN-2026-04-1183',
  policyId: 'POL-JT-7741-26A',
  farmerName: 'Bapak Suparjo',
  farmerId: 'FRM-7741-0291',
  village: 'Sidorejo',
  district: 'Klaten',
  province: 'Jawa Tengah',
  area: 1.4, // ha
  varietal: 'Ciherang',
  plantedAt: '2026-01-08',
  event: 'Banjir bandang · curah hujan ekstrem',
  eventDate: '2026-04-19',
  coverage: 9_240_000, // IDR
  triggeredAt: '2026-04-22 06:14 WIB',
  block: '0xa83f…b219'
};

// 3 trigger states
const TRIGGERS = {
  geo: {
    name: 'Geospasial',
    fired: true,
    confidence: 0.94,
    metric: 'NDVI Δ',
    delta: '−0.41',
    narr: 'Sentinel-2 NDVI rata-rata pada poligon sawah turun dari 0.71 (pra-kejadian) menjadi 0.30 dalam 72 jam. Sentinel-1 SAR menunjukkan kenaikan backscatter +6.2 dB → permukaan tergenang.',
    sources: ['Sentinel-2 L2A · 2026-04-15', 'Sentinel-2 L2A · 2026-04-22', 'Sentinel-1 GRD · 2026-04-21']
  },
  peer: {
    name: 'Atestasi Antar-Desa',
    fired: true,
    confidence: 0.86,
    metric: 'Suara',
    delta: '11 / 14',
    narr: 'Empat belas petani dari desa tetangga (Trucuk, Cawas, Bayat) diundang acak. Sebelas mengonfirmasi banjir telah merendam petak Sidorejo > 48 jam. Satu menolak, dua tidak merespons dalam jendela 24 jam.',
    voters: [
    { v: 'Trucuk', n: 'Pak Wiryo', ok: true, ts: '04-21 08:12' },
    { v: 'Trucuk', n: 'Bu Sumiyem', ok: true, ts: '04-21 09:04' },
    { v: 'Cawas', n: 'Pak Karto', ok: true, ts: '04-21 09:18' },
    { v: 'Cawas', n: 'Pak Heru', ok: true, ts: '04-21 10:30' },
    { v: 'Bayat', n: 'Bu Painem', ok: true, ts: '04-21 11:02' },
    { v: 'Bayat', n: 'Pak Slamet', ok: false, ts: '04-21 11:40' },
    { v: 'Trucuk', n: 'Pak Tarno', ok: true, ts: '04-21 13:11' },
    { v: 'Cawas', n: 'Bu Tarmi', ok: true, ts: '04-21 14:00' },
    { v: 'Bayat', n: 'Pak Yatno', ok: true, ts: '04-21 15:22' },
    { v: 'Trucuk', n: 'Pak Marto', ok: true, ts: '04-21 16:08' },
    { v: 'Cawas', n: 'Bu Sri', ok: true, ts: '04-21 17:45' },
    { v: 'Bayat', n: 'Pak Joyo', ok: true, ts: '04-21 19:11' },
    { v: 'Trucuk', n: 'Bu Lasmi', ok: null, ts: '—' },
    { v: 'Cawas', n: 'Pak Bejo', ok: null, ts: '—' }]

  },
  pranata: {
    name: 'Pranata Mangsa',
    fired: true,
    confidence: 0.78,
    metric: 'Indikator',
    delta: '4 / 5',
    narr: 'Periode aktif: Mangsa Kanem (musim hujan deras). Empat dari lima bio-indikator yang dilaporkan petani dalam radius 25 km menyimpang ke arah curah hujan ekstrem: kemunculan laron massal di luar siklus, randu berbuah dini, embun pagi tebal abnormal, suhu malam +2.4°C dari rata-rata 20-tahun.',
    indicators: [
    { k: 'Kemunculan laron', state: 'anomali', detail: 'massal, di luar siklus' },
    { k: 'Pembungaan randu', state: 'anomali', detail: 'dini · 11 hari' },
    { k: 'Embun pagi', state: 'anomali', detail: 'tebal abnormal' },
    { k: 'Suhu malam', state: 'anomali', detail: '+2.4°C vs 20-th rerata' },
    { k: 'Kicau prenjak', state: 'normal', detail: 'pola sesuai mangsa' }]

  }
};

// Audit trail
const AUDIT = [
{ t: '2026-04-19 04:22', who: 'BMKG', what: 'Peringatan curah hujan ekstrem · Klaten', hash: '0x9c1a…7b04' },
{ t: '2026-04-21 02:00', who: 'Sentinel-1', what: 'Akuisisi citra SAR · pass desc', hash: '0x4d7e…aa12' },
{ t: '2026-04-21 06:30', who: 'Protokol', what: 'Trigger Geospasial dievaluasi → TERPICU', hash: '0xb22f…0918' },
{ t: '2026-04-21 08:12', who: 'Protokol', what: 'Undangan atestasi acak ke 14 petani tetangga', hash: '0x77a3…ee2c' },
{ t: '2026-04-21 19:11', who: 'Protokol', what: 'Trigger Atestasi dievaluasi → TERPICU (11/14)', hash: '0xe091…3344' },
{ t: '2026-04-22 05:30', who: 'Protokol', what: 'Bio-indikator agregat dievaluasi → TERPICU (4/5)', hash: '0x12ba…f0d1' },
{ t: '2026-04-22 06:14', who: 'Protokol', what: 'Konvergensi 3-dari-3 · Pencairan disetujui', hash: '0xa83f…b219' },
{ t: '2026-04-22 06:18', who: 'Bank Mandiri', what: 'Transfer Rp 9.240.000 → rekening petani', hash: '0xff31…7720' }];


const COOP = {
  name: 'Gapoktan Sidorejo Makmur',
  district: 'Klaten · Jawa Tengah',
  members: 142,
  activeHa: 198.4,
  voucherIssued: 122,
  voucherPending: 20,
  payouts2026: 7,
  payoutsTotal: 'Rp 41.820.000'
};

const COOP_MEMBERS = [
{ id: '0288', n: 'Bapak Mulyono', ha: 1.2, status: 'aktif', voucher: 'disalurkan', payout: '—' },
{ id: '0289', n: 'Ibu Sariyem', ha: 0.8, status: 'aktif', voucher: 'disalurkan', payout: '—' },
{ id: '0290', n: 'Bapak Wagiman', ha: 2.1, status: 'aktif', voucher: 'disalurkan', payout: '—' },
{ id: '0291', n: 'Bapak Suparjo', ha: 1.4, status: 'klaim', voucher: 'disalurkan', payout: 'Rp 9.240.000' },
{ id: '0292', n: 'Ibu Tukinem', ha: 0.6, status: 'aktif', voucher: 'disalurkan', payout: '—' },
{ id: '0293', n: 'Bapak Sutrisno', ha: 1.8, status: 'aktif', voucher: 'tertunda', payout: '—' },
{ id: '0294', n: 'Bapak Darto', ha: 1.0, status: 'aktif', voucher: 'disalurkan', payout: '—' },
{ id: '0295', n: 'Ibu Marni', ha: 0.9, status: 'aktif', voucher: 'disalurkan', payout: '—' },
{ id: '0296', n: 'Bapak Karman', ha: 1.3, status: 'klaim', voucher: 'disalurkan', payout: 'Rp 8.580.000' },
{ id: '0297', n: 'Bapak Joko', ha: 0.7, status: 'aktif', voucher: 'tertunda', payout: '—' },
{ id: '0298', n: 'Ibu Painem', ha: 1.1, status: 'aktif', voucher: 'disalurkan', payout: '—' },
{ id: '0299', n: 'Bapak Suyatno', ha: 1.6, status: 'aktif', voucher: 'disalurkan', payout: '—' }];


// ── Money formatter
function rupiah(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

// ── Section header used inside artboards
function SectionHead({ eyebrow, title, sub, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--line)',
      padding: '0 0 14px 0',
      marginBottom: 18
    }}>
      <div>
        <div style={{
          fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--terracotta-2)'
        }}>{eyebrow}</div>
        <div style={{
          fontFamily: 'var(--f-display)', fontSize: 30, lineHeight: 1.1,
          fontWeight: 500, marginTop: 6, color: 'var(--ink)',
          letterSpacing: '-0.01em'
        }}>{title}</div>
        {sub ? <div style={{ marginTop: 6, color: 'var(--ink-3)', fontSize: 13 }}>{sub}</div> : null}
      </div>
      {right}
    </div>);

}

function StatCell({ label, value, sub, accent }) {
  return (
    <div style={{ flex: 1, padding: '14px 16px', borderRight: '1px solid var(--line)' }}>
      <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'var(--ink-3)' }}>{label}</div>
      <div className="serif tnum" style={{
        fontWeight: 500, marginTop: 6,
        color: accent || 'var(--ink)', fontSize: "24px"
      }}>{value}</div>
      {sub ? <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{sub}</div> : null}
    </div>);

}

function MiniLogo({ size = 28 }) {
  // Stylized rice grain mark inside a hexagon — original mark
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-label="Satria Tani logo">
      <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="var(--ink)" />
      <ellipse cx="16" cy="16" rx="3.2" ry="9" fill="var(--gold)" transform="rotate(-22 16 16)" />
      <ellipse cx="16" cy="16" rx="3.2" ry="9" fill="var(--terracotta)" transform="rotate(22 16 16)" opacity="0.9" />
      <circle cx="16" cy="16" r="1.6" fill="var(--bone)" />
    </svg>);

}

Object.assign(window, { COPY, GLOSSARY, T, CLAIM, TRIGGERS, AUDIT, COOP, COOP_MEMBERS, rupiah, SectionHead, StatCell, MiniLogo });