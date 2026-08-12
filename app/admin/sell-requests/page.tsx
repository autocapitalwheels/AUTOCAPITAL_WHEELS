'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Mail, Phone, Tag, User, Car, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function AdminSellRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const supabase = createClient();

  const loadRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sell_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setRequests(data);
      if (error) console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRequests(); }, []);

  const handleUpdate = async (id: string) => {
    setUpdatingId(id);
    const selectEl = document.getElementById(`status-${id}`) as HTMLSelectElement;
    const notesEl = document.getElementById(`notes-${id}`) as HTMLTextAreaElement;
    const priceEl = document.getElementById(`price-${id}`) as HTMLInputElement;

    try {
      const { error } = await supabase
        .from('sell_requests')
        .update({
          status: selectEl.value,
          admin_notes: notesEl.value || null,
          offered_price: priceEl.value ? parseFloat(priceEl.value) : null,
        })
        .eq('id', id);

      if (error) alert('Failed: ' + error.message);
      else await loadRequests();
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-neutral-900">Sell Requests</h1>
        <p className="text-neutral-500 text-sm mt-0.5">{requests.length} sell request{requests.length !== 1 ? 's' : ''} total</p>
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
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Owner</th>
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Vehicle</th>
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Specs</th>
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Expected Price</th>
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Photos</th>
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Offer Price + Notes</th>
                  <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-neutral-400 font-light">
                      No sell requests received yet.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-neutral-50/30 transition-colors align-top">

                      {/* Date */}
                      <td className="p-4 text-neutral-500 whitespace-nowrap font-medium">
                        {formatDate(req.created_at)}
                        <div className="text-[9px] text-neutral-400 mt-0.5 font-mono">{req.request_id}</div>
                      </td>

                      {/* Owner */}
                      <td className="p-4">
                        <div className="font-bold text-neutral-800 flex items-center gap-1.5">
                          <User size={12} className="text-neutral-400" />{req.owner_name}
                        </div>
                        <div className="text-neutral-500 mt-1 flex flex-col gap-1">
                          <span className="flex items-center gap-1"><Phone size={10} /> +91 {req.owner_phone}</span>
                          {req.owner_email && <span className="flex items-center gap-1"><Mail size={10} /> {req.owner_email}</span>}
                          <span className="text-[10px] text-neutral-400">City: {req.owner_city}</span>
                        </div>
                      </td>

                      {/* Vehicle */}
                      <td className="p-4">
                        <div className="font-bold text-neutral-800 flex items-center gap-1.5">
                          <Car size={12} className="text-neutral-400" />
                          {req.manufacturing_year} {req.make} {req.model}
                        </div>
                        {req.variant && <div className="text-[10px] text-neutral-400 mt-0.5">Variant: {req.variant}</div>}
                        {req.additional_info && (
                          <div className="text-[10px] text-neutral-500 mt-1 max-w-[160px] break-words leading-relaxed">
                            {req.additional_info}
                          </div>
                        )}
                      </td>

                      {/* Specs */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="text-neutral-700 font-semibold">{req.fuel_type} • {req.transmission}</div>
                        <div className="text-neutral-500 mt-1">{req.kms_driven?.toLocaleString('en-IN')} km</div>
                        <div className="text-neutral-500">{req.number_of_owners} Owner{req.number_of_owners !== 1 ? 's' : ''}</div>
                        <div className="text-neutral-400 mt-1">Condition: {req.vehicle_condition}</div>
                        {req.accident_history && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold rounded bg-red-50 text-red-600 border border-red-200">Accident History</span>
                        )}
                      </td>

                      {/* Expected Price */}
                      <td className="p-4 whitespace-nowrap font-bold text-neutral-800">
                        {req.expected_price ? (
                          <span>₹{(req.expected_price / 100000).toFixed(2)} Lakh</span>
                        ) : (
                          <span className="text-neutral-300 font-light italic">Not specified</span>
                        )}
                      </td>

                      {/* Photos */}
                      <td className="p-4">
                        {req.photo_urls?.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 max-w-[100px]">
                            {req.photo_urls.slice(0, 4).map((url: string, i: number) => (
                              <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                                <img src={url} alt={`Photo ${i+1}`} className="w-10 h-10 rounded object-cover border border-neutral-200 hover:opacity-80 transition" />
                              </a>
                            ))}
                            {req.photo_urls.length > 4 && (
                              <span className="text-[10px] text-neutral-400">+{req.photo_urls.length - 4} more</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-neutral-300 italic text-[10px]">No photos</span>
                        )}
                      </td>

                      {/* Offer Price + Notes */}
                      <td className="p-4">
                        <div className="flex flex-col gap-2">
                          <input
                            id={`price-${req.id}`}
                            type="number"
                            placeholder="Offer price (₹)"
                            defaultValue={req.offered_price || ''}
                            className="form-input text-xs py-1.5 px-2.5 max-w-[140px] border border-neutral-200 rounded"
                          />
                          <textarea
                            id={`notes-${req.id}`}
                            defaultValue={req.admin_notes || ''}
                            placeholder="Inspection notes, offer details..."
                            className="form-input text-xs p-2 border border-neutral-200 rounded resize-y max-w-[200px]"
                            rows={2}
                          />
                        </div>
                      </td>

                      {/* Status Action */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex flex-col gap-2">
                          <select
                            id={`status-${req.id}`}
                            defaultValue={req.status}
                            className="form-input text-xs py-1.5 px-2.5 max-w-[150px] cursor-pointer font-semibold"
                          >
                            <option value="NEW">Pending Review</option>
                            <option value="UNDER_REVIEW">Under Review</option>
                            <option value="INSPECTION_SCHEDULED">Inspection Scheduled</option>
                            <option value="OFFER_MADE">Offer Made</option>
                            <option value="NEGOTIATION">In Negotiation</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="CLOSED">Closed</option>
                          </select>
                          <button
                            disabled={updatingId === req.id}
                            onClick={() => handleUpdate(req.id)}
                            className="inline-flex items-center justify-center gap-1 bg-[#171717] hover:bg-neutral-800 text-white font-bold px-3 py-1.5 rounded text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                          >
                            {updatingId === req.id ? <Loader2 size={10} className="animate-spin" /> : 'Save Action'}
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
