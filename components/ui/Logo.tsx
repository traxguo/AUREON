type LogoProps = {
  className?: string;
  title?: string;
  /** Stroke colour; defaults to the brand gold. */
  color?: string;
};

/**
 * The AUREON mark: a stylised "A" inside a shield.
 * Kept as inline SVG (rather than an <img>) so it inherits colour and can be
 * animated. `/public/logo.svg` carries the identical geometry for OG images
 * and as the 3D decal source — update both together.
 */
export function Logo({ className, title = 'AUREON', color = '#D4AF37' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 64 74"
      fill="none"
      className={className}
      role="img"
      aria-label={title}
      focusable="false"
    >
      <path
        d="M32 2.5 60 12.4v25.9c0 15.6-12.2 26.9-28 33.2C16.2 65.2 4 53.9 4 38.3V12.4L32 2.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <path
        d="M32 9.6 53.4 17v21.1c0 11.9-9.3 20.6-21.4 25.4C19.9 58.7 10.6 50 10.6 38.1V17L32 9.6Z"
        stroke={color}
        strokeWidth={0.7}
        strokeOpacity={0.45}
        strokeLinejoin="round"
      />
      <path d="M32 19.5 44.2 51.5" stroke={color} strokeWidth={1.6} strokeLinecap="square" />
      <path d="M32 19.5 19.8 51.5" stroke={color} strokeWidth={1.6} strokeLinecap="square" />
      <path d="M24.6 40.2h14.8" stroke={color} strokeWidth={1.6} strokeLinecap="square" />
      <path d="M32 13.8v4.1" stroke={color} strokeWidth={0.7} strokeOpacity={0.6} />
    </svg>
  );
}

export default Logo;
