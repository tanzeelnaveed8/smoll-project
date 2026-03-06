/**
 * Home Services & Products API.
 * Fetches from backend /member/services and /member/products when authenticated.
 * Falls back to mock data on error or when API is not used.
 */

import api from "@/utils/api";
import type {
  ServiceSummary,
  ProductSummary,
  ServiceId,
  ProductId,
} from "@/mocks/homeServices";
import {
  MOCK_SERVICES,
  MOCK_PRODUCTS,
} from "@/mocks/homeServices";

const ICON_PAIRS: { iconBg: string; iconColor: string }[] = [
  { iconBg: "#FDF2F8", iconColor: "#EC4899" },
  { iconBg: "#EFF6FF", iconColor: "#3B82F6" },
  { iconBg: "#F5F3FF", iconColor: "#8B5CF6" },
  { iconBg: "#ECFDF5", iconColor: "#22C55E" },
  { iconBg: "#FFF7ED", iconColor: "#F97316" },
  { iconBg: "#FEF3C7", iconColor: "#EAB308" },
];

function mapServiceFromApi(item: {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  currency?: string;
}, index: number): ServiceSummary {
  const icons = ICON_PAIRS[index % ICON_PAIRS.length];
  const price = Number(item.price);
  return {
    id: item.id as ServiceId,
    title: item.name,
    durationLabel: "30-60 min",
    priceLabel: `From ${item.currency || "AED"} ${price}`,
    startingPrice: price,
    iconBg: icons.iconBg,
    iconColor: icons.iconColor,
  };
}

function mapProductFromApi(item: {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  currency?: string;
  category?: string | null;
}, index: number): ProductSummary {
  return {
    id: item.id as ProductId,
    title: item.name,
    description: item.description || "",
    priceLabel: `${item.currency || "AED"} ${Number(item.price)}`,
    basePrice: Number(item.price),
    tag: "Vet approved",
    subtitle: item.description || item.name,
  };
}

export interface ServicesApiResponse {
  data: Array<{ id: string; name: string; description?: string | null; price: number; currency?: string }>;
  count?: number;
}

export interface ProductsApiResponse {
  data: Array<{ id: string; name: string; description?: string | null; price: number; currency?: string; category?: string | null }>;
  count?: number;
}

export async function fetchServicesFromApi(): Promise<ServiceSummary[]> {
  try {
    const { data } = await api.get<ServicesApiResponse>("/member/services", {
      params: { limit: 50 },
    });
    const list = Array.isArray(data?.data) ? data.data : [];
    return list.map((item, i) => mapServiceFromApi(item, i));
  } catch {
    return MOCK_SERVICES;
  }
}

export async function fetchProductsFromApi(): Promise<ProductSummary[]> {
  try {
    const { data } = await api.get<ProductsApiResponse>("/member/products", {
      params: { limit: 50 },
    });
    const list = Array.isArray(data?.data) ? data.data : [];
    return list.map((item, i) => mapProductFromApi(item, i));
  } catch {
    return MOCK_PRODUCTS;
  }
}

export async function fetchServiceByIdFromApi(
  id: string
): Promise<ServiceSummary | null> {
  try {
    const { data } = await api.get<{
      id: string;
      name: string;
      description?: string | null;
      price: number;
      currency?: string;
    }>(`/member/services/${id}`);
    if (data) return mapServiceFromApi(data, 0);
  } catch {
    // ignore
  }
  return MOCK_SERVICES.find((s) => s.id === id) ?? null;
}

export async function fetchProductByIdFromApi(
  id: string
): Promise<ProductSummary | null> {
  try {
    const { data } = await api.get<{
      id: string;
      name: string;
      description?: string | null;
      price: number;
      currency?: string;
      category?: string | null;
    }>(`/member/products/${id}`);
    if (data) return mapProductFromApi(data, 0);
  } catch {
    // ignore
  }
  return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
}
