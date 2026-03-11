<template>
  <v-card class="mainContainer" width="710">
    <!-- Drawer Header  -->
    <v-sheet class="d-flex justify-space-between align-center gc-6"
      style="border-bottom: 1px solid #dde7ee; padding: 14px 32px">
      <v-sheet class="d-flex gc-8 align-center">
        <h4 style="font-size: 18px; line-height: 24px">Escalate case</h4>
      </v-sheet>

      <v-btn class="text-grey1" icon="$tb-x" width="auto" height="auto" flat color="transparent"
        @click="$emit('close')" />
    </v-sheet>

    <!-- Drawer Main -->
    <v-form ref="formRef" v-model="formIsValid" @submit.prevent="handleConfirm">
      <v-sheet class="px-8 py-7">
        <v-sheet>
          <h4 class="mb-5">Select type of escalation</h4>

          <v-sheet class="d-flex items-center mb-6">
            <v-sheet class="d-flex flex-column gr-3">

              <v-radio-group class="radio-btn-group my-3 mb-1" v-model="escalationForm.escalationType" inline
                hide-details="auto">
                <v-radio color="#10afe1" label="Request Quotation" value="requestQuotation" />
                <v-radio color="#10afe1" label="Direct Booking" value="directBooking" />
              </v-radio-group>

              <v-checkbox v-model="isEmergency" v-if="escalationForm.escalationType === 'directBooking'"
                class="emergencyCheck" color="#fc1212" hide-details="auto" label="This is an Emergency" />

            </v-sheet>

          </v-sheet>

          <v-sheet class="mb-5">
            <p style="line-height: 24px" class=" mb-3 text-body-2 text-grey2 font-weight-bold">
              Experts Note
            </p>
            <v-textarea hide-details="auto" v-model="escalationForm.reason" no-resize row-height="24"
              :disabled="loading.formSubmit" rows="2" placeholder="Note" class="mt-1 text-area" :rules="rules.reason" />
          </v-sheet>

          <v-sheet class="mb-5">
            <div class="d-flex align-center mb-3 gc-2">
              <p class="choseClinicText" style="line-height: 24px;">Choose the Clinic</p>
              <p v-if="showSelectedCount && !isDirectBooking && !loading.clinicsLoading"
                class="text-grey2 font-weight-medium">
                ({{ escalationForm.selectedClinics?.length || 0 }}/{{ fetchedClinic?.length }})
              </p>
            </div>

            <v-sheet class="d-flex gc-3 mb-5">
              <v-sheet class="w-100">
                <v-combobox v-model="filter.country" :hide-details="true" placeholder="Country" item-title="name"
                  :items="country" return-object :menu-props="{ maxWidth: 200 }" />
              </v-sheet>
              <v-sheet class="w-100">
                <v-combobox :hide-details="true" :disabled="!filter.country" placeholder="City" :items="city"
                  item-title="name" item-value="name" :menu-props="{ maxWidth: 200 }" v-model="filter.city" />
              </v-sheet>
            </v-sheet>

            <v-sheet class="d-flex align-center gc-4">
              <v-text-field width="100%" v-model="escalationForm.search" density="comfortable" class="text-field"
                :disabled="loading.formSubmit" hide-details="auto" placeholder="Search by Name" type="text">
                <template v-slot:prepend-inner> <v-icon icon="$tb-search" size="20" /></template>
              </v-text-field>
            </v-sheet>
          </v-sheet>

          <p class="choseClinicText mb-2">Specialty</p>
          <v-skeleton-loader v-if="loading.specialtiesLoading" type="chip@5" />
          <v-chip-group v-else v-model:model-value="escalationForm.selectedSpecialty" selected-class="selectedBtn"
            multiple column class="specialtyBtnContainer">
            <v-chip variant="outlined" v-push class="specialtyBtn text-body-1" v-for="btn in specialities"
              :value="btn">{{
                btn.name }}</v-chip>
          </v-chip-group>

          <v-sheet>
            <v-sheet v-if="loading.clinicsLoading" class="d-flex justify-center align-center h-100"
              style="margin-top: 150px">
              <v-progress-circular indeterminate color="primary" />
            </v-sheet>

            <v-sheet v-if="!fetchedClinic?.length && !loading.clinicsLoading" class="w-100 text-center">
              <p class="text-grey2 font-weight-bold">No clinic found!</p>
            </v-sheet>

            <v-list v-else-if="!loading.clinicsLoading" class="clinicCardContainer"
              :select-strategy="isDirectBooking ? 'single-leaf' : 'classic'"
              v-model:selected="escalationForm.selectedClinics" :mandatory="isDirectBooking">
              <p v-if="clinicIsSelected === false" class="text-body-2" style="color: rgb(176, 0, 32); font-weight: 600">
                {{ isDirectBooking ? 'Select a clinic.' : 'Select atleast 1 clinic.' }}
              </p>
              <v-list-item v-for="item in fetchedClinic" :key="item.id" :value="item" color="#f0ffff"
                active-class="activeClinicCard" class="d-flex justify-space-between align-center clinicCard">
                <v-sheet class="d-flex gc-3 align-center w-100">
                  <v-avatar class="ma-1 text-grey2" :image="item.clinicImg?.url" icon="$tb-heart-handshake"
                    style="font-size: 28px; border: 1px solid #dde7ee" size="80">
                  </v-avatar>

                  <v-sheet class="clinicCardTextContainer align-center">
                    <v-sheet class="d-flex flex-column gr-2">
                      <h4 style="font-size: 18px; line-height: 24px" class="text-grey1">{{ item.name }}</h4>
                      <p style="font-size: 14px; font-weight: 700; color: #494949">
                        {{ item.address }}
                      </p>
                    </v-sheet>
                  </v-sheet>
                </v-sheet>
              </v-list-item>
            </v-list>
          </v-sheet>
        </v-sheet>
      </v-sheet>

      <v-sheet class="continueBtnContainer">
        <template v-if="isDirectBooking">
          <v-btn v-push type="submit" :loading="loading.formSubmit"
            :disabled="loading.formSubmit || !escalationForm.selectedClinics?.length || !formIsValid">
            {{ isEmergency ? 'Create Quotation' : 'Select Vet & Time' }}
          </v-btn>
        </template>
        <template v-else>
          <v-btn v-push type="submit" :loading="loading.formSubmit"
            :disabled="loading.formSubmit || !formIsValid || !escalationForm.selectedClinics?.length">
            Send to partners
          </v-btn>
        </template>

      </v-sheet>

    </v-form>
  </v-card>

  <!-- Confirmation Modal -->
  <v-dialog v-model="modalConfirmation" width="auto">
    <ConfirmationModal text="Are you sure you want to submit?" btnText="Confirm" color="primary"
      @close="modalConfirmation = false" @closeAll="handleFormSubmit" />
  </v-dialog>

  <!-- Quotation Drawer -->
  <v-dialog v-model="quotationDrawer" transition="slide-x-reverse-transition" width="auto" class="dialog">
    <QuotationDrawer v-if="escalationForm.selectedClinics?.length" :case="case" :is-emergency="isEmergency"
      :drawerProps="drawerProps" :member @close="quotationDrawer = false" @submit="() => {
        emit('close')
        emitter.emit('refetch-cases')
      }" />
  </v-dialog>

  <v-dialog v-model="emergencyEscalteDrawer" transition="slide-x-reverse-transition" width="auto" class="dialog">
    <VetAppointmentSchedulerDrawer :case="case" :quotationDrawerProps='drawerProps'
      :vets="escalationForm.selectedClinics ? escalationForm.selectedClinics[0].vets : []" :member
      @close="() => { emergencyEscalteDrawer = false; $emit('close') }" />
  </v-dialog>

</template>

<script lang="ts" setup>
import ConfirmationModal from '@/components/modal/ConfirmationModal.vue'
import useMitt from '@/functions/useMitt'
import { useCaseStore } from '@/stores/case'
import { usePartnerStore, type Partner } from '@/stores/partner'
import type { Case } from '@/stores/types/case'
import type { Consultation } from '@/stores/types/consultation'
import { useDebounceFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { Country, City } from 'country-state-city'
import QuotationDrawer from '../quotationDrawer/QuotationDrawer.vue'
import type { Member } from '@/stores/types/member'
import VetAppointmentSchedulerDrawer from '../vetAppointmentSchedulerDrawer/VetAppointmentSchedulerDrawer.vue'

const props = defineProps<{
  case: Case
  member: Member
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

// Reactive state
const formRef = ref()
const formIsValid = ref(false)
const clinicIsSelected = ref<boolean | null>(null)
const fetchedClinic = ref<Partner[] | null>(null)
const modalConfirmation = ref(false)
const quotationDrawer = ref(false)
const emergencyEscalteDrawer = ref(false)

const { emitter } = useMitt()

interface EscalationForm {
  escalationType: string
  selectedClinics: Partner[] | null
  selectedSpecialty: any[]
  search: ''
  reason: ''
  filter: {
    country: string | null
    city: string | null
  }
}
const partnerStore = usePartnerStore()
const caseStore = useCaseStore()

const { specialities } = storeToRefs(partnerStore)
const { fetchPartner, fetchSpecaialities } = partnerStore


const loading = ref({
  specialtiesLoading: false,
  clinicsLoading: false,
  formSubmit: false
})

const showSelectedCount = ref(false)

const escalationForm = ref<EscalationForm>({
  escalationType: 'requestQuotation',
  selectedClinics: null,
  selectedSpecialty: [],
  search: '',
  reason: '',
  filter: {
    country: null,
    city: null
  }
})

const isEmergency = ref(false)

const rules = ref({
  reason: [(v: string) => v?.length > 0 || 'Please provide reason.']
})

const isDirectBooking = computed(() => escalationForm.value.escalationType === 'directBooking')

const filter = ref<{
  country: any
  city: any
}>({
  country: null,
  city: null
})

const country = computed(() => [Country.getAllCountries()[230]])

const city = computed(() => {
  if (filter.value.country) {
    return City.getCitiesOfCountry((filter.value.country as { isoCode: string })?.isoCode)
  }
  return []
})

const drawerProps = computed(() => ({
  partnerId: escalationForm.value.selectedClinics?.[0]?.id || '',
  note: escalationForm.value.reason,
  actionLoading: false
}))

const escalateCase = async () => {
  try {
    loading.value.formSubmit = true
    await caseStore.escalateCase(props.case.id, {
      partnerIds: escalationForm.value.selectedClinics?.map(clinic => clinic.id) || [],
      vetNote: escalationForm.value.reason
    })
  } finally {
    loading.value.formSubmit = false
  }
}

const handleConfirm = () => {
  if (!formIsValid.value && !escalationForm.value.selectedClinics?.length) {
    clinicIsSelected.value = false
    return
  }
  if (!formIsValid.value) return

  if (isDirectBooking.value) {
    //If isEmergency is true then open emergecynEscalateDrawer otherwise open quotationDrawer
    isEmergency.value ? quotationDrawer.value = true : emergencyEscalteDrawer.value = true
  } else {
    modalConfirmation.value = true
  }
}

const handleFormSubmit = async () => {
  await escalateCase()

  //This will handle refetcing
  emit('close')
  toast.success('Case escalated successfully')
  emitter.emit('refetch-cases')
}

const getSpecaialities = async () => {
  try {
    loading.value.specialtiesLoading = true
    await fetchSpecaialities()
  } finally {
    loading.value.specialtiesLoading = false
  }
}

const getClinics = async (
  search?: string,
  filter?: { country: string | null; city: string | null },
  specialities?: { id: string; name: string }[]
) => {
  try {
    loading.value.clinicsLoading = true
    const formattedSpecialities = specialities?.map((item) => item.name)
    const quickList = isDirectBooking.value
    const { data } = await fetchPartner(quickList, search, formattedSpecialities, filter)
    fetchedClinic.value = data
  } finally {
    loading.value.clinicsLoading = false
  }
}

const refetchClinics = () => {
  const { search, filter, selectedSpecialty } = escalationForm.value
  getClinics(search, filter, selectedSpecialty)
}

watch(
  () => escalationForm.value.search,
  useDebounceFn(async () => {
    refetchClinics()
  }, 1000)
)

watch(
  () => escalationForm.value.selectedSpecialty,
  async () => {
    refetchClinics()
  }
)

watch(
  () => filter.value,
  async (v) => {
    escalationForm.value = { ...escalationForm.value, filter: { country: v.country?.name || null, city: v.city?.name || null } }
    refetchClinics()
  }, { deep: true }
)

watch(() => isDirectBooking.value, (v) => {
  showSelectedCount.value = false
  clinicIsSelected.value = null
  escalationForm.value = {
    ...escalationForm.value,
    selectedClinics: null
  }
  refetchClinics()
})

watch(
  () => escalationForm.value.selectedClinics,
  (v) => {
    showSelectedCount.value = true
    if (v) clinicIsSelected.value = v.length ? true : false
  }
)

onMounted(async () => {
  if (!specialities.value) {
    getSpecaialities()
  }
  getClinics()
})
</script>

<style scoped lang="scss">
.dialog:deep(.v-overlay__content) {
  right: 0;
}

.mainContainer {
  position: relative;
  padding-bottom: 80px;
  height: 100vh;
}

.headline {
  font-weight: bold;
}

.escalationTypeBtnContainer {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.escalationTypeRadio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #a0aeb8;
}

.escalationTypeActiveRadio {
  border-color: #10afe1;
  position: relative;

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    background-color: #10afe1;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

.choseClinicText {
  font-size: 14px;
  font-weight: 700;
  color: #494949;
  /* margin-bottom: 12px; */
}

.specialtyBtnContainer {
  margin-bottom: 24px;

  &:deep(.v-slide-group__content) {
    gap: 4px;
  }
}

.specialtyBtn {
  height: 40px;
  margin: 0px;
  color: #494949 !important;
  border: 1px solid #a0aeb8 !important;
  font-weight: 600;
  line-height: 24px;
}

.selectedBtn {
  color: #10afe1 !important;
  border-color: #10afe1 !important;
}

.clinicCardContainer {
  &> :not(:last-child) {
    margin-bottom: 12px;
  }
}

.clinicCard {
  padding: 12px 16px;
  border: 1px solid #a0aeb8;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;

  &:deep(.v-list-item__content) {
    width: 100%;
  }

  &:hover {
    background-color: rgba(240, 255, 255, 0.12);
  }

  &.activeClinicCard {
    background-color: rgb(233, 255, 255);
    border-color: #10afe1;
  }
}

.clinicImage {
  width: 92px;
  height: 92px;
  object-fit: cover;
  border-radius: 90px;
  /* padding: 4; */
}

.escalationTypeContainer {
  gap: 44px;
}

.escalationTypeLabel {
  font-size: 16px;
  font-weight: 700;
  margin-left: 6px;
  pointer-events: none;
}

.clinicCardTextContainer {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.clinicCardCheckbox {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #a0aeb8;
}

.clinicCardCheckIcon {
  width: 27px;
  max-width: 27px;
  height: 27px;
}

.clinicIconContainer {
  display: flex;
  gap: 6px;
}

.clinicIconContainer svg {
  width: 16px;
  height: 16px;
}

.clinicIconContainer .clinicCardActiveStar {
  fill: #e2bf5e;
  stroke: #e2bf5e;
}

.searchAllCheckboxContainer {
  width: 20px;
  height: 20px;
  position: relative;
}

.searchAllCheckbox {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
}

.hideSearchAllCheckbox {
  opacity: 0;
}

.searchAllStyledCheckbox {
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.continueBtnContainer {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 12px 32px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #dde7ee;
}

.radio-btn-group {
  &:deep(.v-label) {
    font-size: 16px;
    line-height: 24px;
    font-weight: 700;
    opacity: 1;
    color: #222222 !important;
  }

  &:deep(.v-selection-control-group) {
    gap: 44px;
  }

  &:deep(.v-selection-control__wrapper) {
    width: auto;
    height: auto;
  }

  &:deep(.v-selection-control__input) {
    width: auto;
    height: auto;
    margin-right: 4px;
  }
}

.is-notified {
  &::after {
    position: absolute;
    content: '';
    width: 9px;
    height: 9px;
    left: 26px;
    top: 5px;
    border: none !important;
    background-color: #e31f7d;
    opacity: 1;
  }
}

.text-area:deep(.v-messages__message) {
  font-weight: 600;
}

.emergencyCheck {
  &:deep(.v-selection-control__input) {
    height: auto;
    width: auto;
    margin-left: 2px;
    margin-right: 4px;
  }

  &:deep(.v-selection-control__wrapper) {
    height: auto;
    width: auto;
  }

  &:deep(.v-label) {
    font-size: 16px;
    line-height: 24px;
    font-weight: 700;
    opacity: 1;
    color: #494949 !important;
  }
}
</style>
