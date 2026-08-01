'use client';

import Header, { SECTION_IDS } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollProgress from '@/components/layout/ScrollProgress';
import Hero from '@/components/hero/Hero';
import Positioning from '@/components/sections/Positioning';
import Technology from '@/components/sections/Technology';
import Specifications from '@/components/sections/Specifications';
import FieldMap from '@/components/map/FieldMap';
import ExportSection from '@/components/sections/ExportSection';
import Contact from '@/components/sections/Contact';
import SecretRecord from '@/components/easter/SecretRecord';
import { useT } from '@/components/i18n/LanguageProvider';

export default function HomePage() {
  const t = useT();

  return (
    <>
      <a
        href="#main"
        className="data-label-sm sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
      >
        {t.a11y.skipToContent}
      </a>

      <Header />
      <ScrollProgress />

      <main id="main">
        <Hero />
        <Positioning id={SECTION_IDS.positioning} />
        <Technology id={SECTION_IDS.technology} />
        <Specifications id={SECTION_IDS.specifications} />
        <FieldMap id={SECTION_IDS.fieldMap} />
        <ExportSection id={SECTION_IDS.export} />
        <Contact id={SECTION_IDS.contact} />
      </main>

      <Footer />
      <SecretRecord />
    </>
  );
}
