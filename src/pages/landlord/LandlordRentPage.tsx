import React from 'react';
import { localStore } from '../../services/localStore';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { CreditCard, CheckCircle2, Download, Building2, Calendar } from 'lucide-react';

export const LandlordRentPage: React.FC = () => {
  const rentPayments = localStore.getRentPayments();
  const properties = localStore.getProperties().filter(p => p.listingStatus === 'rented');

  const totalCollected = rentPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Rent Collection & Remittances
            </h1>
            <Badge variant="lavender">Verified Ledger</Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500">
            Track automated tenant collections, pending dues, and download tax statements.
          </p>
        </div>
      </div>

      {/* Collection Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 space-y-2">
          <span className="text-xs text-charcoal-500 uppercase font-semibold">Total Collected (YTD)</span>
          <span className="font-display font-extrabold text-2xl text-charcoal-900 block">
            ₹{totalCollected.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold block">
            ✓ 0% Default / On-time Track Record
          </span>
        </Card>

        <Card className="p-5 space-y-2">
          <span className="text-xs text-charcoal-500 uppercase font-semibold">November 2026 Collection</span>
          <span className="font-display font-extrabold text-2xl text-emerald-700 block">
            ₹24,000 / ₹24,000
          </span>
          <span className="text-[11px] text-charcoal-500 block">
            Settled via Direct AutoPay
          </span>
        </Card>

        <Card className="p-5 space-y-2">
          <span className="text-xs text-charcoal-500 uppercase font-semibold">Upcoming Due Date</span>
          <span className="font-display font-extrabold text-2xl text-charcoal-900 block">
            5th Dec 2026
          </span>
          <span className="text-[11px] text-charcoal-500 block">
            Scheduled automatic tenant debit
          </span>
        </Card>
      </div>

      {/* Ledger Table */}
      <Card className="p-6 space-y-4">
        <h3 className="font-display font-bold text-base text-charcoal-900">
          Remittance Records & Receipts
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-charcoal-200 text-charcoal-500 font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-2">Period</th>
                <th className="pb-3">Receipt ID</th>
                <th className="pb-3">Payer (Primary Tenant)</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Method</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Action</th>
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
                  <td className="py-3.5 text-charcoal-600">{p.paymentMethod || 'UPI AutoPay'}</td>
                  <td className="py-3.5">
                    <Badge variant="success" size="sm">CREDITED</Badge>
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-charcoal-200 hover:bg-white text-charcoal-700 text-xs font-semibold shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-sage-600" />
                      <span>Download Receipt</span>
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
