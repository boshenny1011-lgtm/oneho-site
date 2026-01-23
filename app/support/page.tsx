import Link from 'next/link';
import { Metadata } from 'next';
import { Mail, Phone, MessageCircle, FileText, HelpCircle, Download } from 'lucide-react';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Support Center | LinexPv',
  description: 'Get help with your LinexPv products. Email, phone, and live chat support available. Access installation guides, FAQs, and technical documentation.',
  openGraph: {
    title: 'Support Center | LinexPv',
    description: 'Get help with your LinexPv products. Email, phone, and live chat support available. Access installation guides, FAQs, and technical documentation.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support Center | LinexPv',
    description: 'Get help with your LinexPv products. Email, phone, and live chat support available. Access installation guides, FAQs, and technical documentation.',
  },
};

export default function Support() {
  return (
    <>
      <Header />

      <main className="flex-1">
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-6">
                Support Center
              </h1>
              <p className="text-lg text-muted-foreground">
                We're here to help. Get in touch with our support team or browse our resources.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
              <div className="border border-border bg-card p-8 transition-all duration-200 hover:border-foreground/30">
                <div className="w-12 h-12 bg-secondary flex items-center justify-center mb-6">
                  <Mail className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-3">Email Support</h3>
                <p className="text-muted-foreground mb-4">
                  Get a response within 24 hours
                </p>
                <a
                  href="mailto:marco.md@racoforc.com"
                  className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors duration-200 inline-flex items-center gap-2"
                >
                  marco.md@racoforc.com
                </a>
              </div>

              <div className="border border-border bg-card p-8 transition-all duration-200 hover:border-foreground/30">
                <div className="w-12 h-12 bg-secondary flex items-center justify-center mb-6">
                  <Phone className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-3">Phone Support</h3>
                <p className="text-muted-foreground mb-4">
                  Mon-Fri, 9:00 AM - 6:00 PM CET
                </p>
                <a
                  href="tel:+31617815338"
                  className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors duration-200 inline-flex items-center gap-2"
                >
                  +31 617815338
                </a>
              </div>

              <div className="border border-border bg-card p-8 transition-all duration-200 hover:border-foreground/30">
                <div className="w-12 h-12 bg-secondary flex items-center justify-center mb-6">
                  <MessageCircle className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-3">Live Chat</h3>
                <p className="text-muted-foreground mb-4">
                  Chat with our support team now
                </p>
                <button className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors duration-200 inline-flex items-center gap-2">
                  Start Chat
                </button>
              </div>
            </div>

            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-12 text-center">
                Common Resources
              </h2>

              <div className="space-y-4">
                <Link
                  href="/install"
                  className="border border-border bg-card p-6 flex items-center gap-6 transition-all duration-200 hover:border-foreground/30 group"
                >
                  <div className="w-12 h-12 bg-secondary flex items-center justify-center flex-shrink-0">
                    <Download className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-foreground mb-1 group-hover:text-foreground/70 transition-colors duration-200">
                      Installation Guides
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Step-by-step instructions for all products
                    </p>
                  </div>
                </Link>

                <div className="border border-border bg-card p-6 flex items-center gap-6 transition-all duration-200 hover:border-foreground/30 group">
                  <div className="w-12 h-12 bg-secondary flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-foreground mb-1 group-hover:text-foreground/70 transition-colors duration-200">
                      Documentation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Technical specs and user manuals
                    </p>
                  </div>
                </div>

                <div className="border border-border bg-card p-6 flex items-center gap-6 transition-all duration-200 hover:border-foreground/30 group">
                  <div className="w-12 h-12 bg-secondary flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-foreground mb-1 group-hover:text-foreground/70 transition-colors duration-200">
                      FAQ
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Answers to frequently asked questions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-secondary py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-6">
              Warranty & Returns
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              All LinexPv products come with a 2-year warranty and 30-day return policy. We stand behind the quality of our hardware.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 text-sm font-medium"
            >
              View Products
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-white">
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
