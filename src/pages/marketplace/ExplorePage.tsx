import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { localStore } from '../../services/localStore';
import { firestoreDb } from '../../services/firestoreDbService';
import { PropertyListing, FurnishingStatus } from '../../types';
import { PropertyCard } from '../../components/marketplace/PropertyCard';
import { PropertyFilters } from '../../components/marketplace/PropertyFilters';
import { Badge } from '../../components/common/Badge';
import { LayoutGrid, List, Sparkles, Building2 } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | 'all'>('all');
  const [selectedFurnishing, setSelectedFurnishing] = useState<FurnishingStatus | 'all'>('all');
  const [maxRent, setMaxRent] = useState(50000);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc'>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [allProperties, setAllProperties] = useState<PropertyListing[]>(() => localStore.getProperties());

  useEffect(() => {
    firestoreDb.getProperties().then(list => {
      if (list && list.length > 0) {
        setAllProperties(list);
      }
    });
  }, []);

  const filteredProperties = useMemo(() => {
    return allProperties.filter(p => {
      // Search text filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = 
          p.title.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        if (!matchesText) return false;
      }

      // City
      if (selectedCity !== 'all' && p.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Bedrooms
      if (selectedBedrooms !== 'all' && p.bedrooms !== selectedBedrooms) {
        return false;
      }

      // Furnishing
      if (selectedFurnishing !== 'all' && p.furnishingStatus !== selectedFurnishing) {
        return false;
      }

      // Max Rent
      if (p.monthlyRent > maxRent) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.monthlyRent - b.monthlyRent;
      if (sortBy === 'price_desc') return b.monthlyRent - a.monthlyRent;
      return (b.rating || 0) - (a.rating || 0);
    });
  }, [allProperties, searchQuery, selectedCity, selectedBedrooms, selectedFurnishing, maxRent, sortBy]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setSelectedBedrooms('all');
    setSelectedFurnishing('all');
    setMaxRent(50000);
    setSortBy('recommended');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display font-bold text-2xl sm:text-3xl text-charcoal-900">
              Verified Rental Properties
            </span>
            <Badge variant="brokerage">
              ₹0 BROKERAGE
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500">
            Connect directly with verified owners • Digital lease agreements • Co-living hubs
          </p>
        </div>

        {/* View mode toggle & sorting */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-white border border-charcoal-200 text-xs text-charcoal-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-500/20"
          >
            <option value="recommended">Sort by: Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          <div className="flex items-center bg-white border border-charcoal-200 rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-sage-600 text-white' : 'text-charcoal-500 hover:text-charcoal-800'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-sage-600 text-white' : 'text-charcoal-500 hover:text-charcoal-800'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Component */}
      <PropertyFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        selectedBedrooms={selectedBedrooms}
        onBedroomsChange={setSelectedBedrooms}
        selectedFurnishing={selectedFurnishing}
        onFurnishingChange={setSelectedFurnishing}
        maxRent={maxRent}
        onMaxRentChange={setMaxRent}
        onReset={handleReset}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-charcoal-500 pt-1">
        <span>Showing <strong>{filteredProperties.length}</strong> verified properties</span>
        <span>All listings include standard HomeSync Tenant Dashboard</span>
      </div>

      {/* Property Cards Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-charcoal-800 rounded-xl border border-charcoal-200 dark:border-charcoal-700 p-8 space-y-4">
          <Building2 className="w-12 h-12 text-charcoal-300 mx-auto" />
          <h3 className="font-display font-bold text-lg text-charcoal-800">No properties matched your filters</h3>
          <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
            Try adjusting your search location, price range, or bedrooms to discover available homes.
          </p>
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-sage-700 bg-sage-50 px-4 py-2 rounded-xl border border-sage-200 hover:bg-sage-100 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};
