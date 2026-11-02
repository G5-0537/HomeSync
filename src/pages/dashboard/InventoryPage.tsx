import React, { useState } from 'react';
import { useHousehold } from '../../context/HouseholdContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { localStore } from '../../services/localStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { InventoryModal } from '../../components/dashboard/InventoryModal';
import { 
  PackageOpen, 
  Plus, 
  ShoppingCart, 
  AlertTriangle, 
  Check, 
  Minus, 
  UserCheck,
  Sparkles,
  Search
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { household, inventory, refreshData } = useHousehold();
  const { user } = useAuth();
  const { success } = useToast();

  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const lowStockItems = inventory.filter(i => i.quantity <= i.minThreshold);
  const shoppingListItems = inventory.filter(i => i.isShoppingListItem || i.quantity <= i.minThreshold);

  const handleUpdateQuantity = (id: string, newQty: number) => {
    localStore.updateInventoryQuantity(id, newQty);
    refreshData();
  };

  const handleClaimItem = (id: string, itemName: string) => {
    localStore.claimShoppingItem(id, user?.uid || 'user-aanya', user?.name || 'Aanya Sharma');
    success(`Claimed "${itemName}"! Your roommates know you're buying this.`);
    refreshData();
  };

  const handleToggleShoppingList = (id: string) => {
    localStore.toggleShoppingListStatus(id);
    refreshData();
  };

  const filteredInventory = inventory.filter(item => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (search.trim() && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Shared Pantry & Household Inventory
            </h1>
            <Badge variant="sage">Smart Replenishment</Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500">
            Real-time supply tracking, automatic low-stock notifications, and shared grocery runs.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setInventoryModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Add Supply Item
        </Button>
      </div>

      {/* Smart Replenishment & Shopping List Banner */}
      <Card className="p-6 bg-ivory-50 border-amber-300 shadow-premium space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-charcoal-200/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-charcoal-900">
                Shared Grocery & Shopping List ({shoppingListItems.length} items needed)
              </h3>
              <p className="text-xs text-charcoal-500">
                Triggered automatically when supplies fall below minimum threshold
              </p>
            </div>
          </div>
          <Badge variant="warning">SMART RESTOCK ACTIVE</Badge>
        </div>

        {shoppingListItems.length === 0 ? (
          <p className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            ✨ Pantry is fully stocked! Nothing is currently below threshold.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {shoppingListItems.map(item => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-white dark:bg-charcoal-800 border border-amber-200 dark:border-amber-800/60 shadow-2xs space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-charcoal-900 dark:text-white">{item.name}</span>
                    <Badge variant="danger" size="sm">LOW</Badge>
                  </div>
                  <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 mt-1">
                    Current: <strong>{item.quantity} {item.unit}</strong> (Min: {item.minThreshold} {item.unit})
                  </p>
                </div>

                <div className="pt-2 border-t border-charcoal-100 dark:border-charcoal-700 flex items-center justify-between text-xs">
                  {item.claimedByName ? (
                    <span className="text-[11px] font-semibold text-sage-800 dark:text-sage-300 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      Claimed by {item.claimedByName}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleClaimItem(item.id, item.name)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sage-50 dark:bg-sage-950/40 hover:bg-sage-100 dark:hover:bg-sage-900/50 text-sage-800 dark:text-sage-300 border border-sage-300 dark:border-sage-800 transition-colors"
                    >
                      I will buy this
                    </button>
                  )}

                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + (item.unit === 'liters' ? 2 : 5))}
                    className="text-[10px] text-charcoal-400 dark:text-charcoal-400 hover:text-charcoal-700 dark:hover:text-white underline"
                  >
                    Restocked? +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Full Pantry Inventory Table & Search */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-charcoal-100">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pantry & inventory..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-ivory-50 border border-charcoal-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-charcoal-500">Category:</span>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="bg-ivory-50 border border-charcoal-200 text-xs rounded-xl px-2.5 py-1.5 text-charcoal-800"
            >
              <option value="all">All Categories</option>
              <option value="Groceries">Groceries</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Toiletries">Toiletries</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInventory.map(item => {
            const isLow = item.quantity <= item.minThreshold;
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-white dark:bg-charcoal-800 border border-charcoal-200/80 dark:border-charcoal-700 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-charcoal-900 dark:text-white">{item.name}</h4>
                    <span className="text-[10px] text-charcoal-500 dark:text-charcoal-300 bg-charcoal-100 dark:bg-charcoal-700 px-2 py-0.5 rounded-md mt-1 inline-block">
                      {item.category}
                    </span>
                  </div>
                  <Badge variant={isLow ? 'warning' : 'sage'} size="sm">
                    {isLow ? 'Low Stock' : 'Good'}
                  </Badge>
                </div>

                {/* Stepper counter */}
                <div className="bg-ivory-50 dark:bg-charcoal-900/60 p-2.5 rounded-xl border border-charcoal-200/60 dark:border-charcoal-700 flex items-center justify-between">
                  <span className="text-xs text-charcoal-600 dark:text-charcoal-300">Stock on Hand:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 0.5)}
                      className="w-6 h-6 rounded-md bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 flex items-center justify-center hover:bg-charcoal-100 dark:hover:bg-charcoal-700 text-charcoal-700 dark:text-ivory-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-display font-bold text-sm text-charcoal-900 dark:text-white min-w-12 text-center">
                      {item.quantity} {item.unit}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 0.5)}
                      className="w-6 h-6 rounded-md bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 flex items-center justify-center hover:bg-charcoal-100 dark:hover:bg-charcoal-700 text-charcoal-700 dark:text-ivory-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-charcoal-400 pt-1">
                  <span>Threshold: {item.minThreshold} {item.unit}</span>
                  <button
                    onClick={() => handleToggleShoppingList(item.id)}
                    className="text-sage-700 hover:underline font-medium"
                  >
                    {item.isShoppingListItem ? 'On Shopping List ✓' : '+ Add to Shopping List'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <InventoryModal
        isOpen={inventoryModalOpen}
        onClose={() => setInventoryModalOpen(false)}
      />
    </div>
  );
};
