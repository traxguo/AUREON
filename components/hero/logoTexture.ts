import * as THREE from 'three';

const GOLD = '#D4AF37';

/** The same path data as `components/ui/Logo.tsx` — keep the two in sync. */
const SHIELD_OUTER = 'M32 2.5 60 12.4v25.9c0 15.6-12.2 26.9-28 33.2C16.2 65.2 4 53.9 4 38.3V12.4L32 2.5Z';
const SHIELD_INNER = 'M32 9.6 53.4 17v21.1c0 11.9-9.3 20.6-21.4 25.4C19.9 58.7 10.6 50 10.6 38.1V17L32 9.6Z';
const A_RIGHT = 'M32 19.5 44.2 51.5';
const A_LEFT = 'M32 19.5 19.8 51.5';
const A_BAR = 'M24.6 40.2h14.8';

function strokePath(ctx: CanvasRenderingContext2D, d: string, width: number, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineWidth = width;
  ctx.strokeStyle = GOLD;
  ctx.lineJoin = 'round';
  ctx.stroke(new Path2D(d));
  ctx.restore();
}

/** Manually tracked wordmark — canvas `letterSpacing` is not universal yet. */
function drawWordmark(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  tracking: number,
) {
  ctx.save();
  ctx.font = `600 ${size}px ui-sans-serif, system-ui, "Helvetica Neue", Arial, sans-serif`;
  ctx.fillStyle = GOLD;
  ctx.textBaseline = 'middle';
  let cursor = x;
  for (const char of text) {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + tracking;
  }
  ctx.restore();
}

/**
 * Builds the badge applied to the excavator's side panels: shield mark plus
 * wordmark, drawn on a transparent canvas so it reads as painted-on livery.
 * Returns null when there is no DOM (SSR) — callers fall back to bare metal.
 */
export function createLogoTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;

  const width = 640;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, width, height);

  // Shield, drawn from the SVG path data at 3× scale, vertically centred.
  ctx.save();
  ctx.translate(24, (height - 74 * 2.9) / 2);
  ctx.scale(2.9, 2.9);
  strokePath(ctx, SHIELD_OUTER, 1.9);
  strokePath(ctx, SHIELD_INNER, 0.8, 0.45);
  strokePath(ctx, A_RIGHT, 1.9);
  strokePath(ctx, A_LEFT, 1.9);
  strokePath(ctx, A_BAR, 1.9);
  ctx.restore();

  drawWordmark(ctx, 'AUREON', 230, height / 2 - 16, 62, 9);

  // Model designation, small and monospaced-feeling.
  ctx.save();
  ctx.globalAlpha = 0.7;
  drawWordmark(ctx, 'S5', 232, height / 2 + 42, 26, 7);
  ctx.restore();

  // Hairline rule between wordmark and designation.
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(232, height / 2 + 16);
  ctx.lineTo(width - 34, height / 2 + 16);
  ctx.stroke();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  if ('colorSpace' in texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }
  return texture;
}
