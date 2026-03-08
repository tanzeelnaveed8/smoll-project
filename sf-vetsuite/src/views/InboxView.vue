<template>
  <v-sheet height="100%" width="100%">
    <v-sheet
      height="100%"
      color="#fff"
      class="d-flex flex-column w-100"
      style="border-right: 1px solid #dde7ee"
    >
      <v-tabs
        v-model="tab"
        class="tabs px-5 text-grey2"
        height="auto"
        style="padding-top: 14px; border-bottom: 1px solid #dde7ee"
      >
        <v-tab
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          style="line-height: 24px; font-weight: 600"
          class="py-2 px-3 pb-4 text-body-1"
          min-width="auto"
          height="auto"
        >
          {{ tab.label }}
        </v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab" style="background-color: #f8fafb">
        <v-tabs-window-item value="chat"> <ChatView /> </v-tabs-window-item>
        <v-tabs-window-item value="instant">
          <InboxWindow
            ref="inboxScrollEle"
            :inboxItems="consultations!"
            :loading
            :drawer
            @close:drawer="drawer = false"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import InboxWindow from '@/components/app/inbox/InboxWindow.vue'
import { useConsultationStore } from '@/stores/consultation'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useMitt from '@/functions/useMitt'
import { toast } from 'vue3-toastify'
import { SocketEventEnum, socket } from '@/utils/socket'
import { useAuthStore } from '@/stores/auth'
import ChatView from '@/components/app/chat/ChatView.vue'

const inboxScrollEle = ref(null)

const tabs = [
  {
    label: 'Chat',
    value: 'chat'
  },
  {
    label: 'Video Call',
    value: 'instant'
  }
]

const { emitter } = useMitt()
const route = useRoute()
const router = useRouter()

const userStore = useAuthStore()
const consultationStore = useConsultationStore()

const { consultations } = storeToRefs(consultationStore)
const { user } = storeToRefs(userStore)

const tab = ref<'instant' | 'chat'>('chat')
const toastId = ref()

const drawer = ref(false)
const loading = ref(false)

watch(tab, (t) => {
  router.push(`/inbox?tab=${t}`)
})

onMounted(async () => {
  socket.on(SocketEventEnum.VET_REQUEST_CONSULTATION, async ({ by }) => {
    await consultationStore.fetchConsultation('all')
  })

  socket.on(SocketEventEnum.VET_CONSULTATION_SCHEDULED, async ({ by, vetId }) => {
    if (user.value?.id === vetId) {
      consultationStore.fetchConsultation('all')
    }
  })

  socket.on(SocketEventEnum.VET_CONSULTATION_CASE_UPDATED, async ({ consultationId }) => {
    const foundConsultation = consultations.value?.find(
      (consultation) => consultation.id === consultationId
    )

    if (foundConsultation) {
      await consultationStore.fetchConsultation('all')
    }
  })

  socket.on(SocketEventEnum.VET_END_CONSULTATION, async ({ consultationId, vetId }) => {
    if (user.value?.id === vetId) {
      consultationStore.fetchConsultation('all')

      emitter.emit('inbox-view:CLOSE_DRAWER')
    }
  })

  socket.on(SocketEventEnum.MEMBER_CANCEL_CONSULTATION, async ({ consultationId }) => {
    const foundConsultation = consultations.value?.find(
      (consultation) => consultation.id === consultationId
    )

    if (foundConsultation) {
      consultationStore.fetchConsultation('all')
      emitter.emit('inbox-view:CLOSE_DRAWER')
    }
  })

  fetchConsultation()

  if (route.query.tab === 'instant') {
    tab.value = 'instant'
  } else {
    tab.value = 'chat'
  }
})

const fetchConsultation = async () => {
  try {
    loading.value = true
    await consultationStore.fetchConsultation('all')
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  toast.remove(toastId.value)

  socket.off(SocketEventEnum.VET_REQUEST_CONSULTATION)
  socket.off(SocketEventEnum.VET_CONSULTATION_CASE_UPDATED)
  socket.off(SocketEventEnum.VET_END_CONSULTATION)
})
</script>

<style scoped lang="scss">
.tabs:deep(.v-slide-group__content) {
  gap: 16px;
}
.tabs:deep(.v-tab-item--selected) {
  color: #222222 !important;
}

.tabs:deep(.v-tab__slider) {
  color: #427594;
  height: 4px;
}

.dialog:deep(.v-overlay__content) {
  right: 0;
  height: 100%;
  background: #fff;
}
</style>
@/functions/useMitt
