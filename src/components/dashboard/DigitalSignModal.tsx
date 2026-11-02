import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { RentalAgreement } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { localStore } from '../../services/localStore';
import { PenTool, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DigitalSignModalProps {
  isOpen: boolean;
  onClose: () => void;
  agreement: RentalAgreement;
  role: 'tenant' | 'landlord';
  onSigned?: () => void;
}

export const DigitalSignModal: React.FC<DigitalSignModalProps> = ({
  isOpen,
  onClose,
  agreement,
  role,
  onSigned,
}) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [signerName, setSignerName] = useState(
    role === 'tenant' ? agreement.tenantName : agreement.landlordName
  );
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName.trim() || !agreeTerms) {
      error('Please confirm your legal name and accept the tenancy covenants');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const updated = localStore.signAgreement(agreement.id, role, signerName.trim());
      setIsSubmitting(false);

      if (updated?.status === 'active') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        success('Tenancy Activated! Both Tenant & Landlord have fully executed the agreement.');
      } else {
        success(`Agreement signed by ${role}! Awaiting counter-party execution.`);
      }

      if (onSigned) onSigned();
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Digital Agreement Execution"
      subtitle={`Executing as ${role === 'tenant' ? 'Primary Tenant' : 'Verified Property Owner'}`}
      maxWidth="md"
    >
      <form onSubmit={handleSign} className="space-y-4">
        {/* Agreement summary snapshot */}
        <div className="bg-ivory-100 p-3.5 rounded-xl border border-charcoal-200/70 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-charcoal-500">Property:</span>
            <span className="font-semibold text-charcoal-900">{agreement.propertyTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal-500">Monthly Rent:</span>
            <span className="font-semibold text-charcoal-900">₹{agreement.monthlyRent.toLocaleString('en-IN')}/mo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal-500">Security Deposit:</span>
            <span className="font-semibold text-charcoal-900">₹{agreement.securityDeposit.toLocaleString('en-IN')} (Escrow)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal-500">Duration:</span>
            <span className="font-semibold text-charcoal-900">{agreement.startDate} to {agreement.endDate}</span>
          </div>
        </div>

        {/* Legal Signer Name */}
        <div>
          <label className="text-xs font-semibold text-charcoal-700 block mb-1">
            Full Legal Name (Electronic Signature)
          </label>
          <div className="relative">
            <PenTool className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={signerName}
              onChange={e => setSignerName(e.target.value)}
              className="w-full bg-white border border-charcoal-200 rounded-xl pl-9 pr-3 py-2 text-sm text-charcoal-900 font-display font-semibold focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
            />
          </div>
        </div>

        {/* Checkbox acknowledgement */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            id="terms-check"
            checked={agreeTerms}
            onChange={e => setAgreeTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-charcoal-300 text-sage-600 focus:ring-sage-500 cursor-pointer"
          />
          <label htmlFor="terms-check" className="text-xs text-charcoal-700 leading-relaxed cursor-pointer select-none">
            I have reviewed the lease covenants, notice period ({agreement.noticePeriodDays} days), and deposit settlement conditions. I authorize digital execution of this agreement.
          </label>
        </div>

        {/* Prototype legal disclaimer */}
        <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Prototype Notice:</strong> This digital signing workflow simulates the tenancy execution experience. Real-world legal binding requires registered state-specific e-stamp instruments.
          </span>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Review Later
          </Button>
          <Button
            variant={role === 'tenant' ? 'primary' : 'secondary'}
            type="submit"
            isLoading={isSubmitting}
            disabled={!agreeTerms}
          >
            Confirm & Sign Agreement
          </Button>
        </div>
      </form>
    </Modal>
  );
};
