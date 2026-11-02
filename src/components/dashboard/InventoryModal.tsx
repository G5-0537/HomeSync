import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useHousehold } from '../../context/HouseholdContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { localStore } from '../../services/localStore';
import { InventoryItem } from '../../types';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose }) => {
  const { household, refreshData } = useHousehold();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryItem['category']>('Groceries');
  const [quantity, setQuantity] = useState('2');
  const [unit, setUnit] = useState('packs');
  const [minThreshold, setMinThreshold] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(quantity);
    const thresh = parseFloat(minThreshold);

    if (!name.trim() || isNaN(qty) || qty < 0) {
      error('Please enter valid item name and quantity');
      return;
    }

    localStore.addInventoryItem({
      householdId: household.id,
      name: name.trim(),
      category,
      quantity: qty,
      minThreshold: isNaN(thresh) ? 1 : thresh,
      unit: unit.trim() || 'units',
      addedByUid: user?.uid || 'user-aanya',
      addedByName: user?.name || 'Aanya Sharma',
      isShoppingListItem: qty <= thresh
    });

    success(`Added ${name} to pantry & inventory!`);
    refreshData();
    onClose();

    setName('');
    setQuantity('2');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Pantry & Household Supply"
      subtitle="Track stock levels and trigger smart replenishment alerts"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-charcoal-700 block mb-1">Item Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Dishwasher Rinse Aid or Olive Oil"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-white border border-charcoal-200 rounded-xl px-3.5 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm text-charcoal-900"
            >
              <option value="Groceries">Groceries</option>
              <option value="Toiletries">Toiletries</option>
              <option value="Cleaning">Cleaning Supplies</option>
              <option value="Kitchen">Kitchen Supplies</option>
              <option value="Utilities">Utilities</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">Unit of Measure</label>
            <select
              value={unit}
              onChange={e => setUnit(e.target.value)}
              className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm text-charcoal-900"
            >
              <option value="units">units</option>
              <option value="liters">liters</option>
              <option value="kg">kg</option>
              <option value="packs">packs</option>
              <option value="bottles">bottles</option>
              <option value="pods">pods</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">Current Quantity</label>
            <input
              type="number"
              step="any"
              min="0"
              required
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm text-charcoal-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">Low-Stock Alert Level</label>
            <input
              type="number"
              step="any"
              min="0.5"
              required
              value={minThreshold}
              onChange={e => setMinThreshold(e.target.value)}
              className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm text-charcoal-900"
            />
          </div>
        </div>

        <p className="text-[11px] text-charcoal-500 bg-ivory-100 p-2.5 rounded-xl border border-charcoal-200/60">
          💡 When the quantity drops below {minThreshold || 1} {unit}, HomeSync will automatically notify roommates and recommend adding it to the shared shopping list.
        </p>

        <div className="pt-3 flex items-center justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Add to Inventory
          </Button>
        </div>
      </form>
    </Modal>
  );
};
