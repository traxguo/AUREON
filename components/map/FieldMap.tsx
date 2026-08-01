'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useT } from '@/components/i18n/LanguageProvider';
import FadeUp from '@/components/motion/FadeUp';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { FALLBACK_ORIGIN, nearestSite, sites, type Site } from '@/data/sites';
import SitePanel from './SitePanel';
import VisitRequestModal from './VisitRequestModal';

const Globe = dynamic(() => import('./Globe'), {
  ssr: false,
  loading: () => <div className="aspect-square w-full" aria-hidden />,
});

type Hint = { x: number; y: number } | null;

export function FieldMap({ id }: { id: string }) {
  const t = useT();
  const isMobile = useIsMobile();

  const [origin, setOrigin] = useState(FALLBACK_ORIGIN);
  const [located, setLocated] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hovered, setHovered] = useState<Site | null>(null);
  const [hint, setHint] = useState<Hint>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const section = useRef<HTMLElement>(null);

  const nearest = useMemo(() => nearestSite(origin), [origin]);

  /**
   * Ask for the visitor's location only once this section is actually on
   * screen — a permission prompt on page load would be an ambush, and the
   * Madrid fallback keeps the readout meaningful either way.
   */
  useEffect(() => {
    const element = section.current;
    if (!element || !('geolocation' in navigator)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setOrigin({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              label: '',
            });
            setLocated(true);
          },
          () => setLocated(false),
          { timeout: 8000, maximumAge: 600000 },
        );
      },
      { rootMargin: '0px 0px -20% 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Open on the nearest machine, which is the one the visitor can act on.
  useEffect(() => {
    setSelectedId((current) => current ?? nearest.site.id);
  }, [nearest.site.id]);

  const selected = useMemo(
    () => sites.find((site) => site.id === selectedId) ?? null,
    [selectedId],
  );

  const handleSelect = useCallback((site: Site) => {
    setSelectedId(site.id);
    setHint(null);
  }, []);

  const handleEmptyClick = useCallback((screen: { x: number; y: number }) => {
    setHint(screen);
  }, []);

  useEffect(() => {
    if (!hint) return;
    const timer = window.setTimeout(() => setHint(null), 4500);
    return () => window.clearTimeout(timer);
  }, [hint]);

  const country = t.map.countries[nearest.site.country] ?? nearest.site.country;
  const distance = Math.round(nearest.distance).toLocaleString('en-US');

  return (
    <section ref={section} id={id} className="border-t border-silver/10 py-24 md:py-32">
      <div className="section-shell">
        <FadeUp>
          <p className="data-label-sm text-gold">{t.map.eyebrow}</p>
          <h2 className="display-heading mt-5 max-w-3xl text-balance text-5xl md:text-7xl xl:text-8xl">
            {t.map.title}
          </h2>
          <p className="mt-5 max-w-xl text-pretty text-[1.05rem] text-silver">{t.map.subtitle}</p>
        </FadeUp>

        {/* Nearest-machine readout */}
        <FadeUp index={1}>
          <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-silver/10 py-4">
            <span className="data-label-sm text-silver/50">{t.map.nearestPrefix}</span>
            <span className="data-label text-gold">
              {nearest.site.city.toUpperCase()}, {country.toUpperCase()} · {distance}{' '}
              {t.map.distanceUnit.toUpperCase()}
            </span>
            {!located && (
              <span className="data-label-sm text-silver/35">{t.map.locationFallback}</span>
            )}
          </div>
        </FadeUp>

        <div className="mt-12 grid gap-10 lg:grid-cols-5 lg:gap-14">
          {/* ---- globe / list ---- */}
          <FadeUp className="lg:col-span-3">
            {isMobile ? (
              <ul className="divide-y divide-silver/10 border-y border-silver/10">
                {sites.map((site) => {
                  const active = site.id === selectedId;
                  return (
                    <li key={site.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(site)}
                        aria-current={active}
                        className="flex w-full items-center gap-4 py-4 text-left"
                      >
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 shrink-0"
                          style={{
                            backgroundColor: site.tier === 'primary' ? '#D4AF37' : '#8C7527',
                            opacity: site.tier === 'primary' ? 1 : 0.55,
                          }}
                        />
                        <span className="min-w-0 flex-1">
                          <span
                            className={`data-label block ${active ? 'text-gold' : 'text-bone'}`}
                          >
                            {site.city}, {t.map.countries[site.country] ?? site.country}
                          </span>
                          <span className="mt-1 block truncate text-sm text-silver/60">
                            {site.company}
                          </span>
                        </span>
                        {site.id === nearest.site.id && (
                          <span className="data-label-sm shrink-0 border border-gold/40 px-2 py-1 text-gold">
                            {Math.round(nearest.distance).toLocaleString('en-US')}{' '}
                            {t.map.distanceUnit}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="relative">
                <div
                  className="aspect-square w-full"
                  role="application"
                  aria-label={t.a11y.globeAlt}
                >
                  <Globe
                    sites={sites}
                    selectedId={selectedId}
                    nearestId={nearest.site.id}
                    onSelect={handleSelect}
                    onHover={setHovered}
                    onEmptyClick={handleEmptyClick}
                  />
                </div>

                <p className="data-label-sm absolute bottom-0 left-0 text-silver/35">
                  {t.map.dragHint}
                </p>

                {hovered && (
                  <p className="data-label-sm pointer-events-none absolute right-0 top-0 text-gold">
                    {hovered.city}
                  </p>
                )}
              </div>
            )}
          </FadeUp>

          {/* ---- record panel ---- */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selected ? (
                <SitePanel
                  key={selected.id}
                  site={selected}
                  onRequestVisit={() => setModalOpen(true)}
                  onClose={isMobile ? () => setSelectedId(null) : undefined}
                />
              ) : (
                <motion.p
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="data-label-sm border border-dashed border-silver/15 p-8 text-silver/40"
                >
                  {t.map.selectPrompt}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="data-label-sm mt-12 text-silver/30">{t.map.disclaimer}</p>
      </div>

      {/* Empty-region nudge */}
      <AnimatePresence>
        {hint && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto fixed z-30 -translate-x-1/2 -translate-y-full border border-gold/40 bg-ink/95 px-3 py-2"
            style={{ left: hint.x, top: hint.y - 12 }}
          >
            <p className="data-label-sm text-silver">
              {t.map.emptyRegion}{' '}
              <a href="#contact" className="link-underline text-gold" onClick={() => setHint(null)}>
                {t.map.emptyRegionCta} →
              </a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <VisitRequestModal site={selected} open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}

export default FieldMap;
