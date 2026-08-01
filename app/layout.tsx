import type { Metadata, Viewport } from 'next';
import { Big_Shoulders_Display, JetBrains_Mono, Work_Sans } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/components/i18n/LanguageProvider';
import { company, product, siteUrl } from '@/data/company';
import en from '@/i18n/en';

const display = Big_Shoulders_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const body = Work_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: en.meta.title,
    template: '%s — AUREON',
  },
  description: en.meta.description,
  applicationName: 'AUREON',
  keywords: [
    'mini excavator',
    'ground penetrating radar excavator',
    'GPR excavator',
    'GNSS excavator',
    '5 ton excavator',
    'AUREON S5',
    'excavadora GPR',
    'utility detection excavator',
  ],
  authors: [{ name: company.legalName }],
  openGraph: {
    type: 'website',
    siteName: 'AUREON',
    title: en.meta.title,
    description: en.meta.description,
    url: siteUrl,
    locale: 'en',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: en.meta.ogAlt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: en.meta.title,
    description: en.meta.description,
    images: ['/og.png'],
  },
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0D0D0D',
  colorScheme: 'dark',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}#organization`,
      name: company.brand,
      legalName: company.legalName,
      url: siteUrl,
      logo: `${siteUrl}/logo.svg`,
      email: company.email,
      slogan: 'Premium Machinery. Built to Endure.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: company.address.street,
        addressLocality: company.address.city,
        postalCode: company.address.postalCode,
        addressCountry: company.address.country,
      },
    },
    {
      '@type': 'Product',
      '@id': `${siteUrl}#product`,
      name: product.fullName,
      sku: product.sku,
      description: en.meta.description,
      brand: { '@id': `${siteUrl}#organization` },
      manufacturer: { '@id': `${siteUrl}#organization` },
      category: 'Mini excavator',
      image: `${siteUrl}/og.png`,
      offers: {
        '@type': 'Offer',
        price: product.priceEur,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: siteUrl,
      },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Operating weight', value: '5000 kg' },
        { '@type': 'PropertyValue', name: 'GPR scan depth', value: '4.0 m' },
        { '@type': 'PropertyValue', name: 'GNSS accuracy', value: '±2.5 cm' },
        { '@type': 'PropertyValue', name: 'Sound power level', value: '94 dB (LwA)' },
        { '@type': 'PropertyValue', name: 'Emission stage', value: 'EU Stage V' },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // Static, developer-authored JSON — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
