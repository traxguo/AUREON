import { NextResponse } from 'next/server';

/** Quotation and general enquiries. Validates and logs; wire a mailer here. */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_FIELD_LENGTH = 4000;
const INTERESTS = ['purchase', 'dealership', 'visit'] as const;

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim().slice(0, MAX_FIELD_LENGTH) : '';
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const payload = (body ?? {}) as Record<string, unknown>;
  const data = {
    name: asString(payload.name),
    company: asString(payload.company),
    country: asString(payload.country),
    email: asString(payload.email),
    phone: asString(payload.phone),
    interest: asString(payload.interest),
    message: asString(payload.message),
  };

  const errors: string[] = [];
  if (!data.name) errors.push('name');
  if (!EMAIL_PATTERN.test(data.email)) errors.push('email');
  if (!data.country) errors.push('country');
  if (!(INTERESTS as readonly string[]).includes(data.interest)) errors.push('interest');

  if (errors.length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  console.info('[AUREON] contact enquiry', {
    ...data,
    phone: data.phone || '—',
    message: data.message || '—',
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
