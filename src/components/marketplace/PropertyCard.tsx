import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PropertyListing } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { 
  Bed, 
  Bath, 
  MapPin, 
  Maximize, 
  ShieldCheck, 
  Heart, 
  ChevronLeft, 
  ChevronRight,
  Sparkles 
} from 'lucide-react';

interface PropertyCardProps {
  property: PropertyListing;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const images = property.propertyImages.length > 0 
    ? property.propertyImages 
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Card hoverEffect className="overflow-hidden flex flex-col group">
      {/* Property Image with Carousel controls */}
      <div className="relative aspect-4/3 w-full bg-charcoal-100 overflow-hidden">
        <img
          src={images[currentImgIndex]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <Badge variant="brokerage" size="sm" className="pointer-events-auto">
            ₹0 BROKERAGE
          </Badge>
          <button
            onClick={toggleWishlist}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all shadow-subtle ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white/80 hover:bg-white text-charcoal-700'
            }`}
            aria-label="Wishlist property"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Image Arrows */}
        {images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={prevImage}
              className="p-1 rounded-full bg-white/80 hover:bg-white text-charcoal-800 shadow-subtle transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="p-1 rounded-full bg-white/80 hover:bg-white text-charcoal-800 shadow-subtle transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 pointer-events-none">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentImgIndex ? 'bg-white w-3' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-charcoal-500 mb-1">
            <MapPin className="w-3.5 h-3.5 text-sage-600 shrink-0" />
            <span className="truncate">{property.locality}, {property.city}</span>
          </div>

          <Link to={`/properties/${property.id}`}>
            <h3 className="font-display font-bold text-base text-charcoal-900 group-hover:text-sage-700 transition-colors line-clamp-1">
              {property.title}
            </h3>
          </Link>

          {/* Quick Specifications */}
          <div className="flex items-center gap-3 mt-3 text-xs text-charcoal-600">
            <div className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-charcoal-400" />
              <span>{property.bedrooms} BHK</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-charcoal-400" />
              <span>{property.bathrooms} Bath</span>
            </div>
            {property.areaSqFt && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Maximize className="w-3.5 h-3.5 text-charcoal-400" />
                  <span>{property.areaSqFt} sq ft</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3.5 border-t border-charcoal-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-bold text-lg text-charcoal-900">
                ₹{property.monthlyRent.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-charcoal-500">/ month</span>
            </div>
            <p className="text-[10px] text-emerald-700 font-semibold">Zero brokerage fee</p>
          </div>

          <Link
            to={`/properties/${property.id}`}
            className="text-xs font-semibold bg-sage-600 hover:bg-sage-700 text-white px-3.5 py-2 rounded-xl transition-all shadow-subtle active:scale-95"
          >
            View Details
          </Link>
        </div>
      </div>
    </Card>
  );
};
