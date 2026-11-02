import React, { useState } from 'react';
import { useHousehold } from '../../context/HouseholdContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { localStore } from '../../services/localStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { 
  ShieldCheck, 
  Wallet, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  UploadCloud,
  Scale
} from 'lucide-react';

export const DepositPage: React.FC = () => {
  const { household, deposit, agreement, refreshData } = useHousehold();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [requestSettlementModalOpen, setRequestSettlementModalOpen] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeNotes, setDisputeNotes] = useState('');
  const [evidencePhoto, setEvidencePhoto] = useState(false);

  if (!deposit) {
    return (
      <div className="p-8 text-center bg-white dark:bg-charcoal-800 rounded-xl border border-charcoal-200 dark:border-charcoal-700 shadow-subtle">
        <p className="text-sm text-charcoal-500">No deposit wallet found for this household.</p>
      </div>
    );
  }

  const handleRequestSettlement = () => {
    localStore.updateDepositStatus(
      deposit.id,
      'SETTLEMENT_REQUESTED',
      'Tenant initiated mutual move-out deposit settlement request.'
    );
    success('Move-out deposit settlement request initiated! Awaiting mutual inspection verification.');
    refreshData();
    setRequestSettlementModalOpen(false);
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeNotes.trim()) {
      error('Please describe your dispute concerns');
      return;
    }
    localStore.updateDepositStatus(
      deposit.id,
      'DISPUTED',
      `Dispute opened: ${disputeNotes.trim()}`
    );
    success('Dispute submitted with photographic evidence. Both parties have been notified for resolution.');
    refreshData();
    setDisputeModalOpen(false);
    setDisputeNotes('');
  };

  const stages = [
    { name: 'PENDING', label: '1. Deposit Pending' },
    { name: 'HELD', label: '2. Escrow Wallet Held' },
    { name: 'SETTLEMENT_REQUESTED', label: '3. Settlement Requested' },
    { name: 'UNDER_REVIEW', label: '4. Condition Review' },
    { name: 'REFUNDED', label: '5. Settled & Released' },
  ];

  const currentStageIndex = stages.findIndex(s => s.name === deposit.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Security Deposit Wallet (Escrow)
            </h1>
            <Badge variant="sage">{deposit.status}</Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500">
            Simulated neutral trust escrow protecting both tenants and landlord throughout tenancy.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {deposit.status === 'HELD' && (
            <Button
              variant="outline"
              onClick={() => setRequestSettlementModalOpen(true)}
              icon={<Scale className="w-4 h-4 text-sage-600" />}
            >
              Request Move-Out Settlement
            </Button>
          )}

          {deposit.status !== 'DISPUTED' && (
            <Button
              variant="ghost"
              onClick={() => setDisputeModalOpen(true)}
              className="text-amber-800 hover:bg-amber-50"
            >
              Open Dispute
            </Button>
          )}
        </div>
      </div>

      {/* Main Balance Card */}
      <Card className="p-6 sm:p-8 bg-ivory-50 border-emerald-300 shadow-premium space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-200/60">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
              Escrow Trust Balance
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display font-extrabold text-4xl text-charcoal-900">
                ₹{deposit.amount.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-charcoal-500">INR</span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-charcoal-400 block">Locked Tenancy Period:</span>
            <span className="text-xs font-bold text-charcoal-800">
              {agreement?.startDate} — {agreement?.endDate}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
              ✓ Fully Funded at Lease Initiation
            </span>
          </div>
        </div>

        {/* Lifecycle Stepper */}
        <div>
          <h4 className="text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-4">
            Deposit Lifecycle Progression:
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {stages.map((stage, idx) => {
              const isPastOrCurrent = currentStageIndex >= idx;
              const isCurrent = deposit.status === stage.name;
              return (
                <div
                  key={stage.name}
                  className={`p-3 rounded-xl border text-xs text-center transition-all ${
                    isCurrent
                      ? 'bg-sage-600 text-white font-bold border-sage-600 shadow-xs'
                      : isPastOrCurrent
                      ? 'bg-sage-100/70 text-sage-900 border-sage-300 font-semibold'
                      : 'bg-white text-charcoal-400 border-charcoal-200'
                  }`}
                >
                  <p className="text-[11px] truncate">{stage.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Simulated Escrow Protection:</strong> HomeSync guarantees that neither party can unilaterally confiscate the deposit. Final release requires mutual sign-off on the move-out inspection report.
          </span>
        </div>
      </Card>

      {/* Settlement Scenarios Evaluation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 space-y-3">
          <h4 className="font-display font-bold text-sm text-charcoal-900">
            Scenario A: Regular Lease Completion
          </h4>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            At end of 12-month agreement term ({agreement?.endDate}), mutual inspection is completed within 7 days. Full ₹{deposit.amount.toLocaleString('en-IN')} is refunded minus only mutually agreed repairs.
          </p>
          <Badge variant="success" size="sm">Standard Path</Badge>
        </Card>

        <Card className="p-5 space-y-3">
          <h4 className="font-display font-bold text-sm text-charcoal-900">
            Scenario B: Tenant Early Exit
          </h4>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Requires minimum 30 days notice in writing via HomeSync. If 30 days notice is honored, deposit is refunded in full without penalty. If vacated without notice, 1 month rent is deducted.
          </p>
          <Badge variant="warning" size="sm">Notice Dependent</Badge>
        </Card>

        <Card className="p-5 space-y-3">
          <h4 className="font-display font-bold text-sm text-charcoal-900">
            Scenario C: Disputed Condition Claim
          </h4>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            If landlord proposes damage deductions, both parties upload photographic proof comparing move-in baseline photos with move-out photos to resolve claims transparently.
          </p>
          <Badge variant="lavender" size="sm">Evidence Bound</Badge>
        </Card>
      </div>

      {/* Deposit Timeline Audit Log */}
      <Card className="p-6 space-y-4">
        <h3 className="font-display font-bold text-base text-charcoal-900">
          Escrow Audit Trail & History
        </h3>

        <div className="space-y-3">
          {deposit.timeline.map((event, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-ivory-50 border border-charcoal-100 text-xs">
              <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-charcoal-900">{event.stage}</span>
                  <span className="text-[10px] text-charcoal-400">{event.date}</span>
                </div>
                <p className="text-charcoal-600 mt-0.5 text-[11px]">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Move-Out Request Modal */}
      <Modal
        isOpen={requestSettlementModalOpen}
        onClose={() => setRequestSettlementModalOpen(false)}
        title="Request Move-Out Deposit Settlement"
        subtitle="Initiate 7-day mutual inspection and escrow wallet release"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-charcoal-700 leading-relaxed">
            You are requesting settlement for the security deposit of <strong>₹{deposit.amount.toLocaleString('en-IN')}</strong> held for {household.propertyName}.
          </p>
          <div className="p-3 bg-sage-50 rounded-xl border border-sage-200 text-xs text-sage-900">
            ✓ Your move-in inspection checklist from April 2026 will serve as the comparative baseline.
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setRequestSettlementModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRequestSettlement}>
              Confirm & Request Settlement
            </Button>
          </div>
        </div>
      </Modal>

      {/* Dispute Modal */}
      <Modal
        isOpen={disputeModalOpen}
        onClose={() => setDisputeModalOpen(false)}
        title="Open Deposit Dispute"
        subtitle="Submit photographic evidence and itemized objection"
        maxWidth="md"
      >
        <form onSubmit={handleDisputeSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">Reason for Dispute</label>
            <textarea
              required
              rows={3}
              value={disputeNotes}
              onChange={e => setDisputeNotes(e.target.value)}
              placeholder="Detail your objection to proposed deductions or landlord claims..."
              className="w-full bg-white border border-charcoal-200 rounded-xl p-3 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">Evidence Photos</label>
            <div
              onClick={() => setEvidencePhoto(!evidencePhoto)}
              className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
                evidencePhoto ? 'border-sage-500 bg-sage-50 text-sage-800' : 'border-charcoal-200 bg-white text-charcoal-500'
              }`}
            >
              <UploadCloud className="w-5 h-5 mx-auto mb-1 opacity-70" />
              <p className="text-xs font-medium">
                {evidencePhoto ? '✓ 1 Evidence photograph attached' : 'Click to attach photo evidence of move-out cleanliness'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={() => setDisputeModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Dispute
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
