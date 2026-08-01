'use client';

import { useT } from '@/components/i18n/LanguageProvider';
import FadeUp from '@/components/motion/FadeUp';

export function Positioning({ id }: { id: string }) {
  const t = useT();

  return (
    <section id={id} className="py-24 md:py-36">
      <div className="section-shell grid gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-7">
          <FadeUp>
            <p className="data-label-sm text-gold">{t.positioning.eyebrow}</p>
          </FadeUp>
          <FadeUp index={1}>
            <p className="display-heading mt-6 text-balance text-4xl leading-[1.02] md:text-6xl xl:text-7xl">
              {t.positioning.manifesto}
            </p>
          </FadeUp>
          <FadeUp index={2}>
            <p className="mt-8 max-w-xl text-pretty text-[1.05rem] leading-relaxed text-silver">
              {t.positioning.body}
            </p>
          </FadeUp>
        </div>

        <div className="lg:col-span-5 lg:pt-16">
          <dl className="divide-y divide-silver/10 border-y border-silver/10">
            {t.positioning.stats.map((stat, index) => (
              <FadeUp
                as="div"
                key={stat.label}
                index={index}
                className="flex items-baseline justify-between gap-6 py-6"
              >
                <dt className="display-heading text-4xl md:text-5xl">{stat.value}</dt>
                <dd className="data-label-sm text-right text-silver/60">{stat.label}</dd>
              </FadeUp>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export default Positioning;
