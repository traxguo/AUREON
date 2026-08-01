/**
 * Scroll progress for the hero sequence, shared between the GSAP ScrollTrigger
 * that writes it and the render loop / DOM overlay that read it.
 *
 * It deliberately lives outside React state: the 3D scene samples it every
 * frame and the overlay only re-renders when a phase boundary is crossed, so
 * pushing this through `useState` would cost 60 re-renders a second.
 */

export type HeroPhase = 'arrival' | 'recognition' | 'scan' | 'message' | 'release';

/** Sequence timeline, as fractions of the 400vh scroll track. */
export const PHASES = {
  arrival: [0, 0.15],
  recognition: [0.15, 0.35],
  scan: [0.35, 0.65],
  message: [0.65, 0.85],
  release: [0.85, 1],
} as const;

/** Static frames used when the visitor prefers reduced motion. */
export const REDUCED_MOTION_FRAMES = [0.07, 0.25, 0.5, 0.78];

type Listener = (progress: number) => void;

const listeners = new Set<Listener>();

export const heroProgress = { value: 0 };

export function setHeroProgress(next: number): void {
  const clamped = next < 0 ? 0 : next > 1 ? 1 : next;
  if (clamped === heroProgress.value) return;
  heroProgress.value = clamped;
  for (const listener of listeners) listener(clamped);
}

export function subscribeHeroProgress(listener: Listener): () => void {
  listeners.add(listener);
  listener(heroProgress.value);
  return () => {
    listeners.delete(listener);
  };
}

export function phaseAt(progress: number): HeroPhase {
  if (progress < PHASES.arrival[1]) return 'arrival';
  if (progress < PHASES.recognition[1]) return 'recognition';
  if (progress < PHASES.scan[1]) return 'scan';
  if (progress < PHASES.message[1]) return 'message';
  return 'release';
}

/* ---------- easing / interpolation helpers ---------- */

export function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** Normalised position inside [start, end], clamped to 0..1. */
export function range(value: number, start: number, end: number): number {
  if (end === start) return value >= end ? 1 : 0;
  return clamp01((value - start) / (end - start));
}

export function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = range(value, edge0, edge1);
  return t * t * (3 - 2 * t);
}

/** The site's motion curve — sharp start, soft landing. */
export function easeOutQuint(t: number): number {
  return 1 - Math.pow(1 - clamp01(t), 5);
}

export function easeInOutCubic(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Frame-rate independent damping toward a target. */
export function damp(current: number, target: number, lambda: number, delta: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * delta));
}
