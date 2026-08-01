'use client';

import { useT } from '@/components/i18n/LanguageProvider';
import FadeUp from '@/components/motion/FadeUp';

export function ExportSection({ id }: { id: string }) {
  const t = useT();
  const steps = t.exportSection.steps;

  return (
    <section id={id} className="border-t border-silver/10 py-24 md:py-32">
      <div className="section-shell">
        <FadeUp>
          <p className="data-label-sm text-gold">{t.exportSection.eyebrow}</p>
          <h2 className="display-heading mt-5 max-w-2xl text-balance text-5xl md:text-7xl">
            {t.exportSection.title}
          </h2>
          <p className="mt-5 max-w-xl text-[1.05rem] text-silver">{t.exportSection.body}</p>
        </FadeUp>

        {/* Process strip */}
        <FadeUp index={1}>
          <ol className="mt-16 grid grid-cols-2 gap-px border border-silver/10 bg-silver/10 sm:grid-cols-3 lg:grid-cols-6">
            {steps.map((step, index) => (
              <li key={step.id} className="relative flex flex-col gap-4 bg-ink p-5 lg:p-6">
                <span className="data-label-sm text-gold/70">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="data-label text-bone">{step.label}</span>
                {index < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute right-0 top-1/2 hidden h-px w-3 -translate-y-1/2 translate-x-1/2 bg-gold/60 lg:block"
                  />
                )}
              </li>
            ))}
          </ol>
        </FadeUp>

        {/* Certification badges */}
        <FadeUp index={2}>
          <ul className="mt-12 flex flex-wrap gap-3">
            {t.exportSection.badges.map((badge) => (
              <li key={badge} className="gold-frame px-4 py-2.5">
                <span className="data-label-sm text-gold">{badge}</span>
              </li>
            ))}
          </ul>
        </FadeUp>

        <FadeUp index={3}>
          <div className="mt-12 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-silver/10 pt-6">
            <span className="data-label-sm text-silver/45">{t.exportSection.gtipLabel}</span>
            <span className="data-label text-bone">{t.exportSection.gtip}</span>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

export default ExportSection;
