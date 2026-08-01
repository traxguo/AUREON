import * as THREE from 'three';

const GOLD = '#D4AF37';
const GREY = '#A7A9AC';

/** The same path data as `components/ui/Logo.tsx` — keep the two in sync. */
const BASE_FORM = 'M40 74h20v0c0 10-5 17-10 22-5-5-10-12-10-22Z';
const SHIELD = 'M8 8h22l20 14 20-14h22v46c0 24-42 42-42 42S8 78 8 54V8Z';
const LETTER_A = 'M50 12 78 86H60L50 44 40 86H22L50 12Z';

/** Manually tracked wordmark — canvas `letterSpacing` is not universal yet. */
function drawWordmark(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  tracking: number,
  color = GOLD,
) {
  ctx.save();
  ctx.font = `500 ${size}px ui-sans-serif, system-ui, "Helvetica Neue", Arial, sans-serif`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  let cursor = x;
  for (const char of text) {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + tracking;
  }
  ctx.restore();
}

/**
 * Builds the badge applied to the excavator's side panels: the shield mark
 * plus wordmark, drawn on a transparent canvas so it reads as painted-on
 * livery. Returns null when there is no DOM (SSR) — callers fall back to
 * bare metal.
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

  // Mark, drawn from the shared path data at 2× scale, vertically centred.
  const scale = 2;
  ctx.save();
  ctx.translate(20, (height - 104 * scale) / 2);
  ctx.scale(scale, scale);

  ctx.globalAlpha = 0.5;
  ctx.fillStyle = GREY;
  ctx.fill(new Path2D(BASE_FORM));

  ctx.globalAlpha = 1;
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 7;
  ctx.lineJoin = 'round';
  ctx.stroke(new Path2D(SHIELD));

  ctx.fillStyle = GOLD;
  ctx.fill(new Path2D(LETTER_A));
  ctx.fillRect(32, 66, 36, 10);
  ctx.restore();

  drawWordmark(ctx, 'AUREON', 268, height / 2 - 14, 58, 11);

  // Hairline rule and model designation.
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(270, height / 2 + 20);
  ctx.lineTo(width - 30, height / 2 + 20);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.75;
  drawWordmark(ctx, 'S5', 270, height / 2 + 46, 26, 8, GREY);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  if ('colorSpace' in texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }
  return texture;
}
