'use client';

import { motion } from 'framer-motion';
import { useT } from '@/components/i18n/LanguageProvider';
import type { Site } from '@/data/sites';
import SitePhoto from './SitePhoto';

/**
 * Record for one reference machine.
 *
 * Deliberately shows no phone number, email or contact name for the host
 * company: those are third-party personal data, and publishing them would be
 * both a GDPR/KVKK problem and a nuisance for the host. The visit request goes
 * through AUREON instead.
 */
export function SitePanel({
  site,
  onRequestVisit,
  onClose,
}: {
  site: Site;
  onRequestVisit: () => void;
  onClose?: () => void;
}) {
  const t = useT();
  const country = t.map.countries[site.country] ?? site.country;
  const sector = t.map.sectors[site.sector] ?? site.sector;

  return (
    <motion.div
      key={site.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="border border-silver/10 bg-graphite/60"
      aria-live="polite"
    >
      <SitePhoto
        src={site.photo}
        alt={`${site.city}, ${country} — ${site.company}`}
        placeholder={t.map.panel.photoPlaceholder}
        caption={site.serial}
      />

      <div className="border-t border-silver/10 p-6 lg:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="display-heading text-3xl leading-none lg:text-4xl">
              {site.city} · {country}
            </h3>
            <p className="mt-2 text-[0.95rem] text-silver">{site.company}</p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="data-label-sm shrink-0 text-silver/50 transition-colors duration-micro ease-aureon hover:text-bone"
            >
              {t.map.panel.close}
            </button>
          )}
        </div>

        <dl className="mt-7 space-y-5">
          <div>
            <dt className="data-label-sm text-silver/50">{t.map.panel.sector}</dt>
            <dd className="mt-1 text-[0.95rem] text-bone">{sector}</dd>
          </div>
          <div>
            <dt className="data-label-sm text-silver/50">{t.map.panel.inField}</dt>
            <dd className="data-label mt-1 text-bone">
              {site.monthsInField} {t.map.panel.months} ·{' '}
              {site.hours.toLocaleString('en-US').replace(/,/g, ' ')} {t.map.panel.hours}
            </dd>
          </div>
        </dl>

        {/* Certificate of authenticity */}
        <div className="gold-frame mt-7 p-4">
          <p className="data-label-sm text-gold">{t.map.panel.certificate}</p>
          <dl className="mt-3 space-y-2">
            <div className="flex justify-between gap-4">
              <dt className="data-label-sm text-silver/50">{t.map.panel.serial}</dt>
              <dd className="data-label-sm text-bone">{site.serial}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="data-label-sm text-silver/50">{t.map.panel.production}</dt>
              <dd className="data-label-sm text-bone">{site.productionDate}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="data-label-sm text-silver/50">{t.map.panel.verified}</dt>
              <dd className="data-label-sm text-gold">✓</dd>
            </div>
          </dl>
        </div>

        <button type="button" onClick={onRequestVisit} className="btn-gold mt-7 w-full">
          {t.map.panel.cta}
        </button>
      </div>
    </motion.div>
  );
}

export default SitePanel;
