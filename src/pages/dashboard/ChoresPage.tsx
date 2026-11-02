import React, { useState } from 'react';
import { useHousehold } from '../../context/HouseholdContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { localStore } from '../../services/localStore';
import { calculateChoreLeaderboard } from '../../services/fairnessEngine';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ChoreModal } from '../../components/dashboard/ChoreModal';
import { 
  CheckSquare, 
  Plus, 
  Award, 
  Flame, 
  Sparkles, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Circle,
  Trophy,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ChoresPage: React.FC = () => {
  const { household, chores, refreshData } = useHousehold();
  const { user } = useAuth();
  const { success } = useToast();

  const [choreModalOpen, setChoreModalOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<'pending' | 'completed' | 'all'>('pending');

  const leaderboard = calculateChoreLeaderboard(household.members, chores);

  const handleToggleComplete = (choreId: string, choreTitle: string, currentStatus: string) => {
    localStore.toggleChoreComplete(choreId, user?.uid || 'user-aanya');
    if (currentStatus !== 'completed') {
      confetti({
        particleCount: 70,
        spread: 50,
        origin: { y: 0.6 }
      });
      success(`Chore completed! Points and streak updated for your household.`);
    } else {
      success(`Chore marked as pending.`);
    }
    refreshData();
  };

  const filteredChores = chores.filter(c => {
    if (filterTab === 'pending') return c.status === 'pending';
    if (filterTab === 'completed') return c.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Chores & Responsibility Fairness
            </h1>
            <Badge variant="sage">Fairness Engine Active</Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500">
            Intelligently distributed household tasks based on effort difficulty, duration, and personal workloads.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setChoreModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Assign New Chore
        </Button>
      </div>

      {/* Gamified Weekly Fairness Leaderboard */}
      <Card className="p-6 bg-ivory-50 border-sage-300 shadow-premium space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-charcoal-200/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-charcoal-900">
                Weekly Household Fairness Leaderboard
              </h3>
              <p className="text-xs text-charcoal-500">
                Tracks completed tasks, effort points, and active habit streaks
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-sage-800 bg-sage-100 px-2.5 py-1 rounded-full border border-sage-200">
            Cooperative Living
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {leaderboard.map((item, idx) => (
            <div
              key={item.memberUid}
              className={`p-4 rounded-xl bg-white dark:bg-charcoal-800 border shadow-2xs relative overflow-hidden transition-all ${
                idx === 0 ? 'border-amber-300 ring-2 ring-amber-100 dark:ring-amber-950/40' : 'border-charcoal-200/80 dark:border-charcoal-700'
              }`}
            >
              {idx === 0 && (
                <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  <Award className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  #1 Leader
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <img src={item.avatar} alt={item.memberName} className="w-9 h-9 rounded-full object-cover border border-charcoal-200 dark:border-charcoal-700" />
                <div>
                  <h4 className="font-bold text-xs text-charcoal-900 dark:text-white">{item.memberName}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400 font-semibold mt-0.5">
                    <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{item.currentStreak} Day Streak</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-charcoal-100 dark:border-charcoal-700 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-charcoal-400 block">Total Points</span>
                  <span className="font-display font-extrabold text-charcoal-900 dark:text-white text-sm">
                    {item.totalPoints} pts
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-charcoal-400 block">Completed</span>
                  <span className="font-semibold text-charcoal-700 dark:text-charcoal-300 text-xs">
                    {item.completedChores} tasks
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Chore List & Filter Tabs */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-charcoal-100">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-ivory-50 p-1 rounded-xl border border-charcoal-200/60 self-start">
            <button
              onClick={() => setFilterTab('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTab === 'pending'
                  ? 'bg-sage-600 text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              Pending ({chores.filter(c => c.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilterTab('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTab === 'completed'
                  ? 'bg-sage-600 text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              Completed ({chores.filter(c => c.status === 'completed').length})
            </button>
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTab === 'all'
                  ? 'bg-sage-600 text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              All Chores
            </button>
          </div>

          <span className="text-xs text-charcoal-500">
            Click checkbox to mark task completion
          </span>
        </div>

        {/* Chores Cards Grid */}
        <div className="space-y-2.5">
          {filteredChores.length === 0 ? (
            <p className="p-6 text-center text-xs text-charcoal-400">
              No chores in this view. Everything is sparkling clean!
            </p>
          ) : (
            filteredChores.map(chore => {
              const isDone = chore.status === 'completed';
              return (
                <div
                  key={chore.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                    isDone
                      ? 'bg-ivory-50/60 dark:bg-charcoal-800/50 border-charcoal-200/60 dark:border-charcoal-700 opacity-75'
                      : 'bg-white dark:bg-charcoal-800 border-charcoal-200/80 dark:border-charcoal-700 shadow-2xs hover:shadow-subtle'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <button
                      onClick={() => handleToggleComplete(chore.id, chore.title, chore.status)}
                      className="p-1 text-charcoal-400 hover:text-sage-600 transition-colors"
                      title={isDone ? 'Mark as pending' : 'Mark as completed'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-charcoal-300 dark:text-charcoal-600 hover:text-sage-600" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-xs sm:text-sm text-charcoal-900 dark:text-white ${isDone ? 'line-through text-charcoal-500 dark:text-charcoal-400' : ''}`}>
                          {chore.title}
                        </span>
                        <span className="text-[10px] font-semibold bg-charcoal-100 dark:bg-charcoal-700 text-charcoal-600 dark:text-charcoal-300 px-2 py-0.5 rounded-md">
                          {chore.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-charcoal-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Due: {chore.dueDate}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> ~{chore.estimatedMinutes} mins
                        </span>
                        {chore.recurring !== 'none' && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{chore.recurring}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Assignee pill */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <img
                        src={chore.assignedAvatar}
                        alt={chore.assignedToName}
                        className="w-6 h-6 rounded-full object-cover border border-sage-300"
                      />
                      <span className="text-xs font-semibold text-charcoal-800 hidden sm:inline">
                        {chore.assignedToName}
                      </span>
                    </div>

                    <Badge variant={isDone ? 'success' : 'sage'} size="sm">
                      +{chore.points} pts
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      <ChoreModal
        isOpen={choreModalOpen}
        onClose={() => setChoreModalOpen(false)}
      />
    </div>
  );
};
