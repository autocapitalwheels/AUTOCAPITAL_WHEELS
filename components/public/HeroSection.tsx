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
    <section className="relative w-full overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-36 min-h-[80vh] lg:min-h-[90vh] flex items-center bg-neutral-950">
      
      {/* Full-width background image/video slideshow */}
      {slides.map((slide, index) => {
        const lower = slide.toLowerCase();
        const isVideo = lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov') || lower.endsWith('.m4v') || (lower.includes('/hero/') && !lower.includes('.png') && !lower.includes('.jpg') && !lower.includes('.jpeg') && !lower.includes('.webp'));
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
      
      {/* Soft dark premium radial gradient overlay to ensure perfect white text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-950/60 to-neutral-950/40 lg:from-neutral-950/90 lg:via-neutral-950/70 lg:to-neutral-950/30 pointer-events-none z-10" />

      <div className="container-custom relative z-20 w-full">
        <div className="max-w-2xl space-y-8 animate-slide-up">
          
          {/* Main Text content */}
          <div className="space-y-4">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              Trusted Cars.
              <br />
              <span style={{ color: '#b48d36' }}>Trusted Deals.</span>
            </h1>
            
            <p className="text-neutral-300 text-sm sm:text-base max-w-md font-light leading-relaxed">
              We buy and sell certified, premium pre-owned cars. Get transparent pricing, 100+ checkpoint verified vehicles, and expert support.
            </p>
          </div>

          {/* Horizontal Trust Badges */}
          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 max-w-md">
            <div className="flex flex-col gap-1 items-start">
              <div style={{ color: '#b48d36' }} className="flex-shrink-0">
                <ShieldCheck size={20} className="stroke-[2]" />
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-white uppercase tracking-wider">Verified Cars</h3>
                <p className="text-[9px] text-neutral-400 font-light mt-0.5 leading-tight">100+ Checkpoints</p>
              </div>
            </div>

            <div className="flex flex-col gap-1 items-start">
              <div style={{ color: '#b48d36' }} className="flex-shrink-0">
                <Tag size={20} className="stroke-[2]" />
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-white uppercase tracking-wider">Best Value</h3>
                <p className="text-[9px] text-neutral-400 font-light mt-0.5 leading-tight">Fair Market Rates</p>
              </div>
            </div>

            <div className="flex flex-col gap-1 items-start">
              <div style={{ color: '#b48d36' }} className="flex-shrink-0">
                <Headphones size={20} className="stroke-[2]" />
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-white uppercase tracking-wider">Expert Support</h3>
                <p className="text-[9px] text-neutral-400 font-light mt-0.5 leading-tight">Hassle-Free Deal</p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/cars"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-neutral-950 font-bold px-8 py-4 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 shadow-sm hover:shadow"
              id="hero-explore-cars"
            >
              BROWSE INVENTORY
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/sell"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white bg-transparent text-white font-bold px-8 py-4 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 shadow-sm hover:shadow"
              id="hero-sell-car"
            >
              SELL YOUR CAR
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
