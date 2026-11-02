import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useHousehold } from '../../context/HouseholdContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { localStore } from '../../services/localStore';
import { suggestFairChoreAssignee } from '../../services/fairnessEngine';
import { ChoreDifficulty, ChoreItem } from '../../types';
import { Sparkles, Calendar, Clock, Award, Users } from 'lucide-react';

interface ChoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChoreModal: React.FC<ChoreModalProps> = ({ isOpen, onClose }) => {
  const { household, chores, refreshData } = useHousehold();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ChoreItem['category']>('Cleaning');
  const [assignedToUid, setAssignedToUid] = useState(household?.members[0]?.uid || '');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [difficulty, setDifficulty] = useState<ChoreDifficulty>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState(20);
  const [recurring, setRecurring] = useState<ChoreItem['recurring']>('weekly');

  const difficultyPoints = {
    easy: 10,
    medium: 20,
    hard: 35
  };

  const handleSuggestFairAssignee = () => {
    const fairPerson = suggestFairChoreAssignee(household.members, chores);
    setAssignedToUid(fairPerson.uid);
    success(`Fairness Engine selected ${fairPerson.name} based on current lowest chore workload!`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      error('Please enter a chore title');
      return;
    }

    const assignee = household.members.find(m => m.uid === assignedToUid) || household.members[0];

    localStore.addChore({
      householdId: household.id,
      title: title.trim(),
      category,
      assignedToUid: assignee.uid,
      assignedToName: assignee.name,
      assignedAvatar: assignee.avatar,
      dueDate,
      estimatedMinutes: Number(estimatedMinutes) || 20,
      difficulty,
      points: difficultyPoints[difficulty],
      recurring,
      status: 'pending'
    });

    localStore.addNotification({
      userId: assignee.uid,
      householdId: household.id,
      title: 'New Chore Assigned',
      message: `You've been assigned: "${title}" (Due: ${dueDate}, +${difficultyPoints[difficulty]} pts).`,
      type: 'chore'
    });

    success('Chore scheduled and assigned successfully!');
    refreshData();
    onClose();

    setTitle('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Household Chore"
      subtitle="Assign tasks with intelligent workload fairness balancing"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-charcoal-700 block mb-1">Chore Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Deep clean kitchen counters & wipe stovetop"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-white border border-charcoal-200 rounded-xl px-3.5 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
            >
              <option value="Cleaning">Cleaning</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Bathroom">Bathroom</option>
              <option value="Dishwashing">Dishwashing</option>
              <option value="Laundry">Laundry</option>
              <option value="Garbage">Garbage</option>
              <option value="Groceries">Groceries</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">Due Date</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
            />
          </div>
        </div>

        {/* Fairness Assignee Box */}
        <div className="bg-sage-50/60 p-3.5 rounded-xl border border-sage-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-sage-900 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sage-700" />
              Assign To Roommate
            </label>
            <button
              type="button"
              onClick={handleSuggestFairAssignee}
              className="text-[11px] font-bold text-sage-700 hover:text-sage-900 flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-sage-300 shadow-2xs hover:bg-sage-100 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-sage-600" />
              Auto-Pick Fair Assignee
            </button>
          </div>

          <select
            value={assignedToUid}
            onChange={e => setAssignedToUid(e.target.value)}
            className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
          >
            {household?.members.map(m => (
              <option key={m.uid} value={m.uid}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Difficulty & Points */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">Difficulty</label>
            <div className="flex gap-1.5">
              {(['easy', 'medium', 'hard'] as const).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize border ${
                    difficulty === d
                      ? 'bg-sage-600 text-white border-sage-600'
                      : 'bg-white border-charcoal-200 text-charcoal-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">Points Earned</label>
            <div className="flex items-center gap-1.5 px-3 py-2 bg-ivory-100 rounded-xl border border-charcoal-200 text-sm font-bold text-charcoal-800">
              <Award className="w-4 h-4 text-amber-600" />
              <span>+{difficultyPoints[difficulty]} Points</span>
            </div>
          </div>
        </div>

        {/* Recurring */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">Estimated Time</label>
            <input
              type="number"
              min="5"
              step="5"
              value={estimatedMinutes}
              onChange={e => setEstimatedMinutes(Number(e.target.value))}
              className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm text-charcoal-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">Recurring</label>
            <select
              value={recurring}
              onChange={e => setRecurring(e.target.value as any)}
              className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm text-charcoal-900"
            >
              <option value="none">One-time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
            </select>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create Chore
          </Button>
        </div>
      </form>
    </Modal>
  );
};
