import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'LinexPv - Premium Hardware Solutions',
  description: 'Discover premium hardware solutions for modern living. Quality products with 2-year warranty and expert installation support.',
  keywords: ['hardware', 'premium hardware', 'home hardware', 'installation', 'quality products'],
  authors: [{ name: 'LinexPv' }],
  creator: 'LinexPv',
  publisher: 'LinexPv',
  metadataBase: new URL('https://linexpv.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://linexpv.com',
    siteName: 'LinexPv',
    title: 'LinexPv - Premium Hardware Solutions',
    description: 'Discover premium hardware solutions for modern living. Quality products with 2-year warranty and expert installation support.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinexPv - Premium Hardware Solutions',
    description: 'Discover premium hardware solutions for modern living. Quality products with 2-year warranty and expert installation support.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LinexPv',
    url: 'https://linexpv.com',
    logo: 'https://linexpv.com/logo.png',
    description: 'Premium hardware solutions for modern living',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+31-617815338',
      contactType: 'customer service',
      email: 'marco.md@racoforc.com',
      availableLanguage: ['English'],
    },
    sameAs: [
      'https://twitter.com/linexpv',
      'https://facebook.com/linexpv',
      'https://linkedin.com/company/linexpv',
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              {children}
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
