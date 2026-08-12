import type { Metadata } from 'next';
import { Shield, Sparkles, Handshake, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us — AutoCapital Wheels',
  description: 'Learn more about AutoCapital Wheels, Delhi\'s premier pre-owned car dealership. Discover our values of 100% transparency, quality assurance, and premium service.',
};

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: '100% Transparency',
      description: 'We believe trust is earned through complete clarity. From detailed vehicle history reports to clear pricing policies, what you see is exactly what you get.',
    },
    {
      icon: Sparkles,
      title: 'Quality Above All',
      description: 'Every vehicle in our showroom undergoes a meticulous multi-point inspection and sanitization process before being showcased. Only the finest cars make the cut.',
    },
    {
      icon: Handshake,
      title: 'Reliable Partnerships',
      description: 'We guide you through the entire transaction seamlessly, from documentation transfer and RC transfer support to instant payouts when selling.',
    },
    {
      icon: Heart,
      title: 'Customer-First Approach',
      description: 'Our relationship doesn\'t end at delivery. We strive to provide premium post-sales support and expert consultation whenever you need it.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6]/30 pt-20">
      {/* Header Banner */}
      <div className="bg-[#faf9f6] text-neutral-900 py-16 px-4 border-b border-neutral-200/60">
        <div className="container-custom max-w-4xl text-center">
          <div className="w-12 h-0.5 bg-amber-500 mx-auto mb-5" />
          <h1 className="font-display font-black text-4xl sm:text-5xl text-neutral-900 tracking-tight mb-4">
            About AutoCapital Wheels
          </h1>
          <p className="text-neutral-500 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Redefining the pre-owned luxury and premium automotive experience in Delhi with absolute trust and transparency.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom max-w-4xl py-14 px-4">
        {/* Our Story */}
        <section className="space-y-6 mb-16 text-center sm:text-left">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 tracking-tight">
            Our Story
          </h2>
          <p className="text-neutral-600 text-base leading-relaxed font-light">
            Founded with a vision to eliminate the ambiguity and friction typically associated with buying and selling pre-owned cars, <strong>AutoCapital Wheels</strong> has grown to become one of the most trusted names in Delhi NCR\'s automotive space.
          </p>
          <p className="text-neutral-600 text-base leading-relaxed font-light">
            We specialize in curated, high-quality, pre-owned vehicles that meet strict cosmetic and mechanical standards. By prioritizing client satisfaction and rigorous quality verification, we deliver a premium dealership experience that matches the excitement of purchasing a brand-new car.
          </p>
        </section>

        {/* Our Core Values */}
        <section className="mb-16">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 tracking-tight text-center mb-10">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-neutral-200/80 p-6 flex flex-col items-center sm:items-start text-center sm:text-left hover:shadow-sm transition-shadow"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">
                    {val.title}
                  </h3>
                  <p className="text-neutral-500 text-sm font-light leading-relaxed">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Call to Action Box */}
        <section className="bg-white rounded-2xl border border-neutral-200/80 p-8 sm:p-10 text-center">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-neutral-900 mb-4">
            Ready to find your next ride?
          </h2>
          <p className="text-neutral-500 text-sm sm:text-base font-light max-w-xl mx-auto mb-6">
            Browse our carefully vetted inventory of premium pre-owned cars or request a direct quotation for your current vehicle today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/cars" className="btn-primary py-3 px-8 text-sm">
              Explore Inventory
            </a>
            <a href="/sell" className="btn-secondary py-3 px-8 text-sm">
              Sell Your Car
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
