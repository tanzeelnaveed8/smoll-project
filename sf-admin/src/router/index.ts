import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignInView from '../views/SignInView.vue'
import MainLayout from '../components/layout/MainLayout.vue'
import VeterniansView from '@/views/VeterniansView.vue'
import MembersView from '@/views/MembersView.vue'
import PartnerView from '@/views/PartnerView.vue'
import CasesView from '@/views/CasesView.vue'
import AddNewVetView from '@/views/AddNewVetView.vue'
import AddPartnerView from '@/views/AddPartnerView.vue'
import VerifyPartner from '@/views/VerifyPartner.vue'
import PartnerInfoView from '@/views/PartnerInfoView.vue'
import CasePreviewView from '@/views/CasePreviewView.vue'
import MemberInfoView from '@/views/MemberInfoView.vue'
import VetInfoView from '@/views/VetInfoView.vue'
import OrganizationsView from '@/views/OrganizationsView.vue'
import OrganizationInfoView from '@/views/OrganizationInfoView.vue'
import VerifyOtpView from '@/views/VerifyOtpView.vue'
import SettingsView from '@/views/SettingsView.vue'
import ServicesView from '@/views/ServicesView.vue'
import ProductsView from '@/views/ProductsView.vue'
import FinanceView from '@/views/FinanceView.vue'
import AddMemberView from '@/views/AddMemberView.vue'
import AddVisitView from '@/views/AddVisitView.vue'
import CounsellorsView from '@/views/CounsellorsView.vue'
import AddCounsellorView from '@/views/AddCounsellorView.vue'
import CounsellorInfoView from '@/views/CounsellorInfoView.vue'

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
            title: 'Home'
          }
        },
        {
          path: '/experts',
          children: [
            {
              path: '',
              component: VeterniansView,
              meta: {
                title: 'Experts'
              }
            },
            {
              path: 'add-vet',
              component: AddNewVetView,
              meta: {
                title: 'Experts / Add expert'
              }
            },
            {
              path: ':vetId',
              component: VetInfoView,
              meta: {
                title: 'Experts / Added expert'
              }
            }
          ]
        },

        {
          path: '/members',
          children: [
            {
              path: '',
              component: MembersView,
              meta: {
                title: 'Customers'
              }
            },
            {
              path: 'add',
              component: AddMemberView,
              meta: {
                title: 'Customers / Add Customer'
              }
            },
            {
              path: ':memberId',
              component: MemberInfoView,
              meta: {
                title: 'Customers / Information'
              }
            }
          ]
        },

        {
          path: '/partners',
          children: [
            {
              path: '',
              component: PartnerView,
              meta: {
                title: 'Partners'
              }
            },
            {
              path: 'add-partner',
              component: AddPartnerView,
              meta: {
                title: 'Partner management / Add'
              }
            },
            {
              path: 'verify-partner',
              component: VerifyPartner,
              meta: {
                title: 'Partner management / Partner Request'
              }
            },
            {
              path: ':partnerId',
              component: PartnerInfoView,
              meta: {
                title: 'Partner management / Partner Information'
              }
            }
          ]
        },

        {
          path: '/visits',
          children: [
            {
              path: '',
              component: CasesView,
              meta: {
                title: 'Visits'
              }
            },
            {
              path: 'add',
              component: AddVisitView,
              meta: {
                title: 'Visits / Add Visit'
              }
            },
            {
              path: ':caseId',
              component: CasePreviewView,
              meta: {
                title: 'Visits / Details'
              }
            }
          ]
        },
        {
          path: '/cases',
          redirect: '/visits'
        },
        {
          path: '/cases/:caseId',
          redirect: (to) => `/visits/${to.params.caseId}`
        },
        {
          path: '/services',
          component: ServicesView,
          meta: {
            title: 'Services'
          }
        },
        {
          path: '/products',
          component: ProductsView,
          meta: {
            title: 'Products'
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
          path: '/counsellors',
          children: [
            {
              path: '',
              component: CounsellorsView,
              meta: {
                title: 'Counsellors'
              }
            },
            {
              path: 'add',
              component: AddCounsellorView,
              meta: {
                title: 'Counsellors / Add'
              }
            },
            {
              path: ':counsellorId',
              component: CounsellorInfoView,
              meta: {
                title: 'Counsellors / Information'
              }
            }
          ]
        },
        {
          path: '/organizations',
          children: [
            {
              path: '',
              component: OrganizationsView,
              meta: {
                title: 'Organizations'
              }
            },
            {
              path: ':id',
              component: OrganizationInfoView,
              meta: {
                title: 'Organizations / Details'
              }
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      component: SignInView
    }
    ,
    {
      path: '/verify-otp',
      component: VerifyOtpView
    }
  ]
})

export default router
