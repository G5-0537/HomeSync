import React, { useState, useRef } from 'react';
import { localStore } from '../../services/localStore';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { PropertyListing, PropertyType, FurnishingStatus } from '../../types';
import { Plus, Trash2, Home, MapPin, Bed, Bath, Sparkles, Building2, UploadCloud, X, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '../../services/cloudinaryService';

export const LandlordPropertiesPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [properties, setProperties] = useState(localStore.getProperties());
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('Chandigarh');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('3');
  const [areaSqFt, setAreaSqFt] = useState('1800');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [furnishingStatus, setFurnishingStatus] = useState<FurnishingStatus>('fully_furnished');
  const [description, setDescription] = useState('');
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshList = () => {
    setProperties(localStore.getProperties());
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      setPropertyImages(prev => [...prev, ...uploadedUrls]);
      success(`Uploaded ${uploadedUrls.length} property photo(s) to Cloudinary!`);
    } catch (err) {
      console.error(err);
      error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removePhoto = (indexToRemove: number) => {
    setPropertyImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const rent = Number(monthlyRent);
    const dep = Number(securityDeposit) || rent * 2;

    if (!title.trim() || !locality.trim() || isNaN(rent) || rent <= 0) {
      error('Please fill in required fields');
      return;
    }

    const defaultImages = [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ];

    const newProp: PropertyListing = {
      id: `prop-hs-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      description: description.trim() || `${bedrooms} BHK property in ${locality}, ${city}. Direct owner lease.`,
      propertyType,
      monthlyRent: rent,
      securityDeposit: dep,
      brokerageFee: 0,
      address: address.trim() || `${locality}, ${city}`,
      city,
      locality: locality.trim(),
      bedrooms: Number(bedrooms) || 2,
      bathrooms: Number(bathrooms) || 2,
      furnishingStatus,
      amenities: ['High-Speed Wi-Fi', 'Air Conditioning', 'Modular Kitchen', 'Power Backup', 'Covered Parking'],
      occupancy: 'any',
      availableDate: new Date().toISOString().split('T')[0],
      propertyImages: propertyImages.length > 0 ? propertyImages : defaultImages,
      landlordUid: user?.uid || 'landlord-vikram',
      landlordName: user?.name || 'Vikram Singh',
      verificationStatus: 'verified',
      listingStatus: 'active',
      rating: 4.9,
      areaSqFt: Number(areaSqFt) || 1500
    };

    localStore.saveProperty(newProp);
    success(`Property "${title}" published with ₹0 Brokerage!`);
    refreshList();
    setModalOpen(false);

    // reset
    setTitle('');
    setLocality('');
    setAddress('');
    setMonthlyRent('');
    setSecurityDeposit('');
    setDescription('');
    setPropertyImages([]);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete property listing "${title}"?`)) {
      localStore.deleteProperty(id);
      success('Listing deleted.');
      refreshList();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Manage Property Listings
            </h1>
            <Badge variant="lavender">{properties.length} Properties</Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500">
            Publish direct verified homes, manage availability, and set rental pricing.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => setModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Create New Listing
        </Button>
      </div>

      {/* Properties Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map(p => (
          <Card key={p.id} className="p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-4">
              <img
                src={p.propertyImages[0]}
                alt={p.title}
                className="w-24 h-24 rounded-2xl object-cover shrink-0"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-charcoal-500">{p.propertyType}</span>
                  <Badge variant={p.listingStatus === 'rented' ? 'sage' : 'success'} size="sm">
                    {p.listingStatus === 'rented' ? 'OCCUPIED' : 'ACTIVE LISTING'}
                  </Badge>
                </div>
                <h3 className="font-display font-bold text-sm sm:text-base text-charcoal-900 line-clamp-1">
                  {p.title}
                </h3>
                <p className="text-xs text-charcoal-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-sage-600 shrink-0" />
                  <span>{p.locality}, {p.city}</span>
                </p>
                <div className="flex items-center gap-3 text-xs text-charcoal-600 pt-1">
                  <span>{p.bedrooms} BHK</span>
                  <span>•</span>
                  <span>{p.bathrooms} Bath</span>
                  <span>•</span>
                  <span className="capitalize">{p.furnishingStatus.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-charcoal-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-charcoal-400 block text-[10px]">Monthly Rent</span>
                <span className="font-display font-bold text-lg text-charcoal-900">
                  ₹{p.monthlyRent.toLocaleString('en-IN')}/mo
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(p.id, p.title)}
                  className="p-2 rounded-xl text-charcoal-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete Listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Listing Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Property Listing"
        subtitle="100% Broker-Free • Published directly on HomeSync"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateProperty} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">Listing Title</label>
            <input
              type="text"
              required
              placeholder="e.g. The Rosewood Residency — Luxury 3BHK"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-white border border-charcoal-200 rounded-xl px-3.5 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal-700 block mb-1">City</label>
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm text-charcoal-900"
              >
                <option value="Chandigarh">Chandigarh</option>
                <option value="Mohali">Mohali</option>
                <option value="Panchkula">Panchkula</option>
                <option value="Bengaluru">Bengaluru</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal-700 block mb-1">Locality / Sector</label>
              <input
                type="text"
                required
                placeholder="e.g. Sector 35-C"
                value={locality}
                onChange={e => setLocality(e.target.value)}
                className="w-full bg-white border border-charcoal-200 rounded-xl px-3.5 py-2 text-sm text-charcoal-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal-700 block mb-1">Monthly Rent (₹)</label>
              <input
                type="number"
                required
                min="1000"
                placeholder="24000"
                value={monthlyRent}
                onChange={e => setMonthlyRent(e.target.value)}
                className="w-full bg-white border border-charcoal-200 rounded-xl px-3.5 py-2 text-sm text-charcoal-900 font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal-700 block mb-1">Security Deposit (₹)</label>
              <input
                type="number"
                min="1000"
                placeholder="48000"
                value={securityDeposit}
                onChange={e => setSecurityDeposit(e.target.value)}
                className="w-full bg-white border border-charcoal-200 rounded-xl px-3.5 py-2 text-sm text-charcoal-900 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal-700 block mb-1">Bedrooms</label>
              <input
                type="number"
                min="1"
                max="8"
                value={bedrooms}
                onChange={e => setBedrooms(e.target.value)}
                className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm text-charcoal-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal-700 block mb-1">Bathrooms</label>
              <input
                type="number"
                min="1"
                max="8"
                value={bathrooms}
                onChange={e => setBathrooms(e.target.value)}
                className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm text-charcoal-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal-700 block mb-1">Furnishing</label>
              <select
                value={furnishingStatus}
                onChange={e => setFurnishingStatus(e.target.value as any)}
                className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm text-charcoal-900"
              >
                <option value="fully_furnished">Fully Furnished</option>
                <option value="semi_furnished">Semi Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-300 block mb-1">Property Description</label>
            <textarea
              rows={3}
              placeholder="Describe view, furnishings, power backup, study desks..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-lg p-3 text-sm text-charcoal-900 dark:text-ivory-100"
            />
          </div>

          {/* Cloudinary Property Photo Upload */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-300">
                Property Photos (Cloudinary Powered)
              </label>
              <span className="text-[10px] text-charcoal-400">
                {propertyImages.length} uploaded
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              multiple
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                propertyImages.length > 0
                  ? 'border-sage-500 bg-sage-50/60 dark:bg-sage-950/30 text-sage-800 dark:text-sage-300'
                  : 'border-charcoal-200 dark:border-charcoal-700 hover:border-charcoal-400 dark:hover:border-charcoal-500 bg-white dark:bg-charcoal-900 text-charcoal-500 dark:text-charcoal-400'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center gap-1.5 py-1">
                  <Loader2 className="w-5 h-5 animate-spin text-sage-600" />
                  <span className="text-xs font-medium">Uploading photos to Cloudinary...</span>
                </div>
              ) : (
                <div>
                  <UploadCloud className="w-6 h-6 mx-auto mb-1 opacity-70 text-sage-600" />
                  <p className="text-xs font-semibold">
                    Click to add real photos of your property
                  </p>
                  <p className="text-[10px] text-charcoal-400 mt-0.5">
                    Images will be hosted on Cloudinary & displayed in marketplace
                  </p>
                </div>
              )}
            </div>

            {/* Photo Previews */}
            {propertyImages.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mt-2.5">
                {propertyImages.map((url, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-charcoal-200 dark:border-charcoal-700 shadow-2xs group">
                    <img src={url} alt={`Property upload ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 w-5 h-5 bg-charcoal-900/80 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="secondary" type="submit" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Publish Listing'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
