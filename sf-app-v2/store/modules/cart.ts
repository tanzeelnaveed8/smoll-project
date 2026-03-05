import { create } from "zustand";
import { CartItem, CartItemType, CartState } from "../types/cart";

function computeItemTotal(item: CartItem): number {
  const base = item.unitPrice * item.quantity;
  const addonsTotal =
    item.addons?.reduce((sum, addon) => sum + addon.price * item.quantity, 0) ?? 0;
  return base + addonsTotal;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  schedule: null,

  addOrUpdateItem: (itemInput) => {
    const { items } = get();
    const quantity = itemInput.quantity ?? 1;
    const keyMatches = (it: CartItem) =>
      it.id === itemInput.id &&
      it.type === itemInput.type &&
      it.packageId === itemInput.packageId;

    const existingIndex = items.findIndex(keyMatches);

    if (existingIndex === -1) {
      const newItem: CartItem = {
        ...itemInput,
        quantity,
        addons: itemInput.addons ?? [],
      };
      set({ items: [...items, newItem] });
    } else {
      const next = [...items];
      const existing = next[existingIndex];
      next[existingIndex] = {
        ...existing,
        ...itemInput,
        quantity: quantity,
        addons: itemInput.addons ?? existing.addons ?? [],
      };
      set({ items: next });
    }
  },

  removeItem: (id, type) => {
    const { items } = get();
    set({
      items: items.filter((it) => !(it.id === id && it.type === type)),
    });
  },

  updateQuantity: (id, type, quantity) => {
    if (quantity <= 0) {
      const { removeItem } = get();
      removeItem(id, type);
      return;
    }

    const { items } = get();
    set({
      items: items.map((it) =>
        it.id === id && it.type === type ? { ...it, quantity } : it
      ),
    });
  },

  clearCart: () => {
    set({ items: [] });
  },

  setSchedule: (schedule) => {
    set({ schedule });
  },

  getTotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + computeItemTotal(item), 0);
  },
}));

