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
