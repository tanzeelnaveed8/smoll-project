<template>
  <div class="vet-dashboard">
    <!-- Header -->
    <div class="dashboard-header mb-5">
      <h1 class="dashboard-title">Vet Admin</h1>
      <p class="dashboard-subtitle">Welcome back! Here's your overview</p>
    </div>

    <!-- Top Stats Cards Row -->
    <v-row class="mb-2">
      <v-col v-for="card in statCards" :key="card.key" cols="6" sm="6" md="3">
        <v-card
          flat
          class="stat-card rounded-xl pa-4 pa-sm-5 d-flex flex-column h-100"
          :to="card.to"
        >
          <div class="d-flex align-center mb-2 mb-sm-3" style="gap: 10px">
            <v-avatar :color="card.iconBg" size="40" rounded="lg">
              <v-icon :icon="card.icon" :color="card.iconColor" size="22" />
            </v-avatar>
            <p class="stat-label">{{ card.title }}</p>
          </div>
          <div class="flex-grow-1">
            <div v-if="loading" class="mb-1">
              <v-skeleton-loader type="text" width="60" />
            </div>
            <p v-else class="stat-value">
              {{ card.prefix }}{{ getCardValue(card.key) }}
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Bottom Section: Upcoming Visits + Recent Orders -->
    <v-row>
      <!-- Upcoming Visits -->
      <v-col cols="12" md="6">
        <v-card flat class="bottom-card rounded-xl h-100">
          <v-card-title class="card-header d-flex align-center justify-space-between pa-4 pa-sm-5 pb-3">
            <div class="d-flex align-center" style="gap: 10px">
              <v-avatar color="#e3f2fd" size="36" rounded="lg">
                <v-icon icon="mdi-calendar-clock" color="#1565C0" size="20" />
              </v-avatar>
              <span class="bottom-card-title">Upcoming Visits</span>
            </div>
            <v-btn
              variant="text"
              color="#1565C0"
              size="small"
              to="/smoll-home/schedule"
              class="text-none font-weight-medium"
              append-icon="mdi-arrow-right"
            >
              View All
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-4 pa-sm-5 pt-3">
            <div v-if="visitsLoading" class="d-flex flex-column" style="gap: 12px">
              <v-skeleton-loader v-for="i in 3" :key="i" type="list-item-avatar-two-line" />
            </div>
            <div v-else-if="!upcomingVisits.length" class="empty-state pa-6">
              <v-icon icon="mdi-calendar-blank" size="48" color="#b0bec5" />
              <p class="mt-2 text-body-2 text-grey-darken-1">No upcoming visits</p>
            </div>
            <div v-else class="d-flex flex-column" style="gap: 12px">
              <div
                v-for="visit in upcomingVisits.slice(0, 5)"
                :key="visit.id"
                class="visit-item rounded-lg pa-3"
              >
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center" style="gap: 10px; min-width: 0">
                    <v-avatar :color="getAvatarColor(visit)" size="36">
                      <span class="text-white text-caption font-weight-bold">{{ getInitials(visit) }}</span>
                    </v-avatar>
                    <div style="min-width: 0">
                      <p class="text-body-2 font-weight-medium text-truncate">{{ visit.memberName || 'Customer' }}</p>
                      <div class="d-flex align-center" style="gap: 6px">
                        <v-icon icon="mdi-clock-outline" size="12" color="grey" />
                        <span class="text-caption text-grey-darken-1">
                          {{ formatVisitDate(visit.scheduledAt) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <v-chip :color="getCaseStatusColor(visit.status)" size="x-small" variant="tonal" class="flex-shrink-0">
                    {{ getCaseStatusLabel(visit.status) }}
                  </v-chip>
                </div>
                <div v-if="visit.petName" class="mt-2 d-flex align-center" style="gap: 4px">
                  <v-icon icon="mdi-paw" size="14" color="#78909c" />
                  <span class="text-caption text-grey-darken-1">{{ visit.petName }}</span>
                </div>
                <div v-if="visit.vetName" class="mt-2 d-flex align-center" style="gap: 4px">
                  <v-icon icon="mdi-stethoscope" size="14" color="#78909c" />
                  <span class="text-caption text-grey-darken-1">{{ visit.vetName }}</span>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Recent Orders / Products -->
      <v-col cols="12" md="6">
        <v-card flat class="bottom-card rounded-xl h-100">
          <v-card-title class="card-header d-flex align-center justify-space-between pa-4 pa-sm-5 pb-3">
            <div class="d-flex align-center" style="gap: 10px">
              <v-avatar color="#fce4ec" size="36" rounded="lg">
                <v-icon icon="mdi-shopping" color="#c62828" size="20" />
              </v-avatar>
              <span class="bottom-card-title">Recent Orders</span>
            </div>
            <v-btn
              variant="text"
              color="#1565C0"
              size="small"
              to="/smoll-home/products"
              class="text-none font-weight-medium"
              append-icon="mdi-arrow-right"
            >
              View All
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-4 pa-sm-5 pt-3">
            <div v-if="ordersLoading" class="d-flex flex-column" style="gap: 12px">
              <v-skeleton-loader v-for="i in 3" :key="i" type="list-item-avatar-two-line" />
            </div>
            <div v-else-if="!recentOrders.length" class="empty-state pa-6">
              <v-icon icon="mdi-package-variant" size="48" color="#b0bec5" />
              <p class="mt-2 text-body-2 text-grey-darken-1">No recent orders</p>
            </div>
            <div v-else class="d-flex flex-column" style="gap: 12px">
              <div
                v-for="(order, idx) in recentOrders.slice(0, 5)"
                :key="idx"
                class="order-item rounded-lg pa-3"
              >
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center" style="gap: 10px; min-width: 0">
                    <v-avatar :color="orderColors[idx % orderColors.length]" size="36" rounded="lg">
                      <v-icon icon="mdi-package-variant-closed" color="white" size="18" />
                    </v-avatar>
                    <div style="min-width: 0">
                      <p class="text-body-2 font-weight-medium text-truncate">{{ order.name }}</p>
                      <span class="text-caption text-grey-darken-1">
                        {{ order.category || 'Product' }}
                      </span>
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <p class="text-body-2 font-weight-bold" style="color: #2e7d32">
                      AED {{ formatPrice(order.price) }}
                    </p>
                    <span class="text-caption" :style="{ color: order.stock > 10 ? '#66bb6a' : order.stock > 0 ? '#ffa726' : '#ef5350' }">
                      {{ order.stock > 0 ? `${order.stock} in stock` : 'Out of stock' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useAnalyticsStore, type Analytics } from '@/stores/analytics'
import { useCaseStore } from '@/stores/case'
import { useProductStore } from '@/stores/product'
import { formatDateTime } from '@/util/vet-helpers'
import { onMounted, ref, computed } from 'vue'

interface DashboardVisit {
  id: string
  memberName: string
  petName: string
  vetName: string
  status: string
  createdAt: string
  scheduledAt: string | null
}

const analyticsStore = useAnalyticsStore()
const caseStore = useCaseStore()
const productStore = useProductStore()

const analytics = ref<Analytics | null>(null)
const loading = ref(true)
const visitsLoading = ref(true)
const ordersLoading = ref(true)
const upcomingVisits = ref<DashboardVisit[]>([])
const recentOrders = ref<any[]>([])

const orderColors = ['#1565C0', '#2e7d32', '#e65100', '#6a1b9a', '#ad1457']

interface StatCard {
  title: string
  key: string
  icon: string
  iconBg: string
  iconColor: string
  to: string
  prefix: string
}

const statCards: StatCard[] = [
  {
    title: 'Total Revenue',
    key: 'totalRevenue',
    icon: 'mdi-cash-multiple',
    iconBg: '#e3f2fd',
    iconColor: '#1565C0',
    to: '/smoll-home/finance',
    prefix: 'AED '
  },
  {
    title: 'Active Visits',
    key: 'openCases',
    icon: 'mdi-calendar-check',
    iconBg: '#e8f5e9',
    iconColor: '#2e7d32',
    to: '/smoll-home/schedule',
    prefix: ''
  },
  {
    title: 'New Customers',
    key: 'members',
    icon: 'mdi-account-group',
    iconBg: '#fff3e0',
    iconColor: '#e65100',
    to: '/smoll-home/customers',
    prefix: ''
  },
  {
    title: 'Low Stock',
    key: 'lowStock',
    icon: 'mdi-alert-circle-outline',
    iconBg: '#fce4ec',
    iconColor: '#c62828',
    to: '/smoll-home/products',
    prefix: ''
  }
]

const lowStockCount = computed(() => {
  return recentOrders.value.filter((p: any) => (p.stock ?? 0) <= 10).length
})

function getCardValue(key: string): string {
  if (key === 'lowStock') return String(lowStockCount.value)
  if (!analytics.value) return '0'
  const v = (analytics.value as any)[key]
  if (v === undefined || v === null) return '0'
  if (key === 'totalRevenue') {
    return Number(v).toLocaleString('en-AE', { maximumFractionDigits: 0 })
  }
  return String(Number(v))
}

function getInitials(visit: DashboardVisit): string {
  const name = visit.memberName || 'C'
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
}

const avatarColors = ['#1565C0', '#2e7d32', '#e65100', '#6a1b9a', '#ad1457', '#00838f']

function getAvatarColor(visit: DashboardVisit): string {
  const name = visit.memberName || ''
  const idx = name.length % avatarColors.length
  return avatarColors[idx]
}

function getCaseStatusColor(status: string): string {
  const colors: Record<string, string> = {
    open: 'success',
    openEscalated: 'warning',
    closed: 'grey'
  }
  return colors[status] || 'info'
}

function getCaseStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    open: 'Open',
    openEscalated: 'Escalated',
    closed: 'Closed'
  }
  return labels[status] || status
}

function formatVisitDate(date: string | null | undefined): string {
  return formatDateTime(date)
}

function formatPrice(price: number | undefined): string {
  if (!price && price !== 0) return '0'
  return Number(price).toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function normalizeCases(rawCases: any[]): DashboardVisit[] {
  return rawCases.map((c: any) => ({
    id: c.id,
    memberName: typeof c.member === 'string' ? c.member : c.member?.name || 'Customer',
    petName: typeof c.pet === 'string' ? c.pet : c.pet?.name || '',
    vetName: typeof c.vet === 'string' ? c.vet : c.assignedVet?.name || c.vet?.name || '',
    status: c.status || 'open',
    createdAt: c.createdAt,
    scheduledAt: c.scheduledAt || c.createdAt
  }))
}

onMounted(async () => {
  const analyticsPromise = analyticsStore.fetchAnalytics()
    .then((data) => { analytics.value = data })
    .catch(() => {})
    .finally(() => { loading.value = false })

  const visitsPromise = caseStore.fetchCases('', 1)
    .then((res) => {
      const cases = res?.data || res || []
      upcomingVisits.value = normalizeCases(Array.isArray(cases) ? cases : []).slice(0, 5)
    })
    .catch(() => {})
    .finally(() => { visitsLoading.value = false })

  const ordersPromise = productStore.fetchProducts('', 1)
    .then((res) => { recentOrders.value = res.data || [] })
    .catch(() => {})
    .finally(() => { ordersLoading.value = false })

  await Promise.allSettled([analyticsPromise, visitsPromise, ordersPromise])
})
</script>

<style scoped>
.vet-dashboard {
  max-width: 100%;
}

.dashboard-header {
  padding-bottom: 4px;
}

.dashboard-title {
  font-size: 26px;
  font-weight: 800;
  color: #1565C0;
  line-height: 1.2;
}

.dashboard-subtitle {
  font-size: 14px;
  font-weight: 500;
  color: #78909c;
  margin-top: 4px;
}

/* Stat Cards */
.stat-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #e8edf5 !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04) !important;
  min-height: 110px;
  background: #fff;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #263238;
  line-height: 1.2;
  margin-bottom: 0;
}

.stat-label {
  font-size: 13px;
  font-weight: 600;
  color: #78909c;
}

/* Bottom Cards */
.bottom-card {
  border: 1px solid #e8edf5 !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04) !important;
}

.bottom-card-title {
  font-size: 16px;
  font-weight: 700;
  color: #263238;
}

.visit-item {
  background: #f8fafe;
  border: 1px solid #e8edf5;
  transition: all 0.2s ease;
}

.visit-item:hover {
  background: #eef4fb;
  border-color: #bbdefb;
}

.order-item {
  background: #fafbfc;
  border: 1px solid #eceff1;
  transition: all 0.2s ease;
}

.order-item:hover {
  background: #f5f7fa;
  border-color: #cfd8dc;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Responsive */
@media (max-width: 960px) {
  .dashboard-title {
    font-size: 22px;
  }

  .stat-value {
    font-size: 22px;
  }
}

@media (max-width: 600px) {
  .dashboard-title {
    font-size: 20px;
  }

  .dashboard-subtitle {
    font-size: 12px;
  }

  .stat-value {
    font-size: 20px;
  }

  .stat-label {
    font-size: 11px;
  }

  .bottom-card-title {
    font-size: 14px;
  }
}
</style>
