/**
 * Four drawn-for-this-brand icons — hairline gold strokes, no fill, no icon
 * library. Each one is a schematic of what the system actually does.
 */

type IconProps = { className?: string };

const shared = {
  viewBox: '0 0 40 40',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1,
  strokeLinecap: 'square' as const,
  'aria-hidden': true,
  focusable: 'false' as const,
};

/** Radar pulses travelling down through the ground to a buried duct. */
export function GprIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      {/* Machine underside emitter */}
      <path d="M13 6h14v4H13z" />
      {/* Ground line */}
      <path d="M3 14h34" strokeOpacity={0.45} />
      {/* Downward pulses */}
      <path d="M12.5 17.5c3.5-3 11.5-3 15 0" strokeOpacity={0.85} />
      <path d="M10 22.5c5-4.2 15-4.2 20 0" strokeOpacity={0.6} />
      <path d="M7.5 27.5c6.5-5.4 18.5-5.4 25 0" strokeOpacity={0.35} />
      {/* Detected duct */}
      <circle cx="20" cy="32.5" r="3.5" />
      <path d="M20 29v7M16.5 32.5h7" strokeOpacity={0.4} />
    </svg>
  );
}

/** Satellite fixes converging on a survey mark. */
export function GnssIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      {/* Orbit */}
      <path d="M4 13c0 0 6-6 16-6s16 6 16 6" strokeOpacity={0.45} />
      {/* Satellites */}
      <path d="M8.5 9.5h3v3h-3zM28.5 9.5h3v3h-3z" />
      {/* Signal paths */}
      <path d="M11 14 19 25M29 14 21 25" strokeOpacity={0.6} />
      {/* Survey mark */}
      <circle cx="20" cy="28.5" r="4" />
      <circle cx="20" cy="28.5" r="1" />
      <path d="M20 21.5v3M20 32.5v3M13 28.5h3M24 28.5h3" strokeOpacity={0.5} />
    </svg>
  );
}

/** Load-sensing cylinder: rod, piston and a metered flow line. */
export function HydraulicIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      {/* Cylinder body */}
      <path d="M6 12h20v16H6z" />
      {/* Piston head and rod */}
      <path d="M17 12v16" />
      <path d="M26 20h8" />
      <path d="M32 16.5h2v7h-2z" />
      {/* Pressure marks behind the piston */}
      <path d="M9.5 17h5M9.5 20h5M9.5 23h5" strokeOpacity={0.4} />
      {/* Supply line */}
      <path d="M6 33h14" strokeOpacity={0.5} />
      <path d="M20 33v-5" strokeOpacity={0.5} />
    </svg>
  );
}

/** Sound radiating from the powerpack, damped by isolation mounts. */
export function AcousticIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      {/* Source */}
      <path d="M8 16h6v8H8z" />
      {/* Emissions, decaying */}
      <path d="M18 13.5c3.5 3.6 3.5 9.4 0 13" strokeOpacity={0.85} />
      <path d="M23.5 11c5 5 5 13 0 18" strokeOpacity={0.55} />
      <path d="M29 8.5c6.5 6.4 6.5 16.6 0 23" strokeOpacity={0.28} />
      {/* Isolation mounts */}
      <path d="M5 28h12" strokeOpacity={0.45} />
      <path d="M7 28v4M11 28v4M15 28v4" strokeOpacity={0.45} />
    </svg>
  );
}

export const techIcons = {
  gpr: GprIcon,
  gnss: GnssIcon,
  hydraulics: HydraulicIcon,
  acoustics: AcousticIcon,
} as const;

export type TechIconId = keyof typeof techIcons;
