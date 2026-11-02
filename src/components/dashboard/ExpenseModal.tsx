import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useHousehold } from '../../context/HouseholdContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { localStore } from '../../services/localStore';
import { ExpenseCategory, SplitType } from '../../types';
import { Receipt, UploadCloud, Users, Percent, IndianRupee } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose }) => {
  const { household, refreshData } = useHousehold();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Groceries');
  const [paidByUid, setPaidByUid] = useState(user?.uid || household?.members[0]?.uid || '');
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [notes, setNotes] = useState('');
  const [receiptUploaded, setReceiptUploaded] = useState(false);

  const categories: ExpenseCategory[] = [
    'Rent',
    'Groceries',
    'Electricity',
    'Water',
    'Internet',
    'Cleaning supplies',
    'Gas',
    'Maintenance',
    'Miscellaneous'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0) {
      error('Please enter a valid title and positive amount');
      return;
    }

    const payer = household.members.find(m => m.uid === paidByUid) || household.members[0];
    const memberCount = household.members.length;
    const shareAmount = Math.round(numAmount / memberCount);

    const splits = household.members.map(m => ({
      memberUid: m.uid,
      memberName: m.name,
      amount: shareAmount,
      settled: m.uid === paidByUid,
    }));

    localStore.addExpense({
      householdId: household.id,
      title: title.trim(),
      amount: numAmount,
      currency: 'INR',
      category,
      paidByUid: payer.uid,
      paidByName: payer.name,
      splitType,
      splits,
      date: new Date().toISOString().split('T')[0],
      notes: notes.trim() || undefined,
      receiptUrl: receiptUploaded ? 'https://images.unsplash.com/photo-1554415707-9e4466bfe0d0?auto=format&fit=crop&w=600&q=80' : undefined
    });

    localStore.addNotification({
      userId: user?.uid || 'user-aanya',
      householdId: household.id,
      title: 'New Household Expense',
      message: `${payer.name} added ₹${numAmount} for ${title}. Your share: ₹${shareAmount}.`,
      type: 'expense'
    });

    success('Expense added and split among household members!');
    refreshData();
    onClose();

    // Reset fields
    setTitle('');
    setAmount('');
    setNotes('');
    setReceiptUploaded(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Shared Expense"
      subtitle="Record an expense and split it across roommates"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-xs font-semibold text-charcoal-700 block mb-1">Expense Description</label>
          <input
            type="text"
            required
            placeholder="e.g. Weekly pantry & organic dairy"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-white border border-charcoal-200 rounded-xl px-3.5 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
          />
        </div>

        {/* Amount & Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">Total Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400 font-semibold text-sm">₹</span>
              <input
                type="number"
                required
                min="1"
                step="any"
                placeholder="1200"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-white border border-charcoal-200 rounded-xl pl-8 pr-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as ExpenseCategory)}
              className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Paid By */}
        <div>
          <label className="text-xs font-semibold text-charcoal-700 block mb-1">Paid By</label>
          <select
            value={paidByUid}
            onChange={e => setPaidByUid(e.target.value)}
            className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
          >
            {household?.members.map(m => (
              <option key={m.uid} value={m.uid}>{m.name} {m.uid === user?.uid ? '(You)' : ''}</option>
            ))}
          </select>
        </div>

        {/* Split Method */}
        <div>
          <label className="text-xs font-semibold text-charcoal-700 block mb-1.5">Split Breakdown</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSplitType('equal')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                splitType === 'equal'
                  ? 'bg-sage-600 text-white border-sage-600'
                  : 'bg-white border-charcoal-200 text-charcoal-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Equal 4-Way ({amount ? `₹${Math.round(Number(amount) / (household?.members.length || 4))}/ea` : '25% ea'})
            </button>
            <button
              type="button"
              onClick={() => setSplitType('percentage')}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                splitType === 'percentage'
                  ? 'bg-sage-600 text-white border-sage-600'
                  : 'bg-white border-charcoal-200 text-charcoal-700'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              Custom %
            </button>
          </div>
        </div>

        {/* Receipt simulation */}
        <div>
          <label className="text-xs font-semibold text-charcoal-700 block mb-1">Receipt Attachment</label>
          <div
            onClick={() => setReceiptUploaded(!receiptUploaded)}
            className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
              receiptUploaded
                ? 'border-sage-500 bg-sage-50 text-sage-800'
                : 'border-charcoal-200 hover:border-charcoal-400 bg-white text-charcoal-500'
            }`}
          >
            <UploadCloud className="w-5 h-5 mx-auto mb-1 opacity-70" />
            <p className="text-xs font-medium">
              {receiptUploaded ? '✓ Receipt verified & attached' : 'Click to attach receipt / invoice photo'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 flex items-center justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Add Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
};
