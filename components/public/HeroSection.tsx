'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Headphones, ShieldCheck, Tag } from 'lucide-react';

const BACKGROUND_SLIDES = [
  '/hero_full_background.png',
  '/hero_full_background_2.png',
  '/hero_full_background_3.png',
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % BACKGROUND_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-32 pb-24 lg:pt-44 lg:pb-36 overflow-hidden min-h-[90vh] flex items-center bg-white">
      {/* Full section background image slideshow */}
      {BACKGROUND_SLIDES.map((slide, index) => (
        <div 
          key={slide}
          className={`absolute inset-0 bg-cover bg-right md:bg-center pointer-events-none transition-opacity duration-1000 ease-in-out ${
            index === activeSlide ? 'opacity-100 z-0' : 'opacity-0 z-0'
          }`}
          style={{
            backgroundImage: `url('${slide}')`,
          }}
        />
      ))}
      
      {/* Light gradient overlay on the left to ensure high text readability */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-[55%] bg-gradient-to-r from-white via-white/95 to-white/10 pointer-events-none z-10" />

      <div className="container-custom relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-6 space-y-8 animate-slide-up">
            <div className="space-y-4">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.15]">
                Trusted Cars.
                <br />
                <span className="text-amber-500">Trusted Deals.</span>
              </h1>
              
              <p className="text-neutral-600 text-xs sm:text-sm max-w-md font-light leading-relaxed">
                We buy and sell second hand cars like Baleno, Glanza, Swift, WagonR and more.
              </p>
            </div>

            {/* Horizontal Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-2 max-w-md">
              <div className="flex gap-2.5 items-start">
                <div className="text-amber-500 mt-0.5 flex-shrink-0">
                  <ShieldCheck size={16} className="stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-neutral-900 uppercase tracking-wide">Verified Cars</h3>
                  <p className="text-[8px] text-neutral-400 font-light mt-0.5 leading-tight">Quality checked & verified</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="text-amber-500 mt-0.5 flex-shrink-0">
                  <Tag size={16} className="stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-neutral-900 uppercase tracking-wide">Best Value</h3>
                  <p className="text-[8px] text-neutral-400 font-light mt-0.5 leading-tight">Fair quotes, best deals</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="text-amber-500 mt-0.5 flex-shrink-0">
                  <Headphones size={16} className="stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-neutral-900 uppercase tracking-wide">Expert Support</h3>
                  <p className="text-[8px] text-neutral-400 font-light mt-0.5 leading-tight">We're here to help</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/cars"
                className="inline-flex items-center justify-center gap-2 bg-[#171717] hover:bg-neutral-800 text-white font-bold px-8 py-3.5 rounded-lg text-xs tracking-widest uppercase transition-all duration-300"
                id="hero-explore-cars"
              >
                Browse Inventory
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center justify-center gap-2 border border-neutral-200 hover:border-neutral-950 bg-white text-neutral-900 font-bold px-8 py-3.5 rounded-lg text-xs tracking-widest uppercase transition-all duration-300"
                id="hero-sell-car"
              >
                Sell Your Car
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right spacer to keep the layout wide and allow image background visibility */}
          <div className="lg:col-span-6 min-h-[300px] lg:min-h-[400px] pointer-events-none" />

        </div>
      </div>
    </section>
  );
}
