'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showStoreMenu, setShowStoreMenu] = useState(false);
  const [showSolutionsMenu, setShowSolutionsMenu] = useState(false);
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shouldShowSolidBg = !isHomePage || isScrolled;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        shouldShowSolidBg
          ? 'bg-white/95 backdrop-blur-sm border-border'
          : 'bg-transparent backdrop-blur-md border-white/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link
            href="/"
            className="relative h-16 md:h-20 w-auto transition-opacity duration-300 hover:opacity-80 flex items-center"
          >
            <Image
              src="/24.png"
              alt="LinexPv Logo"
              width={800}
              height={240}
              className="h-16 md:h-20 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-normal transition-colors duration-300 ${
                shouldShowSolidBg
                  ? 'text-foreground/80 hover:text-foreground'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Home
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setShowStoreMenu(true)}
              onMouseLeave={() => setShowStoreMenu(false)}
            >
              <button
                className={`text-sm font-normal transition-colors duration-300 flex items-center gap-1 ${
                  shouldShowSolidBg
                    ? 'text-foreground/80 hover:text-foreground'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Store
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-300 ${
                    showStoreMenu ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-6 transition-all duration-300 ${
                  showStoreMenu
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <div
                  className={`${
                    shouldShowSolidBg
                      ? 'bg-white border border-border shadow-xl'
                      : 'bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl'
                  } rounded-lg overflow-hidden min-w-[240px]`}
                >
                  <div className="py-3">
                    {/* ✅ 改成 slug 路径 */}
                    <Link
                      href="/store/microinverters"
                      className="block px-6 py-3 text-sm font-normal text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
                    >
                      <div className="font-medium mb-0.5">Microinverters</div>
                      <div className="text-xs text-muted-foreground">
                        High-efficiency power solutions
                      </div>
                    </Link>

                    <Link
                      href="/store/accessories"
                      className="block px-6 py-3 text-sm font-normal text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
                    >
                      <div className="font-medium mb-0.5">Accessories</div>
                      <div className="text-xs text-muted-foreground">
                        Cables, mounts & more
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setShowSolutionsMenu(true)}
              onMouseLeave={() => setShowSolutionsMenu(false)}
            >
              <button
                className={`text-sm font-normal transition-colors duration-300 flex items-center gap-1 ${
                  shouldShowSolidBg
                    ? 'text-foreground/80 hover:text-foreground'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Solutions
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-300 ${
                    showSolutionsMenu ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-6 transition-all duration-300 ${
                  showSolutionsMenu
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <div
                  className={`${
                    shouldShowSolidBg
                      ? 'bg-white border border-border shadow-xl'
                      : 'bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl'
                  } rounded-lg overflow-hidden min-w-[240px]`}
                >
                  <div className="py-3">
                    <Link
                      href="/solutions/balcony"
                      className="block px-6 py-3 text-sm font-normal text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
                    >
                      <div className="font-medium mb-0.5">Balcony</div>
                      <div className="text-xs text-muted-foreground">
                        Clean energy for urban living
                      </div>
                    </Link>
                    <Link
                      href="/solutions/rooftop"
                      className="block px-6 py-3 text-sm font-normal text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
                    >
                      <div className="font-medium mb-0.5">Rooftop</div>
                      <div className="text-xs text-muted-foreground">
                        Maximize power generation
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/support"
              className={`text-sm font-normal transition-colors duration-300 ${
                shouldShowSolidBg
                  ? 'text-foreground/80 hover:text-foreground'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Support
            </Link>

            <Link
              href="/install"
              className={`text-sm font-normal transition-colors duration-300 ${
                shouldShowSolidBg
                  ? 'text-foreground/80 hover:text-foreground'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Install
            </Link>
          </nav>

          <button
            className={`transition-colors duration-300 ${
              shouldShowSolidBg
                ? 'text-foreground/80 hover:text-foreground'
                : 'text-white/90 hover:text-white'
            }`}
            aria-label="Shopping cart"
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}