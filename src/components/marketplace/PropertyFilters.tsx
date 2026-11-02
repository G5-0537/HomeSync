import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { PropertyType, FurnishingStatus } from '../../types';

interface PropertyFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCity: string;
  onCityChange: (c: string) => void;
  selectedBedrooms: number | 'all';
  onBedroomsChange: (b: number | 'all') => void;
  selectedFurnishing: FurnishingStatus | 'all';
  onFurnishingChange: (f: FurnishingStatus | 'all') => void;
  maxRent: number;
  onMaxRentChange: (r: number) => void;
  onReset: () => void;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  selectedBedrooms,
  onBedroomsChange,
  selectedFurnishing,
  onFurnishingChange,
  maxRent,
  onMaxRentChange,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-charcoal-200/80 p-4 sm:p-5 shadow-subtle space-y-4">
      {/* Top Search & City Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search by locality, area, society, landmark..."
            className="w-full bg-ivory-50 border border-charcoal-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
          />
        </div>

        <div>
          <select
            value={selectedCity}
            onChange={e => onCityChange(e.target.value)}
            className="w-full bg-ivory-50 border border-charcoal-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 cursor-pointer"
          >
            <option value="all">All Cities</option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Mohali">Mohali</option>
            <option value="Bengaluru">Bengaluru</option>
          </select>
        </div>
      </div>

      {/* Filter Row: Bedrooms, Furnishing, Max Budget */}
      <div className="pt-3 border-t border-charcoal-100 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Bedrooms Pill buttons */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-charcoal-600">Bedrooms:</span>
          <div className="flex items-center gap-1 bg-ivory-50 p-1 rounded-xl border border-charcoal-200/60">
            {(['all', 1, 2, 3, 4] as const).map(b => (
              <button
                key={b}
                type="button"
                onClick={() => onBedroomsChange(b)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedBedrooms === b
                    ? 'bg-sage-600 text-white font-semibold shadow-xs'
                    : 'text-charcoal-600 hover:text-charcoal-900'
                }`}
              >
                {b === 'all' ? 'Any' : `${b} BHK`}
              </button>
            ))}
          </div>
        </div>

        {/* Furnishing */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-charcoal-600">Furnishing:</span>
          <select
            value={selectedFurnishing}
            onChange={e => onFurnishingChange(e.target.value as any)}
            className="bg-ivory-50 border border-charcoal-200 rounded-lg px-2.5 py-1 text-xs text-charcoal-800"
          >
            <option value="all">All Statuses</option>
            <option value="fully_furnished">Fully Furnished</option>
            <option value="semi_furnished">Semi Furnished</option>
            <option value="unfurnished">Unfurnished</option>
          </select>
        </div>

        {/* Price Slider */}
        <div className="flex items-center gap-3">
          <span className="font-semibold text-charcoal-600">Max Rent:</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="10000"
              max="60000"
              step="2000"
              value={maxRent}
              onChange={e => onMaxRentChange(Number(e.target.value))}
              className="w-24 sm:w-32 accent-sage-600 cursor-pointer"
            />
            <span className="font-semibold text-charcoal-900 min-w-16">
              ₹{maxRent.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={onReset}
          className="text-charcoal-400 hover:text-charcoal-700 flex items-center gap-1 font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};
