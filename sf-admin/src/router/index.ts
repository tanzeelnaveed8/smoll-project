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
                title: 'Members'
              }
            },
            {
              path: ':memberId',
              component: MemberInfoView,
              meta: {
                title: 'Members / Information'
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
          path: '/cases',
          children: [
            {
              path: '',
              component: CasesView,
              meta: {
                title: 'Cases'
              }
            },
            {
              path: ':caseId',
              component: CasePreviewView,
              meta: {
                title: 'Cases / Preview'
              }
            }
          ]
        },
        {
          path: '/settings',
          component: SettingsView,
          meta: {
            title: 'Settings'
          }
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
