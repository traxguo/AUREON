'use client';

import { useState } from 'react';
import { useT } from '@/components/i18n/LanguageProvider';
import FadeUp from '@/components/motion/FadeUp';
import { SelectField, TextAreaField, TextField } from '@/components/ui/FormField';
import { company, countryOptions, product } from '@/data/company';
import { isBlank, isValidEmail, postJson, type SubmitState } from '@/lib/form';

type Errors = Partial<Record<'name' | 'email' | 'country' | 'interest', string>>;

const EMPTY = {
  name: '',
  company: '',
  country: '',
  email: '',
  phone: '',
  interest: '',
  message: '',
};

export function Contact({ id }: { id: string }) {
  const t = useT();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<SubmitState>('idle');

  const update = (key: keyof typeof EMPTY) => (value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: Errors = {};
    if (isBlank(form.name)) nextErrors.name = t.contact.form.required;
    if (isBlank(form.email)) nextErrors.email = t.contact.form.required;
    else if (!isValidEmail(form.email)) nextErrors.email = t.contact.form.invalidEmail;
    if (isBlank(form.country)) nextErrors.country = t.contact.form.required;
    if (isBlank(form.interest)) nextErrors.interest = t.contact.form.required;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setState('sending');
    try {
      await postJson('/api/contact', form);
      setState('success');
      setForm(EMPTY);
    } catch {
      setState('error');
    }
  };

  return (
    <section id={id} className="border-t border-silver/10 py-24 md:py-32">
      <div className="section-shell grid gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <FadeUp>
            <p className="data-label-sm text-gold">{t.contact.eyebrow}</p>
            <h2 className="display-heading mt-5 text-balance text-5xl md:text-6xl xl:text-7xl">
              {t.contact.title}
            </h2>
            <p className="mt-6 max-w-md text-pretty text-[1.05rem] leading-relaxed text-silver">
              {t.contact.body}
            </p>
            <p className="data-label-sm mt-8 text-silver/45">{t.contact.responseNote}</p>

            <dl className="mt-12 space-y-4 border-t border-silver/10 pt-8">
              <div>
                <dt className="data-label-sm text-silver/45">{product.fullName}</dt>
                <dd className="data-label mt-1 text-bone">
                  € {product.priceEur.toLocaleString('en-US').replace(/,/g, ' ')}
                </dd>
              </div>
              <div>
                <dt className="data-label-sm text-silver/45">{company.brand}</dt>
                <dd className="mt-1 text-sm text-silver">{company.legalName}</dd>
              </div>
            </dl>
          </FadeUp>
        </div>

        <div className="lg:col-span-7">
          <FadeUp index={1}>
            {state === 'success' ? (
              <div className="gold-frame p-8">
                <p className="text-[1.05rem] text-bone">{t.contact.form.success}</p>
                <button
                  type="button"
                  onClick={() => setState('idle')}
                  className="btn-outline mt-7"
                >
                  {t.contact.form.submit}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="grid gap-6 sm:grid-cols-2">
                <TextField
                  label={t.contact.form.name}
                  value={form.name}
                  onChange={update('name')}
                  error={errors.name}
                  required
                  autoComplete="name"
                />
                <TextField
                  label={t.contact.form.company}
                  value={form.company}
                  onChange={update('company')}
                  autoComplete="organization"
                />
                <SelectField
                  label={t.contact.form.country}
                  value={form.country}
                  onChange={update('country')}
                  error={errors.country}
                  required
                  options={countryOptions}
                  placeholder={t.contact.form.countryPlaceholder}
                />
                <TextField
                  label={t.contact.form.email}
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  error={errors.email}
                  required
                  autoComplete="email"
                />
                <TextField
                  label={t.contact.form.phone}
                  type="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  autoComplete="tel"
                />
                <SelectField
                  label={t.contact.form.interest}
                  value={form.interest}
                  onChange={update('interest')}
                  error={errors.interest}
                  required
                  options={t.contact.interests.map((interest) => ({
                    value: interest.id,
                    label: interest.label,
                  }))}
                  placeholder={t.contact.form.selectPlaceholder}
                />
                <TextAreaField
                  label={t.contact.form.message}
                  value={form.message}
                  onChange={update('message')}
                  rows={4}
                  className="sm:col-span-2"
                />

                {state === 'error' && (
                  <p role="alert" className="data-label-sm text-gold sm:col-span-2">
                    {t.contact.form.error}
                  </p>
                )}

                <div className="sm:col-span-2">
                  <button type="submit" disabled={state === 'sending'} className="btn-gold">
                    {state === 'sending' ? t.contact.form.sending : t.contact.form.submit}
                  </button>
                </div>
              </form>
            )}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

export default Contact;
