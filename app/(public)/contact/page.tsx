import type { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import ContactFormClient from '@/components/public/ContactFormClient';

export const metadata: Metadata = {
  title: 'Contact Us — AutoCapital Wheels',
  description: 'Get in touch with AutoCapital Wheels. Find our showroom location in Delhi, contact numbers, email, business hours, or send us a message directly.',
};

export default function ContactPage() {
  const contactDetails = [
    {
      icon: Phone,
      title: 'Call or WhatsApp',
      value: '+91 88002 43707',
      subValue: '+91 78408 15818',
      link: 'tel:+918800243707',
    },
    {
      icon: Mail,
      title: 'Email Address',
      value: 'autocapitalwheels@gmail.com',
      subValue: 'Response within 24 hours',
      link: 'mailto:autocapitalwheels@gmail.com',
    },
    {
      icon: MapPin,
      title: 'Showroom Location',
      value: 'AutoCapital Wheels, Delhi, India',
      subValue: 'Visit us for a physical inspection',
      link: 'https://maps.google.com',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      value: 'Mon–Sat: 10:00 AM – 7:00 PM',
      subValue: 'Sunday: 11:00 AM – 5:00 PM',
      link: null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6]/30 pt-20">
      {/* Header Banner */}
      <div className="bg-[#faf9f6] text-neutral-900 py-16 px-4 border-b border-neutral-200/60">
        <div className="container-custom max-w-5xl text-center">
          <div className="w-12 h-0.5 bg-amber-500 mx-auto mb-5" />
          <h1 className="font-display font-black text-4xl sm:text-5xl text-neutral-900 tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-neutral-500 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Have questions about a car, want to schedule a test drive, or ready to list your vehicle? We\'re here to help.
          </p>
        </div>
      </div>

      <div className="container-custom max-w-5xl py-14 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-display font-bold text-2xl text-neutral-900 mb-6">
              Get in Touch
            </h2>
            <div className="grid grid-cols-1 gap-5">
              {contactDetails.map((detail, idx) => {
                const Icon = detail.icon;
                const ContentWrapper = detail.link ? 'a' : 'div';
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-neutral-200/80 p-5 flex items-start gap-4 hover:shadow-sm transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 flex-shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-neutral-400 uppercase tracking-wider mb-1">
                        {detail.title}
                      </h3>
                      {detail.link ? (
                        <a
                          href={detail.link}
                          target={detail.link.startsWith('http') ? '_blank' : undefined}
                          rel={detail.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="font-semibold text-neutral-900 text-base hover:underline"
                        >
                          {detail.value}
                        </a>
                      ) : (
                        <p className="font-semibold text-neutral-900 text-base">{detail.value}</p>
                      )}
                      <p className="text-xs text-neutral-500 font-light mt-0.5">{detail.subValue}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Contact Form Client */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8">
              <h2 className="font-display font-bold text-2xl text-neutral-900 mb-2">
                Send a Message
              </h2>
              <p className="text-sm text-neutral-500 font-light mb-6">
                Fill out the form below and our customer relationship manager will connect with you shortly.
              </p>
              <ContactFormClient />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
