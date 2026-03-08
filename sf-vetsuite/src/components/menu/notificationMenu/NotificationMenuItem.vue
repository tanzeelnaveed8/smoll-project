<template>
  <v-list-item style="border-bottom: 1px solid #dde7ee" class="pa-4">
    <v-sheet class="d-flex flex-column text-grey1 font-weight-medium" style="line-height: 20px">
      <span class="text-grey2 mt-1 font-weight-medium text-message d-flex align-center">
        <v-icon class="mr-2" style="color: #00a5ff">$tb-info-circle</v-icon
        >{{ notification.message }}
      </span>
      <span class="text-body-2 font-weight-bold mt-2 ml-8" style="color: #808080">
        {{ dayjs(notification.createdAt).fromNow() }}
      </span>
    </v-sheet>
  </v-list-item>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'

defineProps<{
  notification: any
}>()
</script>

<style>
.text-message {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
