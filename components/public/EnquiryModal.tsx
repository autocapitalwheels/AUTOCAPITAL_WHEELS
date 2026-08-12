'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, CheckCircle2, MessageCircle, Clock, MapPin, Sparkles } from 'lucide-react';
import { Vehicle } from '@/types';
import { enquirySchema, EnquiryFormValues } from '@/lib/validations';
import { formatPrice, getVehicleTitle, getWhatsAppUrl, getVehicleWhatsAppMessage } from '@/lib/utils';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

interface EnquiryModalProps {
  vehicle?: Vehicle;
  onClose: () => void;
  defaultType?: 'enquiry' | 'test_drive';
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function EnquiryModal({ vehicle, onClose, defaultType = 'enquiry' }: EnquiryModalProps) {
  const [formState, setFormState] = useState<FormState>('idle');
  const [enquiryId, setEnquiryId] = useState('');
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  
  // Dynamic vehicle list states
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(vehicle || null);
  const [loadingStock, setLoadingStock] = useState(false);

  const {
    register,
    handleSubmit,
    formState: formErrorsState,
    setValue,
  } = useForm<any>({
    resolver: zodResolver(enquirySchema) as any,
    defaultValues: {
      vehicle_id: vehicle?.id || '',
      preferred_contact: 'Phone',
      test_drive_requested: defaultType === 'test_drive',
    },
  });
  const errors = formErrorsState.errors as any;

  // Load user data and available vehicles
  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        setValue('customer_name', session.user.user_metadata?.full_name || '');
        setValue('customer_phone', session.user.user_metadata?.phone || '');
        setValue('customer_email', session.user.email || '');
      }
    };
    loadUser();

    if (!vehicle) {
      setLoadingStock(true);
      fetch('/api/vehicles?per_page=50')
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setAvailableVehicles(json.data);
          }
        })
        .catch((err) => console.error('Error loading quote stock:', err))
        .finally(() => setLoadingStock(false));
    }
  }, [vehicle, setValue]);

  const handleVehicleChange = (vehicleId: string) => {
    const found = availableVehicles.find((v) => v.id === vehicleId) || null;
    setSelectedVehicle(found);
    setValue('vehicle_id', vehicleId);
  };

  const title = selectedVehicle ? getVehicleTitle(selectedVehicle) : 'Select a Vehicle';

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
      // Sanitize empty UUID strings
      const payload: any = {
        ...data,
        user_id: userId || undefined,
        vehicle_id: data.vehicle_id || undefined,
      };

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setEnquiryId(json.data?.enquiry_id || '');
        setFormState('success');
      } else {
        console.error('[EnquiryModal] API error:', json);
        setFormState('error');
      }
    } catch (err) {
      console.error('[EnquiryModal] Submit error:', err);
      setFormState('error');
    }
  };


  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#121215] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-scale">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div>
            <h2 className="font-display font-bold text-base text-white uppercase tracking-wider">Get Quotation</h2>
            <p className="text-[10px] text-neutral-400 font-light uppercase tracking-wider mt-0.5">{title}</p>
            {selectedVehicle && selectedVehicle.price && (
              <p className="text-xs font-bold text-[#b48d36] mt-0.5">{formatPrice(selectedVehicle.price)}</p>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Success State */}
        {formState === 'success' ? (
          <div className="p-8 text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 size={48} className="text-[#b48d36] animate-bounce" />
            </div>
            <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">Request Submitted!</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
              We have received your quotation request. One of our luxury consultants will prepare a custom proposal and reach out to you shortly. You can track this request status in your profile page.
            </p>
            {enquiryId && (
              <p className="text-[10px] text-neutral-500">
                Reference ID: <span className="font-mono font-semibold text-neutral-300">#{enquiryId}</span>
              </p>
            )}
            <div className="space-y-3 pt-2">
              <a
                href={getWhatsAppUrl(WHATSAPP_NUMBER, getVehicleWhatsAppMessage(title))}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#128C7E] text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider transition-all"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp Instead
              </a>
              <button
                onClick={onClose}
                className="w-full border border-neutral-800 hover:bg-neutral-900 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Form content */
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <input type="hidden" {...register('vehicle_id')} />

            {/* Vehicle Selector Dropdown if no vehicle passed */}
            {!vehicle && (
              <div>
                <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Select Car of Interest *</label>
                {loadingStock ? (
                  <div className="flex items-center gap-2 text-xs text-neutral-500 py-2">
                    <Loader2 className="animate-spin text-[#b48d36]" size={14} />
                    Loading available stock...
                  </div>
                ) : (
                  <select
                    className="w-full text-xs font-semibold px-4 py-3 bg-[#16161a] border border-neutral-800 rounded-lg focus:outline-none focus:border-amber-500 text-white cursor-pointer appearance-none"
                    onChange={(e) => handleVehicleChange(e.target.value)}
                    value={selectedVehicle?.id || ''}
                    required
                  >
                    <option value="" disabled>Choose a vehicle from stock...</option>
                    {availableVehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.year} {v.make} {v.model} {v.variant ? ` ${v.variant}` : ''} (₹{(v.price / 100000).toFixed(2)} Lakh)
                      </option>
                    ))}
                  </select>
                )}
                {errors.vehicle_id && <p className="text-red-500 text-[10px] mt-1">{errors.vehicle_id.message}</p>}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Full Name *</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full text-xs font-semibold px-4 py-3 bg-[#16161a] border border-neutral-800 rounded-lg focus:outline-none focus:border-amber-500 text-white"
                  {...register('customer_name')}
                />
                {errors.customer_name && <p className="text-red-500 text-[10px] mt-1">{errors.customer_name.message}</p>}
              </div>

              <div>
                <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Phone Number *</label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-neutral-800 bg-[#16161a] text-xs text-neutral-500 font-semibold">+91</span>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    className="w-full text-xs font-semibold px-4 py-3 bg-[#16161a] border border-neutral-800 rounded-r-lg focus:outline-none focus:border-amber-500 text-white"
                    maxLength={10}
                    {...register('customer_phone')}
                  />
                </div>
                {errors.customer_phone && <p className="text-red-500 text-[10px] mt-1">{errors.customer_phone.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full text-xs font-semibold px-4 py-3 bg-[#16161a] border border-neutral-800 rounded-lg focus:outline-none focus:border-amber-500 text-white"
                  {...register('customer_email')}
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">City (optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Your city"
                    className="w-full text-xs font-semibold px-4 py-3 bg-[#16161a] border border-neutral-800 rounded-lg focus:outline-none focus:border-amber-500 pl-10 text-white"
                    {...register('customer_city')}
                  />
                  <MapPin size={14} className="absolute left-3.5 top-3.5 text-neutral-500" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Message / Requirements</label>
              <textarea
                rows={2}
                placeholder="Questions about registration state, loan requirements..."
                className="w-full text-xs font-semibold px-4 py-3 bg-[#16161a] border border-neutral-800 rounded-lg focus:outline-none focus:border-amber-500 text-white resize-none"
                {...register('message')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Preferred Contact Method</label>
                <select
                  className="w-full text-xs font-semibold px-4 py-3 bg-[#16161a] border border-neutral-800 rounded-lg focus:outline-none focus:border-amber-500 text-white cursor-pointer appearance-none"
                  {...register('preferred_contact')}
                >
                  <option value="Phone">Phone Call</option>
                  <option value="WhatsApp">WhatsApp Message</option>
                  <option value="Email">Email</option>
                  <option value="Any">Any Method</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Preferred Time slot</label>
                <select
                  className="w-full text-xs font-semibold px-4 py-3 bg-[#16161a] border border-neutral-800 rounded-lg focus:outline-none focus:border-amber-500 text-white cursor-pointer appearance-none"
                  {...register('preferred_time')}
                >
                  <option value="">Any time</option>
                  <option value="Morning (10 AM - 1 PM)">Morning (10 AM - 1 PM)</option>
                  <option value="Afternoon (1 PM - 4 PM)">Afternoon (1 PM - 4 PM)</option>
                  <option value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</option>
                </select>
              </div>
            </div>

            {formState === 'error' && (
              <p className="text-[10px] text-red-400 bg-red-950/50 border border-red-900 px-4 py-3 rounded-lg text-center">
                Something went wrong. Please try again or click WhatsApp.
              </p>
            )}

            <button
              type="submit"
              disabled={formState === 'loading'}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#b48d36] hover:bg-[#9a845a] text-white font-bold py-4 rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer"
              id="submit-enquiry-btn"
            >
              {formState === 'loading' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  SUBMITTING...
                </>
              ) : (
                'SUBMIT QUOTATION REQUEST'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
