<template>
  <v-sheet
    height="100vh"
    width="571"
    color="#fff"
    style="transform-origin: right"
    class="position-relative"
  >
  <template v-if="loading">
      <v-sheet class="d-flex justify-center align-center h-100">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-sheet>
  </template>

  <template v-else>
    <v-form
      ref="formRef"
      v-model="isFormValid"
      validate-on="blur"
      @submit.prevent="handleFormSubmit"
      class="d-flex flex-column justify-space-between pb-12"
      style="height: 100vh;"
    >
      <!-- //TOP -->
      <v-sheet
        class="d-flex justify-space-between align-center gc-6"
        style="border-bottom: 1px solid #dde7ee; padding: 14px 32px"
      >
        <h4 style="font-size: 18px; line-height: 24px">Profile info</h4>

        <v-btn
          class="text-grey1"
          icon="$tb-x"
          width="auto"
          height="auto"
          flat
          color="transparent"
          @click="$emit('close')"
        />
      </v-sheet>
      <!-- //MAIN -->
      <v-tabs
        v-model="tab"
        class="tabs px-8 text-grey2"
        height="auto"
        style="padding-top: 8px; border-bottom: 1px solid #dde7ee"
      >
        <v-tab
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          style="line-height: 24px; font-weight: 600"
          class="py-1 px-3 pb-3 text-body-1"
          min-width="auto"
          height="auto"
          >{{ tab.label }}</v-tab
        >
      </v-tabs>
      <v-tabs-window v-model="tab" class="h-100">
        <v-tabs-window-item value="general" class="px-8 py-6 update-vet-form">
          <VetProfile
            :vetDetails="vetDetails!"
            :disable="isLoading.length !== 0"
            @updateVetDetails="updateAccountDetails"
          />
        </v-tabs-window-item>

        <v-tabs-window-item value="appointments" class="px-8 py-6">
          <VetAvailabilities
            :defaultValue="vetDetails?.availabilities"
            @updateAvailability="updateAccountDetails"
          />
        </v-tabs-window-item>
      </v-tabs-window>

      <!-- FOOTER -->
      <v-sheet class="drawer-footer w-100">
        <v-btn
          variant="plain"
          color="#E02A2A"
          :loading="isLoading === 'remove'"
          :disabled="isLoading.length !== 0"
          class="px-0 btn"
          @click="modalConfirmation = true"
        >
          <template #prepend>
            <v-icon size="24" icon="$tb-trash" />
          </template>
          Remove Profile
        </v-btn>
        <v-btn
          class="px-3 ml-auto"
          flat
          type="submit"
          :loading="isLoading === 'submit'"
          :disabled="isLoading.length !== 0 || disableSubmitBtn"
          >Save Changes</v-btn
        >
      </v-sheet>
    </v-form>
  </template>
  
  </v-sheet>
  <v-dialog v-model="modalConfirmation" width="auto">
    <ConfirmationModal
      text="Are you sure you want to remove this vet?"
      btnText="Remove"
      @close="modalConfirmation = false"
      @closeAll="handleProfileDelete"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, watchEffect } from 'vue'
import VetProfile from '../partials/VetProfile.vue'
import { useVetStore } from '@/stores/vets'
import { toast } from 'vue3-toastify'
import useMitt from '@/functions/useMitt'
import type { VetDetails } from '@/stores/types/vet'
import VetAvailabilities from '../partials/vetAvailibilities/VetAvailabilities.vue'
import ConfirmationModal from '../modal/ConfirmationModal.vue'

const emit = defineEmits<{
  (event: 'close'): void
}>()

const props = defineProps<{
  vetDetails: VetDetails | null
  loading:boolean
}>()

const tab = ref()
const tabs = [
  { label: 'General', value: 'general' },
  { label: 'Appointments', value: 'appointments' }
]

const formRef = ref()
const isFormValid = ref(true)

const { emitter } = useMitt()

const disableSubmitBtn = ref(true)
const isMounted = ref(true)
const isLoading = ref('')
const modalConfirmation = ref(false)

const { removeVet, UpdateVet } = useVetStore()

const accountDetails = ref()

const updateAccountDetails = (details: any) => {
  accountDetails.value = { ...accountDetails.value, ...details }
}

const manageRemoveVet = async () => {
  try {
    isLoading.value = 'remove'
    await removeVet(`${props.vetDetails?.id}`)
  } finally {
    isLoading.value = ''
  }
}

const manageUpdateVet = async () => {
  try {
    isLoading.value = 'submit'
    console.log(accountDetails.value , "TEST @")
    await UpdateVet(props.vetDetails?.id as string, accountDetails.value)
  } finally {
    isLoading.value = ''
  }
}

const handleFormSubmit = async () => {
  if (!isFormValid.value) return
  await manageUpdateVet()
  emitter.emit('manage-service-drawer:update_vet', {
    payload: { id: props.vetDetails?.id, ...accountDetails.value }
  })
  emit('close')
  toast.success('Profile updated successfully.')
}

const handleProfileDelete = async () => {
  modalConfirmation.value = false
  await manageRemoveVet()
  emit('close')
  emitter.emit('profile-details-drawer:delete_vet', { id: props.vetDetails?.id as string })
  toast.success('Profile successfully removed.')
}

watch(
  () => accountDetails,
  () => {
    console.log(accountDetails.value, "TEST 3")
    if (!isMounted.value) {
      disableSubmitBtn.value = false
    }
    if (isMounted.value) isMounted.value = false
  },
  { deep: true }
)

watchEffect(() => {
  if (props.vetDetails) {
    let availabilities:{ [key: string]: { from: string; to: string }[] } = {};

    props.vetDetails.availabilities.forEach((availability)=> { availabilities[availability.dayOfWeek] = availability.intervals } )

    accountDetails.value = { ...props.vetDetails, availabilities: { availability: availabilities } }
    console.log({ ...props.vetDetails, availabilities: { availability: availabilities } } , "TEST")
 
    isMounted.value = true
  }
})

</script>

<style lang="scss" scoped>
@import '@/assets/global.css';

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
</style>

<style lang="scss">
.update-vet-form{
 & .scrollable-form{
    height: calc(100vh - 352px);
}
}
</style>