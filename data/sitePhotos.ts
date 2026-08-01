import type { Site } from './sites';

/**
 * Matches a file in `public/sites/` to a reference site.
 *
 * The folder listing is baked in at build time by `next.config.mjs`, so this
 * runs against a known list: a site with no photo renders the placeholder
 * without ever requesting a missing file.
 *
 * Whoever adds the photography should not have to learn our id scheme, so a
 * file matches on any of: the site id (`dz`), the ISO code (`DZ`), the country
 * (`algeria`) or the city (`oran`). Punctuation, case and accents are ignored,
 * which also covers exports like `ORAN-ALGERIA.jpg` and `Göteborg.jpeg`.
 */

const files: string[] = (() => {
  try {
    const parsed: unknown = JSON.parse(process.env.NEXT_PUBLIC_SITE_PHOTOS ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((f): f is string => typeof f === 'string') : [];
  } catch {
    return [];
  }
})();

/**
 * Latin letters that are their own character rather than a base plus a
 * combining mark, so NFD leaves them intact and the a–z filter below would
 * delete them outright.
 *
 * The dotless i matters in practice: a Turkish keyboard turns "libya" into
 * "lıbya", which would otherwise normalise to "lbya" and match nothing.
 */
const TRANSLITERATE: Record<string, string> = {
  ı: 'i',
  İ: 'i',
  ł: 'l',
  đ: 'd',
  ð: 'd',
  ø: 'o',
  œ: 'oe',
  æ: 'ae',
  ß: 'ss',
  þ: 'th',
};

function normalise(value: string): string {
  return value
    .replace(/[ıİłđðøœæßþ]/gi, (char) => TRANSLITERATE[char] ?? TRANSLITERATE[char.toLowerCase()] ?? char)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '');
}

function stem(filename: string): string {
  return normalise(filename.replace(/\.[^.]+$/, ''));
}

export function resolveSitePhoto(site: Site): string | null {
  if (files.length === 0) return null;

  // Whole-name matches first: `dz.jpg`, `DZ.png`, `algeria.jpg`, `oran.webp`.
  const exact = [site.id, site.countryCode, site.country, site.city].map(normalise);
  for (const key of exact) {
    const hit = files.find((file) => stem(file) === key);
    if (hit) return `/sites/${hit}`;
  }

  // Then names that merely contain the country or city, so a label baked into
  // the export ("ORAN-ALGERIA") still lands on the right record. Short keys are
  // skipped here — a two-letter code would match almost anything.
  for (const key of [normalise(site.country), normalise(site.city)]) {
    if (key.length < 4) continue;
    const hit = files.find((file) => stem(file).includes(key));
    if (hit) return `/sites/${hit}`;
  }

  return null;
}

/** Exposed for the README/debugging: what the build actually found. */
export const sitePhotoFiles = files;
