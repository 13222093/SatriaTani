/* Farmer surface — WhatsApp Business API ONLY (no separate app) */

// Photographic-style flooded rice paddy: layered gradients + noise + plant silhouettes
// Designed to read as a real photo at thumbnail size, not an illustration.
function FloodedPaddyPhoto() {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        {/* Sky → distant horizon gradient (overcast, post-rain) */}
        <linearGradient id="fpSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#7d8a92" />
          <stop offset="60%" stopColor="#9aa39c" />
          <stop offset="100%" stopColor="#a8a89a" />
        </linearGradient>
        {/* Treeline */}
        <linearGradient id="fpTree" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4838" />
          <stop offset="100%" stopColor="#2a3a2c" />
        </linearGradient>
        {/* Floodwater: muddy brown-gray with reflective sheen */}
        <linearGradient id="fpWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#7d7560" />
          <stop offset="40%" stopColor="#8a8270" />
          <stop offset="80%" stopColor="#6e6452" />
          <stop offset="100%" stopColor="#4d4636" />
        </linearGradient>
        {/* Reflection of sky on water */}
        <linearGradient id="fpReflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8a89a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#a8a89a" stopOpacity="0" />
        </linearGradient>
        {/* Vignette */}
        <radialGradient id="fpVig" cx="50%" cy="55%" r="80%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.45" />
        </radialGradient>
        {/* Film grain */}
        <filter id="fpGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0"/>
          <feComposite in2="SourceGraphic" operator="in"/>
        </filter>
        {/* Slight blur for atmospheric depth */}
        <filter id="fpBlur"><feGaussianBlur stdDeviation="0.6" /></filter>
      </defs>

      {/* Base sky */}
      <rect width="400" height="170" fill="url(#fpSky)" />
      {/* Cloud streaks */}
      <ellipse cx="80"  cy="50"  rx="120" ry="14" fill="#bcc0b6" opacity="0.55" />
      <ellipse cx="280" cy="38"  rx="140" ry="10" fill="#cdd1c6" opacity="0.45" />
      <ellipse cx="200" cy="78"  rx="180" ry="12" fill="#aab0a6" opacity="0.35" />

      {/* Distant treeline silhouette */}
      <path d="M 0 165 L 22 152 L 44 158 L 70 145 L 92 155 L 118 142 L 142 156 L 168 148 L 196 152 L 224 144 L 252 156 L 280 148 L 310 154 L 340 146 L 372 156 L 400 150 L 400 175 L 0 175 Z"
            fill="url(#fpTree)" filter="url(#fpBlur)" />

      {/* Mid-ground: half-submerged paddy bunds (the visual cue this is rice land) */}
      <g opacity="0.9">
        <path d="M -20 178 Q 80 172 200 178 T 420 176 L 420 188 Q 220 184 100 188 T -20 190 Z" fill="#5a4f3a" />
        <path d="M -20 196 Q 90 192 210 200 T 420 198 L 420 210 Q 200 206 100 212 T -20 212 Z" fill="#6a5e44" opacity="0.85" />
      </g>

      {/* Floodwater body — covers mid-bottom */}
      <rect y="170" width="400" height="130" fill="url(#fpWater)" />

      {/* Sky reflection on water (top of water surface) */}
      <rect y="170" width="400" height="40" fill="url(#fpReflect)" />

      {/* Submerged paddy stalks: scattered yellowed tips poking out of water */}
      <g stroke="#9a8a4a" strokeWidth="0.8" opacity="0.7">
        {Array.from({length: 60}).map((_, i) => {
          const x = (i * 7 + (i % 3) * 11) % 400;
          const y = 200 + ((i * 13) % 80);
          const h = 3 + (i % 4);
          return <line key={i} x1={x} y1={y} x2={x + 0.3} y2={y - h} />;
        })}
      </g>
      {/* Scattered straw clumps floating */}
      <g fill="#7a6a3a" opacity="0.6">
        {[
          [60, 220], [140, 245], [220, 230], [310, 255], [80, 270], [260, 275], [340, 235], [180, 265],
        ].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx={6 + (i%3)} ry="1.2" />
        ))}
      </g>

      {/* Water surface ripples — concentric ovals to show movement */}
      <g fill="none" stroke="#cfc8b6" strokeWidth="0.5" opacity="0.5">
        <ellipse cx="120" cy="240" rx="22" ry="3" />
        <ellipse cx="120" cy="240" rx="32" ry="4.5" opacity="0.35" />
        <ellipse cx="270" cy="265" rx="18" ry="2.5" />
        <ellipse cx="270" cy="265" rx="28" ry="4" opacity="0.35" />
      </g>
      {/* Long horizontal sheen lines */}
      <g stroke="#d8d2c0" strokeWidth="0.6" opacity="0.45">
        <line x1="20"  y1="208" x2="180" y2="208" />
        <line x1="220" y1="216" x2="380" y2="216" />
        <line x1="60"  y1="232" x2="200" y2="232" />
      </g>

      {/* Foreground: a partially-submerged bund with a few standing rice stalks */}
      <path d="M -20 270 Q 100 258 220 268 T 420 264 L 420 300 L -20 300 Z" fill="#4a3f2a" />
      <g stroke="#9a8a4a" strokeWidth="1.1" opacity="0.85">
        {Array.from({length: 18}).map((_, i) => {
          const x = 20 + i * 22;
          const baseY = 270 + Math.sin(i * 0.7) * 3;
          return <line key={i} x1={x} y1={baseY} x2={x + 1} y2={baseY - 8 - (i % 3) * 2} />;
        })}
      </g>

      {/* Vignette + grain */}
      <rect width="400" height="300" fill="url(#fpVig)" />
      <rect width="400" height="300" filter="url(#fpGrain)" opacity="0.6" />
    </svg>
  );
}


// ── Common WA chrome
function WAHeader({ subtitle = 'akun resmi · terverifikasi ✓' }) {
  return (
    <div style={{
      background: '#1f5d4c', color: '#fff',
      padding: '10px 12px',
      display: 'flex', alignItems: 'center', gap: 10,
      flexShrink: 0,
    }}>
      <div style={{ fontSize: 20 }}>‹</div>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'var(--gold)', color: 'var(--ink)',
        display: 'grid', placeItems: 'center',
        fontWeight: 700, fontSize: 13,
        border: '2px solid #fff',
      }}>ST</div>
      <div style={{ flex: 1, lineHeight: 1.2 }}>
        <div style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 4 }}>
          Satria Tani <span style={{ fontSize: 11 }}>✓</span>
        </div>
        <div style={{ fontSize: 11, opacity: 0.8 }}>{subtitle}</div>
      </div>
      <div style={{ display: 'flex', gap: 14, fontSize: 18, opacity: 0.9 }}>
        <span>📞</span><span>⋮</span>
      </div>
    </div>
  );
}

const waChat = {
  background: '#e7ddd2',
  backgroundImage: 'radial-gradient(circle at 12px 12px, rgba(0,0,0,.04) 1px, transparent 1.5px)',
  backgroundSize: '24px 24px',
  flex: 1, padding: '12px 10px',
  display: 'flex', flexDirection: 'column', gap: 8,
  overflow: 'auto',
};

function DateBadge({ children }) {
  return <div style={{ alignSelf: 'center', background: '#fff5c4', padding: '4px 10px', borderRadius: 6, fontSize: 11, color: '#5a430b' }}>{children}</div>;
}

function In({ children, small }) {
  return (
    <div style={{
      alignSelf: 'flex-start', maxWidth: small ? '78%' : '88%',
      background: '#fff', padding: '8px 11px',
      borderRadius: '2px 8px 8px 8px',
      boxShadow: '0 1px 0.5px rgba(0,0,0,.13)',
      fontSize: 14, lineHeight: 1.55, color: '#0b1410',
    }}>{children}</div>
  );
}
function Out({ children }) {
  return (
    <div style={{
      alignSelf: 'flex-end', maxWidth: '78%',
      background: '#dcf8c6', padding: '8px 11px',
      borderRadius: '8px 8px 2px 8px',
      fontSize: 14, lineHeight: 1.55, color: '#0b1410',
      boxShadow: '0 1px 0.5px rgba(0,0,0,.13)',
    }}>{children}</div>
  );
}
function Tm({ children, align = 'right' }) {
  return <div style={{ fontSize: 10, color: '#7a8a83', textAlign: align, marginTop: 3 }}>{children}</div>;
}

// WA interactive list reply (the "API List Message" UX)
function WAListMessage({ title, body, button, items, footer }) {
  return (
    <In small={false}>
      {title ? <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div> : null}
      <div style={{ marginTop: 4 }}>{body}</div>
      <div style={{ marginTop: 8, padding: '8px 0 4px', borderTop: '1px solid #eee' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 6, color: '#1f5d4c', fontSize: 13, fontWeight: 600, padding: '6px 0',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          {button}
        </div>
      </div>
      {footer ? <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>{footer}</div> : null}
      <Tm>06:31 ✓✓</Tm>
    </In>
  );
}

// WA interactive reply buttons (max 3, per WA spec)
function WAReplyButtons({ children, body, header }) {
  return (
    <In>
      {header ? <div style={{ fontWeight: 600, fontSize: 14 }}>{header}</div> : null}
      {body ? <div style={{ marginTop: 4 }}>{body}</div> : null}
      <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {React.Children.map(children, (c, i) => (
          <div key={i} style={{
            padding: '10px 0', textAlign: 'center',
            color: '#1f5d4c', fontSize: 14, fontWeight: 500,
            borderTop: i ? '1px solid #eee' : 'none',
          }}>{c}</div>
        ))}
      </div>
      <Tm>06:31 ✓✓</Tm>
    </In>
  );
}

// ── Screen 1 — Payout notification (the emotional peak)
function WAPayoutScreen() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <WAHeader />
      <div style={waChat}>
        <DateBadge>Hari ini · 06:18</DateBadge>

        <In>
          <div style={{ fontWeight: 600 }}>Selamat pagi, Pak Suparjo. 🌾</div>
          <div style={{ marginTop: 6 }}>
            Banjir di sawah Desa Sidorejo telah <strong>terkonfirmasi</strong> oleh tiga sumber: citra satelit, sebelas tetangga, dan tanda-tanda mangsa.
          </div>
          <div style={{ marginTop: 6 }}>Pencairan otomatis sudah dikirim ke rekening Bapak.</div>
          <Tm>06:18 ✓✓</Tm>
        </In>

        {/* Template message — payout receipt as WA "interactive" template */}
        <In>
          <div style={{
            background: '#f0f7e8', border: '1px solid #b9d49a', borderRadius: 8,
            padding: '12px 14px', margin: '2px 0',
          }}>
            <div style={{ fontSize: 11, color: '#3a5a1d', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Pencairan Klaim</div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 26, fontWeight: 600, marginTop: 4, color: '#1a3a18' }}>Rp 9.240.000</div>
            <div style={{ fontSize: 12, color: '#3a5a1d', marginTop: 4 }}>ke BCA ****8842 · 22 Apr · 06:18</div>
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed #b9d49a', fontSize: 12, color: '#3a5a1d', display: 'flex', justifyContent: 'space-between' }}>
              <span>ID Klaim</span>
              <span style={{ fontFamily: 'var(--f-mono)' }}>STN-2026-04-1183</span>
            </div>
          </div>
          {/* CTA buttons (WA reply buttons) */}
          <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
            {['🔍 Lihat verifikasi publik', '📋 Status tanam ulang', '🆘 Bantuan'].map((b, i) => (
              <div key={i} style={{
                padding: '10px 0', textAlign: 'center',
                color: '#1f5d4c', fontSize: 14, fontWeight: 500,
                borderTop: i ? '1px solid #eee' : 'none',
              }}>{b}</div>
            ))}
          </div>
          <Tm>06:18 ✓✓</Tm>
        </In>

        <In>
          <div>Tidak perlu mengisi formulir. Tidak perlu menemui siapapun. 🙏</div>
          <Tm>06:19 ✓✓</Tm>
        </In>

        <Out>
          Terima kasih, Nak. Cepat sekali, padahal banjir baru kemarin. 🙏
          <Tm>06:24 ✓✓</Tm>
        </Out>
      </div>

      {/* WA input bar */}
      <div style={{ padding: '8px 10px', background: '#f0eae0', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ flex: 1, background: '#fff', borderRadius: 22, padding: '8px 14px', fontSize: 13, color: '#7a8a83', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>😊</span><span>Tulis pesan…</span><span style={{ marginLeft: 'auto' }}>📎</span><span>📷</span>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1f5d4c', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 16 }}>🎤</div>
      </div>
    </div>
  );
}

// ── Screen 2 — Daily mangsa observation prompt → list reply → confirmation
function WAObservationScreen() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <WAHeader />
      <div style={waChat}>
        <DateBadge>Hari ini · 05:42</DateBadge>

        <In>
          <div style={{ fontWeight: 600 }}>Selamat pagi, Pak Suparjo. 🌅</div>
          <div style={{ marginTop: 6 }}>
            Hari ini Mangsa <strong>Kanem</strong>. Boleh kami minta tolong satu pengamatan?
          </div>
          <div style={{ marginTop: 6, fontSize: 12, color: '#5a6a63', fontStyle: 'italic' }}>
            Pesan ini dikirim 1×/hari · stop kapan saja dengan ketik <strong>STOP</strong>
          </div>
          <Tm>05:42 ✓✓</Tm>
        </In>

        {/* Interactive list message — WA "list" UX */}
        <In>
          <div style={{ fontWeight: 600 }}>Apakah Bapak melihat laron pagi ini?</div>
          <div style={{ marginTop: 4, fontSize: 13, color: '#3a4a43' }}>
            Pilih salah satu di bawah:
          </div>
          <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid #eee' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, color: '#1f5d4c', fontSize: 14, fontWeight: 600, padding: '8px 0',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              Pilih Jawaban
            </div>
          </div>
          <Tm>05:42 ✓✓</Tm>
        </In>

        {/* Farmer reply: plain bubble, no auto-quoted bot context */}
        <Out>
          Ya · banyak sekali, sampai mengganggu
          <Tm>05:51 ✓✓</Tm>
        </Out>

        <In>
          <div>Terima kasih, Pak. 🙏</div>
          <div style={{ marginTop: 6 }}>
            Boleh kirim foto atau pesan suara biar lebih jelas?
          </div>
          <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
            {['📷 Kirim foto', '🎤 Kirim pesan suara', 'Lewati'].map((b, i) => (
              <div key={i} style={{
                padding: '10px 0', textAlign: 'center',
                color: '#1f5d4c', fontSize: 14, fontWeight: 500,
                borderTop: i ? '1px solid #eee' : 'none',
              }}>{b}</div>
            ))}
          </div>
          <Tm>05:51 ✓✓</Tm>
        </In>

        {/* User sends voice note (WA voice bubble) */}
        <Out>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 2px' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1f5d4c', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 13 }}>▶</div>
            <svg width="120" height="20" viewBox="0 0 120 20">
              {Array.from({length: 24}).map((_,i) => (
                <rect key={i} x={i*5} y={10 - 6*Math.abs(Math.sin(i*0.7))} width="2.5" height={12*Math.abs(Math.sin(i*0.7)) + 2} fill="#1f5d4c" />
              ))}
            </svg>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: '#3a4a43' }}>0:14</span>
          </div>
          <Tm>05:53 ✓✓</Tm>
        </Out>

        <In>
          <div style={{
            background: '#f0f7e8', border: '1px solid #b9d49a', borderRadius: 6,
            padding: '10px 12px', fontSize: 13, color: '#1a3a18',
          }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>✓ Pengamatan tersimpan</div>
            <div style={{ fontSize: 12 }}>
              Pulsa <strong>Rp 2.000</strong> sudah dikirim ke nomor Bapak sebagai terima kasih.
              Sudah 12 laporan bulan ini · Rp 24.000 total.
            </div>
          </div>
          <Tm>05:54 ✓✓</Tm>
        </In>
      </div>

      <div style={{ padding: '8px 10px', background: '#f0eae0', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ flex: 1, background: '#fff', borderRadius: 22, padding: '8px 14px', fontSize: 13, color: '#7a8a83', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>😊</span><span>Tulis pesan…</span><span style={{ marginLeft: 'auto' }}>📎</span><span>📷</span>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1f5d4c', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 16 }}>🎤</div>
      </div>
    </div>
  );
}

// ── Screen 3 — Peer attestation invitation (the cross-village vote)
function WAAttestationScreen() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <WAHeader />
      <div style={waChat}>
        <DateBadge>21 April · 08:12</DateBadge>

        <In>
          <div style={{ fontWeight: 600 }}>Halo Pak Wiryo (Trucuk). 🙏</div>
          <div style={{ marginTop: 6 }}>
            Bapak terpilih acak sebagai saksi untuk klaim banjir di <strong>Desa Sidorejo</strong> (≈ 9 km dari Bapak).
          </div>
          <div style={{ marginTop: 6, fontSize: 12, color: '#5a6a63', fontStyle: 'italic' }}>
            Ini bukan keputusan Bapak sendiri — sebelas tetangga lain juga ditanya.
          </div>
          <Tm>08:12 ✓✓</Tm>
        </In>

        {/* Image: photographic flooded paddy w/ GPS+timestamp watermark */}
        <In>
          <div style={{
            position: 'relative', overflow: 'hidden', borderRadius: 6,
            aspectRatio: '4/3', background: '#2a3a4a',
          }}>
            <FloodedPaddyPhoto />
            {/* Top-left watermark: GPS + timestamp baked into image */}
            <div style={{
              position: 'absolute', top: 6, left: 8,
              padding: '4px 8px',
              background: 'rgba(0,0,0,0.55)',
              borderRadius: 3,
              backdropFilter: 'blur(2px)',
              fontFamily: 'var(--f-mono)', fontSize: 9.5, lineHeight: 1.4,
              color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.4)',
            }}>
              <div>−6.9847° · 110.5912°</div>
              <div style={{ opacity: 0.85 }}>21 Apr 2026 · 06:30 WIB</div>
            </div>
            {/* Bottom-right corner mark */}
            <div style={{
              position: 'absolute', bottom: 6, right: 8,
              fontFamily: 'var(--f-mono)', fontSize: 8.5,
              color: '#fff', opacity: 0.75,
              textShadow: '0 1px 2px rgba(0,0,0,0.6)',
              letterSpacing: '0.08em',
            }}>
              SATRIATANI · VERIFIED ✓
            </div>
            {/* Compass corner */}
            <div style={{
              position: 'absolute', bottom: 6, left: 8,
              padding: '3px 7px',
              background: 'rgba(0,0,0,0.55)',
              borderRadius: 3,
              fontFamily: 'var(--f-mono)', fontSize: 9, color: '#fff',
            }}>
              ↑ N · ELV 142m
            </div>
          </div>
          <div style={{ marginTop: 8, fontSize: 13 }}>
            Foto resmi dari Pak Suparjo · koordinat GPS dan waktu sudah disisipkan ke gambar.
          </div>
          <Tm>08:12 ✓✓</Tm>
        </In>

        {/* Question with reply buttons */}
        <In>
          <div style={{ fontWeight: 600 }}>Menurut pengamatan Bapak, apakah betul sawah Sidorejo tergenang lebih dari 48 jam?</div>
          <div style={{ marginTop: 6, fontSize: 12, color: '#5a6a63' }}>
            Jawab jujur. Tidak ada konsekuensi apapun untuk Bapak.
          </div>
          <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
            {['✅ Ya, betul', '❌ Tidak, sawahnya kering', '🤷 Tidak tahu / belum lihat'].map((b, i) => (
              <div key={i} style={{
                padding: '10px 0', textAlign: 'center',
                color: '#1f5d4c', fontSize: 14, fontWeight: 500,
                borderTop: i ? '1px solid #eee' : 'none',
              }}>{b}</div>
            ))}
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: '#888' }}>
            Jendela jawab: 24 jam · setelah itu suara dianggap kosong
          </div>
          <Tm>08:12 ✓✓</Tm>
        </In>

        <Out>
          ✅ Ya, betul
          <Tm>08:14 ✓✓</Tm>
        </Out>

        <In>
          <div>Terima kasih atas atestasinya, Pak Wiryo. 🙏</div>
          <div style={{ marginTop: 6, fontSize: 13 }}>
            Suara Bapak ditandatangani secara kriptografis dan disimpan di rantai publik. Pulsa Rp 1.500 sudah dikirim sebagai pengganti waktu Bapak.
          </div>
          <div style={{
            marginTop: 8, padding: '8px 10px', background: '#f5f3ee',
            borderRadius: 6, fontFamily: 'var(--f-mono)', fontSize: 11, color: '#1a2e2a',
          }}>
            tx · 0xe091…3344
          </div>
          <Tm>08:14 ✓✓</Tm>
        </In>
      </div>

      <div style={{ padding: '8px 10px', background: '#f0eae0', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ flex: 1, background: '#fff', borderRadius: 22, padding: '8px 14px', fontSize: 13, color: '#7a8a83', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>😊</span><span>Tulis pesan…</span><span style={{ marginLeft: 'auto' }}>📎</span><span>📷</span>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1f5d4c', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 16 }}>🎤</div>
      </div>
    </div>
  );
}

// ── Screen 4 — Onboarding / status check via WA (no app to install)
function WAOnboardingScreen() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <WAHeader subtitle="online" />
      <div style={waChat}>
        <DateBadge>15 Januari · 09:14</DateBadge>

        <Out>STATUS<Tm>09:14 ✓✓</Tm></Out>

        <In>
          <div style={{ fontWeight: 600 }}>Selamat pagi, Pak Suparjo 🌾</div>
          <div style={{ marginTop: 6 }}>Berikut ringkasan polis Bapak:</div>
        </In>

        {/* Rich card — WA "interactive" template */}
        <In>
          <div style={{
            background: '#fff', border: '1px solid #d6cfbf', borderRadius: 8,
            overflow: 'hidden', margin: '2px 0',
          }}>
            <div style={{ background: '#1a2e2a', color: '#f5f3ee', padding: '10px 12px' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.14em', color: '#d4a84b', fontFamily: 'var(--f-mono)' }}>POLIS AKTIF</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>POL-JT-7741-26A</div>
            </div>
            <div style={{ padding: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12 }}>
                <div><div style={{ color: '#7a8a83', fontSize: 11 }}>Lahan</div><div style={{ fontWeight: 600 }}>1,4 ha · Ciherang</div></div>
                <div><div style={{ color: '#7a8a83', fontSize: 11 }}>Pertanggungan</div><div style={{ fontWeight: 600 }}>Rp 9.240.000</div></div>
                <div><div style={{ color: '#7a8a83', fontSize: 11 }}>Musim</div><div style={{ fontWeight: 600 }}>Apr–Jul 2026</div></div>
                <div><div style={{ color: '#7a8a83', fontSize: 11 }}>Premi</div><div style={{ fontWeight: 600 }}>Sudah dibayar</div></div>
              </div>
              <div style={{ marginTop: 10, padding: '8px 10px', background: '#f0f7e8', border: '1px solid #b9d49a', borderRadius: 4, fontSize: 11.5, color: '#1a3a18' }}>
                ✓ Tertanggung penuh · 3 pemicu aktif
              </div>
            </div>
          </div>
          <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
            {['📋 Lihat klaim saya', '📞 Hubungi pengurus koperasi', '🌾 Tanda mangsa minggu ini'].map((b, i) => (
              <div key={i} style={{
                padding: '10px 0', textAlign: 'center',
                color: '#1f5d4c', fontSize: 14, fontWeight: 500,
                borderTop: i ? '1px solid #eee' : 'none',
              }}>{b}</div>
            ))}
          </div>
          <Tm>09:14 ✓✓</Tm>
        </In>

        {/* Quick reply chips (WA quick replies) */}
        <In small>
          <div>Atau ketik kata kunci:</div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['STATUS', 'KLAIM', 'BANTUAN', 'STOP'].map(k => (
              <span key={k} style={{
                padding: '5px 10px', background: '#e7f3ee', color: '#1f5d4c',
                fontSize: 12, fontWeight: 600, borderRadius: 12, fontFamily: 'var(--f-mono)',
              }}>{k}</span>
            ))}
          </div>
          <Tm>09:14 ✓✓</Tm>
        </In>

        <Out>BANTUAN<Tm>09:16 ✓✓</Tm></Out>

        <In>
          <div>Layanan bantuan tersedia 24/7:</div>
          <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
            {['📞 Telepon agen koperasi', '💬 Chat dengan staf manusia', '📖 FAQ · pertanyaan umum'].map((b, i) => (
              <div key={i} style={{
                padding: '10px 0', textAlign: 'center',
                color: '#1f5d4c', fontSize: 14, fontWeight: 500,
                borderTop: i ? '1px solid #eee' : 'none',
              }}>{b}</div>
            ))}
          </div>
          <Tm>09:16 ✓✓</Tm>
        </In>
      </div>

      <div style={{ padding: '8px 10px', background: '#f0eae0', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ flex: 1, background: '#fff', borderRadius: 22, padding: '8px 14px', fontSize: 13, color: '#7a8a83', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>😊</span><span>Tulis pesan…</span><span style={{ marginLeft: 'auto' }}>📎</span><span>📷</span>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1f5d4c', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 16 }}>🎤</div>
      </div>
    </div>
  );
}

Object.assign(window, { WAPayoutScreen, WAObservationScreen, WAAttestationScreen, WAOnboardingScreen });
