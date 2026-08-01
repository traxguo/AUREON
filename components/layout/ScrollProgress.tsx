'use client';

import { useEffect, useRef } from 'react';
import { useT } from '@/components/i18n/LanguageProvider';

/** A 2 px gold rule down the right edge, tracking page progress. */
export function ScrollProgress() {
  const t = useT();
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      if (bar.current) {
        bar.current.style.transform = `scaleY(${Math.min(1, Math.max(0, progress))})`;
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed right-0 top-0 z-50 hidden h-screen w-0.5 bg-silver/10 md:block"
      role="progressbar"
      aria-label={t.a11y.scrollProgress}
    >
      <div ref={bar} className="h-full w-full origin-top bg-gold" style={{ transform: 'scaleY(0)' }} />
    </div>
  );
}

export default ScrollProgress;
