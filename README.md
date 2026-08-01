# AUREON S5

Export site for the AUREON S5 — a 5-tonne mini excavator with ground
penetrating radar. Single page, English-first, built for European buyers.

Next.js 14 (App Router) · TypeScript · Tailwind · React Three Fiber · GSAP ·
Framer Motion.

---

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build
npm run start        # serve the production build
npm run typecheck    # tsc --noEmit
npm run lint
```

Node 18.17+ is required (Node 22 recommended). The three brand fonts are
downloaded at build time by `next/font`, so the first build needs network
access.

---

## What is where

```
app/
  layout.tsx            metadata, OpenGraph, JSON-LD, font wiring
  page.tsx              section order
  globals.css           design tokens, type roles, buttons, fields
  api/contact/          POST /api/contact
  api/visit-request/    POST /api/visit-request
components/
  hero/                 the 400vh scroll sequence and its 3D scene
  map/                  the reference field map: globe, panel, modal
  sections/             positioning, technology, specs, export, contact
  layout/               header, footer, scroll progress
  icons/                the four hand-drawn technology icons
data/                   site records, company constants, world land mask
i18n/                   en.ts (source of truth), tr.ts, es.ts
scripts/                one-off generator for the land mask
```

No copy lives inside a component. Every string comes from `i18n/`, every
record from `data/`.

---

## Editing content

### Text

`i18n/en.ts` is the source of truth: its shape defines the `Dictionary` type,
so adding a key there makes TypeScript tell you what is missing elsewhere.

- **English** — `i18n/en.ts`
- **Turkish** — `i18n/tr.ts`, fully translated
- **Spanish** — `i18n/es.ts`, inherits from English via `structuredClone(en)`
  and overrides section by section. Still English: the technology card bodies
  and the specification tables. To translate one, move its key out of the
  spread and into the object.

The language switcher (top right and in the footer) stores the choice in
`localStorage`; English is the default on first visit.

### Reference sites

`data/sites.ts`. Append a record and it appears on the globe, in the mobile
list, and in the nearest-machine calculation:

```ts
{
  id: 'pt', country: 'portugal', countryCode: 'PT', city: 'Porto',
  company: 'Douro Obras Lda', sector: 'urban-renewal',
  monthsInField: 9, hours: 1210, serial: 'AUR-S5-0016',
  productionDate: '01 / 2027', lat: 41.1579, lng: -8.6291,
  tier: 'primary', photo: '/sites/pt.jpg',
}
```

- `sector` is a key into `map.sectors`, `country` a key into `map.countries` —
  add them to all three dictionaries so the labels translate.
- `tier: 'primary'` draws a bright gold pin (EU sites a buyer can visit);
  `'secondary'` draws a dimmed one.
- `NEAREST_TIER_PREFERENCE` in the same file controls which tier the
  "nearest AUREON" readout may pick from. Set it to `null` to consider all
  sites.

### Prices, company details, country list

`data/company.ts`.

---

## Assets

Everything below is optional — the site is complete without any of it, and
nothing here can break a build.

| Asset | Path | Fallback when missing |
|---|---|---|
| Logo | `public/logo.svg` | — (shipped; mirrored in `components/ui/Logo.tsx`) |
| 3D model | `public/models/aureon-s5.glb` | Low-poly model built from primitives |
| Site photos | `public/sites/{id}.jpg` | Typographic placeholder with the serial |
| OG image | `public/og.png` | — (shipped) |

**The logo** is a web translation of the brand mark: notched shield, a solid
"A" that rises through the notch and breaks past the shield at the feet, over
the grey "structural balance" base form. It is drawn flat — the print original
uses brushed-metal gradients, which the palette rules out and which turn to
mud at 28 px in the header.

The identical path data lives in three places; change all three together:

- `public/logo.svg` — favicon and static uses
- `components/ui/Logo.tsx` — the mark in the header and footer
- `components/hero/logoTexture.ts` — painted onto the excavator's side panels

The wordmark is set with the `.wordmark` class (Work Sans, uppercase, 0.24em
tracking) rather than the display face: the logotype is wide and geometric
while Big Shoulders Display is condensed. Big Shoulders remains the heading
typeface everywhere else.

Regenerating `public/og.png` after a logo change is manual — it is a static
render of a 1200 × 630 layout using the same paths.

**Adding the real 3D model:** drop the `.glb` in `public/models/` and
redeploy. Presence is resolved at build time in `next.config.mjs`, so no
runtime request is made when the file is absent. The loader rescales the model
to 5.1 units long and sits it on the ground plane, so the camera path needs no
changes. See `public/models/README.md`.

---

## Forms

Both routes validate their payload and log it server-side, then return
`{ ok: true }`. They are the seam for a mailer or CRM — replace the
`console.info` call in each:

- `app/api/visit-request/route.ts` — site visit requests
- `app/api/contact/route.ts` — quotation enquiries

Site visit requests deliberately go through AUREON. The host company's phone,
email and contact name are never rendered anywhere on the site, for GDPR/KVKK
reasons and to keep hosts from being contacted directly.

---

## Regenerating the world map

The globe's dot matrix comes from `data/worldMask.ts`, a 1° land grid
rasterised from Natural Earth's 110 m land polygons. It is committed, so
nothing at build or request time depends on this script. To regenerate (for
example at a different resolution — change `STEP`):

```bash
node scripts/rasterize-land.mjs
```

It downloads the source polygons on first run and caches them next to the
script.

---

## Deploying to Vercel

1. Push the repository to GitHub.
2. In Vercel, **Add New → Project** and import it. The framework preset is
   detected as Next.js; the default build command and output directory are
   correct.
3. Set one environment variable:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |

   It is used for canonical URLs, OpenGraph and JSON-LD. Without it the code
   falls back to `https://aureon-s5.vercel.app`.
4. Deploy. Add the custom domain under **Settings → Domains**.

Adding a `.glb` or site photos later only needs a commit — Vercel rebuilds and
the model-presence flag is recomputed.

---

## Design and behaviour notes

- **Colour** is limited to gold `#D4AF37`, ink `#0D0D0D`, graphite `#1F2023`,
  silver `#A7A9AC` and bone `#F3F1EA`, defined as Tailwind tokens in
  `tailwind.config.ts`. Gold is an accent, not a surface.
- **Type** has three roles: `display-heading` (Big Shoulders Display) for
  headings, Work Sans for body, and `.data-label` / `.data-label-sm`
  (JetBrains Mono, wide tracking, uppercase) for every number, code and unit.
- **Motion** uses one curve, `cubic-bezier(0.22, 1, 0.36, 1)`: 200 ms for
  micro-transitions, 400 ms for panels, 800 ms for camera moves. The hero and
  the globe perform; everything else gets a plain 24 px fade-up with an 80 ms
  stagger.
- **Reduced motion** shortens the hero track and snaps it to four static
  frames instead of animating; Framer Motion reveals drop their translation.
- **Mobile** (≤768 px) halves the globe's dot density, drops the hero to two
  buried utilities and fewer radar rings, caps `dpr` at 1.5, and replaces the
  globe with a vertical site list that keeps the same selection and panel
  behaviour.
- **3D scenes** are `dynamic(..., { ssr: false })` so they never block first
  paint. The hero shows a gold progress rule until the canvas reports ready.
