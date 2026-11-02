import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHousehold } from '../../context/HouseholdContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ExpenseModal } from '../../components/dashboard/ExpenseModal';
import { ChoreModal } from '../../components/dashboard/ChoreModal';
import { InventoryModal } from '../../components/dashboard/InventoryModal';
import { 
  Building, 
  CreditCard, 
  Receipt, 
  CheckSquare, 
  PackageOpen, 
  ShieldCheck, 
  Users, 
  Plus, 
  ArrowUpRight, 
  AlertCircle, 
  Sparkles,
  Bot,
  FileText,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Clock
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const DashboardOverviewPage: React.FC = () => {
  const { 
    household, 
    expenses, 
    inventory, 
    chores, 
    balances, 
    settlements, 
    agreement, 
    deposit,
    rentPayments
  } = useHousehold();
  const { user } = useAuth();

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [choreModalOpen, setChoreModalOpen] = useState(false);
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);

  // Compute metrics
  const totalExpenditure = expenses.reduce((sum, e) => sum + e.amount, 0);
  const userBalance = balances.find(b => b.memberUid === user?.uid);
  const pendingChores = chores.filter(c => c.status === 'pending');
  const lowStockItems = inventory.filter(i => i.quantity <= i.minThreshold);
  const latestRentPayment = rentPayments[0];

  // Category chart data
  const categoryMap = new Map<string, number>();
  expenses.forEach(e => {
    categoryMap.set(e.category, (categoryMap.get(e.category) || 0) + e.amount);
  });
  const chartData = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  const COLORS = ['#4A7C59', '#8B7BB5', '#3B684A', '#AA98CF', '#E2ECE4', '#C7BCE0', '#729F7B', '#F4EFE6'];

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-charcoal-800 p-6 rounded-xl border border-charcoal-200/80 dark:border-charcoal-700 shadow-subtle transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sage-700 dark:text-sage-400 uppercase tracking-wider">Household Hub</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Badge variant="sage" size="sm">Active Lease</Badge>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white tracking-tight">
            {household?.propertyName}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 mt-1">
            {household?.propertyAddress}
          </p>
        </div>

        {/* Roommates bar */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-charcoal-800 dark:text-ivory-100">{household?.members.length} Roommates</p>
            <p className="text-[10px] text-charcoal-400 dark:text-charcoal-400">Rent Split: 25% each</p>
          </div>
          <div className="flex -space-x-2">
            {household?.members.map(m => (
              <img
                key={m.uid}
                src={m.avatar}
                alt={m.name}
                title={`${m.name} (${m.role})`}
                className={`w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-charcoal-800 shadow-xs ${
                  m.uid === user?.uid ? 'ring-sage-500' : ''
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setExpenseModalOpen(true)}
          className="flex items-center justify-center gap-2 p-3.5 bg-sage-600 hover:bg-sage-700 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-subtle transition-all active:scale-98"
        >
          <Receipt className="w-4 h-4" />
          <span>Add Expense</span>
        </button>

        <button
          onClick={() => setChoreModalOpen(true)}
          className="flex items-center justify-center gap-2 p-3.5 bg-white dark:bg-charcoal-800 hover:bg-ivory-50 dark:hover:bg-charcoal-700 text-charcoal-800 dark:text-ivory-100 border border-charcoal-200/80 dark:border-charcoal-700 rounded-xl font-semibold text-xs sm:text-sm shadow-subtle transition-all active:scale-98"
        >
          <CheckSquare className="w-4 h-4 text-sage-600 dark:text-sage-400" />
          <span>Assign Chore</span>
        </button>

        <button
          onClick={() => setInventoryModalOpen(true)}
          className="flex items-center justify-center gap-2 p-3.5 bg-white dark:bg-charcoal-800 hover:bg-ivory-50 dark:hover:bg-charcoal-700 text-charcoal-800 dark:text-ivory-100 border border-charcoal-200/80 dark:border-charcoal-700 rounded-xl font-semibold text-xs sm:text-sm shadow-subtle transition-all active:scale-98"
        >
          <PackageOpen className="w-4 h-4 text-lavender-600 dark:text-lavender-400" />
          <span>Add Pantry Item</span>
        </button>

        <Link
          to="/dashboard/agreement"
          className="flex items-center justify-center gap-2 p-3.5 bg-white dark:bg-charcoal-800 hover:bg-ivory-50 dark:hover:bg-charcoal-700 text-charcoal-800 dark:text-ivory-100 border border-charcoal-200/80 dark:border-charcoal-700 rounded-xl font-semibold text-xs sm:text-sm shadow-subtle transition-all active:scale-98"
        >
          <FileText className="w-4 h-4 text-charcoal-500 dark:text-charcoal-400" />
          <span>View Lease Agreement</span>
        </Link>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Monthly Rent */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between text-charcoal-500 dark:text-charcoal-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Monthly Rent</span>
            <CreditCard className="w-4 h-4 text-sage-600 dark:text-sage-400" />
          </div>
          <div>
            <span className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">
              ₹{household?.monthlyRent.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-charcoal-400 block mt-0.5">
              Due on the {household?.rentDueDayOfMonth}th of each month
            </span>
          </div>
          <div className="pt-2 border-t border-charcoal-100 dark:border-charcoal-700 flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              November Paid
            </span>
            <Link to="/dashboard/rent" className="text-sage-700 dark:text-sage-400 hover:underline">
              Receipts →
            </Link>
          </div>
        </Card>

        {/* Stat 2: Your Balance */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between text-charcoal-500 dark:text-charcoal-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Your Balance</span>
            <Receipt className="w-4 h-4 text-sage-600 dark:text-sage-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className={`font-display font-extrabold text-2xl ${
                (userBalance?.netBalance || 0) >= 0 ? 'text-sage-700 dark:text-sage-400' : 'text-amber-700 dark:text-amber-400'
              }`}>
                {(userBalance?.netBalance || 0) >= 0 ? '+' : ''}₹{Math.abs(userBalance?.netBalance || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-xs text-charcoal-400 block mt-0.5">
              {(userBalance?.netBalance || 0) >= 0 ? 'You are owed money' : 'You owe roommates'}
            </span>
          </div>
          <div className="pt-2 border-t border-charcoal-100 dark:border-charcoal-700 flex items-center justify-between text-[11px]">
            <span className="text-charcoal-600 dark:text-charcoal-400">Total Spent: ₹{totalExpenditure.toLocaleString('en-IN')}</span>
            <Link to="/dashboard/expenses" className="text-sage-700 dark:text-sage-400 hover:underline">
              Splits →
            </Link>
          </div>
        </Card>

        {/* Stat 3: Deposit Status */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between text-charcoal-500 dark:text-charcoal-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Security Deposit</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <span className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">
              ₹{deposit?.amount.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-charcoal-400 block mt-0.5">
              Status: <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">{deposit?.status}</strong> (Simulated Escrow)
            </span>
          </div>
          <div className="pt-2 border-t border-charcoal-100 dark:border-charcoal-700 flex items-center justify-between text-[11px]">
            <span className="text-charcoal-600 dark:text-charcoal-400">Inspection: Signed</span>
            <Link to="/dashboard/deposit" className="text-sage-700 dark:text-sage-400 hover:underline">
              Wallet →
            </Link>
          </div>
        </Card>

        {/* Stat 4: Chores & Pantry */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Household Queue</span>
            <Clock className="w-4 h-4 text-lavender-600" />
          </div>
          <div>
            <span className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">
              {pendingChores.length} Chores
            </span>
            <span className="text-xs text-charcoal-400 block mt-0.5">
              {lowStockItems.length} pantry items running low
            </span>
          </div>
          <div className="pt-2 border-t border-charcoal-100 dark:border-charcoal-700 flex flex-wrap items-center justify-between gap-1 text-[11px]">
            <span className="text-amber-700 dark:text-amber-400 font-semibold inline-block">Replenishment Active</span>
            <Link to="/dashboard/chores" className="text-sage-700 dark:text-sage-400 hover:underline shrink-0 ml-auto">
              Schedule →
            </Link>
          </div>
        </Card>
      </div>

      {/* Main Grid: Expenses Chart & Optimal Settlements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Spending Breakdown & Recent Log */}
        <Card className="lg:col-span-2 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white">Monthly Expense Breakdown</h3>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400">Category split for November 2026</p>
            </div>
            <Link to="/dashboard/expenses" className="text-xs font-semibold text-sage-700 dark:text-sage-400 hover:underline">
              Full Ledger →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            {/* Pie Chart */}
            <div className="h-48 w-full sm:col-span-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      fontSize: '12px', 
                      backgroundColor: '#1E221F', 
                      borderColor: '#373E39',
                      color: '#FAF7F2' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category breakdown pill list */}
            <div className="sm:col-span-2 space-y-2">
              {chartData.slice(0, 4).map((c, idx) => (
                <div key={c.name} className="flex items-center justify-between p-2 rounded-lg bg-ivory-50 dark:bg-charcoal-700/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="font-medium text-charcoal-800 dark:text-ivory-100">{c.name}</span>
                  </div>
                  <span className="font-semibold text-charcoal-900 dark:text-white">₹{c.value.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Right (1 col): Smart Settlement Engine Summary */}
        <Card className="p-6 space-y-4 border-sage-200 dark:border-charcoal-700">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white">Smart Settlements</h3>
            <Badge variant="sage" size="sm">MINIMIZER</Badge>
          </div>
          <p className="text-xs text-charcoal-500 dark:text-charcoal-400 leading-relaxed">
            HomeSync calculates the minimum transactions needed to clear all household debts:
          </p>

          <div className="space-y-2.5 pt-1">
            {settlements.length === 0 ? (
              <p className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                ✨ All roommate balances are fully squared up!
              </p>
            ) : (
              settlements.map((s, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-ivory-50 dark:bg-charcoal-700/60 border border-charcoal-200/60 dark:border-charcoal-600 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-charcoal-900 dark:text-white">{s.fromName}</span>
                    <span className="text-charcoal-400 text-[10px]">pays</span>
                    <span className="font-bold text-sage-800 dark:text-sage-400">{s.toName}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-charcoal-100 dark:border-charcoal-600">
                    <span className="text-[11px] text-charcoal-500 dark:text-charcoal-400">Amount:</span>
                    <span className="font-bold text-charcoal-900 dark:text-white text-sm">₹{s.amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link to="/dashboard/expenses" className="block pt-2">
            <Button variant="outline" size="sm" className="w-full">
              Settle Balances
            </Button>
          </Link>
        </Card>
      </div>

      {/* Two Columns: Upcoming Chores & Low-Stock Pantry Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chores */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white">Upcoming Chores</h3>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400">Balanced by HomeSync Fairness Engine</p>
            </div>
            <Link to="/dashboard/chores" className="text-xs font-semibold text-sage-700 dark:text-sage-400 hover:underline">
              All Chores →
            </Link>
          </div>

          <div className="space-y-2.5">
            {chores.slice(0, 3).map(chore => (
              <div
                key={chore.id}
                className="p-3 rounded-lg bg-ivory-50 dark:bg-charcoal-700/60 border border-charcoal-100 dark:border-charcoal-600 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={chore.assignedAvatar}
                    alt={chore.assignedToName}
                    className="w-7 h-7 rounded-full object-cover border border-sage-300"
                  />
                  <div>
                    <p className={`font-semibold text-charcoal-900 dark:text-white ${chore.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                      {chore.title}
                    </p>
                    <p className="text-[10px] text-charcoal-400">
                      Assigned to {chore.assignedToName} • Due: {chore.dueDate}
                    </p>
                  </div>
                </div>
                <Badge variant={chore.status === 'completed' ? 'success' : 'sage'} size="sm">
                  {chore.status === 'completed' ? 'Done' : `+${chore.points} pts`}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Low-Stock Pantry Alerts */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white">Pantry & Supplies</h3>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400">Smart replenishment alerts</p>
            </div>
            <Link to="/dashboard/inventory" className="text-xs font-semibold text-sage-700 dark:text-sage-400 hover:underline">
              Pantry Hub →
            </Link>
          </div>

          <div className="space-y-2.5">
            {inventory.slice(0, 3).map(item => {
              const isLow = item.quantity <= item.minThreshold;
              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                    isLow 
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200' 
                      : 'bg-ivory-50 dark:bg-charcoal-700/60 border-charcoal-100 dark:border-charcoal-600 text-charcoal-800 dark:text-ivory-100'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-charcoal-900 dark:text-white">{item.name}</p>
                    <p className="text-[10px] text-charcoal-500 dark:text-charcoal-400 mt-0.5">
                      Stock: {item.quantity} {item.unit} (Min: {item.minThreshold} {item.unit})
                      {item.claimedByName ? ` • Claimed by ${item.claimedByName}` : ''}
                    </p>
                  </div>
                  <Badge variant={isLow ? 'warning' : 'sage'} size="sm">
                    {isLow ? 'Low Stock' : 'In Stock'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Modals */}
      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
      />
      <ChoreModal
        isOpen={choreModalOpen}
        onClose={() => setChoreModalOpen(false)}
      />
      <InventoryModal
        isOpen={inventoryModalOpen}
        onClose={() => setInventoryModalOpen(false)}
      />
    </div>
  );
};
