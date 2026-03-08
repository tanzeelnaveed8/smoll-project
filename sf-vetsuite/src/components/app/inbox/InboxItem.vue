<template>
  <v-sheet
    style="border-bottom: 1px solid #dde7ee"
    class="pb-8 d-flex flex-column align-start gr-3"
  >
    <v-sheet class="d-flex justify-space-between w-100">
      <div class="d-flex flex-column gr-3" style="font-weight: 600">
        <div class="d-flex align-center" style="gap: 10px">
          <p style="font-weight: 600">{{ item.member }}</p>
          <v-chip
            variant="outlined"
            :color="item.type === 'instant' ? '#10AFE1' : '#6C10E1'"
            rounded="lg"
            density="comfortable"
            class="px-2"
            style="font-weight: 600"
            :text="item.type === 'instant' ? 'Instant Call' : 'Appointment Scheduled'"
          />
        </div>

        <div>
          <p class="text-grey2 mb-1">
            Pet Name:
            <span class="text-grey1" style="margin-left: 10px">{{ item.pet ?? '-' }}</span>
          </p>

          <p class="text-grey2" v-if="item.type === 'instant'">
            Case brief:
            <span class="text-grey1" style="margin-left: 10px">
              {{ truncateString(item.caseBrief ?? '-', 150) }}
            </span>
          </p>

          <p class="text-grey2 mt-2 d-flex align-center">
            Status:
            <v-chip
              class="text-grey1 text-capitalize text-white font-weight-medium"
              :color="getStatusData(item.status).color"
              variant="flat"
              style="margin-left: 10px"
            >
              {{ getStatusData(item.status).label ?? '-' }}
            </v-chip>
          </p>
        </div>
      </div>
      <div style="min-width: fit-content">
        <p class="text-body-2 text-grey2 font-weight-medium" style="line-height: 24px">
          {{ dayjs(item.createdAt).fromNow() }}
        </p>
      </div>
    </v-sheet>

    <v-sheet
      v-if="item.type !== 'instant'"
      class="d-flex flex-column gr-1"
      style="font-weight: 600"
    >
      <h5 class="text-body-1 font-weight-bold">Appointment Details</h5>
      <p class="text-grey2">
        Booking Date:

        <span style="margin-left: 6px" class="text-grey1 font-weight-medium">{{
          dayjs(item.scheduledAt).format('dddd, D MMMM YYYY')
        }}</span>
      </p>
      <p class="text-grey2">
        Slot:<span style="margin-left: 6px" class="text-grey1 font-weight-medium">{{
          dayjs(item.scheduledAt).format('hh:mm A')
        }}</span>
      </p>
    </v-sheet>

    <v-btn
      v-push
      @click="handleClick"
      :disabled="actionLoading || !item.pet"
      :loading="actionLoading"
      class="mt-3"
    >
      {{ item.type === 'instant' ? 'View the Case' : 'Review Appointment' }}
    </v-btn>

    <v-dialog v-model="drawer" transition="slide-x-reverse-transition" width="auto" class="dialog">
      <InboxDetailsDrawer
        @close="drawer = false"
        :type="item.type"
        :consultation="consultationDetail!"
      />
    </v-dialog>
  </v-sheet>
</template>

<script lang="ts" setup>
import InboxDetailsDrawer from '@/components/drawer/inboxDetailsDrawer/InboxDetailsDrawer.vue'
import useMitt from '@/functions/useMitt'
import { useChatStore } from '@/stores/chat'
import { useConsultationStore } from '@/stores/consultation'
import { type Consultation } from '@/stores/types/consultation.d'
import { getStatusData, truncateString } from '@/utils/helpers'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{ item: Consultation }>()

const { emitter } = useMitt()
const consultationStore = useConsultationStore()
const { consultationDetailMap } = storeToRefs(consultationStore)
const chatStore = useChatStore()

const { newMessageCount } = storeToRefs(chatStore)

const drawer = ref(false)
const actionLoading = ref(false)

const consultationDetail = computed(() => consultationDetailMap.value.get(props.item.id))

onMounted(() => {
  emitter.on('inbox-view:CLOSE_DRAWER', () => {
    drawer.value = false
  })
})

onUnmounted(() => {
  emitter.off('inbox-view:CLOSE_DRAWER')
})

const handleClick = async () => {
  try {
    const existingMessage = newMessageCount.value.get('0')
    actionLoading.value = true
    newMessageCount.value.set('0', existingMessage ? existingMessage - 1 : 0)
    await consultationStore.fetchConsultationDetails(props.item.id)
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
</style>
