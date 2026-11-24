import React, { useState, useEffect } from 'react';
import { useBanking } from '../context/BankingContext';
import { BranchAtm } from '../types';
import { api } from '../services/api';
import {
  MapPin,
  Clock,
  Phone,
  Search,
  Navigation,
  Building2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const LocatorPage: React.FC = () => {
  const { showToast } = useBanking();
  const [locations, setLocations] = useState<BranchAtm[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [only24x7, setOnly24x7] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const loadLocations = async () => {
    try {
      const res = await api.getLocations({
        type: filterType !== 'ALL' ? filterType : undefined,
        is24x7: only24x7 ? 'true' : undefined,
        search: searchTerm || undefined,
      });
      setLocations(res.locations);
    } catch (err: any) {
      showToast(err.message || 'Failed to load locations', 'error');
    }
  };

  useEffect(() => {
    loadLocations();
  }, [filterType, only24x7, searchTerm]);

  const handleDirections = (loc: BranchAtm) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + ', ' + loc.address + ', ' + loc.city)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 space-y-4 pb-8 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-lg font-bold text-bank-text">Branch & Smart ATM Locator</h1>
        <p className="text-xs text-bank-muted">Find Nearby Flagship Centres, 24/7 ATMs & Desks</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by city, postcode (e.g. Canary Wharf, E14)..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-bank-border bg-white text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-[#DB0011]/30"
        />
      </div>

      {/* Filter Tabs & 24/7 Checkbox */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'BRANCH', label: 'Branches' },
            { id: 'ATM', label: 'Smart ATMs' },
            { id: 'PREMIER_CENTRE', label: 'Premier Suites' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                filterType === f.id
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white border border-bank-border text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-zinc-700 whitespace-nowrap">
          <input
            type="checkbox"
            checked={only24x7}
            onChange={e => setOnly24x7(e.target.checked)}
            className="accent-[#DB0011] rounded"
          />
          <span>24/7 Open Only</span>
        </label>
      </div>

      {/* Locations List */}
      <div className="space-y-3">
        {locations.map(loc => (
          <div
            key={loc.id}
            className="bg-white p-4 rounded-2xl border border-bank-border shadow-card space-y-3 hover:border-zinc-300 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      loc.type === 'PREMIER_CENTRE'
                        ? 'bg-red-50 text-[#DB0011] border border-red-200'
                        : loc.type === 'ATM'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {loc.type.replace('_', ' ')}
                  </span>
                  {loc.is_24x7 === 1 && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                      24/7 OPEN
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-zinc-900 mt-1">{loc.name}</h3>
                <p className="text-xs text-zinc-600 mt-0.5">
                  {loc.address}, {loc.city} ({loc.postal_code})
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-black text-zinc-900">{loc.distance_km} km</span>
                <span className="text-[10px] text-zinc-400 block">away</span>
              </div>
            </div>

            {/* Timings & Services */}
            <div className="pt-2 border-t border-zinc-100 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-zinc-600 text-[11px]">
                <Clock size={13} className="text-[#DB0011] shrink-0" />
                <span>{loc.timing}</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-600 text-[11px]">
                <Sparkles size={13} className="text-amber-500 shrink-0" />
                <span>Services: {loc.services}</span>
              </div>
              {loc.phone && (
                <div className="flex items-center gap-1.5 text-zinc-600 text-[11px]">
                  <Phone size={13} className="text-zinc-400 shrink-0" />
                  <span>{loc.phone}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => handleDirections(loc)}
                className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Navigation size={13} />
                <span>Directions & Map</span>
              </button>
              {loc.phone && (
                <a
                  href={`tel:${loc.phone}`}
                  className="py-2 px-3 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold flex items-center justify-center gap-1 transition"
                >
                  <Phone size={13} />
                  <span>Call</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
