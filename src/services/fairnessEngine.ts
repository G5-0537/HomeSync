import { 
  Expense, 
  HouseholdMember, 
  MemberBalance, 
  SettlementSuggestion, 
  ChoreItem, 
  ChoreLeaderboard 
} from '../types';

/**
 * Calculates net balances for all members based on expenses and settlements.
 * Positive balance = Member is owed money (creditor).
 * Negative balance = Member owes money (debtor).
 */
export function calculateBalances(
  members: HouseholdMember[],
  expenses: Expense[]
): MemberBalance[] {
  const balanceMap = new Map<string, { totalPaid: number; totalOwed: number }>();

  // Initialize for all members
  for (const m of members) {
    balanceMap.set(m.uid, { totalPaid: 0, totalOwed: 0 });
  }

  // Aggregate expenses
  for (const exp of expenses) {
    const paidBy = exp.paidByUid;
    const currentPayer = balanceMap.get(paidBy) || { totalPaid: 0, totalOwed: 0 };
    currentPayer.totalPaid += exp.amount;
    balanceMap.set(paidBy, currentPayer);

    for (const split of exp.splits) {
      const debtor = balanceMap.get(split.memberUid) || { totalPaid: 0, totalOwed: 0 };
      debtor.totalOwed += split.amount;
      balanceMap.set(split.memberUid, debtor);
    }
  }

  return members.map(m => {
    const b = balanceMap.get(m.uid) || { totalPaid: 0, totalOwed: 0 };
    return {
      memberUid: m.uid,
      memberName: m.name,
      avatar: m.avatar,
      totalPaid: Math.round(b.totalPaid),
      totalOwed: Math.round(b.totalOwed),
      netBalance: Math.round(b.totalPaid - b.totalOwed),
    };
  });
}

/**
 * Smart Settlement Engine:
 * Minimizes the number of financial transactions required across roommates.
 * Implements an optimal greedy matching algorithm between maximum creditors and maximum debtors.
 */
export function calculateOptimalSettlements(
  balances: MemberBalance[]
): SettlementSuggestion[] {
  // Separate into debtors (net < 0) and creditors (net > 0)
  const creditors: { uid: string; name: string; amount: number }[] = [];
  const debtors: { uid: string; name: string; amount: number }[] = [];

  for (const b of balances) {
    if (b.netBalance > 1) {
      creditors.push({ uid: b.memberUid, name: b.memberName, amount: b.netBalance });
    } else if (b.netBalance < -1) {
      debtors.push({ uid: b.memberUid, name: b.memberName, amount: Math.abs(b.netBalance) });
    }
  }

  // Sort descending
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const suggestions: SettlementSuggestion[] = [];

  let i = 0; // creditor index
  let j = 0; // debtor index

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const settledAmount = Math.min(creditor.amount, debtor.amount);
    if (settledAmount >= 1) {
      suggestions.push({
        fromUid: debtor.uid,
        fromName: debtor.name,
        toUid: creditor.uid,
        toName: creditor.name,
        amount: Math.round(settledAmount),
      });
    }

    creditor.amount -= settledAmount;
    debtor.amount -= settledAmount;

    if (creditor.amount < 1) i++;
    if (debtor.amount < 1) j++;
  }

  return suggestions;
}

/**
 * Chore Fairness Engine:
 * Balances household responsibilities based on difficulty, points, and past completion.
 */
export function calculateChoreLeaderboard(
  members: HouseholdMember[],
  chores: ChoreItem[]
): ChoreLeaderboard[] {
  const memberStats = new Map<string, {
    completedChores: number;
    totalPoints: number;
    streak: number;
    assignedPending: number;
  }>();

  for (const m of members) {
    memberStats.set(m.uid, {
      completedChores: 0,
      totalPoints: 0,
      streak: 3, // baseline friendly streak
      assignedPending: 0
    });
  }

  for (const c of chores) {
    const stats = memberStats.get(c.assignedToUid);
    if (!stats) continue;

    if (c.status === 'completed') {
      stats.completedChores += 1;
      stats.totalPoints += c.points || 15;
      stats.streak = (c.streakCount || 1) + 1;
    } else {
      stats.assignedPending += 1;
    }
  }

  return members.map(m => {
    const s = memberStats.get(m.uid) || { completedChores: 0, totalPoints: 0, streak: 1, assignedPending: 0 };
    // Workload score: lower score means they have done less recently and should take next chore!
    const workloadScore = (s.completedChores * 10) + s.totalPoints - (s.assignedPending * 5);
    return {
      memberUid: m.uid,
      memberName: m.name,
      avatar: m.avatar,
      completedChores: s.completedChores,
      totalPoints: s.totalPoints,
      currentStreak: s.streak,
      workloadScore,
    };
  }).sort((a, b) => b.totalPoints - a.totalPoints);
}

/**
 * Suggests the best roommate for a new chore based on lowest current workload
 */
export function suggestFairChoreAssignee(
  members: HouseholdMember[],
  chores: ChoreItem[]
): HouseholdMember {
  const leaderboard = calculateChoreLeaderboard(members, chores);
  // Sort by lowest points/workload
  const sortedAscending = [...leaderboard].sort((a, b) => a.workloadScore - b.workloadScore);
  const targetUid = sortedAscending[0]?.memberUid || members[0]?.uid;
  return members.find(m => m.uid === targetUid) || members[0];
}
