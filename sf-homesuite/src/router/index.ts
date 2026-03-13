import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import ScheduleView from '@/views/ScheduleView.vue'
import VisitDetailView from '@/views/VisitDetailView.vue'
import VisitsView from '@/views/VisitsView.vue'
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
          component: DashboardView,
          meta: { title: 'Dashboard' }
        },
        {
          path: '/schedule',
          component: ScheduleView,
          meta: { title: 'My Schedule' }
        },
        {
          path: '/visits/:id',
          component: VisitDetailView,
          meta: { title: 'Visit Detail' }
        },
        {
          path: '/history',
          component: VisitsView,
          meta: { title: 'Visit History' }
        },
        {
          path: '/finance',
          component: FinanceView,
          meta: { title: 'Finance' }
        }
      ]
    },
    {
      path: '/login',
      component: LoginView
    }
  ]
})

export default router
