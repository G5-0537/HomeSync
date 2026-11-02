import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Calculator, Sparkles, Check, Info } from 'lucide-react';

interface MoveInCostCalculatorProps {
  monthlyRent: number;
  securityDeposit: number;
}

export const MoveInCostCalculator: React.FC<MoveInCostCalculatorProps> = ({
  monthlyRent,
  securityDeposit,
}) => {
  const [roommateCount, setRoommateCount] = useState<number>(4);

  // Traditional broker fee in India is usually 1 to 2 months rent
  const traditionalBrokerageSaved = monthlyRent;
  const totalMoveIn = monthlyRent + securityDeposit;
  const perPersonTotal = Math.round(totalMoveIn / roommateCount);
  const perPersonRent = Math.round(monthlyRent / roommateCount);
  const perPersonDeposit = Math.round(securityDeposit / roommateCount);

  return (
    <Card className="p-5 bg-ivory-50 border-charcoal-200">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-charcoal-200/60">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-sage-600" />
          <h4 className="font-display font-bold text-sm text-charcoal-900">
            Move-In Cost Transparency
          </h4>
        </div>
        <Badge variant="brokerage">
          ₹0 BROKERAGE GUARANTEE
        </Badge>
      </div>

      {/* Roommate count selector */}
      <div className="mb-4 bg-white p-3 rounded-xl border border-charcoal-100">
        <label className="text-xs font-semibold text-charcoal-700 block mb-1.5">
          Divide Between Roommates:
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => setRoommateCount(num)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                roommateCount === num
                  ? 'bg-sage-600 text-white shadow-xs'
                  : 'bg-ivory-100 text-charcoal-600 hover:bg-ivory-200'
              }`}
            >
              {num} {num === 1 ? 'Person' : 'People'}
            </button>
          ))}
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between py-1 border-b border-charcoal-100">
          <span className="text-charcoal-600">First Month's Rent:</span>
          <span className="font-semibold text-charcoal-900">₹{monthlyRent.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-charcoal-100">
          <span className="text-charcoal-600">Refundable Security Deposit:</span>
          <span className="font-semibold text-charcoal-900">₹{securityDeposit.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-charcoal-100 bg-emerald-50/70 p-2 rounded-lg">
          <span className="text-emerald-900 font-medium flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            HomeSync Brokerage Fee:
          </span>
          <div className="text-right">
            <span className="line-through text-charcoal-400 mr-2 text-[11px]">
              ₹{traditionalBrokerageSaved.toLocaleString('en-IN')}
            </span>
            <span className="font-bold text-emerald-700">₹0 FREE</span>
          </div>
        </div>

        {/* Total calculation */}
        <div className="pt-3 flex items-center justify-between font-display text-sm">
          <span className="font-bold text-charcoal-900">Total Move-In Budget:</span>
          <span className="font-bold text-sage-800 text-base">₹{totalMoveIn.toLocaleString('en-IN')}</span>
        </div>

        {roommateCount > 1 && (
          <div className="p-2.5 rounded-xl bg-sage-100/60 border border-sage-200 mt-2 text-center">
            <p className="text-[11px] text-sage-800">
              Only <strong className="text-sage-900 font-bold text-xs">₹{perPersonTotal.toLocaleString('en-IN')}</strong> per roommate upfront (Rent: ₹{perPersonRent} + Deposit: ₹{perPersonDeposit})
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-charcoal-400">
        <Info className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
        <span>No hidden fees, no broker commission, 100% direct landlord contract.</span>
      </div>
    </Card>
  );
};
