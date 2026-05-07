# Satria Tani — Port Plan & Progress

**Source of truth:** [CLAUDE.MD](CLAUDE.MD) for product brief. This file = porting plan + live progress tracker.

**Deadline:** 2026-05-06 (today). Hackathon submission window.

**Status: Port complete + full map honesty pass landed (all three maps — `JavaMap` on `/pusat-nasional`, `ParcelMap` + `VillageMap` on `/klaim/[id]` — now use real Leaflet tiles with real lat/lng). Ready for Vercel deploy + GitHub push.**

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
| **Map architecture** | Full Leaflet: `ParcelMap`, `VillageMap`, **and** `JavaMap` all ported to Leaflet. CARTO Dark Matter tiles for the national overview; Esri satellite for the parcel; OSM street for the village. | Original decision was full-SVG. First reversal: the two parcel-scale maps. Second reversal (this pass): national `JavaMap`, on user request to "make it a real map." All three maps now use real lat/lng. See "Map honesty pass" + "Map honesty pass — round 2" sections below. |
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

### Risk 1 — Map architecture mismatch with CLAUDE.MD ✅ Resolved
CLAUDE.MD says MapLibre; source had hand-drawn SVG. Compromise: Leaflet (not MapLibre, but real-tile based) adopted for all three maps. `ParcelMap` = Esri satellite over Sidorejo bbox. `VillageMap` = OSM street with real Trucuk/Cawas/Bayat coords. `JavaMap` = CARTO Dark Matter with 12 hotspots at real regency centroids. MapLibre upgrade still on roadmap if vector tiles become a priority.

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

---

## Map honesty pass — round 2 (national `JavaMap`)

**Trigger:** user followup — "in peta risiko pulau jawa, its not even a map. can we make it to be a map and put all the toggles, hotspot, visual element to match a real map. make it a dark map."

**Decisions locked at planning time:**

| Decision | Choice | Why |
|---|---|---|
| Tile provider | **CARTO Dark Matter** (`{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`) | Industry default for dark dashboards (Uber, Airbnb, NYC OpenData). Free, no API key, attribution-only. Designed for data-overlay use, not navigation. |
| Province polygons | **Skipped** (centroid-circle simulation) | Authoring/sourcing simplified Java-province GeoJSON adds ~45 min and ~30 KB. For 6 provinces, simulating loss-ratio choropleth via translucent circles at province centroids communicates the same data spatial-spread. Real GeoJSON deferred to roadmap. |
| Drag/zoom | **Drag enabled with `maxBounds` lock**, zoom restricted to z=6→z=10 | Lets judges zoom in to inspect specific regencies; `maxBoundsViscosity={1.0}` prevents accidental pan to other continents. |
| Layer switching UI | **Existing right-panel LAYER toggles kept**; map takes `activeLayer` as a prop | Built-in Leaflet `LayersControl` is functional but visually clunky and would replace the carefully designed right-panel UI. Conditional rendering by parent state preserves the UX exactly. |
| Hotspot rendering | **`L.divIcon` with HTML + CSS `@keyframes hotspotPulse`** for `high` severity | Native HTML markers allow rendering the claim count number inside the colored severity ring + native CSS pulse animation. Cleaner than base64-SVG icon approach. |
| Loss-ratio choropleth | **Centroid `Circle` with risk-graded color (emerald → gold → terracotta)** | Without GeoJSON polygons, this is the standard hackathon-pragmatic substitute. |
| Attribution | **Visible bottom-left chip** (TOS-compliant) | Floodzy strips it via `attributionControl={false}`. We keep it (small + low-contrast via CSS overrides in globals). |

**What changed:**
- [lib/mock-data/hotspots.json](lib/mock-data/hotspots.json) — added `lat`/`lng` to all 12 entries (real regency centroids from Wikipedia: Klaten, Demak, Banyuwangi, Indramayu, Jember, Karawang, Cirebon, Bantul, Pekalongan, Madiun, Sukabumi, Tegal). Old `x`/`y` retained but unused.
- [lib/mock-data/provinces.json](lib/mock-data/provinces.json) — added `lat`/`lng` to all 6 entries (BTN/JKT/JBR/JTG/DIY/JTM centroids).
- New file [components/admin/JavaMapLeaflet.tsx](components/admin/JavaMapLeaflet.tsx) — CARTO Dark Matter `TileLayer` over Java bounds; conditional rendering of 4 layers (`risk` = hotspot DivIcons, `loss` = centroid Circles colored by risk field, `density` = centroid Circles sized by √(members), `climate` = translucent terracotta/gold circles + permanent "+2,1°C ANOMALI" tooltip); Leaflet `Popup` for selected hotspot with same fields as old inline popover (Pemicu, Klaim, Exposure, Status, "Buka klaim →" routing).
- [components/admin/AdminDashboard.tsx](components/admin/AdminDashboard.tsx): deleted ~297-line `<svg viewBox="0 0 950 360">` block + ~92-line inline popover; deleted unused `sevColor` / `sevR` / `sevHeat` / `sel` helpers. Added `dynamic({ ssr: false })` import of `JavaMapLeaflet` with parchment-on-navy loading placeholder. Added HTML overlays for the compass (`N` glyph) and "100 km" scale bar (used to live inside the SVG). Extended `Hotspot` and `Province` interfaces with `lat`/`lng` fields.
- [app/globals.css](app/globals.css) — appended `@keyframes hotspotPulse`, `.hotspot-marker` styles (with `.sev-high` pulse modifier), `.province-label` and `.climate-anomaly` DivIcon styling, Leaflet popup theme overrides (parchment background, navy border, custom shadow), and attribution-control restyling (low-contrast on navy).

**What stayed unchanged:**
- Top filter row (PETA RISIKO header, 24 jam/7 hari/30 hari/Musim ini pills, date chip, LIVE indicator with its own pulse)
- LAYER right-panel UI (4 toggles with accent dots and descriptions)
- Severity legend (Tinggi/Sedang/Rendah swatches)
- All severity color semantics (terracotta/gold/grey)
- Hotspot popup schema (Pemicu / Klaim / Exposure / Status grid + "Buka klaim →")
- Routing target (`/klaim/STN-2026-04-1183`)
- All 12 hotspot data records and 6 province data records

**Bundle impact:** `/pusat-nasional` First Load JS dropped from 10.3 KB to 8.07 KB (deleted 297 lines of inline SVG markup; Leaflet code already shared with the verifier route's dynamic chunk).
