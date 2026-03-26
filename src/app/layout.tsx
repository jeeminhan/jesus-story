import type { Metadata, Viewport } from 'next';
import { ServiceWorkerRegistrar } from '@/components/ServiceWorkerRegistrar';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0d0a05',
};

export const metadata: Metadata = {
  title: 'The Story',
  description: 'An interactive gospel storybook for international students',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Gospel Story',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}>
        <div id="phone-frame">{children}</div>
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
