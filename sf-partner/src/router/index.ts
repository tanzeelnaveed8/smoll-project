import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignInView from '../views/SignInView.vue'
import MainLayout from '../components/layout/MainLayout.vue'
import CalendarView from '@/views/CalendarView.vue'
import SettingsView from '@/views/SettingsView.vue'
import RequestView from '@/views/RequestView.vue'
import ServiceView from '@/views/ServiceView.vue'
import VeterinariansView from '@/views/VeterinariansView.vue'
import SmollCareView from '../views/SmollCareView.vue'
import FinanceView from '@/views/FinanceView.vue'
import HomeServicesView from '@/views/HomeServicesView.vue'

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
          path: '/quotations',
          component: RequestView,
          meta: {
            title: 'Quotations'
          }
        },
        {
          path: '/home-services',
          component: HomeServicesView,
          meta: {
            title: 'Home Services'
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
