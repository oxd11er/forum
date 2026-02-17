import type { Metadata } from 'next';
import './globals.css';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import { AppShell } from '@/components/app-shell';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });
const plexMono = IBM_Plex_Mono({ subsets: ['latin', 'cyrillic'], weight: ['400', '500'] });

export const metadata: Metadata = {
  title: 'THE WAY — Quiet Archive',
  description: 'A calm archival forum for anomalies, patterns, and coincidences.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${plexMono.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
