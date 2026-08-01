'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useT } from '@/components/i18n/LanguageProvider';
import { useIsMobile, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import HeroOverlay from './HeroOverlay';
import { REDUCED_MOTION_FRAMES, setHeroProgress } from './heroProgress';

/** WebGL never runs on the server, and it must not block first paint. */
const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
});

/** Scroll track length. Reduced motion gets a much shorter, four-frame track. */
const TRACK_VH = 400;
const REDUCED_TRACK_VH = 220;

function HeroLoader({ visible, label, hint }: { visible: boolean; label: string; hint: string }) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-ink transition-opacity duration-500 ease-aureon"
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
      aria-hidden={!visible}
    >
      <span className="wordmark text-xl md:text-2xl">AUREON</span>
      <div className="mt-6 h-px w-40 overflow-hidden bg-silver/15" role="progressbar" aria-label={label}>
        <div className="h-full w-full origin-left bg-gold" style={{ animation: 'aureon-load 1.4s cubic-bezier(0.22,1,0.36,1) infinite' }} />
      </div>
      <span className="data-label-sm mt-4 text-silver/50">{hint}</span>
      <style>{`@keyframes aureon-load{0%{transform:scaleX(0)}55%{transform:scaleX(1)}100%{transform:scaleX(1);opacity:0}}`}</style>
    </div>
  );
}

export function Hero() {
  const t = useT();
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = container.current;
    if (!element) return;

    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top top',
      end: 'bottom bottom',
      scrub: reducedMotion ? false : 0.35,
      onUpdate: (self) => {
        if (!reducedMotion) {
          setHeroProgress(self.progress);
          return;
        }
        // Reduced motion: snap to the nearest of four static frames instead of
        // animating continuously.
        const index = Math.min(
          REDUCED_MOTION_FRAMES.length - 1,
          Math.floor(self.progress * REDUCED_MOTION_FRAMES.length),
        );
        setHeroProgress(REDUCED_MOTION_FRAMES[index]);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [reducedMotion]);

  // Recalculate once the canvas has taken its final size.
  useEffect(() => {
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  return (
    <section
      ref={container}
      id="hero"
      aria-label={t.hero.subtitle}
      style={{ height: `${reducedMotion ? REDUCED_TRACK_VH : TRACK_VH}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0" role="img" aria-label={t.a11y.heroCanvasAlt}>
          <HeroScene mobile={isMobile} still={reducedMotion} onReady={() => setReady(true)} />
        </div>
        <HeroOverlay ready={ready} />
        <HeroLoader visible={!ready} label={t.loader.label} hint={t.loader.hint} />
      </div>
    </section>
  );
}

export default Hero;
