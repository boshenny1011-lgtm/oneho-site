'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import ProductShowcase from '@/components/ProductShowcase';
import type { WooCommerceStoreProduct } from '@/lib/woocommerce.types';

const ParticleGlobe = dynamic(() => import("@/components/ParticleGlobe"), { ssr: false });

export default function HomePageClient() {
  const [products, setProducts] = useState<WooCommerceStoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          '/api/store/products?per_page=3'
        );

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          throw new Error('Expected JSON but got ' + contentType);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <main className="flex-1">
      <section className="relative min-h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/video-poster.jpg"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/10" />

        <div className="absolute inset-x-0 bottom-10 md:bottom-14 lg:bottom-16 z-10">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-light text-white mb-4 leading-tight tracking-normal">
              A new day for clean energy
            </h1>
            <p className="text-base md:text-xl text-white/90 mb-8 leading-snug">
              Generate, use, store, and sell energy with confidence—engineered for everyday reliability.
            </p>
            <div className="flex items-center justify-center">
              <Link
                href="/learn"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-black hover:opacity-90 transition-opacity duration-200 text-sm font-medium rounded-full"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ProductShowcase />

      <section className="relative min-h-screen overflow-hidden flex items-center justify-start">
        <Image
          src="/homepage.png"
          alt="Energy systems"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent md:bg-black/10" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12 w-full py-12 md:py-0">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white leading-[1.2] mb-4 md:mb-6 lg:mb-8">
              Energy that adapts — not one that depends.
            </h2>

            <div className="space-y-2 md:space-y-3 text-sm sm:text-base md:text-lg text-white/95 leading-relaxed">
              <p>Solar power changes constantly.</p>
              <p>Shade, weather, and time affect every panel differently.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-screen overflow-hidden flex items-end justify-center pb-8">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '55% center' }}
        >
          <source src="/25.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="text-center">
            <div className="text-xs tracking-[0.2em] text-white/70 mb-4">
              OUR APPROACH
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
              This is how energy should be built.
            </h2>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto mb-12">
              A system designed for reliability at scale.
            </p>
            <Link
              href="/product/eq-microinverter-1t1"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-black hover:opacity-90 transition-opacity duration-200 text-sm font-medium rounded-full shadow-lg"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      <section className="relative min-h-screen overflow-hidden flex items-end justify-center pb-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/106.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="flex flex-col items-center justify-center">
            <Link
              href="/business"
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-black hover:opacity-90 transition-opacity duration-200 text-base font-medium rounded-full shadow-lg"
            >
              Commercial & Industrial
            </Link>
          </div>
        </div>
      </section>

      <section className="relative h-screen overflow-hidden flex flex-col md:flex-row">
        <Image
          src="/solution.png"
          alt="Solutions"
          fill
          className="object-cover object-center"
          style={{
            filter: 'saturate(0.85) brightness(0.88)',
          }}
          priority
        />

        <Link
          href="/solutions/balcony"
          className="group relative flex-1 overflow-hidden cursor-pointer"
          aria-label="Explore Balcony Solutions"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/55 transition-opacity duration-500 group-hover:opacity-30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-20" />

          <div className="absolute inset-0 flex items-end p-8 md:p-12 lg:p-16">
            <div className="max-w-md">
              <div className="text-xs tracking-[0.25em] text-white/70 mb-3 uppercase font-light">
                Solution
              </div>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 tracking-tight transition-all duration-300 group-hover:translate-x-1">
                Balcony
              </h3>
              <p className="text-base md:text-lg text-white/85 mb-6 font-light leading-relaxed">
                Clean energy for urban living spaces
              </p>

              <div className="overflow-hidden">
                <div className="opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  <span className="inline-flex items-center text-sm text-white tracking-wide">
                    <span className="border-b border-white/40 pb-0.5">Explore Balcony</span>
                    <span className="ml-2">→</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10 z-10 pointer-events-none" />

        <Link
          href="/solutions/rooftop"
          className="group relative flex-1 overflow-hidden cursor-pointer"
          aria-label="Explore Rooftop Solutions"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/55 transition-opacity duration-500 group-hover:opacity-30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-20" />

          <div className="absolute inset-0 flex items-end p-8 md:p-12 lg:p-16">
            <div className="max-w-md">
              <div className="text-xs tracking-[0.25em] text-white/70 mb-3 uppercase font-light">
                Solution
              </div>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 tracking-tight transition-all duration-300 group-hover:translate-x-1">
                Rooftop
              </h3>
              <p className="text-base md:text-lg text-white/85 mb-6 font-light leading-relaxed">
                Maximize power generation at scale
              </p>

              <div className="overflow-hidden">
                <div className="opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  <span className="inline-flex items-center text-sm text-white tracking-wide">
                    <span className="border-b border-white/40 pb-0.5">Explore Rooftop</span>
                    <span className="ml-2">→</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/22.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-20 relative z-10">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="max-w-xl">
              <div className="text-xs tracking-[0.2em] mb-6 uppercase" style={{ color: 'rgba(0,0,0,0.5)' }}>
                Distributed Intelligence
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8 leading-[1.1]" style={{ color: '#1A1A1A' }}>
                A system built on balance.
              </h2>
              <p className="text-lg leading-relaxed mb-10" style={{ color: '#4A4A4A' }}>
                Every component works in harmony. No central point of failure. Just stable, intelligent energy distribution.
              </p>
              <Link
                href="/learn"
                className="inline-flex items-center text-sm transition-colors group hover:opacity-70"
                style={{ color: '#1A1A1A' }}
              >
                <span className="pb-1" style={{ borderBottom: '1px solid #1A1A1A' }}>
                  Explore the architecture
                </span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="relative w-full flex justify-center lg:justify-end">
              <ParticleGlobe speed={1.2} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
