/* Cooperative Admin Dashboard — read-only, NO approve/reject */

function CoopGuardrailBanner() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 26px',
      background: 'var(--gold-soft)',
      borderBottom: '1px solid var(--gold-2)',
      color: '#5a430b',
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ flexShrink: 0 }}>
        <rect x="4" y="11" width="16" height="10" rx="1" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
      <div style={{ fontSize: 12, lineHeight: 1.45, flex: 1 }}>
        <strong style={{ fontWeight: 600 }}>Mode: Akses observasi.</strong>
        {' '}Keputusan klaim ditangani oleh Mesin Triple-Trigger.
        {' '}Anda <strong style={{ fontWeight: 600 }}>tidak dapat</strong> menyetujui atau menolak klaim petani.
      </div>
      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a5a14', fontWeight: 600 }}>
        VIEW-ONLY
      </span>
    </div>
  );
}

function CoopHeader() {
  return (
    <div style={{ padding: '24px 26px 0' }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--terracotta-2)' }}>
        {COOP.district}
      </div>
      <div style={{ fontFamily: 'var(--f-display)', fontSize: 30, fontWeight: 500, marginTop: 6, letterSpacing: '-0.01em' }}>
        {COOP.name}
      </div>
      <div style={{ marginTop: 6, fontSize: 13, color: 'var(--ink-3)' }}>
        Musim Tanam Apr–Jul 2026 · 142 anggota · 198,4 hektare di bawah pertanggungan
      </div>
    </div>
  );
}

function CoopStats() {
  return (
    <div style={{
      margin: '20px 26px 0', display: 'flex',
      border: '1px solid var(--line)', background: 'var(--bone)',
    }}>
      <StatCell label="Anggota Aktif" value="142" sub="3 anggota baru bulan ini" />
      <StatCell label="Hektare Tertanggung" value="198,4 ha" sub="rerata 1,4 ha / anggota" />
      <StatCell label="Voucher Saprodi" value="122 / 142" sub="86% disalurkan · 20 menunggu" />
    </div>
  );
}

function CoopBody() {
  const [filter, setFilter] = React.useState('semua');
  const [page, setPage] = React.useState(0);
  const PAGE_SIZE = 12;

  const filtered = COOP_MEMBERS.filter(m => filter === 'semua' ? true : m.status === filter);
  const claimCount = COOP_MEMBERS.filter(m => m.status === 'klaim').length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const visible = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const setFilterReset = (k) => { setFilter(k); setPage(0); };

  return (
    <div style={{ padding: '20px 26px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
      {/* Members table */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
              Daftar Anggota · view-only
            </div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 500, marginTop: 4 }}>
              {filtered.length} petani
            </div>
          </div>

          <div style={{ display: 'flex', gap: 4 }}>
            {[
              ['semua', 'Semua', null],
              ['aktif', 'Aktif', null],
              ['klaim', 'Sedang Klaim', claimCount],
            ].map(([k, l, badge]) => (
              <button key={k} onClick={() => setFilterReset(k)} style={{
                background: filter === k ? 'var(--ink)' : 'transparent',
                color: filter === k ? 'var(--bone)' : 'var(--ink-3)',
                border: '1px solid var(--line-2)',
                padding: '6px 12px', fontSize: 12, fontWeight: 500,
                borderRadius: 2,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                {l}
                {badge != null && (
                  <span style={{
                    background: filter === k ? 'var(--terracotta)' : 'var(--terracotta-soft)',
                    color: filter === k ? 'var(--bone)' : 'var(--terracotta-2)',
                    fontFamily: 'var(--f-mono)', fontSize: 10, fontWeight: 600,
                    padding: '0 6px', borderRadius: 8, lineHeight: '14px',
                  }}>{badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div style={{ border: '1px solid var(--line)' }}>
          {/* head */}
          <div style={{
            display: 'grid', gridTemplateColumns: '70px 1fr 70px 130px 130px 140px',
            padding: '10px 14px', background: 'var(--bone-2)',
            borderBottom: '1px solid var(--line)',
            fontFamily: 'var(--f-mono)', fontSize: 10,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--ink-3)', gap: 10,
          }}>
            <div>ID</div><div>Nama</div><div>Lahan</div><div>Voucher Saprodi</div><div>Pencairan</div><div></div>
          </div>
          {visible.map((m, i) => {
            const inClaim = m.status === 'klaim';
            return (
              <div key={m.id} style={{
                display: 'grid', gridTemplateColumns: '70px 1fr 70px 130px 130px 140px',
                padding: '11px 14px', gap: 10,
                borderBottom: i === visible.length-1 ? 'none' : '1px solid var(--line)',
                alignItems: 'center', fontSize: 13,
                background: inClaim ? 'var(--gold-soft)' : (i % 2 ? 'var(--bone-2)' : 'transparent'),
                cursor: 'default',
              }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>FRM-{m.id}</div>
                <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'var(--bone-3)', display: 'grid', placeItems: 'center',
                    fontSize: 10, fontWeight: 600, color: 'var(--ink-2)',
                  }}>{m.n.split(' ').slice(-1)[0][0]}</div>
                  {m.n}
                  {inClaim ? <span className="chip fire"><span className="dot" />klaim aktif</span> : null}
                </div>
                <div className="tnum">{m.ha} ha</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    width: 6, height: 6,
                    background: m.voucher === 'disalurkan' ? 'var(--sage-2)' : 'var(--gold-2)',
                  }} />
                  <span style={{ fontSize: 12 }}>{m.voucher}</span>
                </div>
                <div className="tnum" style={{ fontSize: 12, color: m.payout === '—' ? 'var(--muted)' : 'var(--ink)' }}>{m.payout}</div>
                <div style={{ textAlign: 'right' }}>
                  {inClaim ? (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontFamily: 'var(--f-mono)', fontSize: 10, fontWeight: 600,
                      color: '#7a5a14', letterSpacing: '0.06em',
                    }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                        <rect x="4" y="11" width="16" height="10" rx="1" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                      Diproses protokol
                    </div>
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 400 }}>—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 10, padding: '4px 2px',
          fontSize: 12, color: 'var(--ink-3)',
        }}>
          <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.06em' }}>
            Menampilkan <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{safePage * PAGE_SIZE + 1}–{Math.min((safePage + 1) * PAGE_SIZE, filtered.length)}</span> dari {filtered.length} anggota
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <button disabled={safePage === 0} onClick={() => setPage(p => Math.max(0, p-1))} style={{
              ...pagBtn,
              opacity: safePage === 0 ? 0.4 : 1,
              cursor: safePage === 0 ? 'default' : 'pointer',
            }}>‹ Sebelumnya</button>
            {Array.from({length: totalPages}).map((_, i) => (
              <button key={i} onClick={() => setPage(i)} style={{
                ...pagBtn,
                background: safePage === i ? 'var(--ink)' : 'transparent',
                color: safePage === i ? 'var(--bone)' : 'var(--ink-2)',
                fontWeight: safePage === i ? 600 : 500,
                minWidth: 28,
              }}>{i+1}</button>
            ))}
            <button disabled={safePage === totalPages-1} onClick={() => setPage(p => Math.min(totalPages-1, p+1))} style={{
              ...pagBtn,
              opacity: safePage === totalPages-1 ? 0.4 : 1,
              cursor: safePage === totalPages-1 ? 'default' : 'pointer',
            }}>Berikutnya ›</button>
          </div>
        </div>

        {/* Promoted: Pencairan Terbaru — main flow, between table and disclaimer */}
        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--sage-2)', fontWeight: 600 }}>
                Pencairan Terbaru · langsung ke rekening petani
              </div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 20, fontWeight: 500, marginTop: 4, letterSpacing: '-0.005em' }}>
                Rp 41.820.000 · 7 pencairan · YTD 2026
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                marginTop: 6, fontSize: 11, color: '#7a5a14',
                fontStyle: 'italic',
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <rect x="4" y="11" width="16" height="10" rx="1" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                Pengurus koperasi tidak pernah memegang dana klaim petani.
              </div>
            </div>
            <button style={{ ...btnGhostCoop }}>Lihat semua →</button>
          </div>

          <div style={{ border: '1px solid var(--line)', background: 'var(--bone)' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1.4fr 1fr 0.8fr 1fr 110px',
              padding: '10px 14px', background: 'var(--bone-2)',
              borderBottom: '1px solid var(--line)',
              fontFamily: 'var(--f-mono)', fontSize: 10,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--ink-3)', gap: 10,
            }}>
              <div>Penerima</div><div>Jumlah</div><div>Tanggal</div><div>Pemicu</div><div>Rekening</div>
            </div>
            {[
              { n: 'Bapak Suparjo', amt: 'Rp 9.240.000', when: '22 Apr 2026', why: 'Banjir · 3/3', acc: 'BCA ****8842' },
              { n: 'Bapak Karman',  amt: 'Rp 8.580.000', when: '22 Apr 2026', why: 'Banjir · 3/3', acc: 'BRI ****1207' },
              { n: 'Bapak Wagiman', amt: 'Rp 6.300.000', when: '08 Mar 2026', why: 'Hama · 3/3',   acc: 'BCA ****4421' },
              { n: 'Ibu Painem',    amt: 'Rp 5.940.000', when: '08 Mar 2026', why: 'Hama · 3/3',   acc: 'BNI ****6612' },
              { n: 'Bapak Sutarno', amt: 'Rp 4.620.000', when: '14 Feb 2026', why: 'Hama · 3/3',   acc: 'BRI ****2391' },
              { n: 'Ibu Sumini',    amt: 'Rp 4.140.000', when: '14 Feb 2026', why: 'Hama · 3/3',   acc: 'BCA ****7704' },
              { n: 'Bapak Tugiman', amt: 'Rp 3.000.000', when: '03 Feb 2026', why: 'Banjir · 3/3', acc: 'BNI ****5588' },
            ].map((p, i, arr) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1.4fr 1fr 0.8fr 1fr 110px',
                padding: '11px 14px', gap: 10,
                borderBottom: i === arr.length-1 ? 'none' : '1px solid var(--line)',
                alignItems: 'center', fontSize: 13,
                background: i % 2 ? 'var(--bone-2)' : 'transparent',
              }}>
                <div style={{ fontWeight: 500 }}>{p.n}</div>
                <div className="tnum" style={{ fontWeight: 600, color: 'var(--sage-2)' }}>{p.amt}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{p.when}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{p.why}</div>
                <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', textAlign: 'right' }}>{p.acc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Anti-corruption disclaimer */}
        <div style={{
          marginTop: 16, padding: '14px 16px',
          background: 'var(--bone-2)', border: '1px solid var(--line)',
          borderLeft: '3px solid var(--terracotta)',
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--terracotta)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><circle cx="12" cy="16" r="0.5" fill="currentColor" />
          </svg>
          <div style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--ink-2)' }}>
            <strong>Koperasi tidak memutuskan klaim.</strong> Persetujuan dan pencairan sepenuhnya
            ditangani oleh Mesin Triple-Trigger dan disalurkan langsung ke rekening petani — tidak melalui koperasi.
            Peran Anda sebagai administrator: mengelola keanggotaan dan menyalurkan voucher saprodi.
          </div>
        </div>
      </div>

      {/* Right column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Voucher distribution */}
        <div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>
            Penyaluran Voucher
          </div>
          <div style={{ border: '1px solid var(--line)', padding: 16, background: 'var(--bone)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 36, fontWeight: 500 }}>122</div>
              <div style={{ color: 'var(--ink-3)', fontSize: 14 }}>/ 142 anggota</div>
            </div>
            <div style={{ height: 10, background: 'var(--bone-3)', marginTop: 10, position: 'relative' }}>
              <div style={{ width: '86%', height: '100%', background: 'var(--sage-2)' }} />
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.6 }}>
              Premi pertanggungan disisipkan ke harga voucher saprodi (model <T>ACRE</T>) — petani tidak membayar premi langsung.
            </div>
            <button style={{ ...btnPrimaryCoop, marginTop: 12, width: '100%' }}>
              Salurkan ke 20 anggota tersisa →
            </button>
          </div>
        </div>

        {/* Status Protokol — what was previously the dropped KPIs */}
        <div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>
            Status Protokol · view-only
          </div>
          <div style={{ border: '1px solid var(--line)', background: 'var(--bone)' }}>
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--line)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
            }}>
              <div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Klaim Aktif</div>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 28, fontWeight: 500, color: 'var(--terracotta)', marginTop: 2, lineHeight: 1 }}>2</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>diproses oleh protokol</div>
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontFamily: 'var(--f-mono)', fontSize: 9.5, fontWeight: 600,
                color: '#7a5a14', letterSpacing: '0.06em',
                padding: '4px 8px', background: 'var(--gold-soft)', border: '1px solid var(--gold-2)',
              }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                  <rect x="4" y="11" width="16" height="10" rx="1" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                VIEW-ONLY
              </div>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Pencairan 2026</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 28, fontWeight: 500, color: 'var(--sage-2)', lineHeight: 1 }}>7</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>klaim · Rp 41,82 jt</div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>langsung ke rekening petani</div>
            </div>
          </div>
        </div>

        {/* Season indicator */}
        <div style={{ padding: 16, background: 'var(--ink)', color: 'var(--bone)' }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold)' }}>
            MUSIM AKTIF
          </div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 18, fontWeight: 500, marginTop: 6 }}>
            <T>Mangsa Kanem</T> · IV
          </div>
          <div style={{ fontSize: 11, marginTop: 4, opacity: 0.75, lineHeight: 1.5 }}>
            Risiko banjir tinggi · 38 pelapor bio-indikator aktif minggu ini
          </div>
        </div>
      </div>
    </div>
  );
}

const pagBtn = {
  background: 'transparent', color: 'var(--ink-2)',
  border: '1px solid var(--line-2)',
  padding: '5px 10px', fontSize: 11.5, fontWeight: 500,
  borderRadius: 2, fontFamily: 'var(--f-sans)',
  cursor: 'pointer',
};

const btnPrimaryCoop = {
  background: 'var(--sage-2)', color: 'var(--bone)',
  border: '1px solid var(--sage-2)',
  padding: '9px 14px', fontSize: 12, fontWeight: 500,
  letterSpacing: '0.02em', borderRadius: 2, cursor: 'pointer',
};

const btnGhostCoop = {
  background: 'transparent', color: 'var(--ink)',
  border: '1px solid var(--line-2)',
  padding: '6px 12px', fontSize: 11.5, fontWeight: 500,
  borderRadius: 2, cursor: 'pointer',
};

const coopStyles = {
  shell: {
    width: '100%', height: '100%',
    background: 'var(--bone)', color: 'var(--ink)',
    fontFamily: 'var(--f-sans)',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
  },
};

function CooperativeDashboard({ density = 'comfortable' }) {
  return (
    <div style={coopStyles.shell} data-density={density}>
      <UnifiedHeader
        scope={['Dasbor Koperasi', 'Klaten', 'Gapoktan Sidorejo Makmur']}
        navItems={['Beranda', 'Anggota', 'Voucher Saprodi', 'Pencairan', 'Laporan']}
        activeNav="Beranda"
        user={{ name: 'Pak Joko Susilo', org: 'Gapoktan Sidorejo', role: 'Sekretaris', initials: 'JS' }}
        accent="#0E1A2B"
      />
      <CoopGuardrailBanner />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <CoopHeader />
        <CoopStats />
        <CoopBody />
      </div>
    </div>
  );
}

Object.assign(window, { CooperativeDashboard });
