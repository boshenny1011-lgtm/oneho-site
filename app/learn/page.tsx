import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';

export default function LearnPage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        <section className="relative min-h-screen overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/101.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/10" />

          <div className="absolute inset-x-0 bottom-10 md:bottom-14 lg:bottom-16 z-10">
            <div className="max-w-3xl mx-auto px-6 text-center">
              <div className="text-xs tracking-[0.2em] text-white/70 mb-4 uppercase">
                Microinverter System
              </div>
              <h1 className="text-4xl md:text-6xl font-light text-white mb-4 leading-tight tracking-normal">
                Energy systems designed for tomorrow
              </h1>
              <p className="text-base md:text-xl text-white/90 mb-8 leading-snug">
                Panel-level intelligence. System-wide reliability.
              </p>
            </div>
          </div>
        </section>

        <section id="explanation" className="bg-white py-32 md:py-40 lg:py-48">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold tracking-tight text-neutral-900 mb-8 leading-[1.1] max-w-5xl">
              It's not just energy.<br />
              It's how power should behave.
            </h2>

            <p className="text-xl md:text-2xl text-neutral-600 mb-20 font-light">
              Introducing distributed energy architecture.
            </p>

            <div className="space-y-8 text-lg md:text-xl text-neutral-700 leading-relaxed max-w-3xl">
              <p>
                For decades, energy systems have relied on centralized control. When a single component fails or underperforms, the impact spreads across the entire system.
              </p>
              <p>
                Distributed architectures change this by placing intelligence at the source of generation. Performance, safety, and reliability are handled locally—by design, not by exception.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-8 md:py-10">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-900 leading-[1.2] mb-4">
              Distributed by design. Resilient by nature.
            </h2>
            <p className="text-sm md:text-base text-neutral-500 font-light">
              A system built to operate independently, not dependently.
            </p>
          </div>
        </section>

        <section className="bg-neutral-50 py-24 md:py-32 lg:py-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-900 mb-8 leading-[1.1]">
                  Designed panel by panel.<br />
                  Built for the real world.
                </h2>
                <p className="text-lg md:text-xl text-neutral-600 leading-relaxed">
                  When intelligence is distributed to each generation point, the system responds to real conditions as they occur. No central bottleneck. No cascading effects.
                </p>
              </div>

              <div className="space-y-10">
                <div className="pb-10 border-b border-neutral-200">
                  <h3 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-3">
                    Failure stays local
                  </h3>
                  <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
                    When one unit underperforms or stops, the rest of the system continues unaffected.
                  </p>
                </div>

                <div className="pb-10 border-b border-neutral-200">
                  <h3 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-3">
                    Performance adapts locally
                  </h3>
                  <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
                    Shade, orientation, or mismatch affects only the unit experiencing it, not the entire array.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-3">
                    Reliability by design
                  </h3>
                  <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
                    No single point of failure means the system is inherently more stable over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/102.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30" />
        </section>

        <section className="bg-white py-20 md:py-24 lg:py-28">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-900 mb-6 leading-[1.15]">
              Built to keep working.
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 mb-8 font-light">
              A system designed to operate continuously — even when conditions aren't.
            </p>
            <p className="text-base md:text-lg text-neutral-700 leading-relaxed mb-6">
              By distributing intelligence to each generation point, the system avoids single points of failure and adapts naturally to real-world conditions. Performance remains predictable, disruptions stay contained, and long-term stability is built in by design.
            </p>
            <p className="text-sm md:text-base text-neutral-500 font-light">
              This is infrastructure designed for resilience, not dependency.
            </p>
          </div>
        </section>

        <section className="bg-neutral-900 py-24 md:py-32">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white mb-8">
              Ready to explore microinverter solutions?
            </h2>
            <p className="text-lg text-neutral-300 mb-10 max-w-2xl mx-auto">
              Discover products engineered for reliability, performance, and peace of mind.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-white text-neutral-900 hover:bg-neutral-100 transition-colors duration-200 text-base font-medium rounded-full"
            >
              View Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-secondary">
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
                  <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Customer Service
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Technical Support
                  </Link>
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
