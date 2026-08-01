'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import Logo from '@/components/ui/Logo';
import { localeLabels, localeNames, locales } from '@/i18n';

export const SECTION_IDS = {
  positioning: 'positioning',
  technology: 'technology',
  specifications: 'specifications',
  fieldMap: 'field-map',
  export: 'export',
  contact: 'contact',
} as const;

export function Header() {
  const { t, locale, setLocale } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock the page while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const links = [
    { id: SECTION_IDS.positioning, label: t.nav.positioning },
    { id: SECTION_IDS.technology, label: t.nav.technology },
    { id: SECTION_IDS.specifications, label: t.nav.specifications },
    { id: SECTION_IDS.fieldMap, label: t.nav.fieldMap },
    { id: SECTION_IDS.export, label: t.nav.export },
    { id: SECTION_IDS.contact, label: t.nav.contact },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-500 ease-aureon ${
          scrolled ? 'border-silver/10 bg-ink/85 backdrop-blur-md' : 'border-transparent'
        }`}
      >
        <div className="section-shell flex h-16 items-center justify-between md:h-20">
          <a href="#hero" className="flex items-center gap-3" aria-label={t.brand.name}>
            <Logo className="h-7 w-auto md:h-8" title={t.a11y.logoAlt} />
            <span className="wordmark text-sm md:text-base">{t.brand.name}</span>
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label={t.nav.menu}>
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="data-label-sm link-underline text-silver transition-colors duration-micro ease-aureon hover:text-bone"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div
              className="hidden items-center gap-1 md:flex"
              role="group"
              aria-label={t.nav.languageLabel}
            >
              {locales.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocale(code)}
                  aria-label={localeNames[code]}
                  aria-current={locale === code}
                  className={`data-label-sm px-2 py-1 transition-colors duration-micro ease-aureon ${
                    locale === code ? 'text-gold' : 'text-silver/50 hover:text-silver'
                  }`}
                >
                  {localeLabels[code]}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="data-label-sm text-silver transition-colors duration-micro ease-aureon hover:text-bone lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {t.nav.menu}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-50 bg-ink lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="section-shell flex h-16 items-center justify-between md:h-20">
              <span className="wordmark text-sm">{t.brand.name}</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="data-label-sm text-silver"
                autoFocus
              >
                {t.nav.close}
              </button>
            </div>
            <nav className="section-shell mt-8 flex flex-col gap-6" aria-label={t.nav.menu}>
              {links.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="display-heading border-b border-silver/10 pb-4 text-4xl"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div
              className="section-shell mt-10 flex items-center gap-4"
              role="group"
              aria-label={t.nav.languageLabel}
            >
              {locales.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setLocale(code);
                    setMenuOpen(false);
                  }}
                  aria-current={locale === code}
                  className={`data-label border px-4 py-2 ${
                    locale === code ? 'border-gold text-gold' : 'border-silver/20 text-silver'
                  }`}
                >
                  {localeLabels[code]}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
