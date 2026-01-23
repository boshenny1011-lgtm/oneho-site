import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import StorePageClient from '@/components/store/StorePageClient';

export const dynamic = 'force-dynamic';

interface StoreCategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const categoryMetadata: Record<string, { title: string; description: string }> = {
  'microinverters': {
    title: 'Microinverters',
    description: 'High-efficiency microinverters for solar energy systems',
  },
  'solar-panels': {
    title: 'Solar Panels',
    description: 'Premium solar panels for residential and commercial use',
  },
  'batteries': {
    title: 'Batteries',
    description: 'Energy storage solutions for solar systems',
  },
  'accessories': {
    title: 'Accessories',
    description: 'Solar system accessories and components',
  },
};

export async function generateMetadata({ params }: StoreCategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const meta = categoryMetadata[slug] || {
    title: 'Store',
    description: 'Browse our solar energy products and accessories',
  };

  return {
    title: `${meta.title} | Oneho Store`,
    description: meta.description,
    openGraph: {
      title: `${meta.title} | Oneho Store`,
      description: meta.description,
      type: 'website',
    },
  };
}

export default async function StoreCategoryPage({ params }: StoreCategoryPageProps) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.slug;

  return (
    <>
      <Header />
      <StorePageClient slug={categorySlug} />
      <footer className="border-t border-border bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">LinexPv</h3>
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/learn" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Customer Service
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Technical Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              © 2026 LinexPv. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}