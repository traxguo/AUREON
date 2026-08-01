/**
 * Reference field sites.
 *
 * This is the single source of truth for the field map section. To add a
 * machine, append a record here and drop a 16:9 photo at
 * `/public/sites/{id}.jpg`. A missing photo renders a typographic placeholder,
 * never a broken image.
 *
 * `sector` is a key into `map.sectors` in the i18n dictionaries, so the label
 * translates with the rest of the site. `country` is a key into `map.countries`.
 */

export type SiteTier = 'primary' | 'secondary';

export type Site = {
  id: string;
  country: string;
  countryCode: string;
  city: string;
  company: string;
  sector: string;
  monthsInField: number;
  hours: number;
  serial: string;
  productionDate: string;
  lat: number;
  lng: number;
  tier: SiteTier;
  photo: string;
};

export const sites: Site[] = [
  {
    id: 'si',
    country: 'slovenia',
    countryCode: 'SI',
    city: 'Ljubljana',
    company: 'Gradnja Vertika d.o.o.',
    sector: 'urban-renewal',
    monthsInField: 14,
    hours: 1840,
    serial: 'AUR-S5-0003',
    productionDate: '02 / 2026',
    lat: 46.0569,
    lng: 14.5058,
    tier: 'primary',
    photo: '/sites/si.jpg',
  },
  {
    id: 'ro',
    country: 'romania',
    countryCode: 'RO',
    city: 'Cluj-Napoca',
    company: 'Carpat Infrastructura SRL',
    sector: 'road-sewer',
    monthsInField: 11,
    hours: 1520,
    serial: 'AUR-S5-0006',
    productionDate: '05 / 2026',
    lat: 46.7712,
    lng: 23.6236,
    tier: 'primary',
    photo: '/sites/ro.jpg',
  },
  {
    id: 'bg',
    country: 'bulgaria',
    countryCode: 'BG',
    city: 'Plovdiv',
    company: 'Maritsa Stroy EOOD',
    sector: 'landscaping',
    monthsInField: 9,
    hours: 1180,
    serial: 'AUR-S5-0009',
    productionDate: '07 / 2026',
    lat: 42.1354,
    lng: 24.7453,
    tier: 'primary',
    photo: '/sites/bg.jpg',
  },
  {
    id: 'se',
    country: 'sweden',
    countryCode: 'SE',
    city: 'Göteborg',
    company: 'Nordvik Anläggning AB',
    sector: 'fiber',
    monthsInField: 16,
    hours: 2140,
    serial: 'AUR-S5-0001',
    productionDate: '12 / 2025',
    lat: 57.7089,
    lng: 11.9746,
    tier: 'primary',
    photo: '/sites/se.jpg',
  },
  {
    id: 'ua',
    country: 'ukraine',
    countryCode: 'UA',
    city: 'Lviv',
    company: 'Podillia Budtekh TOV',
    sector: 'rebuild',
    monthsInField: 7,
    hours: 980,
    serial: 'AUR-S5-0012',
    productionDate: '09 / 2026',
    lat: 49.8397,
    lng: 24.0297,
    tier: 'primary',
    photo: '/sites/ua.jpg',
  },
  {
    id: 'az',
    country: 'azerbaijan',
    countryCode: 'AZ',
    city: 'Baku',
    company: 'Xəzər Tikinti MMC',
    sector: 'energy',
    monthsInField: 13,
    hours: 1690,
    serial: 'AUR-S5-0004',
    productionDate: '03 / 2026',
    lat: 40.4093,
    lng: 49.8671,
    tier: 'secondary',
    photo: '/sites/az.jpg',
  },
  {
    id: 'ge',
    country: 'georgia',
    countryCode: 'GE',
    city: 'Tbilisi',
    company: 'Mtkvari Construction LLC',
    sector: 'urban-dig',
    monthsInField: 10,
    hours: 1310,
    serial: 'AUR-S5-0007',
    productionDate: '06 / 2026',
    lat: 41.7151,
    lng: 44.8271,
    tier: 'secondary',
    photo: '/sites/ge.jpg',
  },
  {
    id: 'tn',
    country: 'tunisia',
    countryCode: 'TN',
    city: 'Sfax',
    company: 'Sahel Travaux Publics SARL',
    sector: 'municipal',
    monthsInField: 8,
    hours: 1050,
    serial: 'AUR-S5-0010',
    productionDate: '08 / 2026',
    lat: 34.7406,
    lng: 10.7603,
    tier: 'secondary',
    photo: '/sites/tn.jpg',
  },
  {
    id: 'ly',
    country: 'libya',
    countryCode: 'LY',
    city: 'Misrata',
    company: 'Barqa Engineering Works',
    sector: 'water',
    monthsInField: 6,
    hours: 820,
    serial: 'AUR-S5-0014',
    productionDate: '10 / 2026',
    lat: 32.3754,
    lng: 15.0925,
    tier: 'secondary',
    photo: '/sites/ly.jpg',
  },
  {
    id: 'dz',
    country: 'algeria',
    countryCode: 'DZ',
    city: 'Oran',
    company: 'Chelif Constructions SPA',
    sector: 'road-urban',
    monthsInField: 12,
    hours: 1560,
    serial: 'AUR-S5-0011',
    productionDate: '04 / 2026',
    lat: 35.6971,
    lng: -0.6308,
    tier: 'secondary',
    photo: '/sites/dz.jpg',
  },
];

/** Used when the browser will not share a location. */
export const FALLBACK_ORIGIN = { lat: 40.4168, lng: -3.7038, label: 'Madrid, España' };

/**
 * Which tier the "nearest AUREON" readout is allowed to pick from.
 * Primary sites are inside the EU and realistic to visit on a day trip, so a
 * European buyer is pointed at those rather than at a closer secondary site.
 * Set to `null` to consider every site regardless of tier.
 */
export const NEAREST_TIER_PREFERENCE: SiteTier | null = 'primary';

const EARTH_RADIUS_KM = 6371;

export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function nearestSite(origin: { lat: number; lng: number }): {
  site: Site;
  distance: number;
} {
  const pool = NEAREST_TIER_PREFERENCE
    ? sites.filter((s) => s.tier === NEAREST_TIER_PREFERENCE)
    : sites;
  const candidates = pool.length > 0 ? pool : sites;

  let best = candidates[0];
  let bestDistance = distanceKm(origin, best);
  for (const site of candidates.slice(1)) {
    const d = distanceKm(origin, site);
    if (d < bestDistance) {
      best = site;
      bestDistance = d;
    }
  }
  return { site: best, distance: bestDistance };
}
