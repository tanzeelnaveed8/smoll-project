<template>
  <v-sheet class="mb-8 d-flex flex-column gr-6">
    <v-sheet class="px-6 d-flex flex-column gr-8">
      <v-sheet class="d-flex flex-column gr-2">
        <v-avatar
          size="52"
          color="#d5d5d5"
          class="ma-2 ml-0 text-grey2"
          icon="$tb-user"
          :image="user?.profileImg?.url"
        />
        <div class="text-body-2 text-grey2">
          <p
            class="text-grey1 text-body-1"
            style="font-family: 'CooperLtBT' !important; font-weight: 600; line-height: 24px"
          >
            {{ user?.name }}
          </p>
          <p class="font-weight-medium">{{ user?.designation ?? '-' }}</p>
          <p class="font-weight-medium">{{ user?.email ?? '-' }}</p>
        </div>
      </v-sheet>
      <v-sheet>
        <p style="margin-bottom: 2px; line-height: 24px; font-weight: 600" class="text-body-2">
          Status
        </p>
        <v-select
          v-model="status"
          class="text-body-2 select"
          density="compact"
          :menu-props="{ offset: '12px' }"
          :list-props="{ style: 'border: 1px solid #D0D7DC' }"
          hide-details="auto"
          placeholder="Status"
          :items="statusOptions"
          @update:model-value="handleStatusChange"
        >
          <template #item="{ item, props, index }">
            <v-list-item
              class="px-3 py-2 select-item"
              min-height="auto"
              :value="item"
              activable
              v-bind="props"
              :style="`border-top:${index !== 0 && '1px solid #D0D7DC'}`"
            >
              <v-icon v-if="item.value === status" icon="$tb-check" size="20" />
            </v-list-item>
          </template>
        </v-select>
      </v-sheet>
    </v-sheet>

    <div style="border-top: 1px solid #dde7ee">
      <v-btn
        variant="plain"
        color="grey1"
        height="auto"
        class="mt-2 text-body-1 opacity-100 px-8 py-3 w-100 justify-start"
        style="font-weight: 600; line-height: 24px"
        @click="modalConfirmation = true"
      >
        <template v-slot:prepend>
          <v-icon icon="$tb-user-circle" size="24" class="mr-2" />
        </template>
        Sign out
      </v-btn>
    </div>
  </v-sheet>
  <v-dialog v-model="modalConfirmation" width="auto">
    <ConfirmationModal
      text="Are you sure you want to sign out?"
      btnText="Sign out"
      @close="modalConfirmation = false"
      @closeAll="handleLogout"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ZimHelper } from '@/utils/zim'
import ConfirmationModal from '../modal/ConfirmationModal.vue'
import * as Sentry from '@sentry/vue'

const authStore = useAuthStore()
const router = useRouter()

const { user } = storeToRefs(authStore)

const statusOptions = ref([
  { title: 'Online', value: 'online' },
  { title: 'Offline', value: 'offline' }
])
const status = ref<'online' | 'offline'>(user.value?.isOnline ? 'online' : 'offline')
const modalConfirmation = ref(false)
const inactivityTimeout = ref<number | null>(null)

const INACTIVITY_TIMEOUT = 45 * 60 * 1000

const resetInactivityTimer = () => {
  if (inactivityTimeout.value) {
    window.clearTimeout(inactivityTimeout.value)
  }

  if (status.value === 'online') {
    inactivityTimeout.value = window.setTimeout(async () => {
      status.value = 'offline'
      await handleStatusChange()
    }, INACTIVITY_TIMEOUT)
  }
}

const handleUserActivity = () => {
  resetInactivityTimer()
}

onMounted(() => {
  // Add event listeners for user activity
  window.addEventListener('mousemove', handleUserActivity)
  window.addEventListener('keydown', handleUserActivity)
  window.addEventListener('mousedown', handleUserActivity)
  window.addEventListener('touchstart', handleUserActivity)

  // Initialize the inactivity timer
  resetInactivityTimer()
})

onBeforeUnmount(() => {
  // Clean up event listeners
  window.removeEventListener('mousemove', handleUserActivity)
  window.removeEventListener('keydown', handleUserActivity)
  window.removeEventListener('mousedown', handleUserActivity)
  window.removeEventListener('touchstart', handleUserActivity)

  // Clear any existing timeout
  if (inactivityTimeout.value) {
    window.clearTimeout(inactivityTimeout.value)
  }
})

const handleLogout = async () => {
  if (inactivityTimeout.value) {
    window.clearTimeout(inactivityTimeout.value)
  }
  modalConfirmation.value = false
  status.value = 'offline'
  try {
    await handleStatusChange()
  } catch {
    // ignore – proceed with logout
  }
  try {
    ZimHelper.logout()
  } catch {
    // ignore
  }
  await authStore.logout()
  Sentry.setUser(null)
  router.replace('/login')
}

const handleStatusChange = async () => {
  const isOnline = status.value === 'online'
  authStore.updateUser({ isOnline })
}
</script>

<style lang="scss" scoped>
.select {
  &:deep(.v-field) {
    background-color: #ededed;
    font-weight: 600;
    border-color: #e1e1e2;
    padding-right: 8px;
  }

  &:deep(.v-field__input) {
    padding: 6px 0px 6px 12px !important;
  }

  &:deep(.v-select__selection-text) {
    font-size: 14px;
    line-height: 20px;
    overflow: visible;
  }

  &:deep(.v-input__control) {
    height: 36px;
  }

  &:deep(.v-field__input) > input {
    font-size: 14px;
    line-height: 20px;
  }
}

.select-item {
  &:deep(.v-list-item__content) {
    display: flex;
    justify-content: space-between;
  }

  &:deep(.v-list-item-title) {
    font-size: 14px !important;
    font-weight: 600;
  }
}
</style>
