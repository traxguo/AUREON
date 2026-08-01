/**
 * Buried utilities revealed by the radar sweep.
 *
 * `depth` is the real depth in metres (it matches the HUD readouts in the i18n
 * dictionaries). Vertical placement compresses that by DEPTH_SCALE so a 3.2 m
 * sewer and a 0.85 m fibre duct both stay inside one camera frame — the scene
 * would otherwise be mostly empty ground.
 *
 * `order` drives the 200 ms stagger of the HUD labels; `mobile` marks the two
 * lines kept on small screens.
 */

export const DEPTH_SCALE = 0.55;

export type SubsurfaceLine = {
  id: string;
  /** Real burial depth in metres. */
  depth: number;
  /** Pipe/duct radius in metres. */
  radius: number;
  length: number;
  /** Lateral offset across the scene. */
  offset: number;
  /** Heading in radians: 0 runs across the machine, PI/2 runs with it. */
  heading: number;
  color: string;
  /** Cross-section resolution. */
  radialSegments: number;
  /** Rings along the run — without these the wireframe reads as a flat band. */
  lengthSegments: number;
  order: number;
  mobile: boolean;
};

export const subsurfaceLines: SubsurfaceLine[] = [
  {
    id: 'water',
    depth: 2.4,
    radius: 0.16,
    length: 14,
    offset: 1.8,
    heading: Math.PI / 2,
    color: '#A7A9AC',
    radialSegments: 10,
    lengthSegments: 13,
    order: 0,
    mobile: true,
  },
  {
    id: 'power',
    depth: 1.15,
    radius: 0.09,
    length: 14,
    offset: -2.0,
    heading: 0,
    color: '#D4AF37',
    radialSegments: 8,
    lengthSegments: 12,
    order: 1,
    mobile: true,
  },
  {
    id: 'fiber',
    depth: 0.85,
    radius: 0.06,
    length: 13,
    offset: 2.9,
    heading: 0.42,
    color: '#8C7527',
    radialSegments: 6,
    lengthSegments: 11,
    order: 2,
    mobile: false,
  },
  {
    id: 'sewer',
    depth: 3.2,
    radius: 0.28,
    length: 14,
    offset: -3.5,
    heading: Math.PI / 2,
    color: '#A7A9AC',
    radialSegments: 12,
    lengthSegments: 13,
    order: 3,
    mobile: false,
  },
];

export function lineY(depth: number): number {
  return -depth * DEPTH_SCALE;
}
