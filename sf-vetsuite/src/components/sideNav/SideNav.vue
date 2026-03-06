<template>
  <v-navigation-drawer permanent width="272" class="side-nav position-fixed">
    <template v-slot:prepend>
      <v-sheet class="d-flex justify-space-between px-6">
        <v-icon icon="$tb-logo" size="118" style="height: 62px" class="my-6" />
      </v-sheet>
    </template>
    <v-list color="transparent" class="px-3 d-flex flex-column gr-1">
      <v-list-item
        v-push
        v-for="(link, i) in links"
        :key="i"
        :prepend-icon="link.icon"
        :active="link.to === '/' ? $route.path === '/' : undefined"
        active-class="side-nav--active"
        :to="link.to"
        class="side-nav--link text-grey1 rounded-lg"
        style="font-weight: 600"
      >
        <v-sheet
          class="d-flex justify-space-between align-center"
          style="color: inherit; font-weight: inherit"
        >
          {{ link.title }}

          <div
            v-if="link.to === '/inbox' && unreadMessagesCount"
            class="text-white text-caption rounded-circle d-flex justify-center align-center"
            style="
              background-color: #e31f7d;
              border: 1px solid #c01e6c;
              width: 18px;
              height: 18px;
              line-height: 14px;
            "
          >
            {{ unreadMessagesCount }}
          </div>
        </v-sheet>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <SideNavFooter />
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import SideNavFooter from './SideNavFooter.vue'
import { useChatStore } from '@/stores/chat'
import { useSound } from '@/functions/useSound'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { ZimHelper } from '@/utils/zim'

const links = [
  { title: 'Dashboard', icon: '$tb-smart-home', to: '/' },
  { title: 'Inbox', icon: '$tb-mail-box', to: '/inbox' },
  { title: 'Calendar', icon: '$tb-calender-month', to: '/calendar' },
  { title: 'Cases', icon: '$tb-writing-sign', to: '/cases' },
  { title: 'Finance', icon: '$tb-square-arrow-up', to: '/finance' },
  { title: 'Settings', icon: '$tb-settings', to: '/settings' }
]
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const chatStore = useChatStore()

const { newMessageCount } = storeToRefs(chatStore)

const unreadMessagesCount = computed(() => {
  let countMessage = 0
  Array.from(newMessageCount.value.values()).forEach((count) => (countMessage += count))
  return countMessage
})

const handleUnreadMessage = async () => {
  if (!ZimHelper.zim) return

  await new Promise((resolve) => setTimeout(resolve, 1000))

  const unreadMessage = await chatStore.getUnreadMessagesCount()
  newMessageCount.value.set('0', unreadMessage)
}

onMounted(async () => {
  if (user) {
    await handleUnreadMessage()
  }
})
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
      margin-right: 20px;
      opacity: 1;
    }
    .v-list-item__spacer {
      display: none;
    }
  }
}

.side-nav--active {
  background-color: #f4f6f8 !important;
  color: black !important;
  font-weight: 700 !important;

  &:deep(.icon) {
    stroke-width: 1.7 !important;
  }
}

.side-nav--link {
  &:hover {
    background-color: #f4f6f8cb;
  }
  &:deep(.v-list-item__overlay) {
    opacity: 0 !important;
  }
}
</style>
