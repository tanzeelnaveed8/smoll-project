<template>
  <v-app-bar
    app
    border
    style="border: none; border-bottom: 1px solid #dde7ee; background-color: #fff"
    class="px-8 position-fixed"
    height="60"
    flat
  >
    <div
      class="text-body-1 ma-0 text-grey1 w-100"
      style="line-height: 24px; font-weight: 700; color: black !important"
      v-html="rawTitle"
    ></div>

    <v-menu offset="10">
      <template v-slot:activator="{ props }">
        <v-btn
          v-push
          icon="$tb-bell"
          density="compact"
          :class="notificationIndicator && 'is-notified'"
          color="transparent"
          style="margin: 0px"
          v-bind="props"
        />
      </template>
      <NotificationMenu />
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'
import { ref, watchEffect } from 'vue'
import NotificationMenu from './menu/notificationMenu/NotificationMenu.vue'

const notificationStore = useNotificationStore()
const { notificationIndicator } = storeToRefs(notificationStore)

const props = defineProps<{
  title: string
}>()

const rawTitle = ref('')

watchEffect(() => {
  const title = props.title

  const updatedTitle =
    title.split('/').length > 1
      ? `
  ${title.split('/').slice(0, -1).join('/')} /
    <span style='color:#222'>${title.split('/').slice(-1)}</span>`
      : title.split('/')[0]

  rawTitle.value = updatedTitle
})
</script>
