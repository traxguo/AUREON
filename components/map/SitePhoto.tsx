'use client';

import { useEffect, useState } from 'react';

/**
 * Site photography is optional. When no file matched the site the frame holds
 * its shape with a typographic placeholder — a broken-image icon would undo
 * everything else on the page.
 *
 * The frame is 3:2 to match the supplied field photography; `object-cover`
 * absorbs any other ratio without letterboxing.
 */
export function SitePhoto({
  src,
  alt,
  placeholder,
  caption,
}: {
  src: string | null;
  alt: string;
  placeholder: string;
  caption: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  const showImage = src !== null && !failed;

  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden bg-graphite">
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- hand-dropped asset resolved at build time; the optimiser adds nothing here
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-5">
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-gold/30">
            <span className="data-label-sm text-gold/70">{placeholder}</span>
            <span className="data-label-sm text-silver/35">{caption}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SitePhoto;
