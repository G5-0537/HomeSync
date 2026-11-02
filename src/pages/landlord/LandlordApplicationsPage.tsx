import React, { useState } from 'react';
import { localStore } from '../../services/localStore';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  Users, 
  Check, 
  X, 
  Calendar, 
  Briefcase, 
  Mail, 
  Phone, 
  DollarSign, 
  Sparkles,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LandlordApplicationsPage: React.FC = () => {
  const { success, error } = useToast();
  const [applications, setApplications] = useState(localStore.getApplications());

  const refreshList = () => {
    setApplications(localStore.getApplications());
  };

  const handleApprove = (appId: string) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    localStore.updateApplicationStatus(appId, 'completed');

    // Automatically create the Rental Agreement!
    const prop = localStore.getPropertyById(app.propertyId);
    const rent = prop?.monthlyRent || 24000;
    const dep = prop?.securityDeposit || 48000;

    const startDate = app.proposedMoveInDate;
    const end = new Date(startDate);
    end.setFullYear(end.getFullYear() + 1);
    const endDate = end.toISOString().split('T')[0];

    const agreement = localStore.createAgreement({
      applicationId: app.id,
      propertyId: app.propertyId,
      propertyTitle: app.propertyTitle,
      propertyAddress: prop?.address || 'Sector 35-C, Chandigarh',
      landlordUid: 'landlord-vikram',
      landlordName: 'Vikram Singh',
      tenantUid: app.tenantUid,
      tenantName: app.tenantName,
      monthlyRent: rent,
      securityDeposit: dep,
      startDate,
      endDate,
      noticePeriodDays: 30,
      rentDueDayOfMonth: 5,
      maintenanceResponsibilities: 'Landlord handles all structural, plumbing, and inverter electrical upkeep. Lessee handles day-to-day cleaning and consumables.',
      earlyTerminationConditions: 'A minimum 30 days notice in writing via HomeSync. If vacated earlier, 1 month rent is deductible.',
      depositSettlementConditions: 'Security deposit of ₹48,000 held in Escrow Wallet. Mutually inspected at move-out and disbursed within 7 days.'
    });

    // Notify tenant
    localStore.addNotification({
      userId: app.tenantUid,
      title: 'Application Approved! Agreement Ready',
      message: `Vikram Singh approved your application for ${app.propertyTitle}. Digital agreement ${agreement.id} is ready for review and signing.`,
      type: 'agreement'
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5 }
    });

    success(`Application for ${app.tenantName} APPROVED! Lease agreement generated.`);
    refreshList();
  };

  const handleReject = (appId: string) => {
    localStore.updateApplicationStatus(appId, 'rejected');
    success('Application rejected.');
    refreshList();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Tenant Rental Applications
            </h1>
            <Badge variant="lavender">{applications.length} Received</Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500">
            Review applicant employment status, household occupants, and approve to trigger automated agreements.
          </p>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card className="p-8 text-center text-xs text-charcoal-500">
            No rental applications received yet.
          </Card>
        ) : (
          applications.map(app => (
            <Card key={app.id} className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-charcoal-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sage-100 text-sage-800 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5 text-sage-700" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-charcoal-900">{app.tenantName}</h3>
                    <p className="text-xs text-charcoal-500">
                      Applied for <strong>{app.propertyTitle}</strong> on {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={app.status === 'completed' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}
                  size="md"
                >
                  {app.status.toUpperCase()}
                </Badge>
              </div>

              {/* Applicant Profile Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-ivory-50 p-4 rounded-xl border border-charcoal-200/60 text-xs">
                <div>
                  <span className="text-charcoal-400 block text-[10px] uppercase">Employment</span>
                  <span className="font-semibold text-charcoal-900">{app.employmentStatus}</span>
                </div>
                <div>
                  <span className="text-charcoal-400 block text-[10px] uppercase">Monthly Income</span>
                  <span className="font-semibold text-charcoal-900">₹{app.monthlyIncome?.toLocaleString('en-IN') || '1,20,000'}</span>
                </div>
                <div>
                  <span className="text-charcoal-400 block text-[10px] uppercase">Move-In Date</span>
                  <span className="font-semibold text-charcoal-900">{app.proposedMoveInDate}</span>
                </div>
                <div>
                  <span className="text-charcoal-400 block text-[10px] uppercase">Occupants</span>
                  <span className="font-semibold text-charcoal-900">{app.numberOfOccupants} Co-living Roommates</span>
                </div>
              </div>

              {/* Message from tenant */}
              {app.message && (
                <div className="p-3 bg-white rounded-xl border border-charcoal-100 text-xs text-charcoal-700 italic">
                  "{app.message}"
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4 text-xs text-charcoal-500">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {app.tenantEmail}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {app.tenantPhone}</span>
                </div>

                {app.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReject(app.id)}
                      className="text-red-700 hover:bg-red-50"
                    >
                      Reject
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprove(app.id)}
                      icon={<Check className="w-4 h-4" />}
                    >
                      Approve & Generate Agreement
                    </Button>
                  </div>
                )}

                {app.status === 'completed' && (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <FileCheck className="w-4 h-4" /> Tenancy Agreement Activated
                  </span>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
