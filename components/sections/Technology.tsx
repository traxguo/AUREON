'use client';

import { useT } from '@/components/i18n/LanguageProvider';
import FadeUp from '@/components/motion/FadeUp';
import { techIcons, type TechIconId } from '@/components/icons/TechIcons';

export function Technology({ id }: { id: string }) {
  const t = useT();

  return (
    <section id={id} className="border-t border-silver/10 py-24 md:py-32">
      <div className="section-shell">
        <FadeUp>
          <p className="data-label-sm text-gold">{t.technology.eyebrow}</p>
          <h2 className="display-heading mt-5 max-w-2xl text-balance text-5xl md:text-7xl">
            {t.technology.title}
          </h2>
          <p className="mt-5 max-w-lg text-[1.05rem] text-silver">{t.technology.intro}</p>
        </FadeUp>

        <ul className="mt-16 grid gap-px border border-silver/10 bg-silver/10 sm:grid-cols-2 xl:grid-cols-4">
          {t.technology.cards.map((card, index) => {
            const Icon = techIcons[card.id as TechIconId];
            return (
              <FadeUp
                as="li"
                key={card.id}
                index={index}
                className="flex flex-col bg-ink p-7 lg:p-8"
              >
                {Icon && <Icon className="h-14 w-14 text-gold" />}

                <h3 className="display-heading mt-8 text-2xl leading-tight lg:text-[1.75rem]">
                  {card.title}
                </h3>
                <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-silver">
                  {card.body}
                </p>

                <div className="mt-8 border-t border-silver/10 pt-4">
                  <p className="data-label text-gold">{card.metric}</p>
                  <p className="data-label-sm mt-1.5 text-silver/45">{card.metricLabel}</p>
                </div>
              </FadeUp>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default Technology;
