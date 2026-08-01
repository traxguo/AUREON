export type SubmitState = 'idle' | 'sending' | 'success' | 'error';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

export async function postJson(
  endpoint: string,
  payload: Record<string, unknown>,
): Promise<{ ok: boolean }> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`Request failed with ${response.status}`);
  return (await response.json()) as { ok: boolean };
}
