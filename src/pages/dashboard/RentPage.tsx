import React, { useState } from 'react';
import { useHousehold } from '../../context/HouseholdContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { localStore } from '../../services/localStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  CreditCard, 
  CheckCircle2, 
  Download, 
  Calendar, 
  Receipt, 
  AlertCircle, 
  ShieldCheck,
  Building2,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RentPage: React.FC = () => {
  const { household, rentPayments, agreement, refreshData } = useHousehold();
  const { user } = useAuth();
  const { success } = useToast();
  const [isPaying, setIsPaying] = useState(false);

  const monthlyRent = household.monthlyRent;
  const perRoommate = Math.round(monthlyRent / household.members.length);

  const handleSimulatePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      localStore.recordRentPayment({
        householdId: household.id,
        agreementId: agreement?.id || 'agr-001',
        month: 'December 2026',
        dueDate: '2026-12-05',
        amount: monthlyRent,
        status: 'paid',
        paidAt: new Date().toISOString(),
        paidByUid: user?.uid || 'user-aanya',
        paidByName: user?.name || 'Aanya Sharma',
        paymentMethod: 'UPI AutoPay (Simulated)'
      });

      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.5 }
      });
      success(`Rent of ₹${monthlyRent.toLocaleString('en-IN')} paid successfully! Digital receipt generated.`);
      setIsPaying(false);
      refreshData();
    }, 700);
  };

  const handleDownloadReceipt = (receiptId: string, month: string) => {
    success(`Downloading receipt ${receiptId} for ${month}...`);
    // Print window receipt view
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Rent Management & Receipts
            </h1>
            <Badge variant="sage">Direct Owner Transfer</Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500">
            Monthly rent tracking, verified payment records, and downloadable tax-compliant receipts.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleSimulatePayment}
          isLoading={isPaying}
          icon={<CreditCard className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Pay Next Month (Simulated)
        </Button>
      </div>

      {/* Rent Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-ivory-50 border-sage-300 shadow-premium space-y-4 md:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-200/60">
            <div>
              <span className="text-xs font-semibold text-sage-800 uppercase tracking-wider">Current Cycle Status</span>
              <h3 className="font-display font-extrabold text-2xl text-charcoal-900 mt-1">
                November 2026 Rent: Fully Paid
              </h3>
            </div>
            <Badge variant="success" size="md">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1" />
              VERIFIED PAID
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <span className="text-xs text-charcoal-400 block">Total Rent</span>
              <span className="font-display font-bold text-xl text-charcoal-900">
                ₹{monthlyRent.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-xs text-charcoal-400 block">Per Roommate (4-Way)</span>
              <span className="font-display font-bold text-xl text-sage-700">
                ₹{perRoommate.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-xs text-charcoal-400 block">Monthly Due Date</span>
              <span className="font-display font-bold text-xl text-charcoal-900">
                {household.rentDueDayOfMonth}th of month
              </span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-charcoal-200 text-xs text-charcoal-600 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Receiver: <strong>{agreement?.landlordName || 'Vikram Singh'}</strong> (Direct Owner)
            </span>
            <span className="text-charcoal-400 text-[11px]">Brokerage Fee: ₹0</span>
          </div>
        </Card>

        {/* Next Due Snapshot */}
        <Card className="p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Next Payment</span>
            <div className="flex items-center gap-2 text-charcoal-900 font-display font-bold text-xl">
              <Calendar className="w-5 h-5 text-sage-600" />
              <span>December 5, 2026</span>
            </div>
            <p className="text-xs text-charcoal-500">
              Automated reminder will be sent to all roommates on Dec 1st.
            </p>
          </div>

          <div className="pt-4 border-t border-charcoal-100">
            <span className="text-[11px] text-charcoal-400 block mb-2">Roommate Share Breakdown:</span>
            <div className="space-y-1 text-xs">
              {household.members.map(m => (
                <div key={m.uid} className="flex justify-between">
                  <span className="text-charcoal-600">{m.name}:</span>
                  <span className="font-semibold text-charcoal-900">₹{perRoommate.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Payment History Ledger */}
      <Card className="p-6 space-y-4">
        <h3 className="font-display font-bold text-base text-charcoal-900">
          Payment Records & Verified Receipts
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-charcoal-200 text-charcoal-500 font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-2">Rental Month</th>
                <th className="pb-3">Receipt Number</th>
                <th className="pb-3">Paid By</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Method</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {rentPayments.map(p => (
                <tr key={p.id} className="hover:bg-ivory-50 transition-colors">
                  <td className="py-3.5 pl-2 font-bold text-charcoal-900">{p.month}</td>
                  <td className="py-3.5 font-mono text-[11px] text-charcoal-600">{p.receiptId}</td>
                  <td className="py-3.5 font-medium text-charcoal-800">{p.paidByName}</td>
                  <td className="py-3.5 font-display font-bold text-charcoal-900 text-sm">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 text-charcoal-600">{p.paymentMethod || 'UPI Transfer'}</td>
                  <td className="py-3.5">
                    <Badge variant="success" size="sm">PAID</Badge>
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    <button
                      onClick={() => handleDownloadReceipt(p.receiptId || 'REC', p.month)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-charcoal-200 hover:bg-white text-charcoal-700 text-xs font-semibold shadow-2xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-sage-600" />
                      <span>PDF Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
