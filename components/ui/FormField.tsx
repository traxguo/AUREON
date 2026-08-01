'use client';

import { useId, type ReactNode } from 'react';

type BaseProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  required?: boolean;
  className?: string;
  autoComplete?: string;
};

function Shell({
  id,
  label,
  error,
  required,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string | null;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="data-label-sm block text-silver/60">
        {label}
        {required && (
          <span className="ml-1 text-gold" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="data-label-sm mt-1.5 text-gold">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  error,
  required,
  className,
  autoComplete,
  type = 'text',
}: BaseProps & { type?: 'text' | 'email' | 'tel' | 'date' }) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} required={required} className={className}>
      <input
        id={id}
        type={type}
        className="field"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    </Shell>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  error,
  required,
  className,
  rows = 3,
}: BaseProps & { rows?: number }) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} required={required} className={className}>
      <textarea
        id={id}
        rows={rows}
        className="field resize-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    </Shell>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  error,
  required,
  className,
  options,
  placeholder,
}: BaseProps & { options: readonly string[] | readonly { value: string; label: string }[]; placeholder?: string }) {
  const id = useId();
  const normalised = options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  );

  return (
    <Shell id={id} label={label} error={error} required={required} className={className}>
      <select
        id={id}
        className="field"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {normalised.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Shell>
  );
}
