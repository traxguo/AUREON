'use client';

import Header, { SECTION_IDS } from '@/components/layout/Header';
import ScrollProgress from '@/components/layout/ScrollProgress';
import Hero from '@/components/hero/Hero';
import FieldMap from '@/components/map/FieldMap';
import { useT } from '@/components/i18n/LanguageProvider';

export default function HomePage() {
  const t = useT();

  return (
    <>
      <a
        href="#main"
        className="data-label-sm sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
      >
        {t.a11y.skipToContent}
      </a>

      <Header />
      <ScrollProgress />

      <main id="main">
        <Hero />
        <FieldMap id={SECTION_IDS.fieldMap} />
      </main>
    </>
  );
}
