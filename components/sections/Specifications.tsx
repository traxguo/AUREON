'use client';

import { useT } from '@/components/i18n/LanguageProvider';
import FadeUp from '@/components/motion/FadeUp';

export function Specifications({ id }: { id: string }) {
  const t = useT();

  return (
    <section id={id} className="border-t border-silver/10 py-24 md:py-32">
      <div className="section-shell">
        <FadeUp>
          <p className="data-label-sm text-gold">{t.specs.eyebrow}</p>
          <h2 className="display-heading mt-5 text-5xl md:text-7xl">{t.specs.title}</h2>
        </FadeUp>

        <div className="mt-16 space-y-16">
          {t.specs.groups.map((group) => (
            <FadeUp key={group.id} as="div">
              <div className="flex items-baseline gap-6 border-b border-gold/30 pb-3">
                <h3 className="data-label text-gold">{group.title}</h3>
                <span className="data-label-sm ml-auto hidden text-silver/35 md:block">
                  {t.specs.columns.value}
                </span>
              </div>

              <dl className="divide-y divide-silver/[0.08]">
                {group.rows.map((row) => (
                  <div
                    key={row[0]}
                    className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-2 sm:gap-8 sm:py-5"
                  >
                    <dt className="data-label-sm text-silver/60">{row[0]}</dt>
                    <dd className="data-label text-bone sm:text-right">{row[1]}</dd>
                  </div>
                ))}
              </dl>
            </FadeUp>
          ))}
        </div>

        <p className="data-label-sm mt-14 text-silver/30">{t.specs.note}</p>
      </div>
    </section>
  );
}

export default Specifications;
