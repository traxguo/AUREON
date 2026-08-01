/**
 * The hidden message.
 *
 * Deliberately not a route. A page at `/guo` would show up in crawls, the
 * sitemap and anyone's URL guesses; a key sequence leaves no trace in the
 * markup or the network tab until it fires.
 *
 * The sequence is the Konami opening with G-U-O in place of B-A: long enough
 * that nobody triggers it by accident, short enough to type from memory.
 * Values are KeyboardEvent.code, so they are layout-independent.
 */
export const SECRET_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyG',
  'KeyU',
  'KeyO',
] as const;

/** How long a partial sequence stays alive before it resets, in ms. */
export const SEQUENCE_TIMEOUT = 3000;

/** Everything below is yours to rewrite — it is the whole point of the panel. */
export const secretMessage = {
  eyebrow: 'Restricted record',
  serial: 'AUR-S5-0000',
  title: 'Prototype 000',
  lines: [
    'The first S5 was never sold.',
    'It sits in the yard where the line was built, and every machine that leaves is measured against it.',
  ],
  signature: 'GUO',
  signatureNote: 'Founder',
  fields: [
    { label: 'Location', value: '39.9334° N, 32.8597° E' },
    { label: 'Built', value: '11 / 2025' },
    { label: 'Hours', value: '0' },
    { label: 'Status', value: 'Not for sale' },
  ],
  close: 'Close',
  hint: 'This record is not linked from anywhere.',
} as const;
