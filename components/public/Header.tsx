'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, Phone } from 'lucide-react';
import { NAV_LINKS, WHATSAPP_NUMBER } from '@/lib/constants';
import { getDefaultWhatsAppMessage, getWhatsAppUrl } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const headerBg = isHomePage
    ? isScrolled
      ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200/50 shadow-sm'
      : 'bg-white/80 backdrop-blur-sm'
    : 'bg-white border-b border-neutral-200/60';

  const textColor = 'text-neutral-900';
  const logoColor = 'text-neutral-950';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="AutoCapital Wheels Logo"
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  // Fallback if image not loaded
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex flex-col items-center justify-center leading-none">
                <div className="font-display font-black text-base lg:text-lg tracking-tight italic select-none">
                  <span className="text-[#5a6065]">AUTO</span>
                  <span className="text-[#b48d36]">CAPITAL</span>
                </div>
                <div className="flex items-center gap-1 -mt-0.5 select-none w-full justify-center">
                  <span className="h-[1px] w-2 bg-gradient-to-r from-transparent to-[#5a6065]/50" />
                  <span className="font-display font-black text-[8px] tracking-[0.25em] text-[#5a6065] uppercase">
                    WHEELS
                  </span>
                  <span className="h-[1px] w-2 bg-gradient-to-l from-transparent to-[#b48d36]/50" />
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { href: '/', label: 'HOME' },
                { href: '/cars', label: 'INVENTORY' },
                { href: '/sell', label: 'SELL YOUR CAR' },
                { href: '/about', label: 'ABOUT US' },
                { href: '/contact', label: 'CONTACT US' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-[11px] font-bold tracking-widest uppercase transition-all duration-200 ${
                    pathname === link.href
                      ? 'text-amber-500'
                      : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-amber-500" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
              {/* Phone contact */}
              <a
                href="tel:+917840815818"
                className="hidden xl:flex items-center gap-2 text-xs font-bold text-neutral-800 hover:text-neutral-950"
              >
                <Phone size={14} className="text-neutral-600" />
                +91 78408 15818
              </a>

              {/* Login CTA */}
              <Link
                href="/login"
                className="hidden lg:inline-flex items-center justify-center bg-[#171717] hover:bg-neutral-800 text-white font-bold px-6 py-2.5 rounded-lg text-xs tracking-wider transition-all duration-200"
              >
                Login / Sign Up
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-md text-neutral-800 hover:bg-neutral-100 transition-colors"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-80 bg-[#f7f6f2] border-l border-neutral-200 shadow-2xl lg:hidden transform transition-transform duration-350 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-200/60">
          <div>
            <div className="font-display font-black text-base tracking-tight text-neutral-900">AUTOCAPITAL</div>
            <div className="font-display font-black text-base tracking-tight text-neutral-900 -mt-1">WHEELS</div>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-1.5 rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="p-6 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-3 text-sm font-semibold tracking-widest uppercase transition-colors ${
                pathname === link.href
                  ? 'text-neutral-950 border-b-[1.5px] border-neutral-900 w-fit'
                  : 'text-neutral-500 hover:text-neutral-950'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-neutral-200/60 mt-auto space-y-3">
          <a
            href={getWhatsAppUrl(WHATSAPP_NUMBER, getDefaultWhatsAppMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#171717] hover:bg-neutral-800 text-white text-xs font-bold py-3.5 rounded-md uppercase tracking-wider transition-colors"
          >
            WhatsApp Us
          </a>
          <a
            href="tel:+918800243707"
            className="flex items-center justify-center gap-2 w-full border border-neutral-300 hover:border-neutral-400 text-neutral-700 text-xs font-bold py-3.5 rounded-md uppercase tracking-wider transition-colors"
          >
            <Phone size={13} />
            +91 8800243707
          </a>
        </div>
      </div>
    </>
  );
}
