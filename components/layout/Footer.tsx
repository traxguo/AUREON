'use client';

import { useLanguage } from '@/components/i18n/LanguageProvider';
import Logo from '@/components/ui/Logo';
import { company } from '@/data/company';
import { localeLabels, localeNames, locales } from '@/i18n';
import { SECTION_IDS } from './Header';

export function Footer() {
  const { t, locale, setLocale } = useLanguage();

  const links = [
    { id: SECTION_IDS.positioning, label: t.nav.positioning },
    { id: SECTION_IDS.technology, label: t.nav.technology },
    { id: SECTION_IDS.specifications, label: t.nav.specifications },
    { id: SECTION_IDS.fieldMap, label: t.nav.fieldMap },
    { id: SECTION_IDS.export, label: t.nav.export },
    { id: SECTION_IDS.contact, label: t.nav.contact },
  ];

  return (
    <footer className="border-t border-silver/10 py-16 md:py-20">
      <div className="section-shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-auto" title={t.a11y.logoAlt} />
            <span className="display-heading text-2xl tracking-[0.14em]">{t.brand.name}</span>
          </div>
          <p className="data-label-sm mt-5 text-silver/60">{t.brand.slogan}</p>
          <p className="mt-8 text-sm text-silver/50">{company.legalName}</p>
          <p className="text-sm text-silver/50">{t.footer.address}</p>
          <a
            href={`mailto:${company.email}`}
            className="link-underline mt-4 inline-block text-sm text-silver transition-colors duration-micro ease-aureon hover:text-bone"
          >
            {company.email}
          </a>
        </div>

        <nav className="lg:col-span-4" aria-label={t.footer.quickLinks}>
          <p className="data-label-sm text-silver/40">{t.footer.quickLinks}</p>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="data-label-sm link-underline text-silver transition-colors duration-micro ease-aureon hover:text-bone"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <p className="data-label-sm text-silver/40">{t.footer.gtipLabel}</p>
          <p className="data-label mt-4 text-bone">{t.footer.gtip}</p>

          <p className="data-label-sm mt-10 text-silver/40">{t.nav.languageLabel}</p>
          <div className="mt-4 flex gap-2" role="group" aria-label={t.nav.languageLabel}>
            {locales.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                aria-label={localeNames[code]}
                aria-current={locale === code}
                className={`data-label-sm border px-3 py-2 transition-colors duration-micro ease-aureon ${
                  locale === code
                    ? 'border-gold text-gold'
                    : 'border-silver/15 text-silver/60 hover:border-silver/35 hover:text-silver'
                }`}
              >
                {localeLabels[code]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="section-shell mt-16 border-t border-silver/10 pt-6">
        <p className="data-label-sm text-silver/30">
          © {new Date().getFullYear()} {company.legalName}. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
