import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignInView from '../views/SignInView.vue'
import MainLayout from '../components/layout/MainLayout.vue'
import CalendarView from '@/views/CalendarView.vue'
import SettingsView from '@/views/SettingsView.vue'
import RequestView from '@/views/RequestView.vue'
import ServiceView from '@/views/ServiceView.vue'
import ProductView from '@/views/ProductView.vue'
import VeterinariansView from '@/views/VeterinariansView.vue'
import CustomersView from '@/views/CustomersView.vue'
import SmollCareView from '../views/SmollCareView.vue'
import FinanceView from '@/views/FinanceView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          component: HomeView,
          meta: {
            title: 'Dashboard'
          }
        },
        {
          path: '/bookings',
          component: CalendarView,
          meta: {
            title: 'Bookings'
          }
        },
        {
          path: '/visits',
          component: RequestView,
          meta: {
            title: 'Visits'
          }
        },
        {
          path: '/quotations',
          component: RequestView,
          meta: {
            title: 'Visits'
          }
        },
        {
          path: '/services',
          component: ServiceView,
          meta: {
            title: 'Services'
          }
        },
        {
          path: '/products',
          component: ProductView,
          meta: {
            title: 'Products'
          }
        },
        {
          path: '/customers',
          component: CustomersView,
          meta: {
            title: 'Customers'
          }
        },
        {
          path: '/veterinarians',
          component: VeterinariansView,
          meta: {
            title: 'Veterinarians'
          }
        },
        {
          path: '/settings',
          component: SettingsView,
          meta: {
            title: 'Settings'
          }
        },
        {
          path: '/smoll-care',
          component: SmollCareView,
          meta: {
            title: 'Smoll Care'
          }
        },
        {
          path: '/finance',
          component: FinanceView,
          meta: {
            title: 'Finance'
          }
        }
      ]
    },
    {
      path: '/login',
      component: SignInView
    }
  ]
})

export default router
