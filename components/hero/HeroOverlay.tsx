'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useT } from '@/components/i18n/LanguageProvider';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { clamp01, range, subscribeHeroProgress } from './heroProgress';

/**
 * The typographic layer over the 3D scene.
 *
 * Every value here is written straight to the DOM from the progress
 * subscription. Routing 60 updates a second through React state would re-render
 * the whole overlay on every scroll tick for no visual gain.
 */

type Fade = { in: [number, number]; out: [number, number] };

function opacityFor(p: number, fade: Fade): number {
  return range(p, fade.in[0], fade.in[1]) * (1 - range(p, fade.out[0], fade.out[1]));
}

/**
 * The title is an entrance, not a scroll step: it types itself in as soon as
 * the scene is ready, so the first frame is never an empty black screen.
 * Scroll only takes it away again.
 */
const TITLE_OUT: [number, number] = [0.24, 0.32];
const TAGS_FADE: Fade = { in: [0.17, 0.26], out: [0.34, 0.4] };
const SCAN_FADE: Fade = { in: [0.355, 0.4], out: [0.8, 0.86] };
const MESSAGE_FADE: Fade = { in: [0.67, 0.73], out: [0.86, 0.92] };
const DETECTION_START = 0.43;
const DETECTION_STAGGER = 0.035;
/** Readouts clear before the closing statement so it owns the frame. */
const DETECTION_OUT: [number, number] = [0.68, 0.75];

export function HeroOverlay({ ready = false }: { ready?: boolean }) {
  const t = useT();
  const isMobile = useIsMobile();

  const titleRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLUListElement>(null);
  const tagItemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const scanRef = useRef<HTMLDivElement>(null);
  const detectionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const messageRef = useRef<HTMLDivElement>(null);
  const blackoutRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const letters = useMemo(() => Array.from(t.hero.title), [t.hero.title]);

  const tags = useMemo(
    () => [
      { key: 'weight', value: t.hero.tags.weight, name: t.hero.tagNames.weight },
      { key: 'gnss', value: t.hero.tags.gnss, name: t.hero.tagNames.gnss },
      { key: 'noise', value: t.hero.tags.noise, name: t.hero.tagNames.noise },
      { key: 'gpr', value: t.hero.tags.gpr, name: t.hero.tagNames.gpr },
    ],
    [t.hero.tagNames, t.hero.tags],
  );

  const detections = useMemo(
    () => (isMobile ? t.hero.detections.slice(0, 2) : t.hero.detections),
    [isMobile, t.hero.detections],
  );

  const riskLabels = t.hero.risk as Record<string, string>;

  const apply = useCallback(
    (p: number) => {
      /* ---- title (entrance handled in CSS; scroll only fades it out) ---- */
      const titleOpacity = 1 - range(p, TITLE_OUT[0], TITLE_OUT[1]);
      if (titleRef.current) {
        titleRef.current.style.opacity = String(titleOpacity);
        titleRef.current.style.transform = `translateY(${(1 - titleOpacity) * -10}px)`;
      }

      /* ---- technical tags with leader lines ---- */
      const tagsOpacity = opacityFor(p, TAGS_FADE);
      if (tagsRef.current) tagsRef.current.style.opacity = String(tagsOpacity);
      tagItemRefs.current.forEach((item, i) => {
        if (!item) return;
        const local = range(p, 0.18 + i * 0.022, 0.23 + i * 0.022);
        item.style.opacity = String(local);
        item.style.transform = `translateX(${(1 - local) * 16}px)`;
        const leader = item.querySelector<HTMLElement>('[data-leader]');
        if (leader) leader.style.transform = `scaleX(${local})`;
      });

      /* ---- scan header ---- */
      if (scanRef.current) {
        const scan = opacityFor(p, SCAN_FADE);
        scanRef.current.style.opacity = String(scan);
      }

      /* ---- detection readouts ---- */
      detectionRefs.current.forEach((item, i) => {
        if (!item) return;
        const start = DETECTION_START + i * DETECTION_STAGGER;
        const local =
          range(p, start, start + 0.03) * (1 - range(p, DETECTION_OUT[0], DETECTION_OUT[1]));
        item.style.opacity = String(local);
        item.style.transform = `translateX(${(1 - local) * -14}px)`;
      });

      /* ---- closing statement ---- */
      if (messageRef.current) {
        const message = opacityFor(p, MESSAGE_FADE);
        messageRef.current.style.opacity = String(message);
        messageRef.current.style.transform = `translateY(${(1 - message) * 14}px)`;
      }

      /* ---- release to the page ---- */
      if (blackoutRef.current) {
        blackoutRef.current.style.opacity = String(clamp01(range(p, 0.9, 1)) * 0.92);
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(1 - range(p, 0.01, 0.05));
      }
    },
    [],
  );

  useEffect(() => subscribeHeroProgress(apply), [apply]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {/* Vignette keeps type legible over the brightest part of the scene */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 45%, transparent 40%, rgba(13,13,13,0.55) 100%)',
        }}
      />

      {/* ---- title ---- */}
      <div
        ref={titleRef}
        data-entered={ready}
        className="group absolute left-6 top-[32%] max-w-[80vw] md:left-12 md:top-[34%] xl:left-20"
      >
        <h1
          className="display-heading text-[17vw] leading-[0.86] md:text-[9.5vw] xl:text-[8rem]"
          aria-label={t.hero.title}
        >
          {letters.map((letter, i) => (
            <span
              key={`${letter}-${i}`}
              aria-hidden
              className="inline-block opacity-0"
              style={{
                whiteSpace: 'pre',
                animation: ready
                  ? `aureon-letter-in 620ms cubic-bezier(0.22,1,0.36,1) ${180 + i * 55}ms forwards`
                  : undefined,
              }}
            >
              {letter}
            </span>
          ))}
        </h1>
        <div
          className="data-label mt-4 text-silver opacity-0 md:mt-6"
          style={{
            animation: ready
              ? `aureon-fade-in 700ms cubic-bezier(0.22,1,0.36,1) ${180 + letters.length * 55}ms forwards`
              : undefined,
          }}
        >
          {t.hero.subtitle}
        </div>
      </div>

      {/* ---- technical tags ---- */}
      <ul
        ref={tagsRef}
        className="absolute bottom-24 right-6 flex flex-col items-end gap-3 md:bottom-16 md:right-12 md:gap-4 xl:right-20"
        style={{ opacity: 0 }}
      >
        {tags.map((tag, i) => (
          <li
            key={tag.key}
            ref={(node) => {
              tagItemRefs.current[i] = node;
            }}
            className="flex items-center gap-3 md:gap-4"
            style={{ opacity: 0 }}
          >
            <span className="data-label-sm hidden text-silver/50 md:inline">{tag.name}</span>
            <span
              data-leader
              aria-hidden
              className="hidden h-px w-10 origin-right bg-gold/70 md:block lg:w-16"
              style={{ transform: 'scaleX(0)' }}
            />
            <span className="data-label text-gold">{tag.value}</span>
          </li>
        ))}
      </ul>

      {/* ---- scan header ---- */}
      <div
        ref={scanRef}
        className="absolute left-1/2 top-24 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap md:top-28"
        style={{ opacity: 0 }}
      >
        <span className="h-1.5 w-1.5 bg-gold" aria-hidden />
        <span className="data-label-sm text-gold md:text-[0.6875rem]">{t.hero.sonarLabel}</span>
        <span className="h-1.5 w-1.5 bg-gold" aria-hidden />
      </div>

      {/* ---- detection readouts ---- */}
      {/*
        On a phone the machine sits in the middle of a tall frame, so the
        readouts drop to the lower third instead of covering it. On desktop
        they keep the upper-left position beside the machine.
      */}
      <ul className="absolute inset-x-6 bottom-28 flex flex-col gap-2.5 md:inset-x-auto md:bottom-auto md:left-12 md:top-[26%] md:gap-3 xl:left-20">
        {detections.map((detection, i) => (
          <li
            key={detection.id}
            ref={(node) => {
              detectionRefs.current[i] = node;
            }}
            className="w-full border border-gold/35 bg-ink/70 px-3 py-2.5 backdrop-blur-[2px] md:w-[17.5rem] md:px-4 md:py-3"
            style={{ opacity: 0 }}
          >
            <div className="data-label-sm flex items-center gap-2 text-bone">
              <span aria-hidden className="text-gold">
                ⌖
              </span>
              {detection.label}
            </div>
            <dl className="mt-2 space-y-1">
              <div className="flex justify-between gap-4">
                <dt className="data-label-sm text-silver/55">{t.hero.detectionFields.depth}</dt>
                <dd className="data-label-sm text-silver">{detection.depth}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="data-label-sm text-silver/55">{t.hero.detectionFields.diameter}</dt>
                <dd className="data-label-sm text-silver">{detection.diameter}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="data-label-sm text-silver/55">{t.hero.detectionFields.risk}</dt>
                <dd
                  className={`data-label-sm ${
                    detection.risk === 'high' ? 'text-gold' : 'text-silver'
                  }`}
                >
                  {riskLabels[detection.risk] ?? detection.risk}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      {/* ---- closing statement ---- */}
      <div
        ref={messageRef}
        className="absolute inset-x-6 top-1/2 -translate-y-1/2 text-center md:inset-x-12"
        style={{ opacity: 0 }}
      >
        {/* Scrim so the statement stays legible over the wireframe utilities */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-[120%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(closest-side, rgba(13,13,13,0.88), rgba(13,13,13,0))',
          }}
        />
        <p className="display-heading relative text-balance text-[13vw] leading-[0.9] md:text-[7.5vw] xl:text-[6.5rem]">
          {t.hero.message.headline}
        </p>
        <p className="data-label relative mx-auto mt-5 max-w-md text-silver md:mt-7">
          {t.hero.message.sub}
        </p>
      </div>

      {/* ---- scroll hint ---- */}
      <div
        ref={hintRef}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="data-label-sm text-silver/60">{t.hero.scrollHint}</span>
        <span className="h-8 w-px bg-gold/60" aria-hidden />
      </div>

      {/* ---- blackout before the page content ---- */}
      <div ref={blackoutRef} className="absolute inset-0 bg-ink" style={{ opacity: 0 }} aria-hidden />
    </div>
  );
}

export default HeroOverlay;
