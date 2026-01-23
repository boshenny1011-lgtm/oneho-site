import { Metadata } from 'next';
import Header from '@/components/Header';
import ProductDetailClient from '@/components/ProductDetailClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (isNaN(id) || id <= 0) {
    return {
      title: 'Product Not Found | Oneho',
      description: 'The product you are looking for could not be found.',
    };
  }

  return {
    title: 'Product | Oneho',
    description: 'Premium hardware solutions for modern living',
    openGraph: {
      title: 'Product | Oneho',
      description: 'Premium hardware solutions for modern living',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Product | Oneho',
      description: 'Premium hardware solutions for modern living',
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (isNaN(id) || id <= 0) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <section className="bg-white py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center py-16">
                <h1 className="text-4xl md:text-5xl font-medium text-gray-900 mb-4">
                  Invalid Product
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  The product ID is not valid.
                </p>
                <Link
                  href="/store"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200 text-base font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Store
                </Link>
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <ProductDetailClient productId={id} />
      <footer className="border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">ONEHO</h3>
              <p className="text-sm text-muted-foreground">
                Premium hardware solutions for modern living
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/store" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Store
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/install" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Install
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:support@oneho.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Email Support
                  </a>
                </li>
                <li>
                  <a href="tel:+1234567890" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Phone Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              © 2026 Oneho. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
