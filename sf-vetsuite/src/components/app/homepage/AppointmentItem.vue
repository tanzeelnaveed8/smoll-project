<template>
  <v-sheet
    style="padding: 14px 0px; font-weight: 600; border-bottom: 1px solid #dde7ee"
    class="d-flex justify-space-between align-center"
  >
    <v-sheet class="d-flex justify-space-between w-100" max-width="780" style="text-wrap: nowrap">
      <span class="d-flex align-center gc-2">
        <v-icon icon="$tb-user-circle" />
        <p>{{ consultation.member }}</p>
      </span>
      <span class="d-flex align-center gc-3">
        <span class="d-flex gc-2">
          <p>Appointment On:</p>
          <p>{{ dayjs(consultation.scheduledAt).format('dddd, DD MMMM YYYY (z)') }}</p>
        </span>
        <v-chip
          color="#10AFE1"
          variant="flat"
          rounded="lg"
          class="pa-1 time"
          style="font-weight: 600; list-style: 24px"
          >{{ dayjs(consultation.scheduledAt).format('hh:mm A') }}</v-chip
        >
      </span>
    </v-sheet>

    <v-btn
      class="px-3"
      @click="handleClick"
      flat
      v-push
      :disabled="actionLoading"
      :loading="actionLoading"
      >View details</v-btn
    >
    <v-dialog v-model="drawer" transition="slide-x-reverse-transition" width="auto" class="dialog">
      <InboxDetailsDrawer
        @close="drawer = false"
        type="scheduled"
        :consultation="consultationDetail!"
      />
    </v-dialog>
  </v-sheet>
</template>

<script lang="ts" setup>
import InboxDetailsDrawer from '@/components/drawer/inboxDetailsDrawer/InboxDetailsDrawer.vue'
import { useConsultationStore } from '@/stores/consultation'
import type { Consultation } from '@/stores/types/consultation'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const props = defineProps<{
  consultation: Consultation
}>()

dayjs.extend(advancedFormat)

const drawer = ref(false)
const actionLoading = ref(false)

const consultationStore = useConsultationStore()
const { consultationDetailMap } = storeToRefs(consultationStore)

const consultationDetail = computed(() => consultationDetailMap.value.get(props.consultation.id))

const handleClick = async () => {
  try {
    actionLoading.value = true
    await consultationStore.fetchConsultationDetails(props.consultation.id)
    drawer.value = true
  } finally {
    actionLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.dialog:deep(.v-overlay__content) {
  right: 0;
}

.time {
  &:deep(.v-chip__content) {
    line-height: 24px;
  }
}
</style>
