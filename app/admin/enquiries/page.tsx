'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Mail, Phone, Calendar, User, MessageSquare, Clock, MapPin, Loader2 } from 'lucide-react';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const supabase = createClient();

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicle_enquiries')
        .select(`
          *,
          vehicles(make, model, variant, year, price)
        `)
        .order('created_at', { ascending: false });

      if (data) setEnquiries(data);
      if (error) console.error(error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleUpdate = async (id: string, updates: { status: string; admin_notes: string }) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('vehicle_enquiries')
        .update({
          status: updates.status,
          admin_notes: updates.admin_notes || null,
        })
        .eq('id', id);

      if (error) {
        alert('Failed to update status: ' + error.message);
      } else {
        // Reload list
        await loadEnquiries();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-neutral-900">Quotation Enquiries</h1>
        <p className="text-neutral-500 text-sm mt-0.5">{enquiries.length} total customer request{enquiries.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-amber-500" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Customer</th>
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Vehicle of Interest</th>
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Message</th>
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Preference</th>
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Dealer Notes / Feedback</th>
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-neutral-400 font-light">
                      No quotation enquiries received yet.
                    </td>
                  </tr>
                ) : (
                  enquiries.map((enq) => {
                    const car = enq.vehicles || enq.vehicle_snapshot || {};
                    return (
                      <tr key={enq.id} className="hover:bg-neutral-50/30 transition-colors align-top">
                        
                        {/* Date */}
                        <td className="p-4 text-neutral-600 font-medium whitespace-nowrap">
                          {formatDate(enq.created_at)}
                        </td>

                        {/* Customer */}
                        <td className="p-4">
                          <div className="font-bold text-neutral-800 flex items-center gap-1.5">
                            <User size={12} className="text-neutral-400" />
                            {enq.customer_name}
                          </div>
                          <div className="text-neutral-500 mt-1.5 flex flex-col gap-1">
                            <span className="flex items-center gap-1">
                              <Phone size={10} /> +91 {enq.customer_phone}
                            </span>
                            {enq.customer_email && (
                              <span className="flex items-center gap-1">
                                <Mail size={10} /> {enq.customer_email}
                              </span>
                            )}
                            {enq.customer_city && (
                              <span className="text-[10px] text-neutral-400">
                                City: {enq.customer_city}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Vehicle */}
                        <td className="p-4">
                          {car.make ? (
                            <div>
                              <div className="font-bold text-neutral-800">
                                {car.year} {car.make} {car.model}
                              </div>
                              <div className="text-[10px] text-neutral-400 mt-1">
                                {car.variant} • {car.price ? `₹${(car.price / 100000).toFixed(2)} Lakh` : ''}
                              </div>
                              <div className="text-[9px] text-neutral-500 mt-1 font-mono uppercase">#{enq.enquiry_id}</div>
                            </div>
                          ) : (
                            <span className="text-neutral-400 italic">General Inquiry</span>
                          )}
                        </td>

                        {/* Message */}
                        <td className="p-4 max-w-[200px] break-words text-neutral-600 leading-relaxed font-light">
                          {enq.message || <span className="text-neutral-300 italic">No notes left</span>}
                        </td>

                        {/* Preference */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="font-semibold text-neutral-700">
                            {enq.preferred_contact}
                          </div>
                          {enq.preferred_time && (
                            <div className="text-[10px] text-neutral-400 mt-1 flex items-center gap-0.5">
                              <Clock size={10} /> {enq.preferred_time}
                            </div>
                          )}
                        </td>

                        {/* Dealer Notes Input */}
                        <td className="p-4">
                          <textarea
                            defaultValue={enq.admin_notes || ''}
                            placeholder="Add price quote details or comments..."
                            className="w-full form-input text-xs p-2 border border-neutral-200 rounded resize-y max-w-[220px]"
                            id={`notes-input-${enq.id}`}
                            rows={2}
                          />
                        </td>

                        {/* Status Select Actions */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex flex-col gap-2">
                            <select
                              defaultValue={enq.status}
                              className="form-input text-xs py-1.5 px-2.5 max-w-[130px] cursor-pointer font-semibold"
                              id={`status-select-${enq.id}`}
                            >
                              <option value="NEW">Pending Review</option>
                              <option value="CONTACTED">Contacted</option>
                              <option value="FOLLOW_UP">Follow Up</option>
                              <option value="NEGOTIATION">In Negotiation</option>
                              <option value="CONVERTED">Converted / Won</option>
                              <option value="CLOSED">Closed / Rejected</option>
                            </select>
                            
                            <button
                              disabled={updatingId === enq.id}
                              onClick={() => {
                                const selectEl = document.getElementById(`status-select-${enq.id}`) as HTMLSelectElement;
                                const notesEl = document.getElementById(`notes-input-${enq.id}`) as HTMLTextAreaElement;
                                handleUpdate(enq.id, {
                                  status: selectEl.value,
                                  admin_notes: notesEl.value,
                                });
                              }}
                              className="inline-flex items-center justify-center gap-1 bg-[#171717] hover:bg-neutral-800 text-white font-bold px-3 py-1.5 rounded text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                            >
                              {updatingId === enq.id ? (
                                <Loader2 className="animate-spin" size={10} />
                              ) : (
                                'Save Action'
                              )}
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
