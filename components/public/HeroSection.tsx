'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Headphones, ShieldCheck, Tag } from 'lucide-react';

const DEFAULT_SLIDES = [
  '/hero_full_background.png',
  '/hero_full_background_2.png',
  '/hero_full_background_3.png',
];

import { createClient } from '@/lib/supabase/client';

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState<string[]>(DEFAULT_SLIDES);
  const supabase = createClient();

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'hero_slides')
          .single();
        
        if (data?.value) {
          const parsed = JSON.parse(data.value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSlides(parsed);
          }
        }
      } catch {
        // Fallback to defaults
      }
    };
    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <section className="relative w-full bg-white overflow-hidden pt-24 lg:pt-28 min-h-[75vh] lg:min-h-[85vh] flex flex-col justify-center border-b border-neutral-100">
      <div className="container-custom py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left side content */}
          <div className="space-y-6 lg:space-y-8 animate-slide-up z-10">
            <div className="space-y-4">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.12]">
                Trusted Cars.
                <br />
                <span className="text-metallic-gold">Trusted Deals.</span>
              </h1>
              
              <p className="text-neutral-600 text-sm sm:text-base max-w-md font-light leading-relaxed">
                We buy and sell certified, premium pre-owned cars. Get transparent pricing, 100+ checkpoint verified vehicles, and expert support.
              </p>
            </div>

            {/* Horizontal Trust Badges */}
            <div className="grid grid-cols-3 gap-4 border-t border-neutral-100 pt-6 max-w-md">
              <div className="flex flex-col gap-1 items-start">
                <div className="text-amber-500 flex-shrink-0">
                  <ShieldCheck size={20} className="stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider">Verified Cars</h3>
                  <p className="text-[9px] text-neutral-400 font-light mt-0.5 leading-tight">100+ Checkpoints</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 items-start">
                <div className="text-amber-500 flex-shrink-0">
                  <Tag size={20} className="stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider">Best Value</h3>
                  <p className="text-[9px] text-neutral-400 font-light mt-0.5 leading-tight">Fair Market Rates</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 items-start">
                <div className="text-amber-500 flex-shrink-0">
                  <Headphones size={20} className="stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider">Expert Support</h3>
                  <p className="text-[9px] text-neutral-400 font-light mt-0.5 leading-tight">Hassle-Free Deal</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/cars"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white font-bold px-8 py-4 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 shadow-sm hover:shadow"
                id="hero-explore-cars"
              >
                BROWSE INVENTORY
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/sell"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-neutral-200 hover:border-neutral-950 bg-white text-neutral-900 font-bold px-8 py-4 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 shadow-sm hover:shadow"
                id="hero-sell-car"
              >
                SELL YOUR CAR
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right side the cars image / slideshow */}
          <div className="relative w-full aspect-[4/3] lg:aspect-square xl:aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-neutral-100 bg-neutral-900 z-0">
            {slides.map((slide, index) => {
              const isVideo = slide.endsWith('.mp4') || slide.endsWith('.webm') || slide.includes('/hero/hero_slide_') && !slide.includes('.png') && !slide.includes('.jpg');
              return (
                <div 
                  key={slide}
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-in-out ${
                    index === activeSlide ? 'opacity-100 z-0' : 'opacity-0 z-0'
                  }`}
                >
                  {isVideo ? (
                    <video
                      src={slide}
                      className="w-full h-full object-cover object-center"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={slide}
                      alt="Premium Pre-Owned Cars"
                      className="w-full h-full object-cover object-center"
                    />
                  )}
                </div>
              );
            })}
            
            {/* Soft shade overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}
