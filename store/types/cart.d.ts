import { Nullable } from "../types";

export type CartItemType = "service" | "product";

export interface CartAddon {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  type: CartItemType;
  title: string;
  subtitle?: string;
  /** Base unit price (without quantity multiplier). */
  unitPrice: number;
  quantity: number;
  /** Optional package selected for services (e.g. grooming package). */
  packageId?: string;
  packageLabel?: string;
  /** Optional add-ons with individual prices. */
  addons?: CartAddon[];
  /** Optional free-form notes (e.g. special instructions). */
  notes?: string;
}

export interface ScheduleSelection {
  /** Internal ID from the date pill (e.g. mon-14). */
  dateId: string;
  /** Human labels as shown in the UI. */
  labelTop: string;
  labelBottom: string;
  /** Selected time slot label (e.g. 09:00 AM). */
  time: string;
}

export interface CartState {
  items: CartItem[];
  schedule: Nullable<ScheduleSelection>;

  addOrUpdateItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string, type: CartItemType) => void;
  updateQuantity: (id: string, type: CartItemType, quantity: number) => void;
  clearCart: () => void;

  setSchedule: (schedule: ScheduleSelection | null) => void;

  /** Derived total including quantity * unitPrice + add-ons. */
  getTotal: () => number;
}

