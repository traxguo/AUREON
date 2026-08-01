import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Site photography is dropped in by hand, so the filenames are whatever the
 * person adding them chose. Listing the folder at build time lets the panel
 * match a photo to its site by id, country code, country or city — and means a
 * site without a photo makes no request at all, instead of a console 404.
 */
function readSitePhotos() {
  const dir = fileURLToPath(new URL('./public/sites', import.meta.url));
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((name) => /\.(jpe?g|png|webp|avif)$/i.test(name));
}

/**
 * The hero prefers a real GLB but ships without one. Resolving its presence at
 * build time avoids a runtime 404 probe (and the console error that comes with
 * it) — drop the file in and redeploy to switch models.
 */
const modelPath = fileURLToPath(new URL('./public/models/aureon-s5.glb', import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  env: {
    NEXT_PUBLIC_HAS_GLB_MODEL: existsSync(modelPath) ? '1' : '0',
    NEXT_PUBLIC_SITE_PHOTOS: JSON.stringify(readSitePhotos()),
  },
};

export default nextConfig;
