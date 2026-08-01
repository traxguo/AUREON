'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useT } from '@/components/i18n/LanguageProvider';
import { TextAreaField, TextField } from '@/components/ui/FormField';
import type { Site } from '@/data/sites';
import { isBlank, isValidEmail, postJson, type SubmitState } from '@/lib/form';

type Errors = Partial<Record<'name' | 'company' | 'email', string>>;

const EMPTY = { name: '', company: '', email: '', phone: '', date: '', note: '' };

export function VisitRequestModal({
  site,
  open,
  onClose,
}: {
  site: Site | null;
  open: boolean;
  onClose: () => void;
}) {
  const t = useT();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<SubmitState>('idle');
  const dialog = useRef<HTMLDivElement>(null);
  const firstField = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY);
    setErrors({});
    setState('idle');
    firstField.current?.querySelector('input')?.focus();
  }, [open, site?.id]);

  // Escape to close, and keep tabbing inside the dialog.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialog.current) return;

      const focusable = dialog.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const update = (key: keyof typeof EMPTY) => (value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!site) return;

    const nextErrors: Errors = {};
    if (isBlank(form.name)) nextErrors.name = t.contact.form.required;
    if (isBlank(form.company)) nextErrors.company = t.contact.form.required;
    if (isBlank(form.email)) nextErrors.email = t.contact.form.required;
    else if (!isValidEmail(form.email)) nextErrors.email = t.contact.form.invalidEmail;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setState('sending');
    try {
      await postJson('/api/visit-request', {
        ...form,
        siteId: site.id,
        siteCity: site.city,
        serial: site.serial,
      });
      setState('success');
    } catch {
      setState('error');
    }
  };

  const country = site ? (t.map.countries[site.country] ?? site.country) : '';

  return (
    <AnimatePresence>
      {open && site && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-ink/85 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={onClose}
        >
          <motion.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-label={`${t.map.modal.titlePrefix} — ${site.city}, ${country}`}
            className="w-full max-w-xl border border-silver/15 bg-graphite"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6 border-b border-silver/10 p-6 lg:p-8">
              <div>
                <p className="data-label-sm text-gold">{t.map.modal.titlePrefix}</p>
                <h3 className="display-heading mt-2 text-3xl leading-none">
                  {site.city} · {country}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="data-label-sm shrink-0 text-silver/60 transition-colors duration-micro ease-aureon hover:text-bone"
              >
                {t.map.modal.close}
              </button>
            </div>

            {state === 'success' ? (
              <div className="p-6 lg:p-8">
                <p className="text-[0.95rem] text-bone">{t.map.modal.success}</p>
                <button type="button" onClick={onClose} className="btn-outline mt-7">
                  {t.map.modal.close}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="p-6 lg:p-8" noValidate>
                <p className="max-w-prose text-[0.95rem] leading-relaxed text-silver">
                  {t.map.modal.body}
                </p>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <div ref={firstField}>
                    <TextField
                      label={t.map.modal.fields.name}
                      value={form.name}
                      onChange={update('name')}
                      error={errors.name}
                      required
                      autoComplete="name"
                    />
                  </div>
                  <TextField
                    label={t.map.modal.fields.company}
                    value={form.company}
                    onChange={update('company')}
                    error={errors.company}
                    required
                    autoComplete="organization"
                  />
                  <TextField
                    label={t.map.modal.fields.email}
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    error={errors.email}
                    required
                    autoComplete="email"
                  />
                  <TextField
                    label={t.map.modal.fields.phone}
                    type="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    autoComplete="tel"
                  />
                  <TextField
                    label={t.map.modal.fields.date}
                    type="date"
                    value={form.date}
                    onChange={update('date')}
                    className="sm:col-span-2"
                  />
                  <TextAreaField
                    label={t.map.modal.fields.note}
                    value={form.note}
                    onChange={update('note')}
                    className="sm:col-span-2"
                  />
                </div>

                <p className="data-label-sm mt-6 text-silver/40">{t.map.modal.privacyNote}</p>

                {state === 'error' && (
                  <p role="alert" className="data-label-sm mt-4 text-gold">
                    {t.map.modal.error}
                  </p>
                )}

                <button type="submit" disabled={state === 'sending'} className="btn-gold mt-7 w-full">
                  {state === 'sending' ? t.map.modal.sending : t.map.modal.submit}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default VisitRequestModal;
