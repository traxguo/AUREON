/** Company-level constants used by metadata, JSON-LD and the footer. */

export const company = {
  legalName: 'AUREON Makina Sanayi ve Ticaret A.Ş.',
  brand: 'AUREON',
  email: 'export@aureon-machinery.com',
  phone: '+90 312 000 00 00',
  address: {
    street: 'Organize Sanayi Bölgesi',
    city: 'Ankara',
    postalCode: '06909',
    country: 'TR',
  },
} as const;

export const product = {
  name: 'AUREON S5',
  fullName: 'AUREON S5 Smart Precision Excavator',
  sku: 'AUR-S5',
  priceEur: 54900,
  gtip: '8429.52.10.00.00',
} as const;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://aureon-seven-alpha.vercel.app';

/** Countries offered in the contact form's country select. */
export const countryOptions = [
  'Spain',
  'Portugal',
  'France',
  'Italy',
  'Germany',
  'Netherlands',
  'Belgium',
  'Austria',
  'Switzerland',
  'Poland',
  'Czechia',
  'Slovakia',
  'Hungary',
  'Slovenia',
  'Croatia',
  'Romania',
  'Bulgaria',
  'Greece',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Ireland',
  'United Kingdom',
  'Ukraine',
  'Türkiye',
  'Azerbaijan',
  'Georgia',
  'Morocco',
  'Algeria',
  'Tunisia',
  'Libya',
  'Egypt',
  'Other',
] as const;
