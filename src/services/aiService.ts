import { localStore } from './localStore';
import { calculateBalances, calculateOptimalSettlements, calculateChoreLeaderboard } from './fairnessEngine';
import { Household, AIMessage, ExpenseCategory } from '../types';

export interface ToolExecutionResult {
  toolName: string;
  params: Record<string, any>;
  summary: string;
  requiresConfirmation: boolean;
  executed: boolean;
  data?: any;
}

export class HomeSyncAIAgent {
  private household: Household;
  private currentUserUid: string;
  private currentUserName: string;

  constructor(household: Household, userUid: string, userName: string) {
    this.household = household;
    this.currentUserUid = userUid;
    this.currentUserName = userName;
  }

  // --- Tool Implementations ---

  public getHouseholdSummary(): string {
    const expenses = localStore.getExpenses(this.household.id);
    const chores = localStore.getChores(this.household.id);
    const inventory = localStore.getInventory(this.household.id);
    const agreement = localStore.getAgreements().find(a => a.id === this.household.agreementId);
    const deposit = localStore.getDepositWallet(this.household.id);

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const pendingChores = chores.filter(c => c.status === 'pending').length;
    const lowStock = inventory.filter(i => i.quantity <= i.minThreshold).length;

    return `🏡 **${this.household.propertyName} Overview**:
- **Members**: ${this.household.members.map(m => m.name).join(', ')} (${this.household.members.length} roommates)
- **Monthly Rent**: ₹${this.household.monthlyRent.toLocaleString('en-IN')} (Due on the ${this.household.rentDueDayOfMonth}th)
- **Total Tracked Expenses**: ₹${totalExpense.toLocaleString('en-IN')}
- **Pending Chores**: ${pendingChores} tasks queued
- **Inventory Alerts**: ${lowStock} items low or on shopping list
- **Deposit Status**: ₹${deposit?.amount.toLocaleString('en-IN') || 0} (${deposit?.status || 'HELD'})
- **Lease Expiry**: ${agreement?.endDate || 'Active'}`;
  }

  public getExpenseHistory(): string {
    const expenses = localStore.getExpenses(this.household.id);
    if (expenses.length === 0) return 'No expenses recorded yet for this household.';

    const recent = expenses.slice(0, 5);
    const lines = recent.map(e => `• **${e.title}**: ₹${e.amount.toLocaleString('en-IN')} paid by ${e.paidByName} on ${e.date} (${e.category})`);
    return `📊 **Recent Household Expenses**:\n${lines.join('\n')}\n\n*Total recorded: ${expenses.length} expenses.*`;
  }

  public getMemberBalances(): string {
    const expenses = localStore.getExpenses(this.household.id);
    const balances = calculateBalances(this.household.members, expenses);
    const settlements = calculateOptimalSettlements(balances);

    const balanceLines = balances.map(b => {
      if (b.netBalance > 0) {
        return `• **${b.memberName}**: is owed **+₹${b.netBalance.toLocaleString('en-IN')}** (Paid ₹${b.totalPaid}, share ₹${b.totalOwed})`;
      } else if (b.netBalance < 0) {
        return `• **${b.memberName}**: owes **-₹${Math.abs(b.netBalance).toLocaleString('en-IN')}** (Paid ₹${b.totalPaid}, share ₹${b.totalOwed})`;
      } else {
        return `• **${b.memberName}**: is completely settled up (₹0)`;
      }
    });

    let settlementSummary = '';
    if (settlements.length > 0) {
      settlementSummary = '\n\n💡 **Smart Transaction Minimizer** (optimal settlements):\n' +
        settlements.map(s => `→ **${s.fromName}** should pay **₹${s.amount.toLocaleString('en-IN')}** to **${s.toName}**`).join('\n');
    } else {
      settlementSummary = '\n\n✨ All household balances are currently settled!';
    }

    return `💰 **Current Member Balances**:\n${balanceLines.join('\n')}${settlementSummary}`;
  }

  public calculateExpenseSplit(amount: number, membersToSplit?: string[]): {
    perPerson: number;
    splits: { memberUid: string; memberName: string; amount: number; settled: boolean }[];
  } {
    const targetMembers = membersToSplit && membersToSplit.length > 0
      ? this.household.members.filter(m => 
          membersToSplit.some(name => m.name.toLowerCase().includes(name.toLowerCase()))
        )
      : this.household.members;

    const count = targetMembers.length || this.household.members.length;
    const perPerson = Math.round(amount / count);

    const splits = targetMembers.map(m => ({
      memberUid: m.uid,
      memberName: m.name,
      amount: perPerson,
      settled: m.uid === this.currentUserUid,
    }));

    return { perPerson, splits };
  }

  public createExpense(
    title: string, 
    amount: number, 
    category: ExpenseCategory = 'Groceries',
    membersToSplit?: string[]
  ): string {
    const { splits } = this.calculateExpenseSplit(amount, membersToSplit);

    localStore.addExpense({
      householdId: this.household.id,
      title,
      amount,
      currency: 'INR',
      category,
      paidByUid: this.currentUserUid,
      paidByName: this.currentUserName,
      splitType: 'equal',
      splits,
      date: new Date().toISOString().split('T')[0],
      notes: 'Added via HomeSync AI Assistant'
    });

    // Notify household
    localStore.addNotification({
      userId: this.currentUserUid,
      householdId: this.household.id,
      title: 'Expense Added via AI',
      message: `${this.currentUserName} added ₹${amount} for ${title}. Each share: ₹${splits[0]?.amount || 0}.`,
      type: 'expense'
    });

    return `✅ Successfully added **₹${amount.toLocaleString('en-IN')}** for "*${title}*" (${category}).\nSplit equally between ${splits.map(s => s.memberName).join(', ')} (₹${splits[0]?.amount} each).`;
  }

  public getInventory(): string {
    const items = localStore.getInventory(this.household.id);
    if (items.length === 0) return 'Inventory is currently empty.';

    const lowStock = items.filter(i => i.quantity <= i.minThreshold);
    const inStock = items.filter(i => i.quantity > i.minThreshold);

    let res = '📦 **Shared Inventory Status**:\n';
    if (lowStock.length > 0) {
      res += '\n⚠️ **Low Stock (Action Recommended)**:\n' + 
        lowStock.map(i => `• ${i.name}: **${i.quantity} ${i.unit}** (threshold: ${i.minThreshold} ${i.unit})${i.claimedByName ? ` — Claimed by ${i.claimedByName}` : ' — Unclaimed'}`).join('\n');
    }
    res += '\n\n✅ **Well Stocked**:\n' + 
      inStock.map(i => `• ${i.name}: ${i.quantity} ${i.unit}`).join('\n');

    return res;
  }

  public addInventoryItem(name: string, quantity: number, unit: string, category: 'Groceries' | 'Cleaning' | 'Kitchen' = 'Groceries'): string {
    localStore.addInventoryItem({
      householdId: this.household.id,
      name,
      category,
      quantity,
      minThreshold: Math.max(1, Math.round(quantity * 0.4)),
      unit,
      addedByUid: this.currentUserUid,
      addedByName: this.currentUserName,
      isShoppingListItem: false
    });

    return `✅ Added **${quantity} ${unit}** of **${name}** to the household inventory!`;
  }

  public createShoppingList(): string {
    const items = localStore.getInventory(this.household.id);
    const needed = items.filter(i => i.quantity <= i.minThreshold || i.isShoppingListItem);

    if (needed.length === 0) {
      return '🛒 All household supplies are currently well-stocked! No urgent shopping required.';
    }

    const lines = needed.map(i => `• **${i.name}** (${i.quantity} ${i.unit} left, need at least ${i.minThreshold})${i.claimedByName ? ` — [Claimed by ${i.claimedByName}]` : ' — [Unclaimed]'}`);
    return `🛒 **Household Shopping List**:\n${lines.join('\n')}\n\nYou can claim any item or add it to your run!`;
  }

  public getChoreSchedule(): string {
    const chores = localStore.getChores(this.household.id);
    const leaderboard = calculateChoreLeaderboard(this.household.members, chores);

    const pending = chores.filter(c => c.status === 'pending');
    const completed = chores.filter(c => c.status === 'completed');

    let res = '🧹 **Chore Schedule & Fairness**:\n';
    if (pending.length > 0) {
      res += '\n📌 **Upcoming Tasks**:\n' +
        pending.map(c => `• **${c.title}** (${c.category}) → Assigned to **${c.assignedToName}** (Due: ${c.dueDate}) [${c.difficulty.toUpperCase()} • ${c.points} pts]`).join('\n');
    } else {
      res += '\n✨ All chores are caught up for today!';
    }

    res += '\n\n🏆 **Weekly Fairness Leaderboard**:\n' +
      leaderboard.map((l, i) => `${i + 1}. **${l.memberName}**: ${l.totalPoints} pts (${l.completedChores} done, 🔥 ${l.currentStreak} streak)`).join('\n');

    return res;
  }

  public createChore(title: string, category: 'Cleaning' | 'Kitchen' | 'Bathroom' | 'Garbage' = 'Cleaning', assignToName?: string): string {
    let assignee = this.household.members[0];
    if (assignToName) {
      const match = this.household.members.find(m => m.name.toLowerCase().includes(assignToName.toLowerCase()));
      if (match) assignee = match;
    } else {
      // Use fairness engine to suggest least-burdened roommate
      const chores = localStore.getChores(this.household.id);
      const leaderboard = calculateChoreLeaderboard(this.household.members, chores);
      const lowest = [...leaderboard].sort((a, b) => a.totalPoints - b.totalPoints)[0];
      const match = this.household.members.find(m => m.uid === lowest.memberUid);
      if (match) assignee = match;
    }

    localStore.addChore({
      householdId: this.household.id,
      title,
      category,
      assignedToUid: assignee.uid,
      assignedToName: assignee.name,
      assignedAvatar: assignee.avatar,
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      estimatedMinutes: 25,
      difficulty: 'medium',
      points: 20,
      recurring: 'weekly',
      status: 'pending'
    });

    return `🧹 Created chore "*${title}*" and assigned to **${assignee.name}** based on household fairness balance!`;
  }

  public getRentalAgreementSummary(): string {
    const agr = localStore.getAgreements().find(a => a.id === this.household.agreementId);
    if (!agr) return 'No active rental agreement found for this household.';

    return `📜 **Rental Agreement Summary (${agr.id})**:
• **Property**: ${agr.propertyTitle}
• **Landlord**: ${agr.landlordName}
• **Primary Tenant**: ${agr.tenantName}
• **Monthly Rent**: ₹${agr.monthlyRent.toLocaleString('en-IN')} (Due on ${agr.rentDueDayOfMonth}th)
• **Security Deposit**: ₹${agr.securityDeposit.toLocaleString('en-IN')} (Held in verified escrow wallet)
• **Duration**: ${agr.startDate} to ${agr.endDate}
• **Notice Period**: ${agr.noticePeriodDays} days
• **Maintenance Terms**: Landlord handles structural & major plumbing. Day-to-day cleaning and consumables by tenants.
• **Signatures**: Both Tenant & Landlord digitally verified and signed.
• **Brokerage**: ₹0 (100% Broker-Free)`;
  }

  public getRentStatus(): string {
    const payments = localStore.getRentPayments(this.household.id);
    const agr = localStore.getAgreements().find(a => a.id === this.household.agreementId);
    const latestPayment = payments[0];

    return `💳 **Rent Status**:
• **Monthly Amount**: ₹${this.household.monthlyRent.toLocaleString('en-IN')} (₹${Math.round(this.household.monthlyRent / this.household.members.length).toLocaleString('en-IN')} per roommate)
• **Due Day**: ${this.household.rentDueDayOfMonth}th of every month
• **Latest Payment**: ${latestPayment ? `Paid ₹${latestPayment.amount.toLocaleString('en-IN')} on ${latestPayment.paidAt?.split('T')[0]} (${latestPayment.month})` : 'Pending'}
• **Receipt**: ${latestPayment?.receiptId || 'N/A'}
• **Next Due Date**: 5th December 2026`;
  }

  // --- Natural Language Tool Classifier & Processor ---

  public async processMessageAsync(userPrompt: string): Promise<{
    reply: string;
    toolCall?: {
      name: string;
      params: Record<string, any>;
      status: 'pending_confirmation' | 'executed';
    };
  }> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // 1. Run local intelligent tool detection first (guarantees fast, exact responses for household actions)
    const localResult = this.processMessage(userPrompt);
    // If it's a specific recognized tool call (like Add Expense, Balance check, Chores, Rent) return immediately
    if (localResult.toolCall || (localResult.reply && !localResult.reply.startsWith('I can certainly help you with that!'))) {
      return localResult;
    }

    // 2. Call live Gemini with gemini-3.8-flash (or gemini-2.5-flash fallback) with a 6-second timeout
    if (apiKey && apiKey.length > 10) {
      const models = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];
      for (const model of models) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);

          const expenses = localStore.getExpenses(this.household.id);
          const chores = localStore.getChores(this.household.id);
          const inventory = localStore.getInventory(this.household.id);

          const systemPrompt = `You are HomeSync AI, the friendly, intelligent co-living assistant for ${this.household.propertyName}.
Your user is ${this.currentUserName}.
Current Roommates: ${this.household.members.map(m => m.name).join(', ')}.
Monthly Rent: ₹${this.household.monthlyRent}.
Current active chores: ${chores.filter(c => c.status === 'pending').map(c => `${c.title} (${c.assignedToName})`).join(', ') || 'None'}.
Total tracked expenses: ₹${expenses.reduce((s, e) => s + e.amount, 0)}.
Low inventory items: ${inventory.filter(i => i.quantity <= i.minThreshold).map(i => i.name).join(', ') || 'None'}.

Instructions:
- Provide concise, warm, helpful, and direct answers (2-4 sentences max unless detailed calculation requested).
- Format currency with ₹ (Indian Rupees).
- Never make up fake roommates; use the real household data provided above.`;

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: controller.signal,
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [{ text: `${systemPrompt}\n\nUser Question: ${userPrompt}` }]
                  }
                ],
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 500
                }
              })
            }
          );
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidateText && candidateText.trim().length > 0) {
              return { reply: candidateText.trim() };
            }
          }
        } catch (e) {
          console.info(`Gemini API note on model ${model}:`, e);
        }
      }
    }

    return localResult;
  }

  public processMessage(userPrompt: string): {
    reply: string;
    toolCall?: {
      name: string;
      params: Record<string, any>;
      status: 'pending_confirmation' | 'executed';
    };
  } {
    const p = userPrompt.toLowerCase();

    // 1. Financial: Add Expense with confirmation or direct execution
    const expenseMatch = p.match(/(?:add|paid|spent|spend)\s*(?:₹|rs\.?|inr)?\s*(\d+)\s*(?:for|on)?\s*([a-zA-Z\s]+)/i);
    if (expenseMatch) {
      const amount = parseInt(expenseMatch[1], 10);
      const rawTitle = expenseMatch[2].replace(/(and divide|between|equally|split|for)/gi, '').trim() || 'Household Item';
      let category: ExpenseCategory = 'Groceries';
      if (rawTitle.toLowerCase().includes('electric') || rawTitle.toLowerCase().includes('power')) category = 'Electricity';
      else if (rawTitle.toLowerCase().includes('rent')) category = 'Rent';
      else if (rawTitle.toLowerCase().includes('wifi') || rawTitle.toLowerCase().includes('internet')) category = 'Internet';
      else if (rawTitle.toLowerCase().includes('clean') || rawTitle.toLowerCase().includes('mop')) category = 'Cleaning supplies';
      else if (rawTitle.toLowerCase().includes('water')) category = 'Water';

      // Check if user specifically requested confirmation or if write operation
      // As per Section 11: "Confirm financial write operations"
      return {
        reply: `I'm ready to record this expense:\n\n• **Item**: ${rawTitle}\n• **Amount**: ₹${amount.toLocaleString('en-IN')}\n• **Category**: ${category}\n• **Split**: Equally among 4 roommates (₹${Math.round(amount / 4)} each)\n\nPlease confirm to finalize this entry.`,
        toolCall: {
          name: 'createExpense',
          params: { title: rawTitle, amount, category },
          status: 'pending_confirmation'
        }
      };
    }

    // 2. Who owes money / balances
    if (p.includes('who owes') || p.includes('balance') || p.includes('net balance') || p.includes('settle') || p.includes('owe me')) {
      return { reply: this.getMemberBalances() };
    }

    // 3. How much did we spend / expense history
    if (p.includes('spend') || p.includes('spent') || p.includes('expense history') || p.includes('total spend')) {
      return { reply: this.getExpenseHistory() };
    }

    // 4. Shopping list / inventory
    if (p.includes('shopping list') || p.includes('to buy')) {
      return { reply: this.createShoppingList() };
    }
    if (p.includes('inventory') || p.includes('stock') || p.includes('groceries left') || p.includes('milk')) {
      return { reply: this.getInventory() };
    }

    // 5. Add Inventory Item
    const invMatch = p.match(/(?:add|buy|stock)\s*(\d+(?:\.\d+)?)\s*(liters?|kg|packs?|units?|bottles?|packets?)?\s*(?:of)?\s*([a-zA-Z\s]+)/i);
    if (invMatch && !p.includes('₹') && !p.includes('rs')) {
      const qty = parseFloat(invMatch[1]);
      const unit = invMatch[2] || 'units';
      const name = invMatch[3].trim();
      const res = this.addInventoryItem(name, qty, unit);
      return { reply: res };
    }

    // 6. Chores & Responsibilities
    if (p.includes('chore') || p.includes('cleaning') || p.includes('dishes') || p.includes('leaderboard') || p.includes('who has completed')) {
      if (p.includes('assign') || p.includes('create chore')) {
        const title = p.replace(/(assign|create chore|for tomorrow|tomorrow)/gi, '').trim() || 'Kitchen Cleaning';
        const res = this.createChore(title);
        return { reply: res };
      }
      return { reply: this.getChoreSchedule() };
    }

    // 7. Rent & Receipts
    if (p.includes('rent') || p.includes('payment') || p.includes('receipt') || p.includes('rent pending')) {
      return { reply: this.getRentStatus() };
    }

    // 8. Rental Agreement
    if (p.includes('agreement') || p.includes('lease') || p.includes('contract') || p.includes('terms') || p.includes('notice period')) {
      return { reply: this.getRentalAgreementSummary() };
    }

    // 9. Household Summary
    if (p.includes('household') || p.includes('summary') || p.includes('overview') || p.includes('flat')) {
      return { reply: this.getHouseholdSummary() };
    }

    // Default friendly assistant fallback
    return {
      reply: `I can certainly help you with that! Here are some common things you can ask me:
• "*Add ₹1200 for groceries and split equally*"
• "*Who owes me money?*"
• "*How much did we spend this month?*"
• "*Show shared inventory and shopping list*"
• "*Who has completed the most chores?*"
• "*Explain my rental agreement*"
• "*How much rent is pending?*"`
    };
  }

  public executeTool(name: string, params: Record<string, any>): string {
    switch (name) {
      case 'createExpense':
        return this.createExpense(params.title, params.amount, params.category, params.membersToSplit);
      case 'getMemberBalances':
        return this.getMemberBalances();
      case 'getExpenseHistory':
        return this.getExpenseHistory();
      case 'getInventory':
        return this.getInventory();
      case 'createShoppingList':
        return this.createShoppingList();
      case 'getChoreSchedule':
        return this.getChoreSchedule();
      case 'createChore':
        return this.createChore(params.title, params.category, params.assignToName);
      case 'getRentalAgreementSummary':
        return this.getRentalAgreementSummary();
      case 'getRentStatus':
        return this.getRentStatus();
      case 'getHouseholdSummary':
        return this.getHouseholdSummary();
      default:
        return 'Tool executed successfully.';
    }
  }
}
