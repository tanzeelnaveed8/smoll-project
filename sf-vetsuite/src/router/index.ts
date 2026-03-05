import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignInView from '../views/SignInView.vue'
import MainLayout from '../components/layout/MainLayout.vue'
import InboxView from '@/views/InboxView.vue'
import CalendarView from '@/views/CalendarView.vue'
import SettingsView from '@/views/SettingsView.vue'
import CasesView from '@/views/CasesView.vue'
import VideoView from '@/views/VideoView.vue'
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
          path: '/visit-details',
          component: InboxView,
          meta: {
            title: 'Visit Details'
          }
        },
        {
          path: '/inbox',
          component: InboxView,
          meta: {
            title: 'Visit Details'
          }
        },
        {
          path: '/my-schedule',
          component: CalendarView,
          meta: {
            title: 'My Schedule'
          }
        },
        {
          path: '/calendar',
          component: CalendarView,
          meta: {
            title: 'My Schedule'
          }
        },
        {
          path: '/visits',
          component: CasesView,
          meta: {
            title: 'Visits'
          }
        },
        {
          path: '/cases',
          component: CasesView,
          meta: {
            title: 'Visits'
          }
        },
        {
          path: '/finance',
          component: FinanceView,
          meta: {
            title: 'Finance'
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
          path: '/consultation/:consultationId',
          component: VideoView,
          meta: {
            title: 'Video'
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
