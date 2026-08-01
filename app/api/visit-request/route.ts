import { NextResponse } from 'next/server';

/**
 * Site visit requests.
 *
 * Validates and logs for now; a mailer or CRM hook goes where the console call
 * is. Requests are routed through AUREON on purpose — the host company's
 * contact details are never exposed to the visitor.
 */

type VisitRequest = {
  name: string;
  company: string;
  email: string;
  phone?: string;
  date?: string;
  note?: string;
  siteId: string;
  siteCity?: string;
  serial?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_FIELD_LENGTH = 2000;

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
  const data: VisitRequest = {
    name: asString(payload.name),
    company: asString(payload.company),
    email: asString(payload.email),
    phone: asString(payload.phone),
    date: asString(payload.date),
    note: asString(payload.note),
    siteId: asString(payload.siteId),
    siteCity: asString(payload.siteCity),
    serial: asString(payload.serial),
  };

  const errors: string[] = [];
  if (!data.name) errors.push('name');
  if (!data.company) errors.push('company');
  if (!EMAIL_PATTERN.test(data.email)) errors.push('email');
  if (!data.siteId) errors.push('siteId');

  if (errors.length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  console.info('[AUREON] visit request', {
    site: `${data.siteId} (${data.siteCity})`,
    serial: data.serial,
    from: `${data.name} — ${data.company}`,
    email: data.email,
    phone: data.phone || '—',
    preferredDate: data.date || '—',
    note: data.note || '—',
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
