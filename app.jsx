/* Satria Tani — Canvas app */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "comfortable",
  "geoFired": true,
  "peerFired": true,
  "pranataFired": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = window.useTweaks
    ? window.useTweaks(TWEAK_DEFAULTS)
    : [TWEAK_DEFAULTS, () => {}];

  return (
    <>
      <DesignCanvas storageKey="satriatani-canvas-v3">
        <DCSection id="pusat" title="Admin Pusat · Nasional" subtitle="Agregat Pulau Jawa · Kementerian Pertanian, OJK, BMKG, reasuransi">
          <DCArtboard id="admin" label="00 · Dasbor Pusat · Pulau Jawa" width={1640} height={1900}>
            <AdminDashboard density={tweaks.density} />
          </DCArtboard>
        </DCSection>

        <DCSection id="institutional" title="Institusi · Verifier & Koperasi" subtitle="Pengawas (OJK) dan operator lokal (Gapoktan)">
          <DCArtboard id="verifier" label="01 · Konsol Verifier · OJK" width={1480} height={1900}>
            <VerifierConsole density={tweaks.density} />
          </DCArtboard>

          <DCArtboard id="coop" label="02 · Dasbor Koperasi · read-only" width={1320} height={1100}>
            <CooperativeDashboard density={tweaks.density} />
          </DCArtboard>
        </DCSection>

        <DCSection id="farmer" title="Petani · WhatsApp Business API" subtitle="Tanpa aplikasi terpisah — semua interaksi via WhatsApp resmi (template + interactive messages)">
          <DCArtboard id="wa-onboard" label="A · Onboarding & status (STATUS)" width={420} height={830}>
            <IOSDevice width={390} height={800}><WAOnboardingScreen /></IOSDevice>
          </DCArtboard>
          <DCArtboard id="wa-observe" label="B · Pengamatan harian (list reply)" width={420} height={830}>
            <IOSDevice width={390} height={800}><WAObservationScreen /></IOSDevice>
          </DCArtboard>
          <DCArtboard id="wa-attest" label="C · Atestasi antar-desa (peer vote)" width={420} height={830}>
            <IOSDevice width={390} height={800}><WAAttestationScreen /></IOSDevice>
          </DCArtboard>
          <DCArtboard id="wa-payout" label="D · Pencairan klaim (template)" width={420} height={830}>
            <IOSDevice width={390} height={800}><WAPayoutScreen /></IOSDevice>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      {window.TweaksPanel ? (
        <window.TweaksPanel title="Tweaks · Satria Tani">
          <window.TweakSection title="Tampilan">
            <window.TweakRadio
              label="Densitas"
              value={tweaks.density}
              options={[
                { value: 'comfortable', label: 'Nyaman' },
                { value: 'compact',     label: 'Padat' },
              ]}
              onChange={(v) => setTweak('density', v)}
            />
          </window.TweakSection>

          <window.TweakSection title="Mesin Triple-Trigger">
            <window.TweakToggle label="Pemicu 1 · Geospasial" value={tweaks.geoFired} onChange={(v) => setTweak('geoFired', v)} />
            <window.TweakToggle label="Pemicu 2 · Atestasi"   value={tweaks.peerFired} onChange={(v) => setTweak('peerFired', v)} />
            <window.TweakToggle label="Pemicu 3 · Pranata Mangsa" value={tweaks.pranataFired} onChange={(v) => setTweak('pranataFired', v)} />
            <div style={{ fontSize: 11, color: '#888', marginTop: 8, lineHeight: 1.5 }}>
              Toggle berfungsi sebagai dokumentasi skenario.
            </div>
          </window.TweakSection>
        </window.TweaksPanel>
      ) : null}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
