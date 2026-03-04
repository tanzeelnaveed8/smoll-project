<template>
  <v-sheet
    class="pb-6"
    rounded="md"
    style="overflow: hidden"
    width="390"
    min-height="210"
    max-height="419"
  >
    <v-sheet class="d-flex justify-space-between px-6 pt-6 pb-4">
      <h1 class="text-h6" style="line-height: 24px; font-weight: 600">Notifications</h1>

      <v-btn
        variant="plain"
        class="px-0"
        @click="readAllNotification"
        :disabled="!notifications?.data.length"
      >
        Read All
      </v-btn>
    </v-sheet>

    <v-divider color="#dde7ee" class="opacity-100" />
    <v-sheet
      v-if="!notifications?.data.length && !loading"
      class="d-flex justify-center align-center py-12"
    >
      <p class="font-weight-bold text-grey2" style="font-size: 18px">No new notifications</p>
    </v-sheet>

    <v-list
      v-else
      class="py-0 notifications"
      style="background-color: transparent"
      max-height="319"
    >
      <v-skeleton-loader
        v-for="i in 3"
        :key="i"
        v-if="loading"
        type="list-item-three-line"
        style="height: 108px"
      />

      <NotificationMenuItem
        v-else
        v-for="notification in notifications?.data"
        :key="notification.id"
        :notification
      />
    </v-list>
  </v-sheet>
</template>

<script lang="ts" setup>
import { useNotificationStore } from '@/stores/notification'
import NotificationMenuItem from './NotificationMenuItem.vue'
import { onMounted, ref } from 'vue'

const { fetchNotification, readAllNotifications } = useNotificationStore()

const notifications = ref()
const loading = ref(false)

const fetchNotifications = async () => {
  try {
    loading.value = true
    const fetchedNotification = await fetchNotification()
    notifications.value = fetchedNotification
  } finally {
    loading.value = false
  }
}

const readAllNotification = async () => {
  if (!notifications.value.data.length) return
  await readAllNotifications()
}

onMounted(async () => {
  fetchNotifications()
})
</script>

<style lang="scss" scoped>
.notifications::-webkit-scrollbar {
  display: none;
}
</style>
