import { 
  UserProfile, 
  PropertyListing, 
  Household, 
  Expense, 
  InventoryItem, 
  ChoreItem, 
  RentalAgreement, 
  SecurityDepositWallet, 
  PropertyInspection, 
  MaintenanceRequest,
  RentPayment,
  AppNotification
} from '../types';

export const DEMO_USERS: Record<string, UserProfile> = {
  aanya: {
    uid: 'user-aanya',
    name: 'Aanya Sharma',
    email: 'aanya.sharma@example.com',
    phone: '+91 98765 11001',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    roles: ['tenant', 'household_member'],
    createdAt: '2026-01-15T10:00:00Z',
    verificationStatus: 'verified',
    activeHouseholdId: 'household-chandigarh-3bhk',
  },
  riya: {
    uid: 'user-riya',
    name: 'Riya Patel',
    email: 'riya.patel@example.com',
    phone: '+91 98765 11002',
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    roles: ['tenant', 'household_member'],
    createdAt: '2026-01-18T10:00:00Z',
    verificationStatus: 'verified',
    activeHouseholdId: 'household-chandigarh-3bhk',
  },
  mehak: {
    uid: 'user-mehak',
    name: 'Mehak Verma',
    email: 'mehak.verma@example.com',
    phone: '+91 98765 11003',
    profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=250&q=80',
    roles: ['tenant', 'household_member'],
    createdAt: '2026-01-20T10:00:00Z',
    verificationStatus: 'verified',
    activeHouseholdId: 'household-chandigarh-3bhk',
  },
  arjun: {
    uid: 'user-arjun',
    name: 'Arjun Rao',
    email: 'arjun.rao@example.com',
    phone: '+91 98765 11004',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    roles: ['tenant', 'household_member'],
    createdAt: '2026-01-22T10:00:00Z',
    verificationStatus: 'verified',
    activeHouseholdId: 'household-chandigarh-3bhk',
  },
  vikram: {
    uid: 'landlord-vikram',
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    phone: '+91 98765 43210',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    roles: ['landlord'],
    createdAt: '2025-11-10T10:00:00Z',
    verificationStatus: 'verified',
  }
};

export const DEMO_PROPERTIES: PropertyListing[] = [
  {
    id: 'prop-chd-35',
    title: 'The Ivory Heights — Sunlit 3BHK Residence',
    description: 'A beautifully furnished, airy 3-bedroom residence in the heart of Sector 35. Features Italian marble floors, floor-to-ceiling windows, dedicated study desks, premium modular kitchen with dishwasher, high-speed fiber internet, and 100% power backup. Perfect for working professionals.',
    propertyType: 'apartment',
    monthlyRent: 24000,
    securityDeposit: 48000,
    brokerageFee: 0,
    address: 'Flat 402, Block B, Ivory Heights, Sector 35-C',
    city: 'Chandigarh',
    locality: 'Sector 35-C',
    bedrooms: 3,
    bathrooms: 3,
    furnishingStatus: 'fully_furnished',
    amenities: [
      'High-Speed Wi-Fi',
      'Air Conditioning',
      'Modular Kitchen',
      'Washing Machine',
      'Dishwasher',
      'RO Water Purifier',
      'Balcony View',
      '100% Power Backup',
      'Covered Parking',
      '24/7 CCTV & Security',
      'Elevator'
    ],
    occupancy: 'any',
    availableDate: '2026-04-01',
    propertyImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80'
    ],
    landlordUid: 'landlord-vikram',
    landlordName: 'Vikram Singh',
    landlordPhone: '+91 98765 43210',
    verificationStatus: 'verified',
    listingStatus: 'rented',
    rating: 4.95,
    areaSqFt: 1850
  },
  {
    id: 'prop-chd-17',
    title: 'The Green Arcade — Modern 2BHK Studio Suite',
    description: 'Designer 2-bedroom boutique apartment walking distance from Chandigarh Plaza. Equipped with smart lighting, ergonomic home office setups, and private garden patio. 100% zero brokerage.',
    propertyType: 'apartment',
    monthlyRent: 19500,
    securityDeposit: 39000,
    brokerageFee: 0,
    address: 'A-12, Sector 17-D',
    city: 'Chandigarh',
    locality: 'Sector 17',
    bedrooms: 2,
    bathrooms: 2,
    furnishingStatus: 'fully_furnished',
    amenities: [
      'High-Speed Wi-Fi',
      'Smart TV',
      'Air Conditioning',
      'Modular Kitchen',
      'Private Terrace',
      'Covered Parking'
    ],
    occupancy: 'any',
    availableDate: '2026-11-15',
    propertyImages: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    landlordUid: 'landlord-vikram',
    landlordName: 'Vikram Singh',
    landlordPhone: '+91 98765 43210',
    verificationStatus: 'verified',
    listingStatus: 'active',
    rating: 4.88,
    areaSqFt: 1200
  },
  {
    id: 'prop-mohali-70',
    title: 'Aeroview Luxury 4BHK Penthouse',
    description: 'Expansive penthouse with panoramic skyline views of the Shivalik hills. Four en-suite bedrooms, private terrace lounge, double-door refrigerator, and clubhouse access.',
    propertyType: 'villa',
    monthlyRent: 36000,
    securityDeposit: 72000,
    brokerageFee: 0,
    address: 'Penthouse 14, Sky Terraces, Sector 70',
    city: 'Mohali',
    locality: 'Sector 70',
    bedrooms: 4,
    bathrooms: 4,
    furnishingStatus: 'fully_furnished',
    amenities: [
      'High-Speed Wi-Fi',
      'Clubhouse & Gym',
      'Swimming Pool',
      '24/7 Concierge',
      'Balcony View',
      'Power Backup'
    ],
    occupancy: 'any',
    availableDate: '2026-12-01',
    propertyImages: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    landlordUid: 'landlord-vikram',
    landlordName: 'Vikram Singh',
    landlordPhone: '+91 98765 43210',
    verificationStatus: 'verified',
    listingStatus: 'active',
    rating: 4.92,
    areaSqFt: 2600
  },
  {
    id: 'prop-blr-koramangala',
    title: 'Zen Living — Tech Park Adjacent 3BHK',
    description: 'Tranquil minimalist apartment in 4th Block Koramangala. Built for shared coliving with sound-insulated rooms, high-speed fiber, in-unit laundry, and zero landlord hassle.',
    propertyType: 'apartment',
    monthlyRent: 38000,
    securityDeposit: 76000,
    brokerageFee: 0,
    address: '88, 5th Cross, 4th Block, Koramangala',
    city: 'Bengaluru',
    locality: 'Koramangala',
    bedrooms: 3,
    bathrooms: 3,
    furnishingStatus: 'fully_furnished',
    amenities: [
      'High-Speed Wi-Fi',
      'Air Conditioning',
      'Co-working Lounge',
      'Washing Machine',
      'EV Charging',
      'Zero Brokerage'
    ],
    occupancy: 'any',
    availableDate: '2026-11-20',
    propertyImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80'
    ],
    landlordUid: 'landlord-vikram',
    landlordName: 'Vikram Singh',
    landlordPhone: '+91 98765 43210',
    verificationStatus: 'verified',
    listingStatus: 'active',
    rating: 4.91,
    areaSqFt: 1650
  }
];

export const DEMO_HOUSEHOLD: Household = {
  id: 'household-chandigarh-3bhk',
  propertyId: 'prop-chd-35',
  propertyName: 'The Ivory Heights — Sunlit 3BHK',
  propertyAddress: 'Flat 402, Block B, Ivory Heights, Sector 35-C, Chandigarh',
  agreementId: 'agr-homesync-2026-001',
  primaryTenantUid: 'user-aanya',
  landlordUid: 'landlord-vikram',
  monthlyRent: 24000,
  rentDueDayOfMonth: 5,
  active: true,
  createdAt: '2026-03-25T12:00:00Z',
  members: [
    {
      uid: 'user-aanya',
      name: 'Aanya Sharma',
      email: 'aanya.sharma@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      room: 'Master Bedroom',
      joinedDate: '2026-04-01',
      isPrimaryTenant: true,
      role: 'tenant',
      sharePercentage: 25,
    },
    {
      uid: 'user-riya',
      name: 'Riya Patel',
      email: 'riya.patel@example.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
      room: 'Guest Bedroom East',
      joinedDate: '2026-04-01',
      isPrimaryTenant: false,
      role: 'roommate',
      sharePercentage: 25,
    },
    {
      uid: 'user-mehak',
      name: 'Mehak Verma',
      email: 'mehak.verma@example.com',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=250&q=80',
      room: 'Guest Bedroom West',
      joinedDate: '2026-04-01',
      isPrimaryTenant: false,
      role: 'roommate',
      sharePercentage: 25,
    },
    {
      uid: 'user-arjun',
      name: 'Arjun Rao',
      email: 'arjun.rao@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      room: 'Studio Alcove Room',
      joinedDate: '2026-04-01',
      isPrimaryTenant: false,
      role: 'roommate',
      sharePercentage: 25,
    }
  ]
};

export const DEMO_EXPENSES: Expense[] = [
  {
    id: 'exp-01',
    householdId: 'household-chandigarh-3bhk',
    title: 'Monthly Rent (Current Month)',
    amount: 24000,
    currency: 'INR',
    category: 'Rent',
    paidByUid: 'user-aanya',
    paidByName: 'Aanya Sharma',
    splitType: 'equal',
    splits: [
      { memberUid: 'user-aanya', memberName: 'Aanya Sharma', amount: 6000, settled: true },
      { memberUid: 'user-riya', memberName: 'Riya Patel', amount: 6000, settled: false },
      { memberUid: 'user-mehak', memberName: 'Mehak Verma', amount: 6000, settled: false },
      { memberUid: 'user-arjun', memberName: 'Arjun Rao', amount: 6000, settled: false },
    ],
    date: '2026-11-01',
    createdAt: '2026-11-01T09:00:00Z',
    notes: 'Paid via NetBanking to Landlord Vikram Singh.'
  },
  {
    id: 'exp-02',
    householdId: 'household-chandigarh-3bhk',
    title: 'Organic Groceries & Fresh Produce (Nature Basket)',
    amount: 4800,
    currency: 'INR',
    category: 'Groceries',
    paidByUid: 'user-riya',
    paidByName: 'Riya Patel',
    splitType: 'equal',
    splits: [
      { memberUid: 'user-aanya', memberName: 'Aanya Sharma', amount: 1200, settled: false },
      { memberUid: 'user-riya', memberName: 'Riya Patel', amount: 1200, settled: true },
      { memberUid: 'user-mehak', memberName: 'Mehak Verma', amount: 1200, settled: false },
      { memberUid: 'user-arjun', memberName: 'Arjun Rao', amount: 1200, settled: false },
    ],
    date: '2026-11-01',
    createdAt: '2026-11-01T14:30:00Z',
    notes: 'Weekly pantry restocking, vegetables, dairy, olive oil.'
  },
  {
    id: 'exp-03',
    householdId: 'household-chandigarh-3bhk',
    title: 'Airtel Xstream Fiber (300 Mbps Unlimited)',
    amount: 1199,
    currency: 'INR',
    category: 'Internet',
    paidByUid: 'user-mehak',
    paidByName: 'Mehak Verma',
    splitType: 'equal',
    splits: [
      { memberUid: 'user-aanya', memberName: 'Aanya Sharma', amount: 300, settled: false },
      { memberUid: 'user-riya', memberName: 'Riya Patel', amount: 300, settled: false },
      { memberUid: 'user-mehak', memberName: 'Mehak Verma', amount: 299, settled: true },
      { memberUid: 'user-arjun', memberName: 'Arjun Rao', amount: 300, settled: false },
    ],
    date: '2026-10-28',
    createdAt: '2026-10-28T18:00:00Z',
  },
  {
    id: 'exp-04',
    householdId: 'household-chandigarh-3bhk',
    title: 'Electricity Bill (PSPCL Bi-monthly)',
    amount: 3200,
    currency: 'INR',
    category: 'Electricity',
    paidByUid: 'user-arjun',
    paidByName: 'Arjun Rao',
    splitType: 'equal',
    splits: [
      { memberUid: 'user-aanya', memberName: 'Aanya Sharma', amount: 800, settled: false },
      { memberUid: 'user-riya', memberName: 'Riya Patel', amount: 800, settled: false },
      { memberUid: 'user-mehak', memberName: 'Mehak Verma', amount: 800, settled: false },
      { memberUid: 'user-arjun', memberName: 'Arjun Rao', amount: 800, settled: true },
    ],
    date: '2026-10-25',
    createdAt: '2026-10-25T11:20:00Z',
  },
  {
    id: 'exp-05',
    householdId: 'household-chandigarh-3bhk',
    title: 'Eco-Friendly Detergents & Mop Refills',
    amount: 640,
    currency: 'INR',
    category: 'Cleaning supplies',
    paidByUid: 'user-aanya',
    paidByName: 'Aanya Sharma',
    splitType: 'equal',
    splits: [
      { memberUid: 'user-aanya', memberName: 'Aanya Sharma', amount: 160, settled: true },
      { memberUid: 'user-riya', memberName: 'Riya Patel', amount: 160, settled: false },
      { memberUid: 'user-mehak', memberName: 'Mehak Verma', amount: 160, settled: false },
      { memberUid: 'user-arjun', memberName: 'Arjun Rao', amount: 160, settled: false },
    ],
    date: '2026-10-20',
    createdAt: '2026-10-20T16:45:00Z',
  }
];

export const DEMO_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-01',
    householdId: 'household-chandigarh-3bhk',
    name: 'A2 Farm Cow Milk',
    category: 'Groceries',
    quantity: 0.5,
    minThreshold: 2.0,
    unit: 'liters',
    addedByUid: 'user-aanya',
    addedByName: 'Aanya Sharma',
    isShoppingListItem: true,
    claimedByUid: 'user-arjun',
    claimedByName: 'Arjun Rao',
    lastPurchasedDate: '2026-10-30',
    createdAt: '2026-10-15T08:00:00Z'
  },
  {
    id: 'inv-02',
    householdId: 'household-chandigarh-3bhk',
    name: 'Finish Quantum Dishwasher Pods',
    category: 'Cleaning',
    quantity: 4,
    minThreshold: 15,
    unit: 'pods',
    addedByUid: 'user-riya',
    addedByName: 'Riya Patel',
    isShoppingListItem: true,
    lastPurchasedDate: '2026-10-10',
    createdAt: '2026-10-15T08:00:00Z'
  },
  {
    id: 'inv-03',
    householdId: 'household-chandigarh-3bhk',
    name: 'Extra Virgin Cold-Pressed Olive Oil',
    category: 'Kitchen',
    quantity: 2.5,
    minThreshold: 1.0,
    unit: 'liters',
    addedByUid: 'user-mehak',
    addedByName: 'Mehak Verma',
    isShoppingListItem: false,
    lastPurchasedDate: '2026-10-25',
    createdAt: '2026-10-15T08:00:00Z'
  },
  {
    id: 'inv-04',
    householdId: 'household-chandigarh-3bhk',
    name: 'Organic Whole Wheat Sharbati Atta',
    category: 'Groceries',
    quantity: 8.0,
    minThreshold: 3.0,
    unit: 'kg',
    addedByUid: 'user-arjun',
    addedByName: 'Arjun Rao',
    isShoppingListItem: false,
    lastPurchasedDate: '2026-10-28',
    createdAt: '2026-10-15T08:00:00Z'
  },
  {
    id: 'inv-05',
    householdId: 'household-chandigarh-3bhk',
    name: 'Multi-Surface Disinfectant Spray',
    category: 'Cleaning',
    quantity: 2,
    minThreshold: 1,
    unit: 'bottles',
    addedByUid: 'user-aanya',
    addedByName: 'Aanya Sharma',
    isShoppingListItem: false,
    lastPurchasedDate: '2026-10-20',
    createdAt: '2026-10-15T08:00:00Z'
  }
];

export const DEMO_CHORES: ChoreItem[] = [
  {
    id: 'chore-01',
    householdId: 'household-chandigarh-3bhk',
    title: 'Deep Clean Kitchen Counters & Stovetop',
    category: 'Kitchen',
    assignedToUid: 'user-arjun',
    assignedToName: 'Arjun Rao',
    assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    dueDate: '2026-11-03',
    estimatedMinutes: 25,
    difficulty: 'medium',
    points: 20,
    recurring: 'weekly',
    status: 'pending',
    streakCount: 3
  },
  {
    id: 'chore-02',
    householdId: 'household-chandigarh-3bhk',
    title: 'Living Room Vacuuming & Sofa Dusting',
    category: 'Cleaning',
    assignedToUid: 'user-riya',
    assignedToName: 'Riya Patel',
    assignedAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    dueDate: '2026-11-04',
    estimatedMinutes: 20,
    difficulty: 'easy',
    points: 15,
    recurring: 'weekly',
    status: 'pending',
    streakCount: 4
  },
  {
    id: 'chore-03',
    householdId: 'household-chandigarh-3bhk',
    title: 'Balcony Plants Watering & Dry Leaves Clearing',
    category: 'Cleaning',
    assignedToUid: 'user-aanya',
    assignedToName: 'Aanya Sharma',
    assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    dueDate: '2026-11-02',
    estimatedMinutes: 15,
    difficulty: 'easy',
    points: 10,
    recurring: 'daily',
    status: 'completed',
    completedAt: '2026-11-02T08:30:00Z',
    completedByUid: 'user-aanya',
    streakCount: 7
  },
  {
    id: 'chore-04',
    householdId: 'household-chandigarh-3bhk',
    title: 'Common Bathroom Scrubbing & Glass Polish',
    category: 'Bathroom',
    assignedToUid: 'user-mehak',
    assignedToName: 'Mehak Verma',
    assignedAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=250&q=80',
    dueDate: '2026-11-05',
    estimatedMinutes: 40,
    difficulty: 'hard',
    points: 35,
    recurring: 'weekly',
    status: 'pending',
    streakCount: 2
  },
  {
    id: 'chore-05',
    householdId: 'household-chandigarh-3bhk',
    title: 'Garbage Disposal & Recycling Segregation',
    category: 'Garbage',
    assignedToUid: 'user-arjun',
    assignedToName: 'Arjun Rao',
    assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    dueDate: '2026-11-02',
    estimatedMinutes: 10,
    difficulty: 'easy',
    points: 10,
    recurring: 'daily',
    status: 'completed',
    completedAt: '2026-11-02T07:15:00Z',
    completedByUid: 'user-arjun',
    streakCount: 5
  }
];

export const DEMO_AGREEMENT: RentalAgreement = {
  id: 'agr-homesync-2026-001',
  propertyId: 'prop-chd-35',
  propertyTitle: 'The Ivory Heights — Sunlit 3BHK Residence',
  propertyAddress: 'Flat 402, Block B, Ivory Heights, Sector 35-C, Chandigarh',
  landlordUid: 'landlord-vikram',
  landlordName: 'Vikram Singh',
  tenantUid: 'user-aanya',
  tenantName: 'Aanya Sharma',
  monthlyRent: 24000,
  securityDeposit: 48000,
  startDate: '2026-04-01',
  endDate: '2027-03-31',
  noticePeriodDays: 30,
  rentDueDayOfMonth: 5,
  maintenanceResponsibilities: 'Landlord covers structural, plumbing, and major electrical repairs. Tenants are responsible for day-to-day cleanliness, consumable filters, and minor bulb replacements.',
  earlyTerminationConditions: 'A minimum 30 days notice in writing via HomeSync. If terminated earlier without notice, 1 month rent is deductible.',
  depositSettlementConditions: 'Security deposit of ₹48,000 is securely held. At move-out, mutual inspection comparison is completed within 7 days, and full settlement disbursed minus verified damages.',
  status: 'active',
  tenantSignature: {
    signed: true,
    timestamp: '2026-03-28T14:10:00Z',
    signatureName: 'Aanya Sharma'
  },
  landlordSignature: {
    signed: true,
    timestamp: '2026-03-28T16:45:00Z',
    signatureName: 'Vikram Singh'
  },
  createdAt: '2026-03-27T10:00:00Z',
  activatedAt: '2026-04-01T00:00:00Z'
};

export const DEMO_DEPOSIT: SecurityDepositWallet = {
  id: 'dep-wallet-001',
  agreementId: 'agr-homesync-2026-001',
  propertyId: 'prop-chd-35',
  propertyTitle: 'The Ivory Heights 3BHK',
  householdId: 'household-chandigarh-3bhk',
  amount: 48000,
  currency: 'INR',
  status: 'HELD',
  heldSince: '2026-04-01',
  timeline: [
    {
      stage: 'Agreement Finalized',
      date: '2026-03-28',
      description: 'Tenancy terms mutually signed by Aanya Sharma and Vikram Singh.'
    },
    {
      stage: 'Deposit Secured in Escrow Simulation',
      date: '2026-04-01',
      description: '₹48,000 security deposit locked into HomeSync simulated trust wallet.'
    },
    {
      stage: 'Move-in Condition Recorded',
      date: '2026-04-02',
      description: 'Comprehensive 4-room condition report signed with 8 photographic proofs.'
    }
  ]
};

export const DEMO_INSPECTION: PropertyInspection = {
  id: 'insp-move-in-001',
  propertyId: 'prop-chd-35',
  householdId: 'household-chandigarh-3bhk',
  type: 'move_in',
  date: '2026-04-02',
  inspectorName: 'Aanya Sharma',
  inspectorRole: 'tenant',
  status: 'acknowledged_by_counterpart',
  createdAt: '2026-04-02T11:00:00Z',
  rooms: [
    {
      roomName: 'Living & Dining Hall',
      condition: 'excellent',
      notes: 'Walls freshly painted in warm ivory. Italian marble flooring spotless. Sofa set in pristine shape.',
      photos: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
      ],
      fixturesChecked: [
        { name: 'Ceiling Fan & Lights', status: 'working' },
        { name: 'Split AC Remote', status: 'working' },
        { name: 'Sliding Balcony Door Lock', status: 'working' }
      ]
    },
    {
      roomName: 'Modular Kitchen',
      condition: 'good',
      notes: 'Chimney and gas stove functioning smoothly. Minor scuff on lower cabinet drawer interior.',
      photos: [
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
      ],
      fixturesChecked: [
        { name: 'RO Water Purifier', status: 'working' },
        { name: 'Exhaust Chimney', status: 'working' },
        { name: 'Dishwasher Drain', status: 'working' }
      ]
    },
    {
      roomName: 'Master Bedroom',
      condition: 'excellent',
      notes: 'King size bed frame with mattress protector. Wardrobe sliding doors slide smoothly.',
      photos: [
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80'
      ],
      fixturesChecked: [
        { name: 'Inverter AC', status: 'working' },
        { name: 'Geyser in Attached Bath', status: 'working' }
      ]
    }
  ]
};

export const DEMO_MAINTENANCE: MaintenanceRequest[] = [
  {
    id: 'maint-01',
    householdId: 'household-chandigarh-3bhk',
    propertyId: 'prop-chd-35',
    propertyTitle: 'The Ivory Heights 3BHK',
    tenantUid: 'user-aanya',
    tenantName: 'Aanya Sharma',
    title: 'Water Purifier Filter Periodic Replacement',
    description: 'The TDS indicator on the Kent RO is beeping for routine cartridge change.',
    category: 'Plumbing',
    priority: 'medium',
    photos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'RESOLVED',
    createdAt: '2026-10-18T10:00:00Z',
    updatedAt: '2026-10-20T14:30:00Z',
    assignedTechnician: 'Ramesh Plumbers (Urban Company)',
    landlordNotes: 'Technician visited and installed original pre-carbon filter. Covered under warranty.'
  },
  {
    id: 'maint-02',
    householdId: 'household-chandigarh-3bhk',
    propertyId: 'prop-chd-35',
    propertyTitle: 'The Ivory Heights 3BHK',
    tenantUid: 'user-mehak',
    tenantName: 'Mehak Verma',
    title: 'Balcony Door Sliding Track Lubrication',
    description: 'Sliding mesh screen sticks slightly when pulling shut during windy evenings.',
    category: 'Carpentry',
    priority: 'low',
    photos: [],
    status: 'IN_PROGRESS',
    createdAt: '2026-10-29T16:00:00Z',
    updatedAt: '2026-11-01T11:00:00Z',
    landlordNotes: 'Carpenter scheduled to visit Wednesday afternoon at 3:00 PM.'
  }
];

export const DEMO_RENT_PAYMENTS: RentPayment[] = [
  {
    id: 'rent-pay-nov-2026',
    householdId: 'household-chandigarh-3bhk',
    agreementId: 'agr-homesync-2026-001',
    month: 'November 2026',
    dueDate: '2026-11-05',
    amount: 24000,
    status: 'paid',
    paidAt: '2026-11-01T09:00:00Z',
    paidByUid: 'user-aanya',
    paidByName: 'Aanya Sharma',
    paymentMethod: 'UPI AutoPay (Simulated)',
    receiptId: 'REC-HS-2026-11-042'
  },
  {
    id: 'rent-pay-oct-2026',
    householdId: 'household-chandigarh-3bhk',
    agreementId: 'agr-homesync-2026-001',
    month: 'October 2026',
    dueDate: '2026-10-05',
    amount: 24000,
    status: 'paid',
    paidAt: '2026-10-03T10:15:00Z',
    paidByUid: 'user-aanya',
    paidByName: 'Aanya Sharma',
    paymentMethod: 'UPI AutoPay (Simulated)',
    receiptId: 'REC-HS-2026-10-038'
  },
  {
    id: 'rent-pay-sep-2026',
    householdId: 'household-chandigarh-3bhk',
    agreementId: 'agr-homesync-2026-001',
    month: 'September 2026',
    dueDate: '2026-09-05',
    amount: 24000,
    status: 'paid',
    paidAt: '2026-09-04T12:00:00Z',
    paidByUid: 'user-aanya',
    paidByName: 'Aanya Sharma',
    paymentMethod: 'UPI AutoPay (Simulated)',
    receiptId: 'REC-HS-2026-09-029'
  }
];

export const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'user-aanya',
    householdId: 'household-chandigarh-3bhk',
    title: 'Smart Replenishment Alert',
    message: 'Milk is running low (0.5 L remaining). Arjun claimed to buy it on his way home.',
    type: 'inventory',
    read: false,
    createdAt: '2026-11-02T09:15:00Z'
  },
  {
    id: 'notif-2',
    userId: 'user-aanya',
    householdId: 'household-chandigarh-3bhk',
    title: 'Rent Paid for November',
    message: '₹24,000 sent to landlord Vikram Singh. Roommate split breakdown generated.',
    type: 'rent',
    read: true,
    createdAt: '2026-11-01T09:05:00Z'
  },
  {
    id: 'notif-3',
    userId: 'user-aanya',
    householdId: 'household-chandigarh-3bhk',
    title: 'Chore Assigned',
    message: 'Arjun completed Garbage Disposal! Next: Kitchen Counters assigned to Arjun.',
    type: 'chore',
    read: true,
    createdAt: '2026-11-01T15:20:00Z'
  }
];
