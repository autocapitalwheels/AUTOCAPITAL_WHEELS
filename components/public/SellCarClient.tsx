'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X, CheckCircle, Loader2, Camera, MessageCircle } from 'lucide-react';
import { sellCarSchema, SellCarFormValues } from '@/lib/validations';
import { CAR_MAKES, FUEL_TYPES, TRANSMISSION_TYPES, VEHICLE_CONDITIONS, INSURANCE_STATUSES } from '@/lib/constants';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function SellCarClient() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [requestId, setRequestId] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: formErrorsState,
    watch,
  } = useForm<any>({
    resolver: zodResolver(sellCarSchema) as any,
    defaultValues: {
      number_of_owners: 1,
      rc_available: true,
      accident_history: false,
      vehicle_condition: 'Good',
    },
  });
  const errors = formErrorsState.errors as any;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 10) {
      setUploadError('Maximum 10 photos allowed');
      return;
    }
    setUploadError('');
    const validFiles = files.filter((f) => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024);
    const newPhotos = [...photos, ...validFiles];
    setPhotos(newPhotos);
    newPhotos.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreviews((prev) => [...prev, e.target?.result as string]);
      };
      if (!photoPreviews[newPhotos.indexOf(file)]) reader.readAsDataURL(file);
    });
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data: SellCarFormValues) => {
    setFormState('loading');
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      photos.forEach((photo) => formData.append('photos', photo));

      const res = await fetch('/api/sell-requests', { method: 'POST', body: formData });
      const json = await res.json();

      if (json.success) {
        setRequestId(json.data?.request_id || '');
        setFormState('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setFormState('error');
      }
    } catch {
      setFormState('error');
    }
  };

  if (formState === 'success') {
    return (
      <div className="min-h-screen bg-[#faf9f6]/30 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h1 className="font-display font-black text-3xl text-neutral-900 mb-3">Request Submitted!</h1>
          <p className="text-neutral-500 mb-2">
            Thank you for submitting your vehicle details. Our team will review your car and contact you with the next steps.
          </p>
          {requestId && (
            <div className="inline-block bg-neutral-100 rounded-lg px-5 py-3 mb-6">
              <p className="text-xs text-neutral-500 mb-1">Your Reference ID</p>
              <p className="font-mono font-bold text-neutral-900 text-lg">{requestId}</p>
            </div>
          )}
          <div className="space-y-3">
            <a
              href="https://wa.me/918800243707?text=Hello%20AutoCapital%20Wheels%2C%20I%20just%20submitted%20a%20sell%20request.%20My%20reference%20ID%20is%20"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25d366] text-white font-semibold py-3.5 rounded-lg text-sm"
            >
              <MessageCircle size={16} />
              Follow Up on WhatsApp
            </a>
            <a href="/cars" className="btn-secondary w-full py-3.5 justify-center text-sm">
              Browse Our Cars
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]/30">
      {/* Header */}
      <div className="bg-[#faf9f6] text-neutral-900 py-12 px-4 border-b border-neutral-200/60">
        <div className="container-custom max-w-3xl">
          <div className="w-10 h-0.5 bg-amber-500 mb-4" />
          <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 mb-3">Sell Your Car</h1>
          <p className="text-neutral-500 text-sm sm:text-base max-w-xl font-light">
            Submit your vehicle details and our team will review your car and contact you with the next steps.
          </p>
        </div>
      </div>

      <div className="container-custom max-w-3xl py-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Owner Details */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6">
            <h2 className="font-display font-bold text-xl text-neutral-900 mb-5">Your Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sell-name" className="form-label">Full Name *</label>
                <input id="sell-name" type="text" placeholder="Your full name" className={`form-input ${errors.owner_name ? 'error' : ''}`} {...register('owner_name')} />
                {errors.owner_name && <p className="form-error">{errors.owner_name.message}</p>}
              </div>
              <div>
                <label htmlFor="sell-phone" className="form-label">Mobile Number *</label>
                <div className="flex">
                  <span className="flex items-center px-3 bg-neutral-50 border border-r-0 border-neutral-200 rounded-l-md text-sm text-neutral-500">+91</span>
                  <input id="sell-phone" type="tel" placeholder="10-digit number" maxLength={10} className={`form-input rounded-l-none ${errors.owner_phone ? 'error' : ''}`} {...register('owner_phone')} />
                </div>
                {errors.owner_phone && <p className="form-error">{errors.owner_phone.message}</p>}
              </div>
              <div>
                <label htmlFor="sell-email" className="form-label">Email <span className="text-neutral-400 font-normal">(optional)</span></label>
                <input id="sell-email" type="email" placeholder="your@email.com" className="form-input" {...register('owner_email')} />
              </div>
              <div>
                <label htmlFor="sell-city" className="form-label">City *</label>
                <input id="sell-city" type="text" placeholder="Your city" className={`form-input ${errors.owner_city ? 'error' : ''}`} {...register('owner_city')} />
                {errors.owner_city && <p className="form-error">{errors.owner_city.message}</p>}
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6">
            <h2 className="font-display font-bold text-xl text-neutral-900 mb-5">Vehicle Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sell-make" className="form-label">Make *</label>
                <select id="sell-make" className={`form-input ${errors.make ? 'error' : ''}`} {...register('make')}>
                  <option value="">Select Make</option>
                  {CAR_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                {errors.make && <p className="form-error">{errors.make.message}</p>}
              </div>
              <div>
                <label htmlFor="sell-model" className="form-label">Model *</label>
                <input id="sell-model" type="text" placeholder="e.g. Swift, Creta, Nexon" className={`form-input ${errors.model ? 'error' : ''}`} {...register('model')} />
                {errors.model && <p className="form-error">{errors.model.message}</p>}
              </div>
              <div>
                <label htmlFor="sell-variant" className="form-label">Variant <span className="text-neutral-400 font-normal">(optional)</span></label>
                <input id="sell-variant" type="text" placeholder="e.g. VXI, SX, ZX+" className="form-input" {...register('variant')} />
              </div>
              <div>
                <label htmlFor="sell-mfg-year" className="form-label">Manufacturing Year *</label>
                <input id="sell-mfg-year" type="number" placeholder="e.g. 2020" min="1990" max={new Date().getFullYear()} className={`form-input ${errors.manufacturing_year ? 'error' : ''}`} {...register('manufacturing_year', { valueAsNumber: true })} />
                {errors.manufacturing_year && <p className="form-error">{errors.manufacturing_year.message}</p>}
              </div>
              <div>
                <label htmlFor="sell-reg-year" className="form-label">Registration Year <span className="text-neutral-400 font-normal">(optional)</span></label>
                <input id="sell-reg-year" type="number" placeholder="e.g. 2020" min="1990" max={new Date().getFullYear()} className="form-input" {...register('registration_year', { valueAsNumber: true })} />
              </div>
              <div>
                <label htmlFor="sell-fuel" className="form-label">Fuel Type *</label>
                <select id="sell-fuel" className={`form-input ${errors.fuel_type ? 'error' : ''}`} {...register('fuel_type')}>
                  <option value="">Select</option>
                  {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
                {errors.fuel_type && <p className="form-error">{errors.fuel_type.message}</p>}
              </div>
              <div>
                <label htmlFor="sell-trans" className="form-label">Transmission *</label>
                <select id="sell-trans" className={`form-input ${errors.transmission ? 'error' : ''}`} {...register('transmission')}>
                  <option value="">Select</option>
                  {TRANSMISSION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.transmission && <p className="form-error">{errors.transmission.message}</p>}
              </div>
              <div>
                <label htmlFor="sell-kms" className="form-label">Kilometres Driven *</label>
                <input id="sell-kms" type="number" placeholder="e.g. 45000" min="0" className={`form-input ${errors.kms_driven ? 'error' : ''}`} {...register('kms_driven', { valueAsNumber: true })} />
                {errors.kms_driven && <p className="form-error">{errors.kms_driven.message}</p>}
              </div>
              <div>
                <label htmlFor="sell-owners" className="form-label">Number of Owners</label>
                <select id="sell-owners" className="form-input" {...register('number_of_owners', { valueAsNumber: true })}>
                  {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="sell-price" className="form-label">Expected Selling Price (₹) <span className="text-neutral-400 font-normal">(optional)</span></label>
                <input id="sell-price" type="number" placeholder="e.g. 500000" min="0" className="form-input" {...register('expected_price', { valueAsNumber: true })} />
              </div>
              <div>
                <label htmlFor="sell-condition" className="form-label">Vehicle Condition *</label>
                <select id="sell-condition" className={`form-input ${errors.vehicle_condition ? 'error' : ''}`} {...register('vehicle_condition')}>
                  {VEHICLE_CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="sell-insurance" className="form-label">Insurance Status <span className="text-neutral-400 font-normal">(optional)</span></label>
                <select id="sell-insurance" className="form-input" {...register('insurance_status')}>
                  <option value="">Select</option>
                  {INSURANCE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 cursor-pointer hover:bg-neutral-50">
                <input type="checkbox" className="w-4 h-4 accent-neutral-900" {...register('accident_history')} />
                <div>
                  <span className="text-sm font-medium text-neutral-900">Accident History</span>
                  <p className="text-xs text-neutral-400">Vehicle has had an accident</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 cursor-pointer hover:bg-neutral-50">
                <input type="checkbox" className="w-4 h-4 accent-neutral-900" defaultChecked {...register('rc_available')} />
                <div>
                  <span className="text-sm font-medium text-neutral-900">RC Available</span>
                  <p className="text-xs text-neutral-400">Registration Certificate available</p>
                </div>
              </label>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6">
            <h2 className="font-display font-bold text-xl text-neutral-900 mb-2">Vehicle Photos</h2>
            <p className="text-sm text-neutral-500 mb-5">Upload up to 10 photos. Include exterior, interior, dashboard, and any damage areas. Good photos help us evaluate your car faster.</p>

            {/* Dropzone */}
            <div
              className="dropzone"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={32} className="text-neutral-400 mx-auto mb-3" />
              <p className="font-medium text-neutral-700 mb-1">Click to upload photos</p>
              <p className="text-sm text-neutral-400">or drag and drop — JPG, PNG, WEBP up to 10MB each</p>
              <p className="text-xs text-neutral-400 mt-1">Max 10 photos total</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
                id="sell-photos-input"
              />
            </div>

            {uploadError && <p className="form-error mt-2">{uploadError}</p>}

            {/* Previews */}
            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                {photoPreviews.map((src, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
                    <img src={src} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                      aria-label="Remove photo"
                    >
                      <X size={10} />
                    </button>
                    {idx === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] text-center py-0.5">Main</div>
                    )}
                  </div>
                ))}
                {photoPreviews.length < 10 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 hover:border-neutral-400 hover:text-neutral-500 transition-colors"
                  >
                    <Upload size={20} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6">
            <h2 className="font-display font-bold text-xl text-neutral-900 mb-4">Additional Information</h2>
            <textarea
              rows={4}
              placeholder="Any additional details about the vehicle — modifications, recent repairs, accessories included, reason for selling, etc."
              className="form-input resize-none w-full"
              {...register('additional_info')}
            />
          </div>

          {formState === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              Something went wrong. Please try again or WhatsApp us on +91 8800243707.
            </div>
          )}

          {/* Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
            <strong>Please note:</strong> We do not provide an instant valuation. Our team carefully reviews each vehicle submission and will contact you personally to discuss the next steps and pricing.
          </div>

          <button
            type="submit"
            disabled={formState === 'loading'}
            className="btn-primary w-full py-4 text-base justify-center"
            id="submit-sell-request-btn"
          >
            {formState === 'loading' ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Sell Request'
            )}
          </button>

          <p className="text-xs text-neutral-400 text-center pb-8">
            By submitting you agree to be contacted by our team regarding your vehicle.
          </p>
        </form>
      </div>
    </div>
  );
}
