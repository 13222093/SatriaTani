# Satria Tani

**Asuransi Padi Parametrik · Triple-Trigger Engine**

Submission untuk IYREF 2026 Pre-Eliminary Hackathon. Tim ITB: Syauqi Mujaddid Albayani (lead), Moh. Ari Alexander Aziz, Heart Alphionanda.

---

## Problem statement

Asuransi padi pemerintah Indonesia (AUTP) mencakup hanya **2,77%** sawah nasional. Ketika klaim diajukan, rerata waktu pencairan **87 hari** — terlambat untuk membantu petani tanam ulang di musim berikutnya. Korupsi tingkat koperasi dan ambiguitas keputusan klaim adalah dua kegagalan struktural yang dokumentasinya panjang.

Satria Tani mengusulkan **protokol asuransi parametrik** yang memutuskan klaim secara otomatis menggunakan **tiga pemicu independen**, dengan pencairan langsung ke rekening petani — koperasi tidak pernah memegang dana.

## Triple-Trigger Engine

Tiga sumber sinyal independen yang dievaluasi tanpa saling mengetahui:

1. **Geospasial** — NDVI Sentinel-2 + SAR Sentinel-1 mendeteksi penurunan vegetasi & genangan
2. **Atestasi Antar-Desa** — VRF memilih acak 14 petani tetangga, ambang minimum 9/14 setuju
3. **Pranata Mangsa** — bio-indikator kalender Jawa abad-10 (laron, randu, embun, suhu malam)

**Konvergensi 3-of-3 → pencairan otomatis dalam <48 jam.** 2-of-3 → review manual. 1-of-3 atau 0-of-3 → tidak terpicu.

## Empat permukaan produk

| Surface | Audience | Route |
|---|---|---|
| **Pusat Nasional** | OJK, Kementan, reasuransi | [`/pusat-nasional`](/pusat-nasional) |
| **Konsol Verifier** | Pengawas wilayah OJK | [`/klaim/[id]`](/klaim/STN-2026-04-1183) |
| **Dasbor Koperasi** | Pengurus Gapoktan (view-only) | [`/koperasi/[gapoktan-id]`](/koperasi/sidorejo-makmur) |
| **Storyboard Petani** | WhatsApp Business API (demo only) | [`/storyboard`](/storyboard) |

**Anti-corruption guardrail:** Dasbor Koperasi tidak punya affordance approve/reject. Pengurus koperasi tidak dapat memutuskan klaim dan tidak pernah memegang dana.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Akan dibuka pada `http://localhost:3000` dan otomatis redirect ke `/pusat-nasional`.

## Tech stack

- **Framework:** Next.js 14 App Router + TypeScript strict
- **Styling:** Inline styles + `app/globals.css` design tokens (CSS variables). No Tailwind/shadcn — design system was hand-authored before Tailwind would have been introduced; preserving fidelity to the source design.
- **Fonts:** Fraunces (display), Inter (sans), IBM Plex Mono (mono) — loaded via `next/font/google`.
- **Charts:** Inline SVG with deterministic generators (sin/cos). No Recharts dependency.
- **Map:** Mixed. National `JavaMap` (Pusat Nasional) is hand-drawn SVG. Parcel-scale `ParcelMap` (Verifier Console) uses Leaflet + Esri World Imagery satellite tiles over the real Sidorejo, Klaten bounding box. Cross-village `VillageMap` uses Leaflet + OSM street tiles with real Trucuk/Cawas/Bayat coordinates and a 25 km audit radius. MapLibre / vector tiles still on roadmap.
- **Mock data:** JSON in `lib/mock-data/`. No database.

## Hero claim — apa yang dilihat di demo

- **Bapak Suparjo** · FRM-7741-0291 · 1,4 ha varietas Ciherang
- Polis POL-JT-7741-26A · pertanggungan Rp 9.240.000
- Banjir bandang 19 Apr 2026 · BMKG curah 187mm/24h
- 3-of-3 fired · pencairan disetujui 22 Apr 06:14 WIB
- Transfer ke BCA ****8842 dalam 4 menit · audit hash `0xa83f…b219`

Mock data 142 anggota Gapoktan Sidorejo Makmur, 6 provinsi (BTN/JKT/JBR/JTG/DIY/JTM), 12 hotspot, 14 cross-village attesters, 8-event audit trail.

## Project structure

```
satria-tani/
├── app/
│   ├── layout.tsx                       # next/font + globals.css
│   ├── page.tsx                         # → /pusat-nasional
│   ├── globals.css                      # design tokens (ex-tokens.css)
│   ├── error.tsx                        # error boundary
│   ├── pusat-nasional/page.tsx
│   ├── klaim/[id]/page.tsx
│   ├── koperasi/[gapoktan-id]/page.tsx
│   └── storyboard/page.tsx
├── components/
│   ├── UnifiedHeader.tsx                # cross-surface nav, ⌘K bar (visual)
│   ├── primitives/                      # SectionHead, StatCell, MiniLogo, T glossary
│   ├── admin/AdminDashboard.tsx
│   ├── verifier/VerifierConsole.tsx
│   ├── cooperative/CooperativeDashboard.tsx
│   └── farmer/Storyboard.tsx
├── lib/
│   ├── copy.ts
│   ├── format.ts                        # rupiah formatter
│   └── mock-data/*.json                 # 11 JSON files
├── CLAUDE.MD                            # product brief
├── PLAN.md                              # porting plan / progress tracker
└── README.md                            # this file
```

## What's interactive vs visual

**Wired (functional):**
- Cross-surface navigation (4 surfaces, pathname-aware active state)
- ActionQueue cards → `/klaim/[id]`
- Hotspot popover "Buka klaim →"
- Map layer toggles + hotspot selection
- Right rail collapse
- Province table sort/search/filter
- Audit trail row expand
- VRF explainer collapse
- Coop members filter + pagination
- Error boundary

**Visual only (Phase 9 cut for time):**
- Filter strip dropdowns (Region, Periode, etc — show static labels)
- ⌘K palette (visual bar, no modal)

## Roadmap (post-hackathon)

- MapLibre GL JS replacement for the artistic SVG (real GeoJSON of Pulau Jawa, real lat/lng for hotspots)
- ⌘K palette (Cmd+K modal: search across claims, polis, gapoktan, anggota)
- Real backend: Postgres + tRPC (or REST), Sentinel-2/1 ingestion pipeline
- Real WhatsApp Business API integration (storyboard → production farmer surface)
- VRF on-chain proof verification
- Polygon mainnet deployment for audit trail
- Bahasa daerah toggle (Jawa, Sunda, Madura)

## Submission deliverables

- Repo: _GitHub URL_
- Demo: _Vercel URL_
- Video (4 menit): _YouTube URL_
- PDF: `PreEliminary_Hackathon_Climate_Resilience_Local_Wisdom_[NamaTim].pdf`

## License

Internal hackathon submission. Tidak dilisensikan untuk reuse di luar IYREF 2026.
