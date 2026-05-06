# Satria Tani — Port Plan & Progress

**Source of truth:** [CLAUDE.MD](CLAUDE.MD) for product brief. This file = porting plan + live progress tracker.

**Deadline:** 2026-05-06 (today). Hackathon submission window.

**Status: Port complete. Ready for Vercel deploy + GitHub push.**

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
| **Map architecture** | Kept hand-drawn SVG, deferred MapLibre to post-MVP | The source-of-truth `JavaMap` in [admin.jsx](components/admin.jsx) places hotspots in SVG-space coordinates (`x: 605, y: 198`), not lat/lng. Adopting MapLibre = rebuild from scratch (6–10h) with high visual-drift risk vs. CLAUDE.md's "every deviation = bug" rule. |
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

### Risk 1 — Map architecture mismatch with CLAUDE.MD ⚠️ Accepted, documented
CLAUDE.MD says MapLibre; source has hand-drawn SVG. Decision: kept SVG. Documented as roadmap in README.

### Risk 2 — JSX→TSX scope ✅ Resolved within budget
Total port: ~3500 lines of TSX. Build time clean on every phase smoke test.

### Risk 3 — SSR incompatibility ✅ Resolved
No top-level `window`/`document` references in any ported component. All state lives in `'use client'` files. Build generates static + dynamic pages cleanly.

### Risk 4 — npm install ✅ Resolved
Network worked, dependencies installed cleanly, no version resolution failures.
