import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { localStore } from '../../services/localStore';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { MoveInCostCalculator } from '../../components/marketplace/MoveInCostCalculator';
import { useToast } from '../../context/ToastContext';
import { 
  Bed, 
  Bath, 
  MapPin, 
  Maximize, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowLeft,
  Share2,
  Heart,
  Clock,
  Home
} from 'lucide-react';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success } = useToast();

  const property = localStore.getPropertyById(id || 'prop-chd-35');
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [scheduleVisitOpen, setScheduleVisitOpen] = useState(false);
  const [visitDate, setVisitDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [visitTime, setVisitTime] = useState('11:00 AM');

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold font-display text-charcoal-900">Property Not Found</h2>
        <p className="text-sm text-charcoal-500">The listing you requested could not be located.</p>
        <Link to="/explore">
          <Button variant="primary">Return to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const images = property.propertyImages.length > 0 
    ? property.propertyImages 
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    success(`Visit scheduled for ${visitDate} at ${visitTime}! Landlord Vikram Singh notified.`);
    setScheduleVisitOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between">
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-sage-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Properties</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              success('Link copied to clipboard!');
            }}
            className="p-2 rounded-xl border border-charcoal-200 bg-white hover:bg-ivory-50 text-charcoal-700 text-xs flex items-center gap-1.5 font-medium transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Main Image Gallery */}
      <div className="space-y-3">
        <div className="w-full h-80 sm:h-[480px] rounded-xl overflow-hidden bg-charcoal-100 dark:bg-charcoal-900 relative shadow-subtle">
          <img
            src={images[activeImgIndex]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="brokerage" size="md">
              ₹0 BROKERAGE GUARANTEE
            </Badge>
          </div>
        </div>

        {/* Thumbnail row */}
        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIndex(idx)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  idx === activeImgIndex ? 'border-sage-600 scale-102 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Layout Split: Left details, Right pricing & actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-charcoal-500 mb-2">
              <MapPin className="w-4 h-4 text-sage-600 shrink-0" />
              <span>{property.address}, {property.locality}, {property.city}</span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 tracking-tight">
              {property.title}
            </h1>

            {/* Spec strip */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-charcoal-700 bg-white p-3.5 rounded-2xl border border-charcoal-200/70">
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-sage-600" />
                <span>{property.bedrooms} Bedrooms</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-sage-600" />
                <span>{property.bathrooms} Bathrooms</span>
              </div>
              {property.areaSqFt && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Maximize className="w-4 h-4 text-sage-600" />
                    <span>{property.areaSqFt} sq ft</span>
                  </div>
                </>
              )}
              <span>•</span>
              <span className="capitalize text-sage-800">{property.furnishingStatus.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-lg text-charcoal-900">About this Property</h3>
            <p className="text-sm text-charcoal-700 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-charcoal-900">Amenities & Features</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map(amenity => (
                <div
                  key={amenity}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-charcoal-100 text-xs text-charcoal-800 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Landlord Profile Box */}
          <div className="p-6 rounded-2xl bg-white border border-charcoal-200/80 space-y-4">
            <h3 className="font-display font-bold text-base text-charcoal-900">Direct Property Owner</h3>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80"
                  alt={property.landlordName}
                  className="w-12 h-12 rounded-full object-cover border border-sage-300"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-display font-bold text-sm text-charcoal-900">{property.landlordName}</h4>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified Owner
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-500 mt-0.5">Responsive Landlord • Direct Tenancy</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScheduleVisitOpen(true)}
                  icon={<Calendar className="w-3.5 h-3.5" />}
                >
                  Schedule Visit
                </Button>
                <a
                  href={`tel:${property.landlordPhone || '+919876543210'}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-ivory-100 hover:bg-ivory-200 text-charcoal-800 rounded-xl transition-colors border border-charcoal-200"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Landlord</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Column (Pricing, Cost Calculator, Apply) */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <Card className="p-6 space-y-6 border-sage-300 shadow-premium">
            <div className="flex items-baseline justify-between pb-4 border-b border-charcoal-100">
              <div>
                <span className="text-xs text-charcoal-400 uppercase tracking-wider font-semibold">Monthly Rent</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-display font-bold text-3xl text-charcoal-900">
                    ₹{property.monthlyRent.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-charcoal-500">/mo</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-charcoal-400 uppercase tracking-wider font-semibold">Deposit</span>
                <p className="font-display font-bold text-sm text-charcoal-800 mt-0.5">
                  ₹{property.securityDeposit.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Move-in Cost Calculator */}
            <MoveInCostCalculator
              monthlyRent={property.monthlyRent}
              securityDeposit={property.securityDeposit}
            />

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <Link to={`/apply/${property.id}`} className="block">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full font-bold shadow-md"
                  icon={<Sparkles className="w-4 h-4" />}
                >
                  Apply for Rental Now
                </Button>
              </Link>

              <Button
                size="md"
                variant="outline"
                className="w-full"
                onClick={() => setScheduleVisitOpen(true)}
                icon={<Calendar className="w-4 h-4 text-sage-600" />}
              >
                Schedule In-Person Visit
              </Button>
            </div>

            <div className="text-center text-[11px] text-charcoal-400">
              Instant landlord review • Dedicated HomeSync dashboard upon agreement
            </div>
          </Card>
        </div>
      </div>

      {/* Schedule Visit Modal */}
      <Modal
        isOpen={scheduleVisitOpen}
        onClose={() => setScheduleVisitOpen(false)}
        title="Schedule Property Visit"
        subtitle={`Visit ${property.title} in Sector 35, Chandigarh`}
        maxWidth="md"
      >
        <form onSubmit={handleBookVisit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">Preferred Date</label>
            <input
              type="date"
              required
              value={visitDate}
              onChange={e => setVisitDate(e.target.value)}
              className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm text-charcoal-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">Preferred Time Slot</label>
            <select
              value={visitTime}
              onChange={e => setVisitTime(e.target.value)}
              className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm text-charcoal-900"
            >
              <option value="10:00 AM">10:00 AM - Morning</option>
              <option value="11:30 AM">11:30 AM - Late Morning</option>
              <option value="03:00 PM">03:00 PM - Afternoon</option>
              <option value="05:30 PM">05:30 PM - Evening</option>
            </select>
          </div>

          <div className="p-3 bg-ivory-100 rounded-xl text-xs text-charcoal-600 space-y-1 border border-charcoal-200/60">
            <p className="font-semibold text-charcoal-900">Landlord Contact Information:</p>
            <p>Vikram Singh (Owner) • +91 98765 43210</p>
            <p className="text-[11px] text-charcoal-500">He will receive your requested slot via WhatsApp / SMS.</p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setScheduleVisitOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Confirm Visit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
