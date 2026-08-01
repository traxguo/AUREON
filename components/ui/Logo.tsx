type LogoProps = {
  className?: string;
  title?: string;
  /** Mark colour; defaults to the brand gold. */
  color?: string;
};

/**
 * The AUREON mark: a notched shield with a solid "A" that breaks out of it at
 * the notch and at the feet, over a grey base form.
 *
 * Drawn flat rather than with the brushed-metal gradients of the print
 * original — the site's palette rules out gradients, and at 28 px in the
 * header a bevel turns to mud. Geometry is shared with `public/logo.svg` and
 * `components/hero/logoTexture.ts`; update all three together.
 */
export function Logo({ className, title = 'AUREON', color = '#D4AF37' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 104"
      fill="none"
      className={className}
      role="img"
      aria-label={title}
      focusable="false"
    >
      {/* Structural balance */}
      <path
        d="M40 74h20v0c0 10-5 17-10 22-5-5-10-12-10-22Z"
        fill="#A7A9AC"
        fillOpacity={0.5}
      />
      {/* Shield */}
      <path
        d="M8 8h22l20 14 20-14h22v46c0 24-42 42-42 42S8 78 8 54V8Z"
        stroke={color}
        strokeWidth={7}
        strokeLinejoin="round"
      />
      {/* The A */}
      <path d="M50 12 78 86H60L50 44 40 86H22L50 12Z" fill={color} />
      <rect x={32} y={66} width={36} height={10} fill={color} />
    </svg>
  );
}

export default Logo;
