import * as THREE from 'three';

/** Radius of the globe in world units. */
export const GLOBE_RADIUS = 2;

/**
 * Latitude/longitude to a point on the sphere.
 * Longitude 0 faces +Z, so an untouched globe presents the prime meridian to
 * the camera.
 */
export function latLngToVector3(lat: number, lng: number, radius = GLOBE_RADIUS): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/**
 * Globe rotation (x, y) that brings a surface point round to face the camera.
 *
 * With the default XYZ Euler order the matrix is Rx · Ry, so the yaw is solved
 * first (swing the point into the YZ plane) and the pitch second (lift it to
 * the equator). Solving in that order keeps north up — a minimal-arc quaternion
 * would roll the poles.
 */
export function rotationForPoint(point: THREE.Vector3): { x: number; y: number } {
  const y = Math.atan2(-point.x, point.z);
  const horizontal = Math.hypot(point.x, point.z);
  const x = Math.atan2(point.y, horizontal);
  return { x, y };
}

/** Shortest signed delta between two angles, so focusing never takes the long way. */
export function shortestAngle(from: number, to: number): number {
  let delta = (to - from) % (Math.PI * 2);
  if (delta > Math.PI) delta -= Math.PI * 2;
  if (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

export function easeInOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
