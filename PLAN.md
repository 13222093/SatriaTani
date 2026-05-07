# Satria Tani — Port Plan & Progress

**Source of truth:** [CLAUDE.MD](CLAUDE.MD) for product brief. This file = porting plan + live progress tracker.

**Deadline:** 2026-05-06 (today). Hackathon submission window.

**Status: Port complete + map honesty pass landed (`/klaim/[id]` now uses Leaflet on real Klaten coords). Ready for Vercel deploy + GitHub push.**

---

## What we did

Ported the existing React-prototype-in-design-canvas into a deployable Next.js 14 app. The components in [components/](components/) + [tokens.css](tokens.css) were the **visual ground truth**; the HTML files at root were downstream exports of that same prototype, ignored.

Three product surfaces + one storyboard:

| Route | Source component | Status |
|---|---|---|
| [/pusat-nasional](app/pusat-nasional/page.tsx) | `AdminDashboard` | ✅ |
| [/klaim/[id]](app/klaim/[id]/page.tsx) | `VerifierConsole` | ✅ |
| [/koperasi/[gapoktan-id]](app/koperasi/[gapoktan-id]/page.tsx) | `CooperativeDashboard` | ✅ |
| [/storyboard](app/storyboard/page.tsx) | 4 WA screens | ✅ |

---

## Decisions locked at planning time

| Decision | What we did | Why |
|---|---|---|
| **Farmer screens** | Shipped as `/storyboard` (view-only gallery) | Code already existed in [components/farmer.jsx](components/farmer.jsx); marginal cost ~45 min; gives demo video live pixels instead of static PNGs. |
| **Map architecture** | Mixed: SVG `JavaMap` retained; `ParcelMap` + `VillageMap` ported to Leaflet + real OSM/Esri tiles | Original decision was full-SVG. Reversed for the two parcel-scale maps where stylized geometry reads as fake — judges with Klaten knowledge would notice. Country-overview `JavaMap` stays SVG (defensible as illustration). See "Map honesty pass" section below. |
| **Sans-serif font** | Used Inter (not IBM Plex Sans) | [tokens.css](tokens.css) declared `--f-sans: 'IBM Plex Sans'` but the prototype HTML only loaded Inter from Google Fonts. Plex Sans never reached the browser. Using Inter preserves the visual that's been signed off; switching to Plex Sans would change the rendered look. |

All three diverged from CLAUDE.MD's stated assumptions; CLAUDE.MD itself is left unchanged as the original product brief — see this PLAN.md and the README for the locked decisions.

---

## Tech stack (locked)

- **Next.js 14 App Router + TypeScript strict** (with pragmatic typing for SVG/event glue)
- **No Tailwind, no shadcn, no MapLibre, no Recharts, no lucide.** All exist in CLAUDE.md as assumptions; none are present in the source-of-truth components. Inline styles + `tokens.css` utility classes + inline SVG charts/icons.
- **Fonts via `next/font/google`:** Fraunces (display), Inter (sans), IBM Plex Mono (mono).
- **Mock data:** JSON files in `lib/mock-data/`, no DB.
- **Deploy target:** Vercel.

---

## Phase plan — final state

### Phase 0 — Scaffold ✅
[package.json](package.json), [tsconfig.json](tsconfig.json), [next.config.mjs](next.config.mjs), [.gitignore](.gitignore), [app/layout.tsx](app/layout.tsx) (next/font wired), [app/page.tsx](app/page.tsx) (redirect to /pusat-nasional).

### Phase 1 — Tokens + globals ✅
[app/globals.css](app/globals.css) — copy of [tokens.css](tokens.css) with font block swapped to use `var(--font-fraunces)`, `var(--font-inter)`, `var(--font-plex-mono)` from next/font. Plus `.coop-body-grid` media query added in Phase 9.

### Phase 2 — Mock data extraction ✅
11 JSON files in [lib/mock-data/](lib/mock-data/):

| File | Source | Records |
|---|---|---:|
| `claim.json` | `primitives.CLAIM` | 1 |
| `triggers.json` | `primitives.TRIGGERS` | 3 (geo + 14 voters + 5 indicators) |
| `audit-trail.json` | `primitives.AUDIT` | 8 |
| `coop.json` | `primitives.COOP` | 1 |
| `coop-members.json` | `primitives.COOP_MEMBERS` | 12 |
| `glossary.json` | `primitives.GLOSSARY` | 22 |
| `provinces.json` | `admin.PROVINCES` | 6 |
| `hotspots.json` | `admin.HOTSPOTS` | 12 (SVG-space coords) |
| `action-queue.json` | `admin.ACTION_QUEUE` | 8 |
| `kpis.json` | `admin.KPIS` | 6 (with seed/trend; spark recomputed at render) |
| `payouts.json` | `cooperative` inline | 7 |

### Phase 3 — Primitives ✅
- [lib/copy.ts](lib/copy.ts) — `COPY` object
- [lib/format.ts](lib/format.ts) — `rupiah(n)`
- [components/primitives/Glossary.tsx](components/primitives/Glossary.tsx) — `T` component
- [components/primitives/SectionHead.tsx](components/primitives/SectionHead.tsx)
- [components/primitives/StatCell.tsx](components/primitives/StatCell.tsx)
- [components/primitives/MiniLogo.tsx](components/primitives/MiniLogo.tsx)

### Phase 4 — UnifiedHeader ✅
[components/UnifiedHeader.tsx](components/UnifiedHeader.tsx). Initially ported as visual SectionNav; Phase 9 replaced SectionNav with pathname-aware cross-surface tabs.

### Phase 5 — AdminDashboard ✅
[components/admin/AdminDashboard.tsx](components/admin/AdminDashboard.tsx) — single file matching source structure. Includes ActionQueue (with router-wired clicks in Phase 9), KpiStrip + Sparkline, FilterStrip (visual), JavaMap (with router-wired popover), RightRail, ProvinceTable, TriggerBreakdown.

### Phase 6 — VerifierConsole ✅
[components/verifier/VerifierConsole.tsx](components/verifier/VerifierConsole.tsx) — single file. ClaimSummaryStrip, 3 trigger panels (Geo/Peer/Pranata) with their helper sub-components (ParcelMap, NdviChart, SarChart, VillageMap, MangsaWheel, BioGlyph, ColorRampLegend, VRFExplainer), ScenarioMatrix, DecisionStrip, AuditTrail. Deleted unused `VerifierTopBar`.

### Phase 7 — CooperativeDashboard ✅
[components/cooperative/CooperativeDashboard.tsx](components/cooperative/CooperativeDashboard.tsx) — guardrail banner, header, stats, filterable+paginated members table, payouts list, voucher card, status protokol, season indicator, anti-corruption disclaimer.

### Phase 8 — Storyboard ✅
[components/farmer/Storyboard.tsx](components/farmer/Storyboard.tsx) — 4 WA screens (Onboarding, Observation, Attestation, Payout) wrapped in inline `IOSDevice` bezels. Server-rendered, no state. `FloodedPaddyPhoto` SVG preserved verbatim.

### Phase 9 — Wiring ✅
- **Cross-surface nav:** UnifiedHeader's SectionNav replaced with pathname-aware `SurfaceNav` (Pusat / Verifier / Koperasi / Storyboard). Removed `navItems` and `activeNav` props.
- **Action card routing:** ActionQueueCard onClick → `router.push('/klaim/[id]')`. JavaMap hotspot popover "Buka klaim →" → `/klaim/STN-2026-04-1183`.
- **Error boundary:** [app/error.tsx](app/error.tsx) renders Indonesian-language fallback.
- **Responsive coop:** `.coop-body-grid` class in globals.css, stacks below 960px.

**Cut for time:** ⌘K palette modal, FilterStrip dropdown state.

### Phase 10 — README + smoke test ✅ (this commit)
- [README.md](README.md) with problem statement, hero claim, tech stack, structure, roadmap.
- Final `npm run build`: 6 routes, all green.

---

## Final build output

```
Route (app)                              Size     First Load JS
┌ ○ /                                    142 B          87.3 kB
├ ○ /_not-found                          873 B            88 kB
├ ƒ /klaim/[id]                          12.5 kB        107 kB
├ ƒ /koperasi/[gapoktan-id]              6.6  kB        101 kB
├ ○ /pusat-nasional                      10.3 kB        104 kB
└ ○ /storyboard                          142 B          87.3 kB
+ First Load JS shared by all            87.1 kB
```

---

## What we kept vs dropped

### Kept (ported to TSX)
- [tokens.css](tokens.css) → [app/globals.css](app/globals.css)
- [components/primitives.jsx](components/primitives.jsx) → split across `lib/` + `components/primitives/`
- [components/unified-header.jsx](components/unified-header.jsx) → [components/UnifiedHeader.tsx](components/UnifiedHeader.tsx)
- [components/admin.jsx](components/admin.jsx) → [components/admin/AdminDashboard.tsx](components/admin/AdminDashboard.tsx)
- [components/verifier.jsx](components/verifier.jsx) → [components/verifier/VerifierConsole.tsx](components/verifier/VerifierConsole.tsx)
- [components/cooperative.jsx](components/cooperative.jsx) → [components/cooperative/CooperativeDashboard.tsx](components/cooperative/CooperativeDashboard.tsx)
- [components/farmer.jsx](components/farmer.jsx) → [components/farmer/Storyboard.tsx](components/farmer/Storyboard.tsx)

### Dropped (Claude Design canvas authoring infra)
Files left on disk as visual reference, excluded from TS build via [tsconfig.json](tsconfig.json) and not imported anywhere:
- [design-canvas.jsx](design-canvas.jsx)
- [tweaks-panel.jsx](tweaks-panel.jsx)
- [ios-frame.jsx](ios-frame.jsx)
- [app.jsx](app.jsx)
- [components/type-scales.jsx](components/type-scales.jsx)
- All 5 root HTML files
- [.design-canvas.state.json](.design-canvas.state.json)

Optional cleanup pass before final deploy.

---

## Open items for the user

1. **Run `npm run dev` and click through all 4 routes** — verify hover states, sort/filter, row expand, coop pagination, navigation between surfaces all behave as expected. Build passing means SSR works; runtime interactivity needs eyeball check.
2. **`git init`** the project and push to GitHub (CLAUDE.MD specifies public repo deliverable).
3. **Deploy to Vercel** — connect the GitHub repo. No `vercel.json` needed for default Next.js deploys.
4. **Update README placeholders** with the GitHub URL, Vercel URL, and YouTube video URL.
5. **PDF deliverable** — `PreEliminary_Hackathon_Climate_Resilience_Local_Wisdom_[NamaTim].pdf` per CLAUDE.MD.

---

## Risk register (final)

### Risk 1 — Map architecture mismatch with CLAUDE.MD ⚠️ Partially resolved
CLAUDE.MD says MapLibre; source had hand-drawn SVG. Compromise: SVG kept for `JavaMap` (national hotspot overview); Leaflet + real tiles adopted for `ParcelMap` (Esri satellite over Sidorejo bbox) and `VillageMap` (OSM street with real Trucuk/Cawas/Bayat coords). MapLibre still on roadmap.

### Risk 2 — JSX→TSX scope ✅ Resolved within budget
Total port: ~3500 lines of TSX. Build time clean on every phase smoke test.

### Risk 3 — SSR incompatibility ✅ Resolved
No top-level `window`/`document` references in any ported component. All state lives in `'use client'` files. Build generates static + dynamic pages cleanly.

### Risk 4 — npm install ✅ Resolved
Network worked, dependencies installed cleanly, no version resolution failures.

---

## Map honesty pass (post-initial-port addendum)

**Trigger:** review caught that the original SVG `ParcelMap` and `VillageMap` placed everything in image-space coordinates. The "Sidorejo" coord overlay (`6.9847°S 110.5912°E`) actually lands in Boyolali, not Klaten — exactly the kind of detail a local judge would notice.

**Reference:** [Floodzy/components/map/FloodMap.tsx](Floodzy/components/map/FloodMap.tsx) — same author's separate project that uses real Leaflet + OSM/Esri tiles with `dynamic({ ssr: false })` import pattern.

**What changed:**
- Added `leaflet@1.9.4`, `react-leaflet@4.2.1`, `@types/leaflet` to [package.json](package.json).
- Added `import 'leaflet/dist/leaflet.css'` in [app/layout.tsx](app/layout.tsx).
- New file [globals.d.ts](globals.d.ts) — declares `*.css` modules to satisfy strict TS.
- New file [lib/geo.ts](lib/geo.ts) — `SIDOREJO_CENTER` (real lat/lng for Desa Sidorejo, Kec. Trucuk, Kab. Klaten), `PARCEL_BOUNDS` (~120m × 120m bbox = 1.4 ha hero claim), `cellBounds(row, col)` helper, `NEIGHBOR_VILLAGES` (real Trucuk/Cawas/Bayat coords), 14-attester registry with verdict (approve/pending/reject), deterministic NDVI seed preserved from old SVG.
- New file [components/verifier/ParcelMapLeaflet.tsx](components/verifier/ParcelMapLeaflet.tsx) — Esri satellite tile layer + 54 NDVI `Rectangle`s + dashed flood-outline overlay. LayersControl swap to OSM street.
- New file [components/verifier/VillageMapLeaflet.tsx](components/verifier/VillageMapLeaflet.tsx) — OSM street tiles + Sidorejo `CircleMarker` (terracotta, target) + 3 neighbour village markers + 14 attester dots + 25 km radius `Circle` + dashed `Polyline`s connecting villages to target.
- [components/verifier/VerifierConsole.tsx](components/verifier/VerifierConsole.tsx): deleted old `ParcelMap` (~100 lines SVG) and `VillageMap` (~85 lines SVG). Added `dynamic({ ssr: false })` imports of the two new components with bone-coloured loading placeholders. Updated coord overlay text from `6.9847°S · 110.5912°E · ZOOM 16` to the real `7.6855°S · 110.6678°E · ZOOM 18`. Wrapped `<VillageMap />` callsite in a `height: 220` container so Leaflet has a layout box.

**Out of scope of this pass (still SVG):** `JavaMap` in [components/admin/AdminDashboard.tsx](components/admin/AdminDashboard.tsx) and the country-level hotspots in [lib/mock-data/hotspots.json](lib/mock-data/hotspots.json) (still SVG-space `x,y`). National-overview SVG is defensible as illustration; parcel-scale SVG was not.
