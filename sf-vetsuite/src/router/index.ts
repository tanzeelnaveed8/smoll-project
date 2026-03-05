import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignInView from '../views/SignInView.vue'
import MainLayout from '../components/layout/MainLayout.vue'
import InboxView from '@/views/InboxView.vue'
import CalendarView from '@/views/CalendarView.vue'
import SettingsView from '@/views/SettingsView.vue'
import CasesView from '@/views/CasesView.vue'
import VideoView from '@/views/VideoView.vue'

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
          path: '/inbox',
          component: InboxView,
          meta: {
            title: 'Inbox'
          }
        },
        {
          path: '/calendar',
          component: CalendarView,
          meta: {
            title: 'Calendar'
          }
        },
        {
          path: '/cases',
          component: CasesView,
          meta: {
            title: 'Cases'
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
