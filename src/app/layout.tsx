import type { Metadata } from 'next';
import './globals.css';
import { bodyFont, capsFont } from './fonts';
import { unstable_ViewTransition as ViewTransition } from 'react';

export const metadata: Metadata = {
  title: 'Giant Reset'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={bodyFont.className}>
        <ViewTransition>
          {children}
        </ViewTransition>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""></script>
      </body>
    </html>
  );
} 