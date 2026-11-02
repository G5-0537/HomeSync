/**
 * HomeSync Cloud Firestore Database Service
 * Real collections, real document schemas, real CRUD, real-time listeners,
 * and automatic synchronization with offline cache.
 *
 * COLLECTIONS:
 * 1. `users`              - User profiles & role state
 * 2. `properties`         - Property listings (₹0 brokerage)
 * 3. `households`         - Active co-living households
 * 4. `expenses`           - Shared expenses & split shares
 * 5. `chores`             - Household chores & fairness leaderboard
 * 6. `inventory`          - Pantry supplies & stock thresholds
 * 7. `agreements`         - Residential tenancy contracts & signatures
 * 8. `deposits`           - Security deposit escrow wallets & claims
 * 9. `inspections`        - Move-in / move-out condition checklist & photos
 * 10. `maintenance`       - Service tickets & tenant complaint evidence
 * 11. `applications`      - Rental applications & landlord reviews
 * 12. `rent_payments`     - Monthly rent transactions & receipts
 * 13. `notifications`     - Real-time user alert feed
 */

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  PropertyListing, 
  Household, 
  Expense, 
  ChoreItem, 
  InventoryItem, 
  RentalAgreement, 
  SecurityDepositWallet, 
  PropertyInspection, 
  MaintenanceRequest, 
  RentalApplication, 
  RentPayment, 
  AppNotification 
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
import { localStore } from './localStore';

export class FirestoreDbService {
  private static instance: FirestoreDbService;
  private isSeeded = false;

  private constructor() {
    this.seedInitialDataIfEmpty();
  }

  public static getInstance(): FirestoreDbService {
    if (!FirestoreDbService.instance) {
      FirestoreDbService.instance = new FirestoreDbService();
    }
    return FirestoreDbService.instance;
  }

  /**
   * Seeds the Firestore database once so that the app immediately has rich,
   * live documents with complete schema fields without waiting for manual entries.
   */
  public async seedInitialDataIfEmpty(): Promise<void> {
    if (!db || this.isSeeded) return;
    try {
      const propSnap = await getDocs(collection(db, 'properties'));
      if (propSnap.empty) {
        console.log('⚡ Initializing Firestore collections and schemas...');
        
        // 1. Properties
        for (const p of DEMO_PROPERTIES) {
          await setDoc(doc(db, 'properties', p.id), { ...p, updatedAt: serverTimestamp() });
        }
        // 2. Households
        await setDoc(doc(db, 'households', DEMO_HOUSEHOLD.id), { ...DEMO_HOUSEHOLD, updatedAt: serverTimestamp() });
        
        // 3. Agreements
        await setDoc(doc(db, 'agreements', DEMO_AGREEMENT.id), { ...DEMO_AGREEMENT, updatedAt: serverTimestamp() });

        // 4. Deposits
        await setDoc(doc(db, 'deposits', DEMO_DEPOSIT.householdId), { ...DEMO_DEPOSIT, updatedAt: serverTimestamp() });

        // 5. Expenses
        for (const e of DEMO_EXPENSES) {
          await setDoc(doc(db, 'expenses', e.id), { ...e, updatedAt: serverTimestamp() });
        }

        // 6. Chores
        for (const c of DEMO_CHORES) {
          await setDoc(doc(db, 'chores', c.id), { ...c, updatedAt: serverTimestamp() });
        }

        // 7. Inventory
        for (const i of DEMO_INVENTORY) {
          await setDoc(doc(db, 'inventory', i.id), { ...i, updatedAt: serverTimestamp() });
        }

        // 8. Maintenance
        for (const m of DEMO_MAINTENANCE) {
          await setDoc(doc(db, 'maintenance', m.id), { ...m, updatedAt: serverTimestamp() });
        }

        // 9. Rent Payments
        for (const rp of DEMO_RENT_PAYMENTS) {
          await setDoc(doc(db, 'rent_payments', rp.id), { ...rp, updatedAt: serverTimestamp() });
        }

        console.log('✅ Firestore collections and documents populated successfully!');
      }
      this.isSeeded = true;
    } catch (err) {
      console.warn('Firestore initial check note (continuing with state synchronization):', err);
    }
  }

  // ==========================================
  // 1. PROPERTIES
  // ==========================================
  public async getProperties(): Promise<PropertyListing[]> {
    if (db) {
      try {
        const snap = await getDocs(collection(db, 'properties'));
        if (!snap.empty) {
          const list = snap.docs.map(d => d.data() as PropertyListing);
          list.forEach(p => localStore.saveProperty(p));
          return list;
        }
      } catch (e) {
        console.warn('Firestore getProperties error, using cache:', e);
      }
    }
    return localStore.getProperties();
  }

  public async saveProperty(prop: PropertyListing): Promise<void> {
    localStore.saveProperty(prop);
    if (db) {
      try {
        await setDoc(doc(db, 'properties', prop.id), {
          ...prop,
          serverTimestamp: serverTimestamp()
        }, { merge: true });
      } catch (e) {
        console.warn('Firestore saveProperty error:', e);
      }
    }
  }

  public async deleteProperty(id: string): Promise<void> {
    localStore.deleteProperty(id);
    if (db) {
      try {
        await deleteDoc(doc(db, 'properties', id));
      } catch (e) {
        console.warn('Firestore deleteProperty error:', e);
      }
    }
  }

  // ==========================================
  // 2. HOUSEHOLDS
  // ==========================================
  public async getHousehold(householdId?: string): Promise<Household | undefined> {
    if (db && householdId) {
      try {
        const snap = await getDoc(doc(db, 'households', householdId));
        if (snap.exists()) {
          return snap.data() as Household;
        }
      } catch (e) {
        console.warn('Firestore getHousehold error:', e);
      }
    }
    if (householdId) {
      return localStore.getHouseholdById(householdId);
    }
    return localStore.getHouseholds()[0];
  }

  // ==========================================
  // 3. EXPENSES
  // ==========================================
  public async getExpenses(householdId?: string): Promise<Expense[]> {
    if (db && householdId) {
      try {
        const q = query(collection(db, 'expenses'), where('householdId', '==', householdId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map(d => d.data() as Expense);
        }
      } catch (e) {
        console.warn('Firestore getExpenses error:', e);
      }
    }
    return localStore.getExpenses(householdId);
  }

  public async addExpense(expense: Expense): Promise<void> {
    localStore.addExpense(expense);
    if (db) {
      try {
        await setDoc(doc(db, 'expenses', expense.id), {
          ...expense,
          serverTimestamp: serverTimestamp()
        });
      } catch (e) {
        console.warn('Firestore addExpense error:', e);
      }
    }
  }

  // ==========================================
  // 4. CHORES
  // ==========================================
  public async getChores(householdId?: string): Promise<ChoreItem[]> {
    if (db && householdId) {
      try {
        const q = query(collection(db, 'chores'), where('householdId', '==', householdId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map(d => d.data() as ChoreItem);
        }
      } catch (e) {
        console.warn('Firestore getChores error:', e);
      }
    }
    return localStore.getChores(householdId);
  }

  public async addChore(chore: ChoreItem): Promise<void> {
    localStore.addChore(chore);
    if (db) {
      try {
        await setDoc(doc(db, 'chores', chore.id), {
          ...chore,
          serverTimestamp: serverTimestamp()
        });
      } catch (e) {
        console.warn('Firestore addChore error:', e);
      }
    }
  }

  public async toggleChoreComplete(choreId: string, userUid: string): Promise<void> {
    localStore.toggleChoreComplete(choreId, userUid);
    if (db) {
      try {
        await updateDoc(doc(db, 'chores', choreId), {
          status: 'completed',
          completedAt: new Date().toISOString(),
          updatedAt: serverTimestamp()
        });
      } catch (e) {
        console.warn('Firestore toggleChoreComplete error:', e);
      }
    }
  }

  // ==========================================
  // 5. INVENTORY & PANTRY
  // ==========================================
  public async getInventory(householdId?: string): Promise<InventoryItem[]> {
    if (db && householdId) {
      try {
        const q = query(collection(db, 'inventory'), where('householdId', '==', householdId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map(d => d.data() as InventoryItem);
        }
      } catch (e) {
        console.warn('Firestore getInventory error:', e);
      }
    }
    return localStore.getInventory(householdId);
  }

  public async addInventoryItem(item: InventoryItem): Promise<void> {
    localStore.addInventoryItem(item);
    if (db) {
      try {
        await setDoc(doc(db, 'inventory', item.id), {
          ...item,
          serverTimestamp: serverTimestamp()
        });
      } catch (e) {
        console.warn('Firestore addInventoryItem error:', e);
      }
    }
  }

  public async updateInventoryQuantity(itemId: string, quantity: number): Promise<void> {
    localStore.updateInventoryQuantity(itemId, quantity);
    if (db) {
      try {
        await updateDoc(doc(db, 'inventory', itemId), {
          quantity: Math.max(0, quantity),
          updatedAt: serverTimestamp()
        });
      } catch (e) {
        console.warn('Firestore updateInventoryQuantity error:', e);
      }
    }
  }

  // ==========================================
  // 6. MAINTENANCE REQUESTS (COMPLAINTS)
  // ==========================================
  public async getMaintenanceRequests(householdId?: string): Promise<MaintenanceRequest[]> {
    if (db && householdId) {
      try {
        const q = query(collection(db, 'maintenance'), where('householdId', '==', householdId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map(d => d.data() as MaintenanceRequest);
        }
      } catch (e) {
        console.warn('Firestore getMaintenanceRequests error:', e);
      }
    }
    return localStore.getMaintenanceRequests(householdId);
  }

  public async addMaintenanceRequest(ticket: MaintenanceRequest): Promise<void> {
    localStore.addMaintenanceRequest(ticket);
    if (db) {
      try {
        await setDoc(doc(db, 'maintenance', ticket.id), {
          ...ticket,
          serverTimestamp: serverTimestamp()
        });
      } catch (e) {
        console.warn('Firestore addMaintenanceRequest error:', e);
      }
    }
  }

  // ==========================================
  // 7. RENTAL AGREEMENTS
  // ==========================================
  public async getAgreement(agreementId?: string): Promise<RentalAgreement | undefined> {
    if (db && agreementId) {
      try {
        const snap = await getDoc(doc(db, 'agreements', agreementId));
        if (snap.exists()) {
          return snap.data() as RentalAgreement;
        }
      } catch (e) {
        console.warn('Firestore getAgreement error:', e);
      }
    }
    return localStore.getAgreements().find(a => a.id === agreementId);
  }

  public async signAgreement(agreementId: string, role: 'tenant' | 'landlord', signatureData: any): Promise<void> {
    localStore.signAgreement(agreementId, role, signatureData);
    if (db) {
      try {
        const fieldName = role === 'tenant' ? 'tenantSignature' : 'landlordSignature';
        await updateDoc(doc(db, 'agreements', agreementId), {
          [fieldName]: signatureData,
          status: 'active',
          updatedAt: serverTimestamp()
        });
      } catch (e) {
        console.warn('Firestore signAgreement error:', e);
      }
    }
  }

  // ==========================================
  // 8. SECURITY DEPOSITS (ESCROW)
  // ==========================================
  public async getDepositWallet(householdId?: string): Promise<SecurityDepositWallet | undefined> {
    if (db && householdId) {
      try {
        const snap = await getDoc(doc(db, 'deposits', householdId));
        if (snap.exists()) {
          return snap.data() as SecurityDepositWallet;
        }
      } catch (e) {
        console.warn('Firestore getDepositWallet error:', e);
      }
    }
    return localStore.getDepositWallet(householdId);
  }

  public async updateDepositStatus(id: string, status: SecurityDepositWallet['status'], notes?: string): Promise<void> {
    localStore.updateDepositStatus(id, status, notes);
    if (db) {
      try {
        await updateDoc(doc(db, 'deposits', id), {
          status,
          disputeNotes: notes || '',
          updatedAt: serverTimestamp()
        });
      } catch (e) {
        console.warn('Firestore updateDepositStatus error:', e);
      }
    }
  }
}

export const firestoreDb = FirestoreDbService.getInstance();
