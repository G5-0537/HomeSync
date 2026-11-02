# HomeSync — AI-Powered Broker-Free Rental & Shared Living Ecosystem

> **"Your space. Your people. Your peace."**

HomeSync is a modern, commercial-grade PropTech web application that transforms the rental and shared-living experience. It bridges direct broker-free rental discovery with an intelligent, automated co-living household hub powered by a personal AI consultant.

---

## 🌟 The Complete Tenancy Journey

```
Property Discovery (₹0 Brokerage)
       ↓
Direct Landlord Contact & Visit Scheduling
       ↓
Structured Rental Application
       ↓
Automated Lease Agreement Generation
       ↓
Mutual Digital Signatures & PDF Issuance
       ↓
Automatic Provisioning of Co-Living Household Hub
       ↓
Shared Living Management (Expenses, Chores, Pantry, Rent, Escrow Deposit)
       ↓
Move-Out Photographic Handover & Deposit Settlement
```

---

## ✨ Signature Features & Modules

### 1. 100% Broker-Free Rental Marketplace
- **Zero Brokerage Guarantee (`₹0`)**: Save 1–2 months of rent on traditional agent fees.
- **Direct Owner Listings**: Explore hand-verified apartments, villas, and studios in Chandigarh, Mohali, Bengaluru, and more.
- **Move-In Cost Transparency Calculator**: Interactive breakdown showing exact upfront budget and per-roommate share.
- **Search & Filters**: Multi-faceted filtering by locality, city, bedrooms, furnishing status, and budget.
- **Interactive Visit Scheduling**: Instant booking of in-person viewings without middleman delays.

### 2. Rental Application & Agreement Workflow
- **Direct Tenant Application**: Submit professional profile, co-tenant count, income, and personalized message.
- **Landlord Screening Hub**: Landlord reviews applicants, approves with 1 click, and triggers lease creation.
- **Digital Signing Workflow**: Mutually execute tenancy covenants with digital signature stamps.
- **Official PDF Generation**: Export professional lease agreements with HomeSync verification seals.
- **Instant Household Provisioning**: Agreement activation automatically creates the shared dashboard for all co-tenants.

### 3. Personalized Tenant Co-Living Dashboard
- **Central Household Overview**: Active lease dates, monthly rent cycle, roommate distribution, and key action shortcuts.
- **Shared Expense Manager**:
  - Split bills equally (4-way), by percentage, or custom amounts.
  - Category tagging (Rent, Groceries, Electricity, Internet, Cleaning).
  - Receipt image attachments.
- **Smart Settlement Engine (Transaction Minimizer)**:
  - Mathematical optimization algorithm that computes net balances across all roommates and reduces multi-way debts to the minimal number of direct transactions.
- **Pantry & Shared Inventory**:
  - Quantity tracking with minimum alert thresholds.
  - Automatic low-stock notifications (`"Milk is running low. Add to shopping list?"`).
  - Shared shopping list with 1-click **"Claim Purchase"** (`"I will buy this"`).
- **Chore & Responsibility Fairness Engine**:
  - Algorithmic workload scoring based on task difficulty (Easy: 10 pts, Medium: 20 pts, Hard: 35 pts) and past completions.
  - **"Auto-Pick Fair Assignee"** button that assigns tasks to the roommate with the lowest current workload.
  - Gamified weekly leaderboard with habit streaks 🔥 and points.
- **Security Deposit Escrow Wallet**:
  - Simulated neutral wallet holding ₹48,000 deposit.
  - Lifecycle tracking: `PENDING → HELD → SETTLEMENT_REQUESTED → UNDER_REVIEW → REFUNDED / RELEASED`.
  - Structured evaluation for lease completion, early exit with notice, and photographic dispute submission.
- **Property Condition Documentation**:
  - Move-in vs. Move-out comparative inspection with photographic records across Living Room, Kitchen, and Master Bedroom.
- **Rent Management**:
  - Due date tracking, automated monthly ledger, simulated instant payment, and downloadable receipts.
- **Maintenance Dispatcher**:
  - Report urgent issues (Plumbing, Electrical, Appliances) with photo evidence; track landlord contractor status.

### 4. HomeSync AI — Personal Rental Consultant
- Floating conversational assistant (FAB) positioned throughout the app.
- Natural-language command understanding:
  - *"Add ₹1200 for groceries and divide it equally"*
  - *"Who owes me money?"*
  - *"Create a shopping list"*
  - *"Assign kitchen cleaning for tomorrow to the fairest roommate"*
  - *"Explain my rental agreement"*
  - *"How much rent is pending?"*
- **Server-Side Tool-Calling Architecture**:
  - `getHouseholdSummary()`, `createExpense()`, `getMemberBalances()`, `createShoppingList()`, `getChoreSchedule()`, `createChore()`, `getRentalAgreementSummary()`, `getRentStatus()`.
  - Financial write operations include interactive authorization confirmation cards.

### 5. Dedicated Landlord Hub
- Portfolio overview: total properties, occupancy rate, monthly rent roll.
- Listing wizard: create and publish direct listings.
- Application management: review background and approve with automated agreement generation.
- Maintenance ticket tracker: assign service vendors and update repair status.

### 6. Hackathon Demo Environment
- **Pre-Seeded Real Estate**: The Ivory Heights — Sunlit 3BHK in Sector 35, Chandigarh (Rent: ₹24,000, Deposit: ₹48,000).
- **Pre-Seeded Household**: 4 Roommates:
  - **Aanya Sharma** (Primary Tenant / Lead UX Designer)
  - **Riya Patel** (Software Engineer)
  - **Mehak Verma** (Financial Analyst)
  - **Arjun Rao** (Architect)
- **Verified Landlord**: Vikram Singh
- **Interactive Persona Bar**: 1-click instant persona switching at the top of the screen to preview the app from the perspective of any roommate or the landlord.
- **1-Click Reset**: Restore demo data to pristine state anytime.

---

## 🛠 Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router v7.
- **Icons & UI**: Lucide React, Canvas Confetti.
- **Data Visualization**: Recharts (Pie & Bar charts).
- **PDF Generation**: jsPDF client-side engine.
- **Backend Infrastructure**: Firebase Authentication, Cloud Firestore, Firebase Storage, Firebase Cloud Functions (`functions/`).
- **AI Integration**: Gemini API tool-calling agent with local fallback dispatcher.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm.

### Installation
```bash
# Clone or navigate to the repository
cd HomeSync

# Install dependencies (already pre-installed)
npm install

# Start Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```bash
npm run build
```

---

## 🔒 Firebase Security & Cloud Functions

- `firestore.rules`: Production-grade security rules with strict household-level data isolation, role-based checks, and application permissions.
- `storage.rules`: Asset upload rules for property photography, receipts, and maintenance documentation.
- `functions/src/index.ts`:
  - `settleBalances`: Algorithmic greedy transaction minimizer.
  - `validateExpense`: Server-side financial split validation.
  - `calculateFairChoreSchedule`: Server-side chore workload fairness engine.
  - `homesyncAiAssistant`: Authenticated Gemini API endpoint with tool calls.

---

## 🏆 Hackathon Demonstration Highlights

1. **Click the Demo Bar at the Top**: Notice the active persona (Aanya). Switch to **Landlord Vikram** with 1 click to view the owner hub.
2. **Explore Marketplace**: Filter for 3BHK in Chandigarh, see **₹0 Brokerage**, and check the **Move-In Cost Transparency Calculator**.
3. **Open HomeSync AI**: Click the floating assistant in the bottom right and tap any suggested prompt chip like *"Who owes me money?"* or type *"Add ₹800 for electricity"*.
4. **Inspect the Agreement**: Head to `Tenant Dashboard → Rental Agreement` to view digitally executed covenants and click **"Download PDF"** for an official lease document.
5. **Test Chore Fairness**: Head to `Chores`, click **"Assign New Chore"**, and hit **"Auto-Pick Fair Assignee"** to let the fairness engine pick the roommate who did the least this week.
# Boston-n-bytes
