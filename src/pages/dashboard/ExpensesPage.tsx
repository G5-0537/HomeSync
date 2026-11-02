import React, { useState } from 'react';
import { useHousehold } from '../../context/HouseholdContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { localStore } from '../../services/localStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ExpenseModal } from '../../components/dashboard/ExpenseModal';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  Users, 
  Calendar, 
  TrendingUp, 
  Tag, 
  FileCheck,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const ExpensesPage: React.FC = () => {
  const { household, expenses, balances, settlements, refreshData } = useHousehold();
  const { user } = useAuth();
  const { success } = useToast();

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const totalHouseholdExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Filter expenses
  const filteredExpenses = selectedCategoryFilter === 'all'
    ? expenses
    : expenses.filter(e => e.category === selectedCategoryFilter);

  const handleDeleteExpense = (id: string, title: string) => {
    if (window.confirm(`Delete expense "${title}"?`)) {
      localStore.deleteExpense(id);
      success(`Expense "${title}" deleted.`);
      refreshData();
    }
  };

  // Chart data for spending per roommate
  const memberSpentChartData = balances.map(b => ({
    name: b.memberName.split(' ')[0],
    Paid: b.totalPaid,
    Share: b.totalOwed,
  }));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Shared Expense Manager
            </h1>
            <Badge variant="sage">Smart Splits</Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500">
            Track household bills, split equally or by custom amounts, and settle with minimal transactions.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setExpenseModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Add Expense
        </Button>
      </div>

      {/* Smart Settlement Engine Showcase */}
      <Card className="p-6 bg-ivory-50 border-sage-300 shadow-premium space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-charcoal-200/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sage-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-charcoal-900">
                Smart Settlement Engine (Transaction Minimizer)
              </h3>
              <p className="text-xs text-charcoal-500">
                Optimal debt resolution algorithm reducing complex multi-way debts into direct peer payments
              </p>
            </div>
          </div>
          <Badge variant="brokerage">ALGORITHM VERIFIED</Badge>
        </div>

        {/* Member Balances Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {balances.map(b => {
            const isOwed = b.netBalance > 0;
            const isOwing = b.netBalance < 0;
            return (
              <div key={b.memberUid} className="p-3.5 rounded-xl bg-white dark:bg-charcoal-800 border border-charcoal-200/80 dark:border-charcoal-700 shadow-2xs space-y-1">
                <div className="flex items-center gap-2">
                  <img src={b.avatar} alt={b.memberName} className="w-6 h-6 rounded-full object-cover" />
                  <span className="font-semibold text-xs text-charcoal-900 dark:text-white truncate">{b.memberName}</span>
                </div>
                <div className="pt-1">
                  <span className="text-[10px] text-charcoal-400 block">Net Position</span>
                  <span className={`font-display font-bold text-base ${
                    isOwed ? 'text-sage-700 dark:text-sage-400' : isOwing ? 'text-red-600 dark:text-red-400' : 'text-charcoal-600 dark:text-charcoal-300'
                  }`}>
                    {isOwed ? '+' : ''}₹{Math.abs(b.netBalance).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-charcoal-400 block">
                    (Paid ₹{b.totalPaid} • Share ₹{b.totalOwed})
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Suggested Minimal Transactions */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
            Suggested Minimal Settlements:
          </h4>
          {settlements.length === 0 ? (
            <p className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              ✨ All household balances are currently completely settled!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {settlements.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white dark:bg-charcoal-800 border border-charcoal-200/70 dark:border-charcoal-700 shadow-2xs flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-charcoal-900 dark:text-white">{s.fromName}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />
                    <span className="font-bold text-sage-800 dark:text-sage-300">{s.toName}</span>
                  </div>
                  <span className="font-display font-bold text-charcoal-900 dark:text-white text-sm">
                    ₹{s.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Chart: Total Paid vs Fair Share per Roommate */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-charcoal-900">Roommate Expenditure Distribution</h3>
            <p className="text-xs text-charcoal-500">Amount paid vs required share across all expenses</p>
          </div>
          <span className="text-xs font-bold text-charcoal-700">
            Total Household: ₹{totalHouseholdExpense.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={memberSpentChartData}>
              <XAxis dataKey="name" stroke="#6C756E" fontSize={12} />
              <YAxis stroke="#6C756E" fontSize={12} tickFormatter={v => `₹${v}`} />
              <Tooltip formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`]} />
              <Bar dataKey="Paid" fill="#4A7C59" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Share" fill="#C7BCE0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Expense History Table */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-display font-bold text-base text-charcoal-900">Expense History & Splits</h3>
          
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-charcoal-500">Category:</span>
            <select
              value={selectedCategoryFilter}
              onChange={e => setSelectedCategoryFilter(e.target.value)}
              className="bg-ivory-50 border border-charcoal-200 text-xs rounded-xl px-2.5 py-1.5 text-charcoal-800"
            >
              <option value="all">All Categories</option>
              <option value="Rent">Rent</option>
              <option value="Groceries">Groceries</option>
              <option value="Electricity">Electricity</option>
              <option value="Internet">Internet</option>
              <option value="Cleaning supplies">Cleaning Supplies</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-charcoal-200 text-charcoal-500 font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-2">Description</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Paid By</th>
                <th className="pb-3">Total Amount</th>
                <th className="pb-3">Per Roommate</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {filteredExpenses.map(exp => (
                <tr key={exp.id} className="hover:bg-ivory-50 transition-colors">
                  <td className="py-3.5 pl-2">
                    <p className="font-semibold text-charcoal-900">{exp.title}</p>
                    {exp.notes && <p className="text-[10px] text-charcoal-400 mt-0.5">{exp.notes}</p>}
                    {exp.receiptUrl && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-sage-700 font-medium mt-0.5">
                        <FileCheck className="w-3 h-3" /> Receipt attached
                      </span>
                    )}
                  </td>
                  <td className="py-3.5">
                    <span className="bg-charcoal-100 text-charcoal-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3.5 font-medium text-charcoal-800">{exp.paidByName}</td>
                  <td className="py-3.5 font-display font-bold text-charcoal-900 text-sm">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 text-charcoal-600">
                    ₹{exp.splits[0]?.amount?.toLocaleString('en-IN') || 0} each ({exp.splits.length} roommates)
                  </td>
                  <td className="py-3.5 text-charcoal-500">{exp.date}</td>
                  <td className="py-3.5 text-right pr-2">
                    <button
                      onClick={() => handleDeleteExpense(exp.id, exp.title)}
                      className="p-1.5 rounded-lg text-charcoal-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
      />
    </div>
  );
};
