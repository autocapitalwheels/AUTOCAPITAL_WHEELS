'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, CheckCircle, MessageCircle } from 'lucide-react';
import { Vehicle } from '@/types';
import { enquirySchema, EnquiryFormValues } from '@/lib/validations';
import { formatPrice, getVehicleTitle, getWhatsAppUrl, getVehicleWhatsAppMessage } from '@/lib/utils';
import { WHATSAPP_NUMBER, PREFERRED_TIMES } from '@/lib/constants';

interface EnquiryModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  defaultType?: 'enquiry' | 'test_drive';
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function EnquiryModal({ vehicle, onClose, defaultType = 'enquiry' }: EnquiryModalProps) {
  const [formState, setFormState] = useState<FormState>('idle');
  const [enquiryId, setEnquiryId] = useState('');
  const title = getVehicleTitle(vehicle);

  const {
    register,
    handleSubmit,
    formState: formErrorsState,
    setValue,
  } = useForm<any>({
    resolver: zodResolver(enquirySchema) as any,
    defaultValues: {
      vehicle_id: vehicle.id,
      preferred_contact: 'Phone',
      test_drive_requested: defaultType === 'test_drive',
    },
  });
  const errors = formErrorsState.errors as any;

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const onSubmit = async (data: EnquiryFormValues) => {
    setFormState('loading');
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setEnquiryId(json.data?.enquiry_id || '');
        setFormState('success');
      } else {
        setFormState('error');
      }
    } catch {
      setFormState('error');
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="enquiry-modal-title">
      <div className="modal-content animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-neutral-100">
          <div>
            <h2 id="enquiry-modal-title" className="font-display font-bold text-lg text-neutral-900">
              {defaultType === 'test_drive' ? 'Request Test Drive' : 'Get Quotation'}
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">{title}</p>
            {vehicle.price && (
              <p className="text-sm font-semibold text-neutral-900 mt-0.5">{formatPrice(vehicle.price)}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success State */}
        {formState === 'success' && (
          <div className="p-8 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={28} />
            </div>
            <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Enquiry Submitted!</h3>
            <p className="text-sm text-neutral-500 mb-1">
              Our team will contact you within 24 hours.
            </p>
            {enquiryId && (
              <p className="text-xs text-neutral-400 mb-6">
                Reference ID: <span className="font-mono font-medium text-neutral-700">{enquiryId}</span>
              </p>
            )}
            <div className="space-y-3">
              <a
                href={getWhatsAppUrl(WHATSAPP_NUMBER, getVehicleWhatsAppMessage(title))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25d366] text-white font-semibold py-3 rounded-md text-sm hover:bg-[#128C7E] transition-colors"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp Instead
              </a>
              <button
                onClick={onClose}
                className="w-full border border-neutral-300 text-neutral-700 font-semibold py-3 rounded-md text-sm hover:bg-neutral-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        {formState !== 'success' && (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <input type="hidden" {...register('vehicle_id')} />

            {/* Name */}
            <div>
              <label htmlFor="enq-name" className="form-label">Full Name *</label>
              <input
                id="enq-name"
                type="text"
                placeholder="Your full name"
                className={`form-input ${errors.customer_name ? 'error' : ''}`}
                autoComplete="name"
                {...register('customer_name')}
              />
              {errors.customer_name && <p className="form-error">{errors.customer_name.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="enq-phone" className="form-label">Mobile Number *</label>
              <div className="flex">
                <span className="flex items-center px-3 bg-neutral-50 border border-r-0 border-neutral-200 rounded-l-md text-sm text-neutral-500 font-medium">+91</span>
                <input
                  id="enq-phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  className={`form-input rounded-l-none flex-1 ${errors.customer_phone ? 'error' : ''}`}
                  maxLength={10}
                  autoComplete="tel"
                  {...register('customer_phone')}
                />
              </div>
              {errors.customer_phone && <p className="form-error">{errors.customer_phone.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="enq-email" className="form-label">Email <span className="text-neutral-400 font-normal">(optional)</span></label>
              <input
                id="enq-email"
                type="email"
                placeholder="your@email.com"
                className="form-input"
                autoComplete="email"
                {...register('customer_email')}
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="enq-city" className="form-label">City <span className="text-neutral-400 font-normal">(optional)</span></label>
              <input
                id="enq-city"
                type="text"
                placeholder="Your city"
                className="form-input"
                {...register('customer_city')}
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="enq-message" className="form-label">Message <span className="text-neutral-400 font-normal">(optional)</span></label>
              <textarea
                id="enq-message"
                rows={3}
                placeholder="Any specific questions or requirements..."
                className="form-input resize-none"
                {...register('message')}
              />
            </div>

            {/* Preferred Contact */}
            <div>
              <label className="form-label">Preferred Contact Method</label>
              <div className="flex gap-2 flex-wrap">
                {(['Phone', 'WhatsApp', 'Email', 'Any'] as const).map((method) => (
                  <label key={method} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={method}
                      className="sr-only"
                      {...register('preferred_contact')}
                      id={`contact-${method}`}
                    />
                    <span
                      className="px-3 py-1.5 border rounded-md text-sm cursor-pointer transition-all has-[:checked]:bg-neutral-900 has-[:checked]:text-white has-[:checked]:border-neutral-900"
                      onClick={() => setValue('preferred_contact', method)}
                    >
                      {method}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Preferred Time */}
            <div>
              <label htmlFor="enq-time" className="form-label">Preferred Time <span className="text-neutral-400 font-normal">(optional)</span></label>
              <select id="enq-time" className="form-input" {...register('preferred_time')}>
                <option value="">Any time</option>
                {PREFERRED_TIMES.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            {/* Test Drive toggle */}
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-md border border-neutral-200 hover:bg-neutral-50 transition-colors">
              <input type="checkbox" className="w-4 h-4 accent-neutral-900" {...register('test_drive_requested')} />
              <span className="text-sm font-medium text-neutral-700">I'd also like to request a test drive</span>
            </label>

            {formState === 'error' && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-md">
                Something went wrong. Please try again or WhatsApp us directly.
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={formState === 'loading'}
                className="flex-1 btn-primary py-3 justify-center"
                id="submit-enquiry-btn"
              >
                {formState === 'loading' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Enquiry'
                )}
              </button>
              <a
                href={getWhatsAppUrl(WHATSAPP_NUMBER, getVehicleWhatsAppMessage(title))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp py-3 px-4"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>

            <p className="text-xs text-neutral-400 text-center">
              By submitting you agree to be contacted by our team regarding this vehicle.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
