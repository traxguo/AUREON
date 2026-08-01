import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

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
  },
};

export default nextConfig;
