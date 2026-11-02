export type UserRole = 'tenant' | 'landlord' | 'household_member';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  roles: UserRole[];
  createdAt: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  activeHouseholdId?: string;
}

export type PropertyType = 'apartment' | 'villa' | 'studio' | 'shared_room' | 'independent_floor';
export type FurnishingStatus = 'fully_furnished' | 'semi_furnished' | 'unfurnished';
export type ListingStatus = 'active' | 'rented' | 'under_review' | 'inactive';

export interface PropertyListing {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  monthlyRent: number;
  securityDeposit: number;
  brokerageFee: 0; // Always 0
  address: string;
  city: string;
  locality: string;
  bedrooms: number;
  bathrooms: number;
  furnishingStatus: FurnishingStatus;
  amenities: string[];
  occupancy: 'single' | 'double' | 'any' | 'family';
  availableDate: string;
  propertyImages: string[];
  landlordUid: string;
  landlordName: string;
  landlordPhone?: string;
  verificationStatus: 'verified' | 'pending';
  listingStatus: ListingStatus;
  rating?: number;
  areaSqFt?: number;
}

export interface RentalApplication {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage?: string;
  tenantUid: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  monthlyIncome?: number;
  employmentStatus: string;
  proposedMoveInDate: string;
  numberOfOccupants: number;
  message?: string;
  status: 'pending' | 'approved' | 'rejected' | 'agreement_in_progress' | 'completed';
  createdAt: string;
  reviewedAt?: string;
}

export interface RentalAgreement {
  id: string;
  applicationId?: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  landlordUid: string;
  landlordName: string;
  tenantUid: string;
  tenantName: string;
  monthlyRent: number;
  securityDeposit: number;
  startDate: string;
  endDate: string;
  noticePeriodDays: number;
  rentDueDayOfMonth: number;
  maintenanceResponsibilities: string;
  earlyTerminationConditions: string;
  depositSettlementConditions: string;
  documentUrl?: string;
  status: 'draft' | 'pending_tenant_sign' | 'pending_landlord_sign' | 'active' | 'terminated' | 'expired';
  tenantSignature?: {
    signed: boolean;
    timestamp: string;
    signatureName: string;
  };
  landlordSignature?: {
    signed: boolean;
    timestamp: string;
    signatureName: string;
  };
  createdAt: string;
  activatedAt?: string;
}

export interface HouseholdMember {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  room?: string;
  joinedDate: string;
  isPrimaryTenant: boolean;
  role: 'tenant' | 'roommate';
  sharePercentage?: number;
}

export interface Household {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  agreementId: string;
  primaryTenantUid: string;
  landlordUid: string;
  members: HouseholdMember[];
  monthlyRent: number;
  rentDueDayOfMonth: number;
  active: boolean;
  createdAt: string;
}

export type ExpenseCategory = 
  | 'Rent'
  | 'Groceries'
  | 'Electricity'
  | 'Water'
  | 'Internet'
  | 'Cleaning supplies'
  | 'Gas'
  | 'Maintenance'
  | 'Miscellaneous';

export type SplitType = 'equal' | 'percentage' | 'custom' | 'shares';

export interface ExpenseSplit {
  memberUid: string;
  memberName: string;
  amount: number;
  settled: boolean;
  settledAt?: string;
}

export interface Expense {
  id: string;
  householdId: string;
  title: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  paidByUid: string;
  paidByName: string;
  splitType: SplitType;
  splits: ExpenseSplit[];
  receiptUrl?: string;
  date: string;
  createdAt: string;
  notes?: string;
}

export interface MemberBalance {
  memberUid: string;
  memberName: string;
  avatar: string;
  totalPaid: number;
  totalOwed: number;
  netBalance: number; // positive = owed money, negative = owes money
}

export interface SettlementSuggestion {
  fromUid: string;
  fromName: string;
  toUid: string;
  toName: string;
  amount: number;
}

export interface SettlementRecord {
  id: string;
  householdId: string;
  fromUid: string;
  fromName: string;
  toUid: string;
  toName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'completed';
  createdAt: string;
  note?: string;
}

export interface InventoryItem {
  id: string;
  householdId: string;
  name: string;
  category: 'Groceries' | 'Toiletries' | 'Cleaning' | 'Kitchen' | 'Utilities';
  quantity: number;
  minThreshold: number;
  unit: string; // 'liters', 'kg', 'packs', 'units', etc.
  addedByUid: string;
  addedByName: string;
  claimedByUid?: string;
  claimedByName?: string;
  isShoppingListItem: boolean;
  expiryDate?: string;
  lastPurchasedDate?: string;
  createdAt: string;
}

export type ChoreDifficulty = 'easy' | 'medium' | 'hard';

export interface ChoreItem {
  id: string;
  householdId: string;
  title: string;
  category: 'Cleaning' | 'Laundry' | 'Dishwashing' | 'Bathroom' | 'Kitchen' | 'Garbage' | 'Groceries' | 'Other';
  assignedToUid: string;
  assignedToName: string;
  assignedAvatar?: string;
  dueDate: string;
  estimatedMinutes: number;
  difficulty: ChoreDifficulty;
  points: number;
  recurring: 'none' | 'daily' | 'weekly' | 'biweekly';
  status: 'pending' | 'completed' | 'overdue';
  completedAt?: string;
  completedByUid?: string;
  streakCount?: number;
}

export interface ChoreLeaderboard {
  memberUid: string;
  memberName: string;
  avatar: string;
  completedChores: number;
  totalPoints: number;
  currentStreak: number;
  workloadScore: number;
}

export type DepositStatus = 
  | 'PENDING'
  | 'HELD'
  | 'SETTLEMENT_REQUESTED'
  | 'UNDER_REVIEW'
  | 'REFUNDED'
  | 'RELEASED'
  | 'DISPUTED';

export interface SecurityDepositWallet {
  id: string;
  agreementId: string;
  propertyId: string;
  propertyTitle: string;
  householdId: string;
  amount: number;
  currency: string;
  status: DepositStatus;
  heldSince: string;
  deductionsProposed?: {
    reason: string;
    amount: number;
    evidencePhotoUrl?: string;
  }[];
  finalSettlementAmount?: number;
  disputeNotes?: string;
  timeline: {
    stage: string;
    date: string;
    description: string;
  }[];
}

export interface PropertyInspection {
  id: string;
  propertyId: string;
  householdId: string;
  type: 'move_in' | 'move_out';
  date: string;
  inspectorName: string;
  inspectorRole: 'tenant' | 'landlord';
  rooms: {
    roomName: string;
    condition: 'excellent' | 'good' | 'fair' | 'damaged';
    notes: string;
    photos: string[];
    fixturesChecked: {
      name: string;
      status: 'working' | 'defective' | 'missing';
    }[];
  }[];
  status: 'draft' | 'submitted' | 'acknowledged_by_counterpart';
  createdAt: string;
}

export interface MaintenanceRequest {
  id: string;
  householdId: string;
  propertyId: string;
  propertyTitle: string;
  tenantUid: string;
  tenantName: string;
  title: string;
  description: string;
  category: 'Plumbing' | 'Electrical' | 'Appliance' | 'Carpentry' | 'HVAC' | 'Other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  photos: string[];
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  updatedAt?: string;
  assignedTechnician?: string;
  landlordNotes?: string;
}

export interface RentPayment {
  id: string;
  householdId: string;
  agreementId: string;
  month: string; // e.g. "November 2026"
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paidAt?: string;
  paidByUid?: string;
  paidByName?: string;
  paymentMethod?: string;
  receiptId?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  householdId?: string;
  title: string;
  message: string;
  type: 'rent' | 'expense' | 'settlement' | 'chore' | 'inventory' | 'agreement' | 'deposit' | 'maintenance' | 'system';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolCall?: {
    name: string;
    params: Record<string, any>;
    status: 'pending_confirmation' | 'executed' | 'cancelled';
    result?: any;
  };
}
