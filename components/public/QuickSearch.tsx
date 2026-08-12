'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import type { Vehicle } from '@/types';

export default function QuickSearch() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  
  const [filters, setFilters] = useState({
    query: '',
    make: '',
    model: '',
    year: '',
    max_price: '',
  });

  // Fetch active stock from API to build dynamic dropdowns
  useEffect(() => {
    setLoading(true);
    fetch('/api/vehicles?per_page=100')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const list: Vehicle[] = json.data;
          setVehicles(list);
          
          // Extract unique active makes
          const activeMakes = Array.from(new Set(list.map((v) => v.make))).sort();
          setMakes(activeMakes);
        }
      })
      .catch((err) => console.error('Error loading search criteria:', err))
      .finally(() => setLoading(false));
  }, []);

  // Update available models dynamically when selected brand changes
  useEffect(() => {
    if (filters.make) {
      const filteredModels = Array.from(
        new Set(
          vehicles
            .filter((v) => v.make.toLowerCase() === filters.make.toLowerCase())
            .map((v) => v.model)
        )
      ).sort();
      setModels(filteredModels);
      // Reset selected model if it doesn't belong to the newly selected brand
      if (filters.model && !filteredModels.includes(filters.model)) {
        setFilters((prev) => ({ ...prev, model: '' }));
      }
    } else {
      // If no brand selected, show all unique models
      const allModels = Array.from(new Set(vehicles.map((v) => v.model))).sort();
      setModels(allModels);
    }
  }, [filters.make, vehicles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    // Support search query or make/model dropdowns
    if (filters.query) params.set('search', filters.query);
    if (filters.make) params.set('make', filters.make);
    if (filters.model) params.set('model', filters.model);
    if (filters.year) params.set('min_year', filters.year);
    if (filters.max_price) params.set('max_price', filters.max_price);
    
    router.push(`/cars${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="relative z-20 mt-6 lg:-mt-14 pb-6">
      <div className="container-custom">
        <div className="bg-[#121215] rounded-xl shadow-2xl border border-neutral-800/80 p-6 lg:p-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
              
              {/* Search Car */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Search Car</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by keywords..."
                    className="w-full text-xs font-semibold px-4 py-3 bg-[#16161a] border border-neutral-800 rounded-lg focus:outline-none focus:border-amber-500 pr-10 text-white transition-colors"
                    value={filters.query}
                    onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                  />
                  <Search size={14} className="absolute right-3.5 top-3.5 text-neutral-500" />
                </div>
              </div>

              {/* Brand (Dynamic) */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Brand</label>
                {loading ? (
                  <div className="h-[42px] bg-[#16161a] border border-neutral-800 rounded-lg flex items-center justify-center">
                    <Loader2 className="animate-spin text-amber-500" size={14} />
                  </div>
                ) : (
                  <select
                    className="w-full text-xs font-semibold px-4 py-3 bg-[#16161a] border border-neutral-800 rounded-lg focus:outline-none focus:border-amber-500 text-white transition-colors cursor-pointer"
                    value={filters.make}
                    onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                  >
                    <option value="">All Brands</option>
                    {makes.map((make) => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Model (Dynamic Dependent) */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Model</label>
                <select
                  className="w-full text-xs font-semibold px-4 py-3 bg-[#16161a] border border-neutral-800 rounded-lg focus:outline-none focus:border-amber-500 text-white transition-colors cursor-pointer"
                  value={filters.model}
                  onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                >
                  <option value="">All Models</option>
                  {models.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Year</label>
                <select
                  className="w-full text-xs font-semibold px-4 py-3 bg-[#16161a] border border-neutral-800 rounded-lg focus:outline-none focus:border-amber-500 text-white transition-colors cursor-pointer"
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
                  className="w-full text-xs font-semibold px-4 py-3 bg-[#16161a] border border-neutral-800 rounded-lg focus:outline-none focus:border-amber-500 text-white transition-colors cursor-pointer"
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
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#b48d36] hover:bg-[#9a845a] text-white font-bold h-[42px] rounded-lg text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer"
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
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 hover:text-white transition-colors uppercase tracking-wider cursor-pointer"
              >
                <SlidersHorizontal size={12} className="text-amber-500" />
                More Filters
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
