# Satria Tani — Project Context

## What this project is

Satria Tani — parametric crop insurance protocol untuk petani padi Indonesia. Submission IYREF 2026 Pre-Eliminary Hackathon (deadline 6 May 2026, HackDay offline ITB 15-16 May 2026).

Inovasi: **Triple-Trigger Engine** — tiga pemicu independen untuk validasi klaim:
1. Geospasial (NDVI Sentinel-2 + SAR Sentinel-1)
2. Atestasi sosial (cross-village peer attestation, VRF random selection)
3. Kultural Pranata Mangsa (kalender Jawa abad-10, bio-indikator)

Konvergensi 3-of-3 → pencairan otomatis ke rekening petani <48 jam, bypass koperasi.

Tim: Syauqi Mujaddid Albayani (lead), Moh. Ari Alexander Aziz, Heart Alphionanda — ITB.

## CRITICAL: source of truth

`components/` directory adalah ground truth. React prototype yang sudah di-build 
di Claude Design canvas environment, dengan design tokens di `tokens.css` dan 
primitives di `components/primitives.jsx`.

Files yang matter:
- `components/admin.jsx` — Pusat Nasional dashboard (Verifier Console, surface 1 page 1)
- `components/verifier.jsx` — Konsol Verifier single-claim (surface 1 page 2)
- `components/cooperative.jsx` — Dasbor Koperasi (surface 2)
- `components/farmer.jsx` — WhatsApp 4-panel storyboard (NOT built as product, video asset)
- `components/primitives.jsx` — reusable primitives (Card, KPI, Badge, etc.)
- `components/unified-header.jsx` — header system konsisten antar surface
- `tokens.css` — design tokens

Files yang IGNORE / drop di port:
- `design-canvas.jsx`, `tweaks-panel.jsx`, `ios-frame.jsx` — Claude Design 
  canvas authoring infra, bukan product code
- `Satria Tani*.html` (Standalone, bundle-src, print, plain) — downstream 
  exports, abaikan
- `Type Scale Exploration.html` — exploratory artifact
- `.design-canvas.state.json` — Claude Design state, irrelevant for production

**Tugas Claude Code: port React prototype existing ke Next.js App Router, 
wire mock data, add routing/navigation, deploy ke Vercel. BUKAN rebuild 
visual dari design assets.**

## Workflow port

1. Discovery: read tokens.css, primitives.jsx, unified-header.jsx, dan 4 
   surface components (admin, verifier, cooperative, farmer). Inventory 
   primitives, hardcoded data, dependency surface.
2. Decide token strategy: keep tokens.css as-is imported via layout, atau 
   port ke tailwind.config.ts. Tergantung struktur tokens.css existing.
3. Convert .jsx → .tsx, fix any type issues. Move ke struktur Next.js App Router:
   - `app/pusat-nasional/page.tsx` ← components/admin.jsx
   - `app/klaim/[id]/page.tsx` ← components/verifier.jsx
   - `app/koperasi/[gapoktan-id]/page.tsx` ← components/cooperative.jsx
   - `app/storyboard/page.tsx` ← components/farmer.jsx (untuk reference 
     video, optional ditampilkan)
4. Extract hardcoded mock data dari components ke `lib/mock-data/*.json`. 
   Components terima props instead of hardcoded values.
5. Wire navigation: top-right "Lihat semua (47)" pada Antrian Aksi Pusat 
   Nasional → routes ke /klaim/[id]. Provincial table "Aksi: buka →" → 
   routes ke detail. Dst.
6. Add interactivity minimum: filter dropdown functional, table sortable, 
   search berfungsi (filter client-side cukup), loading/empty/error states.
7. Vercel deploy config, README, screenshot smoke test.

## Tech stack

- **Framework:** Next.js 14 App Router + TypeScript strict
- **Styling:** Tailwind config harus respect tokens.css. Decide during 
  discovery: import tokens.css globally + use CSS variables in Tailwind 
  config, OR port semua ke tailwind.config.ts. Whatever preserves existing 
  visual exact.
- **shadcn/ui:** Probably NOT needed — primitives.jsx already exists. 
  Don't install kecuali ada gap nyata.
- **Map, charts, icons:** Match what existing components import. Inspect 
  before adding new dependencies.
- **Mock data:** JSON di `lib/mock-data/`
- **Deploy:** Vercel

## Two product surfaces

**Surface 1 — Verifier Console (web desktop)**
Audience: OJK regulator + Kementan + asuransi. Routes:
- `/pusat-nasional` — national overview dashboard (source: pusat-nasional.html)
- `/klaim/[id]` — single claim detail (source: konsol-verifier.html)

**Surface 2 — Dasbor Koperasi (responsive web)**
Audience: Pengurus KDMP. **Anti-corruption guardrail: NO approve/reject affordances anywhere.** Route:
- `/koperasi/[gapoktan-id]` — cooperative dashboard (source: dasbor-koperasi.html)

**Out of scope:**
- WhatsApp bot — storyboard only untuk video demo, jangan implement
- Real backend payment integration
- Real blockchain audit trail — mock hash format `0xa83f…b219`
- Mobile native — responsive web cukup

## Visual fidelity rules

- **Tidak boleh "improve" design** atas inisiatif sendiri. Kalau Claude Design output beda dari preference Claude Code, Claude Design wins.
- Kalau extracting dari HTML butuh judgment call (misal: HTML pakai inline style vs class), default ke approach yang preserve visual exact.
- Setelah implement page, screenshot via `npm run dev` + browser, compare side-by-side dengan HTML source. Flag any deviation > 5% visual difference.

## Bahasa & format

- UI bahasa Indonesia, technical terms English code-switched OK
- Date: 22 Apr 2026 (Indonesian short)
- Currency: Rp 9.240.000 (titik separator) atau Rp 184,2 Mrd compact
- Time: 14:42 WIB
- Petani disebut "Bapak/Ibu [Nama]", bukan "user-1234"

## Mock data — realistic, hero claim case

Real backdrop: Desa Sidorejo, Klaten, Jawa Tengah (~6.98°S 110.59°E).

Hero claim case (yang akan di-demo di video):
- Bapak Suparjo, FRM-7741-0291, 1.4 ha, varietas Ciherang
- Polis POL-JT-7741-26A, pertanggungan Rp 9.240.000
- Kejadian: banjir bandang 19 Apr 2026, BMKG curah 187mm/24h
- Konvergensi 3/3 fired, pencairan disetujui otomatis 22 Apr 06:14 WIB
- Pencairan ke BCA ****8842, audit hash 0xa83f…b219

Generate juga:
- 142 named anggota Gapoktan Sidorejo Makmur (Bapak Mulyono, Ibu Sariyem, dst — sudah ada di Dasbor Koperasi HTML, extract from there)
- 6 provinsi data agregat (BTN, JKT, JBR, JTG, DIY, JTM — angka sudah ada di Pusat Nasional HTML)
- 12-20 polygon GeoJSON sawah on top of Klaten coords
- 6-month NDVI timeseries dengan 1-2 polygon menunjukkan drought
- Cross-village attesters: 14 petani dari Trucuk, Cawas, Bayat (radius 25km dari Sidorejo)
- Audit trail timeline 6+ events

JSON files:
- `lib/mock-data/farmers.json`
- `lib/mock-data/polygons.geojson`
- `lib/mock-data/ndvi-timeseries.json`
- `lib/mock-data/claims.json`
- `lib/mock-data/attestations.json`
- `lib/mock-data/audit-trail.json`
- `lib/mock-data/provinces.json`
- `lib/mock-data/triggers.json`

**Strategy: extract data yang sudah ada di HTML mockup duluan**, baru tambah yang missing. HTML sudah punya nama-nama, angka-angka — jangan bikin ulang.

## Quality bar hackathon

- MVP **operable**, bukan static. Routing antar page works, filter dropdown functional, table sortable.
- Loading + empty + error state minimum harus ada
- Responsive: Verifier Console desktop-first (≥1280px). Dasbor Koperasi tablet+desktop (≥768px).
- TypeScript strict, no `any`
- Lighthouse >70 cukup, tidak harus 90+
- Build harus deploy clean ke Vercel

## Submission deliverable

- GitHub repo public
- README.md: problem statement, architecture diagram, demo URL, video URL, future roadmap
- Vercel deployment URL
- Video 4 menit
- PDF: `PreEliminary_Hackathon_Climate_Resilience_Local_Wisdom_[NamaTim].pdf` berisi link repo + video

## Anti-patterns yang JANGAN dilakukan

- Jangan rebuild dari design intuition — HTML adalah source of truth
- Jangan introduce shadcn/ui kalau HTML export pakai vanilla Tailwind (cek dulu)
- Jangan generate 1000+ entities — HTML mockup sudah punya nama-nama, extract dari sana
- Jangan over-engineer auth — skip atau localStorage mock cukup
- Jangan implement WhatsApp Business API — storyboard saja
- Jangan "perbaiki" design Claude Design — kalau ada masalah visual, flag ke gua, jangan fix sendiri
- Jangan tambah dependency tanpa cek package.json existing
- Jangan refactor HTML jadi React **kalau lo belum baca semua 3 HTML files dulu**. Component reusability cuma kelihatan setelah lo lihat ketiganya.

## Design tokens

Source of truth: `tokens.css`. Don't re-spec values here. If tokens need 
changing, edit tokens.css.