import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Script from 'next/script';
import { unstable_ViewTransition as ViewTransition } from 'react';

import { bodyFont } from '../fonts';
import '../globals.css';

type LayoutParams = {
  params: Promise<{ locale: string }>;
};

type Props = {
  children: React.ReactNode;
} & LayoutParams;

export async function generateMetadata({ params }: LayoutParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body className={bodyFont.className}>
        <SpeedInsights />
        <Analytics />
        <NextIntlClientProvider>
          <ViewTransition>{children}</ViewTransition>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
