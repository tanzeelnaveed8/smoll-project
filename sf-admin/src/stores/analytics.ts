import api from '@/util/api'
import { defineStore } from 'pinia'

export interface Analytics {
  cases: number
  partners: number
  vets: number
  members: number
  services: number
  products: number
  openCases: number
  closedCases: number
  escalatedCases: number
  totalRevenue?: number
}

/** Normalize API response so card keys always match (handles snake_case from backend if any) */
function normalizeAnalytics(raw: Record<string, unknown> | null): Analytics | null {
  if (!raw || typeof raw !== 'object') return null
  const num = (v: unknown): number => (typeof v === 'number' ? v : Number.isFinite(Number(v)) ? Number(v) : 0)
  return {
    cases: num(raw.cases),
    partners: num(raw.partners),
    vets: num(raw.vets),
    members: num(raw.members),
    services: num(raw.services),
    products: num(raw.products),
    openCases: num(raw.openCases ?? (raw as Record<string, unknown>).open_cases),
    closedCases: num(raw.closedCases ?? (raw as Record<string, unknown>).closed_cases),
    escalatedCases: num(raw.escalatedCases ?? (raw as Record<string, unknown>).escalated_cases),
    totalRevenue: num(raw.totalRevenue ?? (raw as Record<string, unknown>).total_revenue),
  }
}

export const useAnalyticsStore = defineStore('AnalyticsStore', {
  state: () => ({}),
  actions: {
    async fetchAnalytics(): Promise<Analytics> {
      const { data } = await api.get('/admin/analytics')
      const normalized = normalizeAnalytics(data as Record<string, unknown>)
      return normalized ?? {
        cases: 0,
        partners: 0,
        vets: 0,
        members: 0,
        services: 0,
        products: 0,
        openCases: 0,
        closedCases: 0,
        escalatedCases: 0,
        totalRevenue: 0,
      }
    }
  }
})
