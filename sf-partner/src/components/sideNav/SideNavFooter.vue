<template>
  <v-sheet class="mb-8 d-flex flex-column gr-6">
    <v-sheet class="px-6 d-flex flex-column gr-8">
      <v-sheet class="d-flex flex-column gr-2">
        <v-avatar
          size="52"
          color="#d5d5d5"
          class="ma-2 ml-0 text-grey2"
          icon="$tb-user"
          :image="user?.clinicImg?.url"
        />
        <div class="text-body-2 text-grey2">
          <p class="text-grey1" style="font-size: 18px; line-height: 24px; font-weight: 600">
            {{ user?.name ?? '-' }}
          </p>
          <p class="font-weight-medium">{{ user?.email ?? '-' }}</p>
        </div>
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
      text="Are you sure you want to signout?"
      btnText="Sign out"
      @close="modalConfirmation = false"
      @closeAll="handleLogout"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import ConfirmationModal from '../modal/ConfirmationModal.vue'
import * as Sentry from "@sentry/vue";


const authStore = useAuthStore()
const router = useRouter()

const { user } = storeToRefs(authStore)

const modalConfirmation = ref(false)

const handleLogout = async () => {
  modalConfirmation.value = false
  await authStore.logout()
  router.replace('/login')
  Sentry.setUser(null);
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
