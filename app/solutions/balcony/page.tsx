import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArchitectureCard } from '@/components/ArchitectureCard';
import Header from '@/components/Header';

export default function BalconySolutionPage() {
  return (
    <>
      <Header />
      <main className="bg-black">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        >
          <source src="/阳台solution.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/60" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs tracking-[0.3em] text-neutral-400 mb-8 uppercase font-light">
            Solution
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8 tracking-tight">
            ONEHO Balcony PV Solution
          </h1>

          <p className="text-xl md:text-2xl text-neutral-300 font-light mb-6 max-w-3xl mx-auto">
            A complete solar solution designed for urban balconies and limited spaces.
          </p>

          <p className="text-sm md:text-base text-neutral-400 font-light mb-12 max-w-2xl mx-auto">
            Optimized system architecture combining panels, microinverter, and monitoring — engineered for real residential constraints.
          </p>

          <Button
            variant="outline"
            className="bg-transparent border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base"
          >
            Download Solution Brief
          </Button>
        </div>
      </section>

      <section className="py-32 md:py-40 bg-neutral-950">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="text-xs tracking-[0.25em] text-neutral-500 mb-6 uppercase font-light">
            System Overview
          </div>

          <h2 className="text-4xl md:text-5xl font-light text-white mb-20 tracking-tight mx-auto">
            Designed for real urban constraints
          </h2>

          <div className="max-w-2xl mx-auto">
            <div className="space-y-12">
              <div>
                <h3 className="text-xl text-white font-light mb-3">Panel-level intelligence</h3>
                <p className="text-neutral-400 font-light leading-relaxed">
                  Each panel converts power independently, adapting to shading, orientation, and uneven sunlight.
                </p>
              </div>

              <div>
                <h3 className="text-xl text-white font-light mb-3">Grid-ready AC architecture</h3>
                <p className="text-neutral-400 font-light leading-relaxed">
                  Power is converted at the panel and delivered as AC, simplifying grid connection in residential environments.
                </p>
              </div>

              <div>
                <h3 className="text-xl text-white font-light mb-3">Integrated monitoring</h3>
                <p className="text-neutral-400 font-light leading-relaxed">
                  System-level visibility built in for installers and end users from day one.
                </p>
              </div>

              <div>
                <h3 className="text-xl text-white font-light mb-3">Urban-safe design</h3>
                <p className="text-neutral-400 font-light leading-relaxed">
                  Low-voltage DC at panel level, suitable for dense residential buildings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 md:py-40 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-xs tracking-[0.25em] text-neutral-500 mb-6 uppercase font-light">
            Architecture
          </div>

          <h2 className="text-4xl md:text-5xl font-light text-white mb-20 tracking-tight max-w-3xl">
            Why this architecture works for balconies
          </h2>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <ArchitectureCard
              title="Space efficiency"
              items={[
                'Compact system layout',
                'No central inverter required',
                'Fits balconies, railings, and limited façade space'
              ]}
              imageSrc="/1.png"
              index={0}
            />
            <ArchitectureCard
              title="Safety by design"
              items={[
                'Low-voltage operation at panel level',
                'Automatic shutdown capability',
                'Aligned with residential safety expectations'
              ]}
              imageSrc="/2.png"
              index={1}
            />
            <ArchitectureCard
              title="Installation flexibility"
              items={[
                'Modular and expandable system',
                'Minimal electrical work required',
                'Suitable for owner-occupied and rental properties'
              ]}
              imageSrc="/3.png"
              index={2}
            />
          </div>
        </div>
      </section>

      <section className="pt-32 md:pt-40 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-8 tracking-tight">
              Engineered for long-term operation
            </h2>
            <p className="text-xl text-neutral-400 font-light">
              Reliable power in constrained residential environments.
            </p>
          </div>

          <div className="max-w-5xl mx-auto mb-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              <div className="border-l border-neutral-800 pl-6">
                <div className="text-2xl md:text-3xl text-white font-light mb-3">Long system lifetime</div>
                <p className="text-neutral-400 font-light text-sm">Designed for decades of operation</p>
              </div>

              <div className="border-l border-neutral-800 pl-6">
                <div className="text-2xl md:text-3xl text-white font-light mb-3">Weather-resistant</div>
                <p className="text-neutral-400 font-light text-sm">Outdoor-rated enclosure</p>
              </div>

              <div className="border-l border-neutral-800 pl-6">
                <div className="text-2xl md:text-3xl text-white font-light mb-3">Stable operation</div>
                <p className="text-neutral-400 font-light text-sm">Consistent output across seasons</p>
              </div>

              <div className="border-l border-neutral-800 pl-6">
                <div className="text-2xl md:text-3xl text-white font-light mb-3">Urban-tested</div>
                <p className="text-neutral-400 font-light text-sm">Proven in residential contexts</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <img
              src="/4.png"
              alt="System architecture"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </section>

      <section className="py-32 md:py-40 bg-black">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-xs tracking-[0.25em] text-neutral-500 mb-6 uppercase font-light text-center">
            Operations
          </div>

          <h2 className="text-4xl md:text-5xl font-light text-white mb-20 tracking-tight mx-auto text-center">
            Operational visibility built into the solution
          </h2>

          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 max-w-3xl mx-auto">
            <div>
              <h3 className="text-2xl text-white font-light mb-8">Installer View</h3>
              <ul className="space-y-6 text-neutral-400 font-light">
                <li className="flex items-start">
                  <span className="mr-3 text-neutral-600">—</span>
                  <span>Remote commissioning support</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-neutral-600">—</span>
                  <span>System health monitoring</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-neutral-600">—</span>
                  <span>Performance diagnostics</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl text-white font-light mb-8">End User View</h3>
              <ul className="space-y-6 text-neutral-400 font-light">
                <li className="flex items-start">
                  <span className="mr-3 text-neutral-600">—</span>
                  <span>Simple mobile access</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-neutral-600">—</span>
                  <span>Real-time generation data</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-neutral-600">—</span>
                  <span>Energy savings tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 md:py-40 bg-neutral-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs tracking-[0.25em] text-neutral-500 mb-6 uppercase font-light">
            Target Applications
          </div>

          <h2 className="text-4xl md:text-5xl font-light text-white mb-12 tracking-tight">
            Who This Solution Is For
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-16 text-left max-w-2xl mx-auto">
            <ul className="space-y-4 text-neutral-400 font-light">
              <li className="flex items-start">
                <span className="mr-3 text-neutral-600">—</span>
                <span>Urban residential installations</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-neutral-600">—</span>
                <span>Apartment and balcony systems</span>
              </li>
            </ul>
            <ul className="space-y-4 text-neutral-400 font-light">
              <li className="flex items-start">
                <span className="mr-3 text-neutral-600">—</span>
                <span>Solar installers serving urban markets</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-neutral-600">—</span>
                <span>Distributed energy integrators</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/support">
              <Button
                variant="outline"
                className="bg-white text-black hover:bg-neutral-200 px-8 py-6 text-base"
              >
                Contact ONEHO
              </Button>
            </Link>
            <Button
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base"
            >
              Download Full Technical Documentation
            </Button>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
