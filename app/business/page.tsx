'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';

export default function BusinessPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-white">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/14.png"
            alt="Solar installation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              FOR SOLAR PROFESSIONALS
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-white leading-tight drop-shadow-2xl">
              Power your business forward
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed drop-shadow-lg">
              Join thousands of installers who trust our technology to deliver exceptional results. Faster installation. Better margins. Happier customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-black hover:bg-white/90 text-base px-10 py-7 rounded-full shadow-xl transition-all hover:scale-105"
              >
                Get in Touch
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="contact-section" className="bg-white py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-7xl md:text-8xl lg:text-9xl font-light tracking-tight mb-12 text-black">
                Get in touch
              </h2>
              <p className="text-xl md:text-2xl text-neutral-500 font-light max-w-2xl mx-auto">
                Let's discuss how we can work together
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-16 mb-32 text-center">
              <div>
                <div className="text-xs uppercase tracking-widest text-neutral-400 mb-4">Email</div>
                <a href="mailto:marco.md@racoforc.com" className="text-lg text-black hover:text-neutral-600 transition-colors">
                  marco.md@racoforc.com
                </a>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-neutral-400 mb-4">Phone</div>
                <a href="tel:+31617815338" className="text-lg text-black hover:text-neutral-600 transition-colors">
                  +31 617815338
                </a>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-neutral-400 mb-4">Office</div>
                <div className="text-lg text-black">
                  Netherlands
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Label htmlFor="name" className="text-xs uppercase tracking-widest text-neutral-500 mb-3 block">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-0 border-b border-neutral-300 rounded-none bg-transparent px-0 text-lg focus:border-black focus:ring-0 transition-colors"
                  />
                </div>

                <div>
                  <Label htmlFor="company" className="text-xs uppercase tracking-widest text-neutral-500 mb-3 block">
                    Company
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="border-0 border-b border-neutral-300 rounded-none bg-transparent px-0 text-lg focus:border-black focus:ring-0 transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Label htmlFor="email" className="text-xs uppercase tracking-widest text-neutral-500 mb-3 block">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-0 border-b border-neutral-300 rounded-none bg-transparent px-0 text-lg focus:border-black focus:ring-0 transition-colors"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-xs uppercase tracking-widest text-neutral-500 mb-3 block">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-0 border-b border-neutral-300 rounded-none bg-transparent px-0 text-lg focus:border-black focus:ring-0 transition-colors"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-xs uppercase tracking-widest text-neutral-500 mb-3 block">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="border-0 border-b border-neutral-300 rounded-none bg-transparent px-0 text-lg focus:border-black focus:ring-0 resize-none min-h-[120px] transition-colors"
                />
              </div>

              <div className="pt-8">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white hover:bg-neutral-800 px-12 py-6 text-base font-normal tracking-wide transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
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
