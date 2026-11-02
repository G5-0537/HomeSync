import { 
  PropertyListing, 
  RentalApplication, 
  RentalAgreement, 
  Household, 
  Expense, 
  InventoryItem, 
  ChoreItem, 
  SecurityDepositWallet, 
  PropertyInspection, 
  MaintenanceRequest,
  RentPayment,
  AppNotification,
  HouseholdMember
} from '../types';
import { 
  DEMO_PROPERTIES, 
  DEMO_HOUSEHOLD, 
  DEMO_EXPENSES, 
  DEMO_INVENTORY, 
  DEMO_CHORES, 
  DEMO_AGREEMENT, 
  DEMO_DEPOSIT, 
  DEMO_INSPECTION, 
  DEMO_MAINTENANCE, 
  DEMO_RENT_PAYMENTS, 
  DEMO_NOTIFICATIONS 
} from './seedData';

type Listener = () => void;

class LocalStore {
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.ensureInitialized();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  private getItem<T>(key: string, defaultVal: T): T {
    try {
      const data = localStorage.getItem(`homesync_${key}`);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private setItem<T>(key: string, val: T): void {
    try {
      localStorage.setItem(`homesync_${key}`, JSON.stringify(val));
      this.notify();
    } catch (e) {
      console.error('Failed to write to localStorage', e);
    }
  }

  public ensureInitialized(forceReset: boolean = false) {
    if (forceReset || !localStorage.getItem('homesync_initialized')) {
      localStorage.setItem('homesync_initialized', 'true');
      this.setItem('properties', DEMO_PROPERTIES);
      this.setItem('households', [DEMO_HOUSEHOLD]);
      this.setItem('expenses', DEMO_EXPENSES);
      this.setItem('inventory', DEMO_INVENTORY);
      this.setItem('chores', DEMO_CHORES);
      this.setItem('agreements', [DEMO_AGREEMENT]);
      this.setItem('deposits', [DEMO_DEPOSIT]);
      this.setItem('inspections', [DEMO_INSPECTION]);
      this.setItem('maintenance', DEMO_MAINTENANCE);
      this.setItem('rentPayments', DEMO_RENT_PAYMENTS);
      this.setItem('notifications', DEMO_NOTIFICATIONS);
      this.setItem('applications', [
        {
          id: 'app-001',
          propertyId: 'prop-chd-35',
          propertyTitle: 'The Ivory Heights — Sunlit 3BHK Residence',
          propertyImage: DEMO_PROPERTIES[0].propertyImages[0],
          tenantUid: 'user-aanya',
          tenantName: 'Aanya Sharma',
          tenantEmail: 'aanya.sharma@example.com',
          tenantPhone: '+91 98765 11001',
          monthlyIncome: 120000,
          employmentStatus: 'Employed (Sr. UX Designer at TechCorp)',
          proposedMoveInDate: '2026-04-01',
          numberOfOccupants: 4,
          message: 'We are a group of 4 working professionals looking for a clean, peaceful long-term home.',
          status: 'completed',
          createdAt: '2026-03-24T10:00:00Z',
          reviewedAt: '2026-03-25T14:00:00Z'
        }
      ] as RentalApplication[]);
    }
  }

  public resetToDemo() {
    this.ensureInitialized(true);
  }

  // --- Properties ---
  public getProperties(): PropertyListing[] {
    return this.getItem<PropertyListing[]>('properties', DEMO_PROPERTIES);
  }

  public getPropertyById(id: string): PropertyListing | undefined {
    return this.getProperties().find(p => p.id === id);
  }

  public saveProperty(property: PropertyListing): void {
    const list = this.getProperties();
    const idx = list.findIndex(p => p.id === property.id);
    if (idx >= 0) {
      list[idx] = property;
    } else {
      list.unshift(property);
    }
    this.setItem('properties', list);
  }

  public deleteProperty(id: string): void {
    const list = this.getProperties().filter(p => p.id !== id);
    this.setItem('properties', list);
  }

  // --- Applications ---
  public getApplications(): RentalApplication[] {
    return this.getItem<RentalApplication[]>('applications', []);
  }

  public createApplication(app: Omit<RentalApplication, 'id' | 'createdAt' | 'status'>): RentalApplication {
    const newApp: RentalApplication = {
      ...app,
      id: `app-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const list = this.getApplications();
    list.unshift(newApp);
    this.setItem('applications', list);
    return newApp;
  }

  public updateApplicationStatus(id: string, status: RentalApplication['status']): void {
    const list = this.getApplications();
    const app = list.find(a => a.id === id);
    if (app) {
      app.status = status;
      app.reviewedAt = new Date().toISOString();
      this.setItem('applications', list);
    }
  }

  // --- Agreements ---
  public getAgreements(): RentalAgreement[] {
    return this.getItem<RentalAgreement[]>('agreements', [DEMO_AGREEMENT]);
  }

  public getAgreementById(id: string): RentalAgreement | undefined {
    return this.getAgreements().find(a => a.id === id);
  }

  public createAgreement(agreementData: Omit<RentalAgreement, 'id' | 'createdAt' | 'status'>): RentalAgreement {
    const newAgr: RentalAgreement = {
      ...agreementData,
      id: `agr-homesync-${Date.now().toString().slice(-6)}`,
      status: 'pending_tenant_sign',
      createdAt: new Date().toISOString()
    };
    const list = this.getAgreements();
    list.unshift(newAgr);
    this.setItem('agreements', list);
    return newAgr;
  }

  public signAgreement(
    id: string, 
    role: 'tenant' | 'landlord', 
    signatureName: string
  ): RentalAgreement | undefined {
    const list = this.getAgreements();
    const agr = list.find(a => a.id === id);
    if (!agr) return undefined;

    const timestamp = new Date().toISOString();
    if (role === 'tenant') {
      agr.tenantSignature = { signed: true, timestamp, signatureName };
      agr.status = agr.landlordSignature?.signed ? 'active' : 'pending_landlord_sign';
    } else {
      agr.landlordSignature = { signed: true, timestamp, signatureName };
      agr.status = agr.tenantSignature?.signed ? 'active' : 'pending_tenant_sign';
    }

    if (agr.status === 'active') {
      agr.activatedAt = timestamp;
      // Auto-create or activate Household
      this.activateHouseholdFromAgreement(agr);
    }

    this.setItem('agreements', list);
    return agr;
  }

  // --- Households ---
  public getHouseholds(): Household[] {
    return this.getItem<Household[]>('households', [DEMO_HOUSEHOLD]);
  }

  public getHouseholdById(id: string): Household | undefined {
    return this.getHouseholds().find(h => h.id === id);
  }

  public activateHouseholdFromAgreement(agr: RentalAgreement): Household {
    const households = this.getHouseholds();
    let existing = households.find(h => h.agreementId === agr.id || h.propertyId === agr.propertyId);

    if (existing) {
      existing.active = true;
      existing.agreementId = agr.id;
      this.setItem('households', households);
      return existing;
    }

    const newHousehold: Household = {
      id: `household-${agr.propertyId}-${Date.now().toString().slice(-4)}`,
      propertyId: agr.propertyId,
      propertyName: agr.propertyTitle,
      propertyAddress: agr.propertyAddress,
      agreementId: agr.id,
      primaryTenantUid: agr.tenantUid,
      landlordUid: agr.landlordUid,
      monthlyRent: agr.monthlyRent,
      rentDueDayOfMonth: agr.rentDueDayOfMonth,
      active: true,
      createdAt: new Date().toISOString(),
      members: [
        {
          uid: agr.tenantUid,
          name: agr.tenantName,
          email: `${agr.tenantName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          room: 'Master Bedroom',
          joinedDate: new Date().toISOString().split('T')[0],
          isPrimaryTenant: true,
          role: 'tenant',
          sharePercentage: 100
        }
      ]
    };

    households.push(newHousehold);
    this.setItem('households', households);
    return newHousehold;
  }

  public addHouseholdMember(householdId: string, member: HouseholdMember): void {
    const list = this.getHouseholds();
    const h = list.find(item => item.id === householdId);
    if (h) {
      h.members.push(member);
      // Re-adjust equal share percentages
      const count = h.members.length;
      const share = Math.round(100 / count);
      h.members.forEach(m => m.sharePercentage = share);
      this.setItem('households', list);
    }
  }

  // --- Expenses ---
  public getExpenses(householdId?: string): Expense[] {
    const list = this.getItem<Expense[]>('expenses', DEMO_EXPENSES);
    if (!householdId) return list;
    return list.filter(e => e.householdId === householdId);
  }

  public addExpense(expense: Omit<Expense, 'id' | 'createdAt'>): Expense {
    const newExp: Expense = {
      ...expense,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const list = this.getItem<Expense[]>('expenses', DEMO_EXPENSES);
    list.unshift(newExp);
    this.setItem('expenses', list);
    return newExp;
  }

  public deleteExpense(id: string): void {
    const list = this.getItem<Expense[]>('expenses', DEMO_EXPENSES).filter(e => e.id !== id);
    this.setItem('expenses', list);
  }

  // --- Inventory ---
  public getInventory(householdId?: string): InventoryItem[] {
    const list = this.getItem<InventoryItem[]>('inventory', DEMO_INVENTORY);
    if (!householdId) return list;
    return list.filter(i => i.householdId === householdId);
  }

  public addInventoryItem(item: Omit<InventoryItem, 'id' | 'createdAt'>): InventoryItem {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const list = this.getInventory();
    list.unshift(newItem);
    this.setItem('inventory', list);
    return newItem;
  }

  public updateInventoryQuantity(id: string, newQty: number): void {
    const list = this.getInventory();
    const item = list.find(i => i.id === id);
    if (item) {
      item.quantity = Math.max(0, newQty);
      if (item.quantity <= item.minThreshold) {
        item.isShoppingListItem = true;
      }
      this.setItem('inventory', list);
    }
  }

  public toggleShoppingListStatus(id: string): void {
    const list = this.getInventory();
    const item = list.find(i => i.id === id);
    if (item) {
      item.isShoppingListItem = !item.isShoppingListItem;
      this.setItem('inventory', list);
    }
  }

  public claimShoppingItem(id: string, userUid: string, userName: string): void {
    const list = this.getInventory();
    const item = list.find(i => i.id === id);
    if (item) {
      item.claimedByUid = userUid;
      item.claimedByName = userName;
      this.setItem('inventory', list);
    }
  }

  // --- Chores ---
  public getChores(householdId?: string): ChoreItem[] {
    const list = this.getItem<ChoreItem[]>('chores', DEMO_CHORES);
    if (!householdId) return list;
    return list.filter(c => c.householdId === householdId);
  }

  public addChore(chore: Omit<ChoreItem, 'id'>): ChoreItem {
    const newChore: ChoreItem = {
      ...chore,
      id: `chore-${Date.now()}`
    };
    const list = this.getChores();
    list.unshift(newChore);
    this.setItem('chores', list);
    return newChore;
  }

  public toggleChoreComplete(id: string, userUid: string): void {
    const list = this.getChores();
    const chore = list.find(c => c.id === id);
    if (chore) {
      if (chore.status === 'completed') {
        chore.status = 'pending';
        chore.completedAt = undefined;
        chore.completedByUid = undefined;
      } else {
        chore.status = 'completed';
        chore.completedAt = new Date().toISOString();
        chore.completedByUid = userUid;
        chore.streakCount = (chore.streakCount || 0) + 1;
      }
      this.setItem('chores', list);
    }
  }

  // --- Security Deposit Wallet ---
  public getDepositWallet(householdId?: string): SecurityDepositWallet | undefined {
    const list = this.getItem<SecurityDepositWallet[]>('deposits', [DEMO_DEPOSIT]);
    if (!householdId) return list[0];
    return list.find(d => d.householdId === householdId) || list[0];
  }

  public updateDepositStatus(
    id: string, 
    status: SecurityDepositWallet['status'],
    notes?: string
  ): void {
    const list = this.getItem<SecurityDepositWallet[]>('deposits', [DEMO_DEPOSIT]);
    const dep = list.find(d => d.id === id);
    if (dep) {
      dep.status = status;
      if (notes) dep.disputeNotes = notes;
      dep.timeline.push({
        stage: `Status Changed: ${status}`,
        date: new Date().toISOString().split('T')[0],
        description: notes || `Deposit wallet transitioned to ${status}`
      });
      this.setItem('deposits', list);
    }
  }

  // --- Property Inspection ---
  public getInspections(householdId?: string): PropertyInspection[] {
    const list = this.getItem<PropertyInspection[]>('inspections', [DEMO_INSPECTION]);
    if (!householdId) return list;
    return list.filter(i => i.householdId === householdId);
  }

  public addInspection(insp: Omit<PropertyInspection, 'id' | 'createdAt'>): PropertyInspection {
    const newInsp: PropertyInspection = {
      ...insp,
      id: `insp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const list = this.getInspections();
    list.unshift(newInsp);
    this.setItem('inspections', list);
    return newInsp;
  }

  // --- Maintenance Requests ---
  public getMaintenanceRequests(householdId?: string): MaintenanceRequest[] {
    const list = this.getItem<MaintenanceRequest[]>('maintenance', DEMO_MAINTENANCE);
    if (!householdId) return list;
    return list.filter(m => m.householdId === householdId);
  }

  public addMaintenanceRequest(req: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'status'>): MaintenanceRequest {
    const newReq: MaintenanceRequest = {
      ...req,
      id: `maint-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    const list = this.getMaintenanceRequests();
    list.unshift(newReq);
    this.setItem('maintenance', list);
    return newReq;
  }

  public updateMaintenanceStatus(
    id: string, 
    status: MaintenanceRequest['status'], 
    landlordNotes?: string
  ): void {
    const list = this.getMaintenanceRequests();
    const req = list.find(m => m.id === id);
    if (req) {
      req.status = status;
      req.updatedAt = new Date().toISOString();
      if (landlordNotes) req.landlordNotes = landlordNotes;
      this.setItem('maintenance', list);
    }
  }

  // --- Rent Payments ---
  public getRentPayments(householdId?: string): RentPayment[] {
    const list = this.getItem<RentPayment[]>('rentPayments', DEMO_RENT_PAYMENTS);
    if (!householdId) return list;
    return list.filter(r => r.householdId === householdId);
  }

  public recordRentPayment(payment: Omit<RentPayment, 'id' | 'receiptId'>): RentPayment {
    const newPay: RentPayment = {
      ...payment,
      id: `rent-${Date.now()}`,
      receiptId: `REC-HS-${Date.now().toString().slice(-6)}`,
    };
    const list = this.getRentPayments();
    list.unshift(newPay);
    this.setItem('rentPayments', list);
    return newPay;
  }

  // --- Notifications ---
  public getNotifications(userId?: string): AppNotification[] {
    const list = this.getItem<AppNotification[]>('notifications', DEMO_NOTIFICATIONS);
    if (!userId) return list;
    return list.filter(n => n.userId === userId || n.userId === 'user-aanya');
  }

  public markNotificationAsRead(id: string): void {
    const list = this.getNotifications();
    const notif = list.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.setItem('notifications', list);
    }
  }

  public addNotification(notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>): AppNotification {
    const newN: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    const list = this.getNotifications();
    list.unshift(newN);
    this.setItem('notifications', list);
    return newN;
  }
}

export const localStore = new LocalStore();
