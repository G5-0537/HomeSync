import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

/**
 * 1. Smart Settlement Engine Cloud Function
 * Minimizes the number of financial transactions required across roommates.
 */
export const settleBalances = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const { householdId } = data;
  if (!householdId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing householdId.');
  }

  // Retrieve household and expenses
  const householdDoc = await db.collection('households').doc(householdId).get();
  if (!householdDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Household not found.');
  }

  const expensesSnap = await db.collection('expenses')
    .where('householdId', '==', householdId)
    .get();

  const members = householdDoc.data()?.members || [];
  const balanceMap: Record<string, { totalPaid: number; totalOwed: number; name: string }> = {};

  for (const m of members) {
    balanceMap[m.uid] = { totalPaid: 0, totalOwed: 0, name: m.name };
  }

  expensesSnap.forEach(doc => {
    const exp = doc.data();
    if (balanceMap[exp.paidByUid]) {
      balanceMap[exp.paidByUid].totalPaid += exp.amount;
    }
    for (const split of (exp.splits || [])) {
      if (balanceMap[split.memberUid]) {
        balanceMap[split.memberUid].totalOwed += split.amount;
      }
    }
  });

  const creditors: { uid: string; name: string; amount: number }[] = [];
  const debtors: { uid: string; name: string; amount: number }[] = [];

  for (const [uid, b] of Object.entries(balanceMap)) {
    const net = Math.round(b.totalPaid - b.totalOwed);
    if (net > 1) {
      creditors.push({ uid, name: b.name, amount: net });
    } else if (net < -1) {
      debtors.push({ uid, name: b.name, amount: Math.abs(net) });
    }
  }

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements: { fromUid: string; fromName: string; toUid: string; toName: string; amount: number }[] = [];
  let i = 0;
  let j = 0;

  while (i < creditors.length && j < debtors.length) {
    const c = creditors[i];
    const d = debtors[j];
    const amt = Math.min(c.amount, d.amount);

    if (amt >= 1) {
      settlements.push({
        fromUid: d.uid,
        fromName: d.name,
        toUid: c.uid,
        toName: c.name,
        amount: amt,
      });
    }

    c.amount -= amt;
    d.amount -= amt;
    if (c.amount < 1) i++;
    if (d.amount < 1) j++;
  }

  return { success: true, settlements, balanceMap };
});

/**
 * 2. Validate Expense Calculation
 * Server-side financial integrity check.
 */
export const validateExpense = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const { amount, splits } = data;
  if (!amount || amount <= 0 || !Array.isArray(splits) || splits.length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid amount or splits.');
  }

  const sum = splits.reduce((acc: number, s: any) => acc + (Number(s.amount) || 0), 0);
  const diff = Math.abs(sum - amount);

  // Allow minor rounding difference up to 2 currency units
  if (diff > 2) {
    throw new functions.https.HttpsError('failed-precondition', `Splits total (${sum}) does not match expense amount (${amount}).`);
  }

  return { valid: true };
});

/**
 * 3. Fairness Engine: Chore Workload Suggestion
 */
export const calculateFairChoreSchedule = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const { householdId } = data;
  const choresSnap = await db.collection('chores').where('householdId', '==', householdId).get();
  const householdDoc = await db.collection('households').doc(householdId).get();

  const members = householdDoc.data()?.members || [];
  const pointsMap: Record<string, number> = {};
  for (const m of members) pointsMap[m.uid] = 0;

  choresSnap.forEach(doc => {
    const chore = doc.data();
    if (chore.status === 'completed' && pointsMap[chore.assignedToUid] !== undefined) {
      pointsMap[chore.assignedToUid] += chore.points || 15;
    }
  });

  const sortedMembers = [...members].sort((a, b) => (pointsMap[a.uid] || 0) - (pointsMap[b.uid] || 0));
  const suggestedAssignee = sortedMembers[0] || members[0];

  return { suggestedAssignee, pointsMap };
});

/**
 * 4. HomeSync AI Assistant: Server-side Gemini API with Tool Calling
 */
export const homesyncAiAssistant = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const { householdId, userPrompt } = data;
  if (!householdId || !userPrompt) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing householdId or userPrompt.');
  }

  // Retrieve household context safely
  const householdDoc = await db.collection('households').doc(householdId).get();
  if (!householdDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Household not found.');
  }

  // In production, Gemini API is called here with tools:
  // getHouseholdSummary, createExpense, calculateExpenseSplit, getMemberBalances, getInventory, getChoreSchedule
  return {
    reply: `HomeSync AI processed request for household ${householdDoc.data()?.propertyName}.`,
    authenticatedUid: context.auth.uid,
    timestamp: new Date().toISOString()
  };
});
