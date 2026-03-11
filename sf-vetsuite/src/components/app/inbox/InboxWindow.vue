<template>
  <v-sheet
    max-width="34.18%"
    min-width="507"
    class="d-flex flex-column gr-8 px-6 py-8 scroll-window bg-white"
  >
    <v-sheet
      v-if="loading"
      class="d-flex justify-center align-center"
      height="100%"
      style="height: calc(100vh - 124px)"
    >
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-sheet>
    <v-sheet v-else-if="!loading && !inboxItems?.length" class="d-flex justify-center">
      <div style="margin-top: 210px">
        <v-img src="/no-consultation.png" width="201" />
      </div>
    </v-sheet>

    <v-sheet v-else v-for="item in inboxItems" :key="item?.id">
      <InboxItem :item="item" />
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import type { Consultation } from '@/stores/types/consultation'
import InboxItem from './InboxItem.vue'

const props = defineProps<{
  inboxItems: Consultation[]
  loading: boolean
}>()
</script>

<style lang="scss" scoped>
.scroll-window {
  border-right: 1px solid #dde7ee;
  overflow-y: scroll;
  height: calc(100vh - 135px);

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>

<style lang="scss" scoped></style>
