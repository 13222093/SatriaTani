// Real-world coordinates for Klaten, Jawa Tengah.
// Used by Leaflet maps in the Verifier Console (ParcelMap + VillageMap).
//
// Sidorejo here = Desa Sidorejo, Kecamatan Trucuk, Kabupaten Klaten.
// (CLAUDE.md's earlier 6.98°S 110.59°E lands in Boyolali — corrected to the
// real Sidorejo location below.)

export type LatLng = [number, number];

export const SIDOREJO_CENTER: LatLng = [-7.6855, 110.6678];

// 1.4 ha hero-claim parcel — approx 120m × 120m square centered on Sidorejo.
// Half-extent in degrees at this latitude: ~0.000543° lat, ~0.000548° lng.
const HALF_LAT = 0.000545;
const HALF_LNG = 0.000550;

export const PARCEL_BOUNDS = {
  south: SIDOREJO_CENTER[0] - HALF_LAT,
  north: SIDOREJO_CENTER[0] + HALF_LAT,
  west: SIDOREJO_CENTER[1] - HALF_LNG,
  east: SIDOREJO_CENTER[1] + HALF_LNG,
};

export const PARCEL_GRID = { rows: 6, cols: 9 } as const;

// Returns [SW, NE] corners of a single parcel grid cell.
// Row 0 is the northern edge; col 0 is the western edge.
export function cellBounds(row: number, col: number): [LatLng, LatLng] {
  const { rows, cols } = PARCEL_GRID;
  const latStep = (PARCEL_BOUNDS.north - PARCEL_BOUNDS.south) / rows;
  const lngStep = (PARCEL_BOUNDS.east - PARCEL_BOUNDS.west) / cols;
  const north = PARCEL_BOUNDS.north - row * latStep;
  const south = north - latStep;
  const west = PARCEL_BOUNDS.west + col * lngStep;
  const east = west + lngStep;
  return [
    [south, west],
    [north, east],
  ];
}

// Cells that fired the SAR-flooding trigger. Same indices as the original SVG
// (rows 2-4, cols 3-5) — preserves source-of-truth visual semantics.
export const FLOODED_CELL_KEYS = new Set([
  '2-3',
  '2-4',
  '3-3',
  '3-4',
  '3-5',
  '4-4',
]);

// 14 cross-village attesters within ~25 km of Sidorejo.
// Verdict colours match the original VillageMap: sage = approve, gold = pending,
// terracotta = reject.
export type Attester = {
  id: string;
  village: 'Trucuk' | 'Cawas' | 'Bayat';
  verdict: 'approve' | 'pending' | 'reject';
  // Small offset in degrees from the village center, to show the attester
  // dots clustered around their village marker.
  offset: LatLng;
};

export const NEIGHBOR_VILLAGES: Record<
  Attester['village'],
  { name: string; center: LatLng }
> = {
  Trucuk: { name: 'Trucuk', center: [-7.7150, 110.6800] },
  Cawas: { name: 'Cawas', center: [-7.7550, 110.7150] },
  Bayat: { name: 'Bayat', center: [-7.7900, 110.6850] },
};

const D = 0.0035; // ~390 m offset radius for attester dots around village center

export const ATTESTERS: Attester[] = [
  { id: 'T1', village: 'Trucuk', verdict: 'approve', offset: [-D, -D * 0.7] },
  { id: 'T2', village: 'Trucuk', verdict: 'approve', offset: [D * 0.4, -D * 0.6] },
  { id: 'T3', village: 'Trucuk', verdict: 'approve', offset: [D, D * 0.8] },
  { id: 'T4', village: 'Trucuk', verdict: 'approve', offset: [-D * 0.6, D * 0.8] },
  { id: 'T5', village: 'Trucuk', verdict: 'pending', offset: [0, 0] },

  { id: 'C1', village: 'Cawas', verdict: 'approve', offset: [-D, -D * 0.5] },
  { id: 'C2', village: 'Cawas', verdict: 'approve', offset: [D * 0.6, -D * 0.7] },
  { id: 'C3', village: 'Cawas', verdict: 'approve', offset: [D * 0.8, D * 0.6] },
  { id: 'C4', village: 'Cawas', verdict: 'approve', offset: [-D * 0.6, D * 0.8] },
  { id: 'C5', village: 'Cawas', verdict: 'pending', offset: [0, 0] },

  { id: 'B1', village: 'Bayat', verdict: 'approve', offset: [-D * 0.7, -D * 0.6] },
  { id: 'B2', village: 'Bayat', verdict: 'reject', offset: [D * 0.6, -D * 0.7] },
  { id: 'B3', village: 'Bayat', verdict: 'approve', offset: [D * 0.8, D * 0.6] },
  { id: 'B4', village: 'Bayat', verdict: 'approve', offset: [-D * 0.7, D * 0.6] },
];

// Deterministic NDVI for a given grid cell. Same seeded LCG as the original
// SVG so the colour pattern stays identical.
export function deterministicNDVI(): number[] {
  const { rows, cols } = PARCEL_GRID;
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const out: number[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out.push(0.4 + rand() * 0.5);
    }
  }
  return out;
}

export function ndviColor(ndvi: number, flooded: boolean): string {
  if (flooded) return '#c4633c';
  if (ndvi > 0.65) return '#7bc44a';
  if (ndvi > 0.5) return '#a8c468';
  if (ndvi > 0.4) return '#d4a84b';
  return '#a08a4a';
}

// ─────────── Paddy field polygons ───────────
// Programmatically generated paddy polygons within the parcel bbox. Layout:
// 4×4 = 16 paddies in a tilted grid (~22° clockwise from north, mimicking the
// way Klaten paddies align along irrigation canals rather than magnetic north).
// Each paddy ~28m × 28m before bunds & jitter; deterministic.

const PADDY_ROTATION = (22 * Math.PI) / 180;
const PADDY_COLS = 4;
const PADDY_ROWS = 4;

const METERS_PER_DEG_LAT = 110574;
const METERS_PER_DEG_LNG_AT_SIDOREJO = 109520;

function localMetersToLatLng(xEast: number, yNorth: number): LatLng {
  // (xEast, yNorth) is in tilted local meters relative to bbox center.
  // Rotate clockwise by PADDY_ROTATION to get map-aligned meters.
  const cos = Math.cos(PADDY_ROTATION);
  const sin = Math.sin(PADDY_ROTATION);
  const xMap = xEast * cos - yNorth * sin;
  const yMap = xEast * sin + yNorth * cos;
  return [
    SIDOREJO_CENTER[0] + yMap / METERS_PER_DEG_LAT,
    SIDOREJO_CENTER[1] + xMap / METERS_PER_DEG_LNG_AT_SIDOREJO,
  ];
}

// Tiny deterministic PRNG seeded by row + col, for cell-size jitter.
function jitter(r: number, c: number, salt: number): number {
  const v = Math.sin(r * 12.9898 + c * 78.233 + salt * 37.719) * 43758.5453;
  return v - Math.floor(v); // [0, 1)
}

// Indices flagged as flooded in the source-of-truth dataset.
const FLOODED_PADDIES = new Set(['1-1', '1-2', '2-1', '2-2', '2-3', '3-2']);

export type Paddy = {
  id: string;
  polygon: LatLng[]; // 4 corners, lat/lng
  ndvi: number;
  flooded: boolean;
  area: number; // square meters
};

export function generatePaddies(): Paddy[] {
  const cellW = 28; // meters
  const cellH = 28;
  const bund = 1.5; // meters of gap between paddies (rice field bunds / pematang)

  const out: Paddy[] = [];

  for (let r = 0; r < PADDY_ROWS; r++) {
    for (let c = 0; c < PADDY_COLS; c++) {
      // Cell center in tilted local meters, with bbox center at origin.
      const cx = (c - (PADDY_COLS - 1) / 2) * cellW;
      const cy = ((PADDY_ROWS - 1) / 2 - r) * cellH;

      // Per-cell jitter: trim 0–4m off width / height for natural variation.
      const wJitter = jitter(r, c, 1) * 4;
      const hJitter = jitter(r, c, 2) * 4;
      const w = cellW - bund * 2 - wJitter;
      const h = cellH - bund * 2 - hJitter;

      // 4 corners in tilted local meters
      const halfW = w / 2;
      const halfH = h / 2;
      const corners: Array<[number, number]> = [
        [cx - halfW, cy - halfH], // SW
        [cx + halfW, cy - halfH], // SE
        [cx + halfW, cy + halfH], // NE
        [cx - halfW, cy + halfH], // NW
      ];
      const polygon = corners.map(([x, y]) => localMetersToLatLng(x, y));

      const key = `${r}-${c}`;
      const flooded = FLOODED_PADDIES.has(key);

      // NDVI: deterministic from cell index. Flooded → low.
      const baseNdvi = 0.42 + jitter(r, c, 3) * 0.45;
      const ndvi = flooded ? 0.22 : baseNdvi;

      out.push({
        id: `paddy-${key}`,
        polygon,
        ndvi,
        flooded,
        area: w * h,
      });
    }
  }
  return out;
}
