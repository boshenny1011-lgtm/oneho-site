import Link from 'next/link';
import { Metadata } from 'next';
import { CheckCircle2, Download, Wrench, BookOpen, Video } from 'lucide-react';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Installation Guides | LinexPv',
  description: 'Step-by-step installation guides for all LinexPv products. Download manuals, watch video tutorials, and access troubleshooting resources.',
  openGraph: {
    title: 'Installation Guides | LinexPv',
    description: 'Step-by-step installation guides for all LinexPv products. Download manuals, watch video tutorials, and access troubleshooting resources.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Installation Guides | LinexPv',
    description: 'Step-by-step installation guides for all LinexPv products. Download manuals, watch video tutorials, and access troubleshooting resources.',
  },
};

export default function Install() {
  return (
    <>
      <Header />

      <main className="flex-1">
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-6">
                Installation Guides
              </h1>
              <p className="text-lg text-muted-foreground">
                Everything you need to install and configure your LinexPv hardware products
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
              <div className="border border-border bg-card p-8">
                <div className="w-12 h-12 bg-secondary flex items-center justify-center mb-6">
                  <Download className="w-6 h-6 text-foreground" />
                </div>
                <h2 className="text-2xl font-medium text-foreground mb-4">Quick Start</h2>
                <p className="text-muted-foreground mb-6">
                  Download our comprehensive installation package with all the tools and documentation you need to get started.
                </p>
                <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Download Package
                </button>
              </div>

              <div className="border border-border bg-card p-8">
                <div className="w-12 h-12 bg-secondary flex items-center justify-center mb-6">
                  <Video className="w-6 h-6 text-foreground" />
                </div>
                <h2 className="text-2xl font-medium text-foreground mb-4">Video Tutorials</h2>
                <p className="text-muted-foreground mb-6">
                  Watch step-by-step video guides for installing and configuring your LinexPv products.
                </p>
                <button className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border hover:border-foreground/30 transition-colors duration-200 text-sm font-medium text-foreground">
                  Watch Tutorials
                </button>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-12">
                Installation Steps
              </h2>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-xl font-medium text-foreground mb-2">Prepare Your Workspace</h3>
                    <p className="text-muted-foreground mb-4">
                      Ensure you have adequate lighting and a clean, static-free workspace. Gather all necessary tools including screwdrivers, cable organizers, and your product documentation.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-xl font-medium text-foreground mb-2">Unbox and Inspect</h3>
                    <p className="text-muted-foreground mb-4">
                      Carefully unbox your product and verify all components are included. Check for any visible damage and review the included quick start guide.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-xl font-medium text-foreground mb-2">Physical Installation</h3>
                    <p className="text-muted-foreground mb-4">
                      Follow the product-specific mounting instructions. Ensure all connections are secure and cables are properly routed to avoid strain or interference.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      4
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-xl font-medium text-foreground mb-2">Power and Configuration</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect power supply and turn on the device. Follow the on-screen setup wizard or use the mobile app for initial configuration.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      5
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-xl font-medium text-foreground mb-2">Testing and Verification</h3>
                    <p className="text-muted-foreground mb-4">
                      Run diagnostic tests to ensure proper operation. Verify all features are working correctly and perform any necessary firmware updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-secondary py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-12 text-center">
              Installation Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-border bg-card p-6">
                <div className="w-10 h-10 bg-white flex items-center justify-center mb-4">
                  <BookOpen className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">User Manuals</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Detailed documentation for all products
                </p>
                <button className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors duration-200">
                  View Manuals
                </button>
              </div>

              <div className="border border-border bg-card p-6">
                <div className="w-10 h-10 bg-white flex items-center justify-center mb-4">
                  <Wrench className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Troubleshooting</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Common issues and solutions
                </p>
                <Link href="/support" className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors duration-200">
                  Get Help
                </Link>
              </div>

              <div className="border border-border bg-card p-6">
                <div className="w-10 h-10 bg-white flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Best Practices</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tips for optimal performance
                </p>
                <button className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors duration-200">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-6">
              Need Professional Installation?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our certified technicians can handle the installation for you. Schedule a professional installation service for a hassle-free setup experience.
            </p>
            <Link
              href="/support"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 text-sm font-medium"
            >
              Contact Support
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">LinexPv</h3>
              <p className="text-sm text-muted-foreground">
                Premium hardware solutions for modern living
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Products
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
                  <a href="mailto:marco.md@racoforc.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Email Support
                  </a>
                </li>
                <li>
                  <a href="tel:+31617815338" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Phone Support
                  </a>
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
