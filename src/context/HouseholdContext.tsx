import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Household, 
  Expense, 
  InventoryItem, 
  ChoreItem, 
  MemberBalance, 
  SettlementSuggestion, 
  RentalAgreement, 
  SecurityDepositWallet,
  PropertyInspection,
  MaintenanceRequest,
  RentPayment,
  AppNotification
} from '../types';
import { localStore } from '../services/localStore';
import { firestoreDb } from '../services/firestoreDbService';
import { calculateBalances, calculateOptimalSettlements } from '../services/fairnessEngine';
import { useAuth } from './AuthContext';

interface HouseholdContextType {
  household: Household;
  expenses: Expense[];
  inventory: InventoryItem[];
  chores: ChoreItem[];
  balances: MemberBalance[];
  settlements: SettlementSuggestion[];
  agreement: RentalAgreement | undefined;
  deposit: SecurityDepositWallet | undefined;
  inspections: PropertyInspection[];
  maintenance: MaintenanceRequest[];
  rentPayments: RentPayment[];
  notifications: AppNotification[];
  refreshData: () => void;
}

const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined);

export const HouseholdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeHouseholdId, user } = useAuth();

  const [household, setHousehold] = useState<Household>(() => {
    return localStore.getHouseholdById(activeHouseholdId) || localStore.getHouseholds()[0];
  });
  const [expenses, setExpenses] = useState<Expense[]>(() => localStore.getExpenses(household?.id));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => localStore.getInventory(household?.id));
  const [chores, setChores] = useState<ChoreItem[]>(() => localStore.getChores(household?.id));
  const [agreement, setAgreement] = useState<RentalAgreement | undefined>(() => {
    return localStore.getAgreements().find(a => a.id === household?.agreementId) || localStore.getAgreements()[0];
  });
  const [deposit, setDeposit] = useState<SecurityDepositWallet | undefined>(() => localStore.getDepositWallet(household?.id));
  const [inspections, setInspections] = useState<PropertyInspection[]>(() => localStore.getInspections(household?.id));
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>(() => localStore.getMaintenanceRequests(household?.id));
  const [rentPayments, setRentPayments] = useState<RentPayment[]>(() => localStore.getRentPayments(household?.id));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => localStore.getNotifications(user?.uid));

  const [balances, setBalances] = useState<MemberBalance[]>(() => {
    return household ? calculateBalances(household.members, expenses) : [];
  });
  const [settlements, setSettlements] = useState<SettlementSuggestion[]>(() => {
    return calculateOptimalSettlements(balances);
  });

  const refreshData = async () => {
    const currentH = (await firestoreDb.getHousehold(activeHouseholdId)) || localStore.getHouseholdById(activeHouseholdId) || localStore.getHouseholds()[0];
    setHousehold(currentH);
    if (!currentH) return;

    const currentExp = await firestoreDb.getExpenses(currentH.id);
    const currentInv = await firestoreDb.getInventory(currentH.id);
    const currentChores = await firestoreDb.getChores(currentH.id);
    const currentAgr = (await firestoreDb.getAgreement(currentH.agreementId)) || localStore.getAgreements()[0];
    const currentDep = (await firestoreDb.getDepositWallet(currentH.id)) || localStore.getDepositWallet(currentH.id);
    const currentMaint = await firestoreDb.getMaintenanceRequests(currentH.id);

    setExpenses(currentExp);
    setInventory(currentInv);
    setChores(currentChores);
    setAgreement(currentAgr);
    setDeposit(currentDep);
    setInspections(localStore.getInspections(currentH.id));
    setMaintenance(currentMaint);
    setRentPayments(localStore.getRentPayments(currentH.id));
    setNotifications(localStore.getNotifications(user?.uid));

    const newBalances = calculateBalances(currentH.members, currentExp);
    setBalances(newBalances);
    setSettlements(calculateOptimalSettlements(newBalances));
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = localStore.subscribe(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, [activeHouseholdId, user?.uid]);

  return (
    <HouseholdContext.Provider
      value={{
        household,
        expenses,
        inventory,
        chores,
        balances,
        settlements,
        agreement,
        deposit,
        inspections,
        maintenance,
        rentPayments,
        notifications,
        refreshData,
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
};

export const useHousehold = () => {
  const ctx = useContext(HouseholdContext);
  if (!ctx) throw new Error('useHousehold must be used within HouseholdProvider');
  return ctx;
};
