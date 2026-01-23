'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  tagline: string;
  power: string;
  powerLabel: string;
  image: string;
  link: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'EQ Microinverter 1T1',
    tagline: '1.25x Higher Density. HW-Class Reliability.',
    power: '550VA',
    powerLabel: 'peak output',
    image: '/11.png',
    link: '/product/eq-microinverter-1t1'
  },
  {
    id: 2,
    name: 'EQ Gateway',
    tagline: 'Multi-panel orchestration',
    power: '250 UNITS',
    powerLabel: 'MAXIMUM CONNECTIONS',
    image: '/12.png',
    link: '/product/eq-microinverter-1t1'
  }
];

function MobileProductGrid() {
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
            EQ Microinverter Series
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-gradient-to-br from-white/[0.03] via-transparent to-white/[0.03] rounded-2xl backdrop-blur-3xl border border-white/[0.05] p-6 hover:border-white/20 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.08),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-400/20 rounded-full backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] animate-pulse"></div>
                    <span className="text-[8px] tracking-wider text-emerald-400 font-medium">AVAILABLE</span>
                  </div>
                </div>

                <div className="aspect-square mb-6 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                    style={{
                      filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
                    }}
                  />
                </div>

                <h3 className="text-xl md:text-2xl font-light tracking-tight text-white mb-2">
                  {product.name}
                </h3>

                <p className="text-sm text-neutral-400 mb-4">
                  {product.tagline}
                </p>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-light text-white tracking-tight">
                    {product.power}
                  </span>
                  <span className="text-xs text-neutral-500 font-light tracking-wide uppercase">
                    {product.powerLabel}
                  </span>
                </div>

                <Link
                  href={product.link}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-xs tracking-wider text-white font-medium transition-all duration-300"
                >
                  <span>LEARN MORE</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DesktopProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number>();
  const lastIndexRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
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

    const handleScroll = () => {
      if (!ticking) {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }

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

          if (newIndex !== lastIndexRef.current) {
            lastIndexRef.current = newIndex;
            setCurrentIndex(newIndex);
          }

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
  }, []);

  const currentProduct = products[currentIndex] || products[0];

  return (
    <section ref={sectionRef} className="hidden lg:block relative bg-black" style={{ height: '300vh' }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black"></div>

        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-16">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div
                className={`transition-all duration-1000 transform-gpu ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="text-[9px] tracking-[0.5em] text-neutral-500 mb-8 uppercase font-semibold">
                  Product Excellence
                </div>

                <div className="relative mb-10" style={{ minHeight: '180px' }}>
                  {products.map((product, index) => (
                    <h2
                      key={product.id}
                      className={`text-7xl xl:text-8xl font-light tracking-tighter text-white leading-[1.1] transition-all duration-500 absolute top-0 left-0 will-change-transform ${
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

                <div className="relative mb-14" style={{ minHeight: '60px' }}>
                  {products.map((product, index) => (
                    <p
                      key={product.id}
                      className={`text-2xl text-neutral-400 font-light leading-relaxed tracking-wide transition-all duration-500 absolute top-0 left-0 will-change-transform ${
                        index === currentIndex
                          ? 'opacity-100 translate-x-0'
                          : index < currentIndex
                          ? 'opacity-0 -translate-x-8'
                          : 'opacity-0 translate-x-8'
                      }`}
                    >
                      {product.tagline}
                    </p>
                  ))}
                </div>

                <div className="relative mb-16" style={{ minHeight: '100px' }}>
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className={`transition-all duration-500 absolute top-0 left-0 flex items-baseline gap-4 will-change-transform ${
                        index === currentIndex
                          ? 'opacity-100 translate-x-0'
                          : index < currentIndex
                          ? 'opacity-0 -translate-x-8'
                          : 'opacity-0 translate-x-8'
                      }`}
                    >
                      <span className="text-8xl font-light text-white tracking-tighter leading-none">
                        {product.power}
                      </span>
                      <span className="text-xl text-neutral-500 font-light tracking-wide uppercase">{product.powerLabel}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={currentProduct.link}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-xs tracking-[0.15em] text-white font-medium group transition-all duration-300 backdrop-blur-sm transform-gpu"
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
                    className={`h-[2px] w-16 rounded-full transition-all duration-500 ease-out transform-gpu ${
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
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out will-change-transform ${
                      index === currentIndex
                        ? 'opacity-100 scale-100 rotate-0 z-10'
                        : index < currentIndex
                        ? 'opacity-0 scale-95 -rotate-6 z-0'
                        : 'opacity-0 scale-105 rotate-6 z-0'
                    }`}
                    style={{
                      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <div className="relative w-full h-full transform-gpu">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-white/[0.03] rounded-[3rem] backdrop-blur-3xl border border-white/[0.05]"></div>

                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.08),transparent_60%)]"></div>
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(59,130,246,0.06),transparent_50%)]"></div>

                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="relative w-full h-full object-contain transform-gpu"
                          style={{
                            filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.4)) drop-shadow(0 10px 20px rgba(251,146,60,0.1))',
                          }}
                        />
                      </div>

                      <div className="absolute top-6 right-6 flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-400/20 rounded-full backdrop-blur-sm z-20">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] animate-pulse"></div>
                        <span className="text-[10px] tracking-wider text-emerald-400 font-medium">AVAILABLE</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-[100px] pointer-events-none"></div>
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-[100px] pointer-events-none"></div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-60">
          <div className="text-[9px] tracking-[0.4em] text-neutral-500 uppercase font-medium">Scroll</div>
          <div className="w-[1px] h-16 bg-gradient-to-b from-neutral-600 via-neutral-700 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}

export default function ProductShowcase() {
  return (
    <>
      <MobileProductGrid />
      <DesktopProductShowcase />
    </>
  );
}
