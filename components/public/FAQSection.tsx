'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQ } from '@/types';

interface FAQSectionProps {
  faqs: FAQ[];
}

function FAQItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-neutral-200 last:border-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-5 text-left gap-4"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq.id}`}
      >
        <span className="font-medium text-neutral-900 text-sm sm:text-base pr-4">{faq.question}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        id={`faq-answer-${faq.id}`}
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="pb-5 text-sm text-neutral-500 leading-relaxed">{faq.answer}</p>
      </div>
    </div>
  );
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  if (faqs.length === 0) return null;

  return (
    <section className="py-10 bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-0.5 bg-neutral-900" />
              <p className="section-label">FAQ</p>
              <div className="w-8 h-0.5 bg-neutral-900" />
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-neutral-900">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-500 mt-3 text-base">
              Quick answers to common questions about buying and selling cars with AutoCapital Wheels.
            </p>
          </div>

          <div className="bg-[#faf9f6]/40 rounded-2xl p-6 sm:p-8">
            {faqs.map((faq) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-neutral-500">
              Still have questions?{' '}
              <a
                href="https://wa.me/918800243707"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-900 font-semibold hover:underline"
              >
                WhatsApp us directly
              </a>{' '}
              or{' '}
              <a href="mailto:autocapitalwheels@gmail.com" className="text-neutral-900 font-semibold hover:underline">
                send us an email
              </a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
