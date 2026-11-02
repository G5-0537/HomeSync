import React, { useState } from 'react';
import { useHousehold } from '../../context/HouseholdContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { DigitalSignModal } from '../../components/dashboard/DigitalSignModal';
import { downloadRentalAgreementPDF } from '../../services/pdfService';
import { 
  FileText, 
  Download, 
  PenTool, 
  ShieldCheck, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileCheck
} from 'lucide-react';

export const AgreementPage: React.FC = () => {
  const { agreement, refreshData } = useHousehold();
  const { user, role } = useAuth();
  const { success, error } = useToast();

  const [signModalOpen, setSignModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!agreement) {
    return (
      <div className="p-8 text-center bg-white dark:bg-charcoal-800 rounded-xl border border-charcoal-200 dark:border-charcoal-700 shadow-subtle">
        <p className="text-sm text-charcoal-500">No active agreement found.</p>
      </div>
    );
  }

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await downloadRentalAgreementPDF(agreement);
      success('Rental Agreement PDF generated and downloaded!');
    } catch (e) {
      error('Failed to generate PDF');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const isTenantSigned = agreement.tenantSignature?.signed;
  const isLandlordSigned = agreement.landlordSignature?.signed;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Verified Rental Lease Agreement
            </h1>
            <Badge variant="sage">{agreement.status.toUpperCase()}</Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500">
            Agreement ID: <span className="font-mono text-charcoal-700 font-bold">{agreement.id}</span> • 100% Broker-Free Direct Contract
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            onClick={handleDownloadPdf}
            isLoading={isGeneratingPdf}
            icon={<Download className="w-4 h-4 text-sage-600" />}
          >
            Download PDF
          </Button>

          {(!isTenantSigned || !isLandlordSigned) && (
            <Button
              variant="primary"
              onClick={() => setSignModalOpen(true)}
              icon={<PenTool className="w-4 h-4" />}
            >
              Sign Agreement
            </Button>
          )}
        </div>
      </div>

      {/* Signature Status Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tenant Signature Box */}
        <Card className={`p-5 border transition-all ${
          isTenantSigned 
            ? 'bg-sage-50/60 dark:bg-sage-950/30 border-sage-300 dark:border-sage-800' 
            : 'bg-white dark:bg-charcoal-800 border-charcoal-200 dark:border-charcoal-700'
        }`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Primary Tenant Signature</span>
              <h4 className="font-display font-bold text-sm text-charcoal-900 dark:text-white">{agreement.tenantName}</h4>
              {isTenantSigned ? (
                <div className="text-[11px] text-sage-800 dark:text-sage-300 flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />
                  <span>Digitally Executed on {new Date(agreement.tenantSignature?.timestamp || '').toLocaleDateString()}</span>
                </div>
              ) : (
                <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold block pt-1">Pending Signature</span>
              )}
            </div>
            <Badge variant={isTenantSigned ? 'success' : 'warning'} size="sm">
              {isTenantSigned ? 'SIGNED' : 'PENDING'}
            </Badge>
          </div>
        </Card>

        {/* Landlord Signature Box */}
        <Card className={`p-5 border transition-all ${
          isLandlordSigned 
            ? 'bg-lavender-50/60 dark:bg-lavender-950/30 border-lavender-300 dark:border-lavender-800' 
            : 'bg-white dark:bg-charcoal-800 border-charcoal-200 dark:border-charcoal-700'
        }`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Verified Landlord Signature</span>
              <h4 className="font-display font-bold text-sm text-charcoal-900 dark:text-white">{agreement.landlordName}</h4>
              {isLandlordSigned ? (
                <div className="text-[11px] text-lavender-800 dark:text-lavender-300 flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lavender-600 dark:text-lavender-400" />
                  <span>Digitally Executed on {new Date(agreement.landlordSignature?.timestamp || '').toLocaleDateString()}</span>
                </div>
              ) : (
                <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold block pt-1">Pending Signature</span>
              )}
            </div>
            <Badge variant={isLandlordSigned ? 'success' : 'warning'} size="sm">
              {isLandlordSigned ? 'SIGNED' : 'PENDING'}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Official Agreement Document Canvas */}
      <Card className="p-8 sm:p-10 bg-white dark:bg-charcoal-800 border-charcoal-200 dark:border-charcoal-700 shadow-premium space-y-8 max-w-4xl mx-auto">
        {/* Header Document Seal */}
        <div className="border-b-2 border-charcoal-900 dark:border-charcoal-600 pb-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-6 h-6 text-sage-600 dark:text-sage-400" />
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-charcoal-900 dark:text-white uppercase tracking-wider">
              Residential Tenancy & Shared Living Agreement
            </h2>
          </div>
          <p className="text-xs text-charcoal-500 dark:text-charcoal-400">
            HomeSync Verified Contract • Agreement ID: {agreement.id} • Registered Date: {new Date(agreement.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Key Terms Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-ivory-50 dark:bg-charcoal-900/60 p-4 rounded-xl border border-charcoal-200/80 dark:border-charcoal-700 text-xs">
          <div>
            <span className="text-charcoal-400 block text-[10px] uppercase">Monthly Rent</span>
            <span className="font-bold text-charcoal-900 dark:text-white text-sm">₹{agreement.monthlyRent.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-charcoal-400 block text-[10px] uppercase">Security Deposit</span>
            <span className="font-bold text-charcoal-900 text-sm">₹{agreement.securityDeposit.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-charcoal-400 block text-[10px] uppercase">Due Day</span>
            <span className="font-bold text-charcoal-900 text-sm">{agreement.rentDueDayOfMonth}th of month</span>
          </div>
          <div>
            <span className="text-charcoal-400 block text-[10px] uppercase">Notice Period</span>
            <span className="font-bold text-charcoal-900 text-sm">{agreement.noticePeriodDays} Days</span>
          </div>
        </div>

        {/* Section 1: Demised Premises */}
        <div className="space-y-2 text-xs sm:text-sm text-charcoal-800 leading-relaxed">
          <h3 className="font-display font-bold text-sm sm:text-base text-charcoal-900 text-sage-900 uppercase tracking-wide">
            1. Parties and Demised Premises
          </h3>
          <p>
            This agreement is made between <strong>{agreement.landlordName}</strong> (hereinafter referred to as the <em>"Lessor"</em>) and <strong>{agreement.tenantName}</strong> (hereinafter referred to as the <em>"Primary Tenant / Lessee"</em>), regarding the premises located at:
          </p>
          <div className="p-3 rounded-xl bg-ivory-50 border border-charcoal-100 font-medium">
            {agreement.propertyTitle} — {agreement.propertyAddress}
          </div>
          <p>
            The Tenancy period commences on <strong>{agreement.startDate}</strong> and terminates on <strong>{agreement.endDate}</strong>, unless renewed or terminated in accordance with clause 4.
          </p>
        </div>

        {/* Section 2: Maintenance Responsibilities */}
        <div className="space-y-2 text-xs sm:text-sm text-charcoal-800 leading-relaxed">
          <h3 className="font-display font-bold text-sm sm:text-base text-charcoal-900 text-sage-900 uppercase tracking-wide">
            2. Maintenance & Shared Living Responsibilities
          </h3>
          <p className="bg-ivory-50 p-4 rounded-xl border border-charcoal-100">
            {agreement.maintenanceResponsibilities}
          </p>
        </div>

        {/* Section 3: Early Termination & Notice */}
        <div className="space-y-2 text-xs sm:text-sm text-charcoal-800 leading-relaxed">
          <h3 className="font-display font-bold text-sm sm:text-base text-charcoal-900 text-sage-900 uppercase tracking-wide">
            3. Early Termination & Notice Conditions
          </h3>
          <p className="bg-ivory-50 p-4 rounded-xl border border-charcoal-100">
            {agreement.earlyTerminationConditions}
          </p>
        </div>

        {/* Section 4: Security Deposit Escrow & Settlement */}
        <div className="space-y-2 text-xs sm:text-sm text-charcoal-800 leading-relaxed">
          <h3 className="font-display font-bold text-sm sm:text-base text-charcoal-900 text-sage-900 uppercase tracking-wide">
            4. Security Deposit Settlement
          </h3>
          <p className="bg-ivory-50 p-4 rounded-xl border border-charcoal-100">
            {agreement.depositSettlementConditions}
          </p>
        </div>

        {/* Stamp Signature Section */}
        <div className="pt-6 border-t border-charcoal-200 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl border border-charcoal-200 bg-ivory-50 text-xs space-y-2">
            <span className="font-bold text-charcoal-500 uppercase tracking-wider block">LESSEE (TENANT)</span>
            <p className="font-display font-bold text-sm text-charcoal-900">
              {agreement.tenantSignature?.signatureName || agreement.tenantName}
            </p>
            <p className="text-[10px] text-charcoal-400">
              {agreement.tenantSignature?.signed ? `Verified: ${agreement.tenantSignature.timestamp}` : 'Signature Pending'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-charcoal-200 bg-ivory-50 text-xs space-y-2">
            <span className="font-bold text-charcoal-500 uppercase tracking-wider block">LESSOR (LANDLORD)</span>
            <p className="font-display font-bold text-sm text-charcoal-900">
              {agreement.landlordSignature?.signatureName || agreement.landlordName}
            </p>
            <p className="text-[10px] text-charcoal-400">
              {agreement.landlordSignature?.signed ? `Verified: ${agreement.landlordSignature.timestamp}` : 'Signature Pending'}
            </p>
          </div>
        </div>
      </Card>

      <DigitalSignModal
        isOpen={signModalOpen}
        onClose={() => setSignModalOpen(false)}
        agreement={agreement}
        role={role}
        onSigned={refreshData}
      />
    </div>
  );
};
