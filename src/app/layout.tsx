import type { Metadata } from 'next';
import Script from 'next/script';
import { unstable_ViewTransition as ViewTransition } from 'react';

import { bodyFont } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Giant Reset',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={bodyFont.className}>
        <ViewTransition>{children}</ViewTransition>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></Script>
      </body>
    </html>
  );
}
