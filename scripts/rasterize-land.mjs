import { readFileSync, writeFileSync } from 'node:fs';

const STEP = 2; // degrees
const geo = JSON.parse(readFileSync(new URL('./land.geojson', import.meta.url), 'utf8'));

/** Collect every ring as a flat array of [lon,lat] pairs, tagged outer/hole. */
const polygons = [];
for (const f of geo.features) {
  const g = f.geometry;
  const list = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  for (const poly of list) polygons.push(poly);
}

function pointInRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function isLand(lon, lat) {
  for (const poly of polygons) {
    if (!pointInRing(lon, lat, poly[0])) continue;
    let hole = false;
    for (let h = 1; h < poly.length; h++) {
      if (pointInRing(lon, lat, poly[h])) { hole = true; break; }
    }
    if (!hole) return true;
  }
  return false;
}

// Bounding boxes per polygon to skip fast
const boxes = polygons.map((poly) => {
  let minX = 180, maxX = -180, minY = 90, maxY = -90;
  for (const [x, y] of poly[0]) {
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return [minX, maxX, minY, maxY];
});

function isLandFast(lon, lat) {
  for (let p = 0; p < polygons.length; p++) {
    const [minX, maxX, minY, maxY] = boxes[p];
    if (lon < minX || lon > maxX || lat < minY || lat > maxY) continue;
    const poly = polygons[p];
    if (!pointInRing(lon, lat, poly[0])) continue;
    let hole = false;
    for (let h = 1; h < poly.length; h++) {
      if (pointInRing(lon, lat, poly[h])) { hole = true; break; }
    }
    if (!hole) return true;
  }
  return false;
}

const cols = 360 / STEP;
const rows = 180 / STEP;
const out = [];
let landCount = 0;
for (let r = 0; r < rows; r++) {
  const lat = 90 - r * STEP - STEP / 2;
  let line = '';
  for (let c = 0; c < cols; c++) {
    const lon = -180 + c * STEP + STEP / 2;
    const land = isLandFast(lon, lat);
    if (land) landCount++;
    line += land ? '1' : '0';
  }
  out.push(line);
}

// Drop Antarctica rows (below 60S) — visual noise on a business map.
const trimmed = out.map((line, r) => {
  const lat = 90 - r * STEP - STEP / 2;
  return lat < -60 ? '0'.repeat(cols) : line;
});

const file = `/**
 * Dot-matrix land mask, rasterised from Natural Earth 110m land polygons.
 * One character per ${STEP}° cell: "1" = land, "0" = water.
 * Row 0 is the northernmost band; column 0 starts at 180°W.
 * Antarctica is intentionally blanked.
 *
 * Regenerate: see README (scripts/rasterize-land.mjs).
 */
export const LAND_MASK_STEP = ${STEP};
export const LAND_MASK_COLS = ${cols};
export const LAND_MASK_ROWS = ${rows};

export const LAND_MASK: readonly string[] = [
${trimmed.map((l) => `  '${l}',`).join('\n')}
];

/** Every land cell as a [longitude, latitude] pair. */
export function landCoordinates(step = 1): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  for (let r = 0; r < LAND_MASK_ROWS; r += step) {
    const row = LAND_MASK[r];
    const lat = 90 - r * LAND_MASK_STEP - LAND_MASK_STEP / 2;
    for (let c = 0; c < LAND_MASK_COLS; c += step) {
      if (row[c] === '1') {
        points.push([-180 + c * LAND_MASK_STEP + LAND_MASK_STEP / 2, lat]);
      }
    }
  }
  return points;
}
`;

writeFileSync('/home/user/AUREON/data/worldMask.ts', file);
console.log(`grid ${cols}x${rows}, land cells ${landCount}`);
