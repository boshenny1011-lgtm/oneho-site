'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Download, Zap, Shield, Sun, Gauge, Box, Droplets, Award, FileText, BookOpen, FileCheck, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import { useEffect, useRef } from 'react';

export default function EQMicroinverter1T1Page() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      cardsRef.current.forEach((card, index) => {
        if (card) {
          const rect = card.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          if (rect.top < windowHeight && rect.bottom > 0) {
            const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
            const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

            const translateY = (1 - clampedProgress) * 50;
            const opacity = clampedProgress;
            const scale = 0.9 + (clampedProgress * 0.1);

            card.style.transform = `translateY(${translateY}px) scale(${scale})`;
            card.style.opacity = opacity.toString();
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <>
      <Header />

      <main className="flex-1 bg-neutral-950">
        <section className="relative min-h-screen overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/详情页1.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40" />

          <div className="absolute inset-x-0 bottom-20 z-10">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                EQ Microinverter 1T1
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed font-light">
                The World's Lightest 500W Microinverter
              </p>
              <div className="flex items-center justify-center">
                <Link
                  href="/store"
                  className="px-8 py-4 bg-white text-neutral-950 hover:bg-neutral-100 transition-colors duration-200 font-semibold rounded-full shadow-lg"
                >
                  Order Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-gradient-to-b from-neutral-100 to-white py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-1 h-24 bg-gradient-to-b from-red-600 to-red-800 rounded-full" />
                  <h2 className="text-5xl md:text-6xl font-bold text-black leading-tight">
                    EQ Microinverter 1T1
                  </h2>
                </div>
              </div>

              <div>
                <p className="text-lg text-neutral-700 leading-relaxed">
                  The Microinverter 1T1 is a single-module microinverter designed for residential and small commercial rooftop solar systems.
                </p>
                <p className="text-lg text-neutral-700 leading-relaxed mt-4">
                  It delivers reliable AC power conversion at the module level, improving system safety, energy harvest, and long-term stability. With its compact design, industrial-grade components, and wide operating temperature range, the 1T1 is built for demanding outdoor environments and long service life.
                </p>
                <p className="text-lg text-neutral-700 leading-relaxed mt-4">
                  The plug-and-play architecture simplifies installation and maintenance, making it an ideal choice for installers seeking efficiency, safety, and consistent performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-black py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
              Where every home finds its ideal energy solution
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                ref={(el) => {cardsRef.current[0] = el}}
                className="relative rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-500 min-h-[400px] group"
                style={{ opacity: 0, transform: 'translateY(50px)' }}
              >
                <Image
                  src="/15.png"
                  alt="Maximized Energy Harvest"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white mb-4">Maximized Energy Harvest</h3>
                  <p className="text-sm text-neutral-200 leading-relaxed">
                    Features an industry-leading <span className="text-white font-semibold">12V start-up voltage</span> (vs. 16V competitors). It wakes up earlier at dawn and works later at dusk, capturing more sunlight to deliver higher daily yields.
                  </p>
                </div>
              </div>

              <div
                ref={(el) => {cardsRef.current[1] = el}}
                className="relative rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-500 min-h-[400px] group"
                style={{ opacity: 0, transform: 'translateY(50px)' }}
              >
                <Image
                  src="/16.png"
                  alt="Ultimate Power Density"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white mb-4">Ultimate Power Density</h3>
                  <p className="text-sm text-neutral-200 leading-relaxed">
                    Weighing just <span className="text-white font-semibold">1.48kg</span>, it delivers <span className="text-white font-semibold">1.25x the power density</span> of Enphase. With <span className="text-white font-semibold">16A high-current input</span>, it perfectly supports modern 182/210mm large modules without clipping.
                  </p>
                </div>
              </div>

              <div
                ref={(el) => {cardsRef.current[2] = el}}
                className="relative rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-500 min-h-[400px] group"
                style={{ opacity: 0, transform: 'translateY(50px)' }}
              >
                <Image
                  src="/17.png"
                  alt="Stable & Integrated Design"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white mb-4">Stable & Integrated Design</h3>
                  <p className="text-sm text-neutral-200 leading-relaxed">
                    Utilizes industrial-grade <span className="text-white font-semibold">PLC communication</span> for robust connectivity. Features a <span className="text-white font-semibold">Built-in Relay</span>, eliminating the need for external disconnects and simplifying installation.
                  </p>
                </div>
              </div>

              <div
                ref={(el) => {cardsRef.current[3] = el}}
                className="relative rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-500 min-h-[400px] group"
                style={{ opacity: 0, transform: 'translateY(50px)' }}
              >
                <Image
                  src="/18.png"
                  alt="Extreme Reliability"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white mb-4">Extreme Reliability</h3>
                  <p className="text-sm text-neutral-200 leading-relaxed">
                    Designed with <span className="text-white font-semibold">HW-class reliability logic</span>. IP67 rated and capable of running at <span className="text-white font-semibold">65°C without derating</span>, ensuring stable operation for its 25-year lifespan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/19.png"
              alt="System Architecture"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="absolute inset-x-0 top-32 z-10">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Industrial-Grade PLC Connectivity.<br />Simplified System Architecture.
              </h2>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                Built for complex rooftops. Stable PLC communication ensures consistent data transmission across large installations and dense structures.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-b from-neutral-950 to-neutral-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Technical Specifications
              </h2>
              <p className="text-xl text-neutral-400">
                EQ-500-P Complete Data Sheet
              </p>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-900/80">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-900/80">Parameter</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-900/80">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white" rowSpan={6}>Input (DC)</td>
                      <td className="px-6 py-4 text-sm text-neutral-300">Recommended Module Power</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">400W - 700W+</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300">Max. Input Voltage</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">60 V</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300">Start-up Voltage</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">22 V</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300">MPPT Voltage Range</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">16 V - 55 V</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/30 transition-colors bg-blue-500/5 border-l-4 border-blue-500">
                      <td className="px-6 py-4 text-sm text-neutral-300 flex items-center gap-2">
                        <span>Max. Input Current</span>
                        <span className="inline-flex px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-300 font-semibold">KEY SPEC</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-mono font-bold">16 A <span className="text-neutral-500 text-xs">(Supports 182/210mm cells)</span></td>
                    </tr>
                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300">Max. Short Circuit Current</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">25 A</td>
                    </tr>

                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white" rowSpan={6}>Output (AC)</td>
                      <td className="px-6 py-4 text-sm text-neutral-300">Peak Output Power</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">550 VA</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300">Rated Output Power</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">500 W</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300">Rated Output Current</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">2.17 A</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300">Nominal Voltage</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">230 V <span className="text-neutral-500 text-xs">(Range: 184-276 V)</span></td>
                    </tr>
                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300">Nominal Frequency</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">50 Hz / 60 Hz</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300">Power Factor</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">&gt; 0.99 <span className="text-neutral-500 text-xs">(Adjustable 0.8 leading...0.8 lagging)</span></td>
                    </tr>

                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white" rowSpan={3}>Efficiency</td>
                      <td className="px-6 py-4 text-sm text-neutral-300">Peak Efficiency</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">98.0%</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300">MPPT Efficiency</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">99.9%</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300">Night Power Consumption</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">&lt; 20 mW</td>
                    </tr>

                    <tr className="hover:bg-neutral-900/30 transition-colors bg-emerald-500/5 border-l-4 border-emerald-500">
                      <td className="px-6 py-4 text-sm font-medium text-white" rowSpan={4}>Mechanical</td>
                      <td className="px-6 py-4 text-sm text-neutral-300">Dimensions (W × H × D)</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">215 × 173 × 31 mm</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/30 transition-colors bg-emerald-500/5 border-l-4 border-emerald-500">
                      <td className="px-6 py-4 text-sm text-neutral-300 flex items-center gap-2">
                        <span>Weight</span>
                        <span className="inline-flex px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded text-xs text-emerald-300 font-semibold">KEY SPEC</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-mono font-bold">1.48 kg</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300">Protection Class</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">IP67 (NEMA 6)</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300">Cooling</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">Natural Convection <span className="text-neutral-500 text-xs">(No Fans)</span></td>
                    </tr>

                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white" rowSpan={2}>Features</td>
                      <td className="px-6 py-4 text-sm text-neutral-300">Communication</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">PLC <span className="text-neutral-500 text-xs">(Requires EQ Gateway)</span></td>
                    </tr>
                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300">Warranty</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">25 Years</td>
                    </tr>

                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white" rowSpan={2}>Compliance</td>
                      <td className="px-6 py-4 text-sm text-neutral-300">Grid Standards</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">EN 50549-1, VDE-AR-N 4105, CEI 0-21</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-300">Safety Standards</td>
                      <td className="px-6 py-4 text-sm text-white font-mono">IEC/EN 62109-1, IEC/EN 62109-2</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="relative min-h-screen bg-black py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                WEATHER TESTED,<br />DURABILITY ENSURED
              </h2>
              <p className="text-lg md:text-xl text-white/80 max-w-4xl mx-auto">
                Our weather-resistant materials and robust design ensure a 25-year Warranty, maximizing your return on investment.
              </p>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-10">
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/9]">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src="/20.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>

                <div className="lg:col-span-2 flex items-center justify-center lg:justify-start">
                  <div className="text-center lg:text-left">
                    <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-none">
                      25-YEAR
                    </div>
                    <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-2">
                      WARRANTY
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-800 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">ONEHO</h3>
              <p className="text-sm text-neutral-400">
                Professional solar energy solutions for installers and contractors
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-4">Products</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/shop" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link href="/business" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    For Business
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/support" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Technical Support
                  </Link>
                </li>
                <li>
                  <Link href="/install" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Installation Guides
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral-800">
            <p className="text-center text-sm text-neutral-500">
              © 2026 Oneho. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
