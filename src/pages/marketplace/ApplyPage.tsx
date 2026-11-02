import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { localStore } from '../../services/localStore';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar, 
  Users, 
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ArrowLeft 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ApplyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error } = useToast();

  const property = localStore.getPropertyById(id || 'prop-chd-35');

  const [tenantName, setTenantName] = useState(user?.name || 'Aanya Sharma');
  const [tenantEmail, setTenantEmail] = useState(user?.email || 'aanya.sharma@example.com');
  const [tenantPhone, setTenantPhone] = useState(user?.phone || '+91 98765 11001');
  const [employmentStatus, setEmploymentStatus] = useState('Senior Product Designer (Full-Time)');
  const [monthlyIncome, setMonthlyIncome] = useState('120000');
  const [proposedMoveInDate, setProposedMoveInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().split('T')[0];
  });
  const [numberOfOccupants, setNumberOfOccupants] = useState(4);
  const [message, setMessage] = useState(
    'Hello Vikram, we are 4 working professionals working in tech and design. We loved the sunlit balcony and modular kitchen at Ivory Heights and are looking for a long-term peaceful home.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!property) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <p className="text-sm text-charcoal-500">Property not found.</p>
        <Link to="/explore">
          <Button variant="primary" className="mt-4">Back to Explorer</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName.trim() || !tenantEmail.trim()) {
      error('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newApp = localStore.createApplication({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyImage: property.propertyImages[0],
        tenantUid: user?.uid || 'user-aanya',
        tenantName: tenantName.trim(),
        tenantEmail: tenantEmail.trim(),
        tenantPhone: tenantPhone.trim(),
        monthlyIncome: Number(monthlyIncome) || 0,
        employmentStatus: employmentStatus.trim(),
        proposedMoveInDate,
        numberOfOccupants: Number(numberOfOccupants) || 1,
        message: message.trim()
      });

      // Notify landlord
      localStore.addNotification({
        userId: property.landlordUid,
        title: 'New Rental Application Received!',
        message: `${tenantName} applied for ${property.title} (${numberOfOccupants} occupants).`,
        type: 'agreement'
      });

      setIsSubmitting(false);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 }
      });
      success('Application submitted! Landlord Vikram Singh has been notified.');
      navigate('/landlord/applications');
    }, 700);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <Link
        to={`/properties/${property.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-sage-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Property Listing</span>
      </Link>

      {/* Property banner */}
      <div className="bg-white p-4 rounded-2xl border border-charcoal-200/80 flex items-center justify-between gap-4 shadow-subtle">
        <div className="flex items-center gap-3.5">
          <img
            src={property.propertyImages[0]}
            alt={property.title}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-sage-700 font-bold uppercase tracking-wider">Applying For</span>
              <Badge variant="brokerage" size="sm">₹0 BROKERAGE</Badge>
            </div>
            <h2 className="font-display font-bold text-base text-charcoal-900 mt-0.5">{property.title}</h2>
            <p className="text-xs text-charcoal-500">₹{property.monthlyRent.toLocaleString('en-IN')}/month • Sector 35, Chandigarh</p>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="font-display font-extrabold text-xl sm:text-2xl text-charcoal-900">
            Rental Tenancy Application
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Submit your background profile directly to landlord Vikram Singh. No agent calls, no brokerage.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm text-charcoal-800 pb-1 border-b border-charcoal-100">
              1. Applicant Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={tenantName}
                    onChange={e => setTenantName(e.target.value)}
                    className="w-full bg-ivory-50 border border-charcoal-200 rounded-xl pl-9 pr-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={tenantEmail}
                    onChange={e => setTenantEmail(e.target.value)}
                    className="w-full bg-ivory-50 border border-charcoal-200 rounded-xl pl-9 pr-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={tenantPhone}
                    onChange={e => setTenantPhone(e.target.value)}
                    className="w-full bg-ivory-50 border border-charcoal-200 rounded-xl pl-9 pr-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1">Number of Occupants</label>
                <div className="relative">
                  <Users className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={numberOfOccupants}
                    onChange={e => setNumberOfOccupants(Number(e.target.value))}
                    className="w-full bg-ivory-50 border border-charcoal-200 rounded-xl pl-9 pr-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Employment & Financials */}
          <div className="space-y-4 pt-2">
            <h3 className="font-display font-bold text-sm text-charcoal-800 pb-1 border-b border-charcoal-100">
              2. Employment & Tenancy Timeline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1">Current Profession / Employer</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={employmentStatus}
                    onChange={e => setEmploymentStatus(e.target.value)}
                    className="w-full bg-ivory-50 border border-charcoal-200 rounded-xl pl-9 pr-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1">Approx. Monthly Household Income (₹)</label>
                <input
                  type="number"
                  required
                  value={monthlyIncome}
                  onChange={e => setMonthlyIncome(e.target.value)}
                  className="w-full bg-ivory-50 border border-charcoal-200 rounded-xl px-3.5 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal-700 block mb-1">Target Move-In Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={proposedMoveInDate}
                  onChange={e => setProposedMoveInDate(e.target.value)}
                  className="w-full bg-ivory-50 border border-charcoal-200 rounded-xl pl-9 pr-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
                />
              </div>
            </div>
          </div>

          {/* Message to Landlord */}
          <div className="space-y-2 pt-2">
            <h3 className="font-display font-bold text-sm text-charcoal-800 pb-1 border-b border-charcoal-100">
              3. Message to Landlord Vikram Singh
            </h3>
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full bg-ivory-50 border border-charcoal-200 rounded-xl p-3 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
              placeholder="Introduce yourself and your co-tenants..."
            />
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Once approved, HomeSync will automatically generate your lease agreement and provision your 4-roommate household dashboard.
            </span>
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <Link to={`/properties/${property.id}`}>
              <Button variant="ghost" type="button">Cancel</Button>
            </Link>
            <Button
              variant="primary"
              size="lg"
              type="submit"
              isLoading={isSubmitting}
              icon={<Sparkles className="w-4 h-4" />}
            >
              Submit Application
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
