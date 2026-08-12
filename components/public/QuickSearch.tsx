'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { CAR_MAKES } from '@/lib/constants';

export default function QuickSearch() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    query: '',
    make: '',
    model: '',
    year: '',
    max_price: '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/cars${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="relative z-20 mt-6 lg:-mt-14 pb-6">
      <div className="container-custom">
        <div className="bg-white rounded-xl shadow-xl border border-neutral-200/80 p-6 lg:p-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
              
              {/* Search Car */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Search Car</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search model (e.g. Swift, Baleno)"
                    className="w-full text-xs font-semibold px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-amber-500 pr-10"
                    value={filters.query}
                    onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                  />
                  <Search size={14} className="absolute right-3.5 top-3.5 text-neutral-400" />
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Brand</label>
                <select
                  className="w-full text-xs font-semibold px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-amber-500"
                  value={filters.make}
                  onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                >
                  <option value="">All Brands</option>
                  {CAR_MAKES.map((make) => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Model</label>
                <select
                  className="w-full text-xs font-semibold px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-amber-500"
                  value={filters.model}
                  onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                >
                  <option value="">All Models</option>
                  <option value="swift">Swift</option>
                  <option value="baleno">Baleno</option>
                  <option value="wagonr">WagonR</option>
                  <option value="alto">Alto</option>
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Year</label>
                <select
                  className="w-full text-xs font-semibold px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-amber-500"
                  value={filters.year}
                  onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                >
                  <option value="">Any Year</option>
                  {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Price Range</label>
                <select
                  className="w-full text-xs font-semibold px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-amber-500"
                  value={filters.max_price}
                  onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                >
                  <option value="">Any Price</option>
                  <option value="300000">Under ₹3 Lakh</option>
                  <option value="500000">Under ₹5 Lakh</option>
                  <option value="800000">Under ₹8 Lakh</option>
                  <option value="1200000">Under ₹12 Lakh</option>
                  <option value="2000000">Under ₹20 Lakh</option>
                </select>
              </div>

              {/* Search Button */}
              <div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#171717] hover:bg-neutral-800 text-white font-bold h-[42px] rounded-lg text-xs uppercase tracking-wider transition-all duration-200"
                >
                  <Search size={14} />
                  Search Cars
                </button>
              </div>

            </div>

            {/* Bottom filter toggle row */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 hover:text-neutral-900 transition-colors uppercase tracking-wider"
              >
                <SlidersHorizontal size={12} />
                More Filters
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
