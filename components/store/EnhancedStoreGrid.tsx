'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { WooCommerceStoreProduct } from '@/lib/woocommerce.types';
import { getBestProductImage } from '@/lib/image-matcher';

interface EnhancedStoreGridProps {
  products: WooCommerceStoreProduct[];
  categoryName: string;
}

function formatStorePrice(product: WooCommerceStoreProduct): string {
  try {
    if (product.prices?.price) {
      const priceValue = parseInt(product.prices.price) / Math.pow(10, product.prices.currency_minor_unit);
      const prefix = product.prices.currency_prefix || '';
      const suffix = product.prices.currency_suffix || '';
      return `${prefix}${priceValue.toFixed(product.prices.currency_minor_unit)}${suffix}`;
    }
    if (product.price_html) {
      return product.price_html.replace(/<[^>]*>/g, '');
    }
  } catch (error) {
    console.error('Error formatting price:', error);
  }
  return 'Contact us';
}

function MobileProductGrid({ products }: { products: WooCommerceStoreProduct[] }) {
  return (
    <section className="lg:hidden relative py-16 md:py-20 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.08),transparent_50%)]"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="text-[9px] tracking-[0.5em] text-neutral-500 mb-4 uppercase font-semibold">
            Product Excellence
          </div>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white">
            {products.length > 0 ? products[0].categories[0]?.name || 'Products' : 'Products'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => {
            const imageUrl = getBestProductImage(product);
            const price = formatStorePrice(product);
            
            return (
              <div
                key={product.id}
                className="group relative bg-gradient-to-br from-white/[0.03] via-transparent to-white/[0.03] rounded-2xl backdrop-blur-3xl border border-white/[0.05] p-6 hover:border-white/20 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.08),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-400/20 rounded-full backdrop-blur-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] animate-pulse"></div>
                      <span className="text-[8px] tracking-wider text-emerald-400 font-medium">
                        {product.stock_status === 'instock' ? 'AVAILABLE' : 'OUT OF STOCK'}
                      </span>
                    </div>
                  </div>

                  <div className="aspect-square mb-6 flex items-center justify-center relative overflow-hidden rounded-lg">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain transform group-hover:scale-105 transition-transform duration-500"
                        style={{
                          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-500 text-sm">
                        No image
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl md:text-2xl font-light tracking-tight text-white mb-2">
                    {product.name}
                  </h3>

                  {product.short_description && (
                    <p className="text-sm text-neutral-400 mb-4 line-clamp-2">
                      {product.short_description.replace(/<[^>]*>/g, '')}
                    </p>
                  )}

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl font-light text-white tracking-tight">
                      {price}
                    </span>
                  </div>

                  <Link
                    href={`/product/${product.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-xs tracking-wider text-white font-medium transition-all duration-300"
                  >
                    <span>LEARN MORE</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DesktopProductShowcase({ products, categoryName }: { products: WooCommerceStoreProduct[]; categoryName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useState<HTMLElement | null>(null)[0];

  useEffect(() => {
    const section = document.querySelector('[data-product-showcase]') as HTMLElement;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);

    let ticking = false;
    const rafRef = { current: 0 };

    const handleScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          if (!section) return;

          const rect = section.getBoundingClientRect();
          const sectionHeight = rect.height;
          const scrolled = -rect.top;
          const progress = Math.max(0, Math.min(1, scrolled / (sectionHeight - window.innerHeight)));

          const newIndex = Math.min(
            Math.max(0, Math.floor(progress * products.length * 1.1)),
            products.length - 1
          );

          setCurrentIndex(newIndex);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [products.length]);

  if (products.length === 0) return null;

  const currentProduct = products[currentIndex] || products[0];
  const imageUrl = getBestProductImage(currentProduct);
  const price = formatStorePrice(currentProduct);

  return (
    <section 
      data-product-showcase
      className="hidden lg:block relative bg-black" 
      style={{ height: `${Math.max(300, products.length * 100)}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black"></div>

        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-16">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="text-[9px] tracking-[0.5em] text-neutral-500 mb-8 uppercase font-semibold">
                  {categoryName}
                </div>

                <div className="relative mb-10" style={{ minHeight: '180px' }}>
                  {products.map((product, index) => (
                    <h2
                      key={product.id}
                      className={`text-7xl xl:text-8xl font-light tracking-tighter text-white leading-[1.1] transition-all duration-500 absolute top-0 left-0 ${
                        index === currentIndex
                          ? 'opacity-100 translate-x-0'
                          : index < currentIndex
                          ? 'opacity-0 -translate-x-8'
                          : 'opacity-0 translate-x-8'
                      }`}
                    >
                      {product.name}
                    </h2>
                  ))}
                </div>

                <div className="w-16 h-[1px] bg-gradient-to-r from-orange-400 to-transparent mb-16"></div>

                {currentProduct.short_description && (
                  <div className="relative mb-14" style={{ minHeight: '60px' }}>
                    <p className="text-2xl text-neutral-400 font-light leading-relaxed tracking-wide">
                      {currentProduct.short_description.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                  </div>
                )}

                <div className="relative mb-16" style={{ minHeight: '100px' }}>
                  <div className="flex items-baseline gap-4">
                    <span className="text-8xl font-light text-white tracking-tighter leading-none">
                      {price}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/product/${currentProduct.id}`}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-xs tracking-[0.15em] text-white font-medium group transition-all duration-300 backdrop-blur-sm"
                >
                  <span>DISCOVER MORE</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              <div className="flex gap-4 pt-10">
                {products.map((_, index) => (
                  <div
                    key={index}
                    className={`h-[2px] w-16 rounded-full transition-all duration-500 ${
                      index === currentIndex
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500 shadow-[0_0_20px_rgba(251,146,60,0.5)]'
                        : 'bg-white/10'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-square">
                {products.map((product, index) => {
                  const productImageUrl = getBestProductImage(product);
                  return (
                    <div
                      key={product.id}
                      className={`absolute inset-0 transition-all duration-700 ${
                        index === currentIndex
                          ? 'opacity-100 scale-100 rotate-0 z-10'
                          : index < currentIndex
                          ? 'opacity-0 scale-95 -rotate-6 z-0'
                          : 'opacity-0 scale-105 rotate-6 z-0'
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-white/[0.03] rounded-[3rem] backdrop-blur-3xl border border-white/[0.05]"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.08),transparent_60%)]"></div>

                        <div className="relative w-full h-full flex items-center justify-center">
                          {productImageUrl ? (
                            <Image
                              src={productImageUrl}
                              alt={product.name}
                              fill
                              className="object-contain"
                              style={{
                                filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.4)) drop-shadow(0 10px 20px rgba(251,146,60,0.1))',
                              }}
                            />
                          ) : (
                            <div className="text-neutral-500">No image</div>
                          )}
                        </div>

                        <div className="absolute top-6 right-6 flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-400/20 rounded-full backdrop-blur-sm z-20">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] animate-pulse"></div>
                          <span className="text-[10px] tracking-wider text-emerald-400 font-medium">
                            {product.stock_status === 'instock' ? 'AVAILABLE' : 'OUT OF STOCK'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function EnhancedStoreGrid({ products, categoryName }: EnhancedStoreGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-neutral-400 text-lg">No products available</p>
      </div>
    );
  }

  return (
    <>
      <MobileProductGrid products={products} />
      <DesktopProductShowcase products={products} categoryName={categoryName} />
    </>
  );
}
