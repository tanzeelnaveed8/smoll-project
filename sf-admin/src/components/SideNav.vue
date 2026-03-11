<template>
  <v-navigation-drawer permanent width="272" class="side-nav position-fixed">
    <template v-slot:prepend>
      <v-img src="/smoll.png" height="22" width="80" class="mx-8 mb-6 mt-9" />
    </template>
    <v-list color="transparent" :opened="openedGroups">
      <template v-for="(item, i) in navItems" :key="i">
        <v-list-group v-if="item.children" value="smoll-home" class="side-nav--group">
          <template #activator="{ props: activatorProps }">
            <v-list-item
              v-bind="activatorProps"
              :prepend-icon="item.icon"
              class="pl-8 side-nav--link text-grey1"
              style="font-weight: 600"
            >
              {{ item.title }}
            </v-list-item>
          </template>
          <v-list-item
            v-for="(child, j) in item.children"
            :key="j"
            :to="child.to"
            active-class="side-nav--active"
            class="side-nav--link text-grey1 pl-14"
            style="font-weight: 600"
          >
            {{ child.title }}
          </v-list-item>
        </v-list-group>
        <v-list-item
          v-else
          :prepend-icon="item.icon"
          :active="item.to === '/' ? $route.path === '/' : undefined"
          :to="item.to"
          active-class="side-nav--active"
          class="pl-8 side-nav--link text-grey1"
          style="font-weight: 600"
        >
          {{ item.title }}
        </v-list-item>
      </template>
    </v-list>

    <template v-slot:append>
      <div class="mb-5">
        <v-divider />
        <v-btn
          variant="plain"
          color="alert"
          height="auto"
          @click="handleLogout"
          class="text-body-1 opacity-100 px-8 py-3 w-100 justify-start"
          style="font-weight: 600; line-height: 24px"
        >
          <template v-slot:prepend>
            <v-icon icon="$tb-layout-sidebar" size="24" class="mr-1" />
          </template>
          Logout
        </v-btn>
        <p class="px-9 text-body-2" style="font-weight: 600">V 2.0</p>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const openedGroups = computed(() =>
  ['/products', '/services', '/finance'].includes(route.path) ? ['smoll-home'] : []
)

const navItems = [
  { title: 'Home', icon: '$tb-smart-home', to: '/' },
  {
    title: 'smoll®Home',
    icon: '$tb-heart-handshake',
    children: [
      { title: 'Product', to: '/products' },
      { title: 'Service', to: '/services' },
      { title: 'Finance', to: '/finance' }
    ]
  },
  { title: 'Visits', icon: '$tb-writing-sign', to: '/visits' },
  { title: 'Customers', icon: '$tb-users', to: '/members' },
  { title: 'Experts', icon: '$tb-first-aid-kit', to: '/experts' },
  { title: 'Counsellors', icon: '$tb-user-circle', to: '/counsellors' },
  { title: 'Partner management', icon: '$tb-heart-handshake', to: '/partners' },
  { title: 'Organizations', icon: '$tb-organizations', to: '/organizations' },
  { title: 'Settings', icon: '$tb-settings', to: '/settings' }
]

const handleLogout = async () => {
  await authStore.logout()

  router.replace('/login')
}
</script>

<style lang="scss" scoped>
.side-nav:deep(.v-navigation-drawer__content) {
  overflow: hidden;
}

.side-nav--link {
  border: none;

  &::after {
    border: none !important;
  }

  &:deep(.v-list-item-title) {
    font-weight: 600 !important;
  }
  & :deep(.v-list-item__prepend) {
    display: contents;

    .v-icon {
      margin-right: 12px;
      opacity: 1;
    }
    .v-list-item__spacer {
      display: none;
    }
  }
}

.side-nav--active {
  color: #427594 !important;
  background-color: #f1f8ff !important;
  position: relative;

  &::after {
    content: '';
    display: flex;
    border: none !important;
    width: 4px;
    height: 100%;
    background-color: #427594;
    opacity: 1;
    position: absolute;
    left: calc(100% - 4px);
    z-index: 1000;
    border-radius: 4px 0px 0px 4px;
  }
}

.side-nav--active:deep(.v-list-item__overlay) {
  opacity: 0 !important;
}
</style>
