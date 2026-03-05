/**
 * Mock service detail data: packages and add-ons per service.
 * Used by ServiceDetailsScreen for package/addon selection and cart.
 */

import type { ServiceId } from "./homeServices";

export interface ServicePackageOption {
  id: string;
  name: string;
  /** Display label (e.g. "AED 40"). */
  priceLabel: string;
  /** Numeric price for cart. */
  price: number;
  perks: string[];
  highlighted?: boolean;
}

export interface ServiceAddonOption {
  id: string;
  name: string;
  /** Display label (e.g. "+AED 10"). */
  priceLabel: string;
  /** Numeric price for cart. */
  price: number;
}

/** Default packages used for grooming and fallback for other services. */
const DEFAULT_PACKAGES: ServicePackageOption[] = [
  {
    id: "basic",
    name: "Basic Care",
    priceLabel: "AED 40",
    price: 40,
    highlighted: true,
    perks: ["Standard service", "Health check", "Report card"],
  },
  {
    id: "premium",
    name: "Premium",
    priceLabel: "AED 60",
    price: 60,
    perks: ["Everything in Basic", "Premium products", "Extended time", "Photo update"],
  },
  {
    id: "deluxe",
    name: "Deluxe Spa",
    priceLabel: "AED 88",
    price: 88,
    perks: ["Everything in Premium", "Luxury treatment", "Gourmet treat", "Take-home bandana"],
  },
];

/** Default add-ons. */
const DEFAULT_ADDONS: ServiceAddonOption[] = [
  { id: "shampoo", name: "Premium Shampoo", priceLabel: "+AED 10", price: 10 },
  { id: "teeth", name: "Teeth Cleaning", priceLabel: "+AED 20", price: 20 },
  { id: "pickup", name: "Pickup & Drop", priceLabel: "+AED 30", price: 30 },
];

/** Per-service overrides. If not set, DEFAULT_PACKAGES and DEFAULT_ADDONS are used. */
const SERVICE_PACKAGES: Partial<Record<ServiceId, ServicePackageOption[]>> = {};
const SERVICE_ADDONS: Partial<Record<ServiceId, ServiceAddonOption[]>> = {};

export function getServicePackages(serviceId: ServiceId): ServicePackageOption[] {
  return SERVICE_PACKAGES[serviceId] ?? DEFAULT_PACKAGES;
}

export function getServiceAddons(serviceId: ServiceId): ServiceAddonOption[] {
  return SERVICE_ADDONS[serviceId] ?? DEFAULT_ADDONS;
}
