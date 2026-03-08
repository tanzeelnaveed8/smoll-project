<template>
  <v-sheet class="px-8 d-flex justify-center pb-8 h-100">
    <v-sheet class="d-flex flex-column gr-6 w-100" max-width="1104">
      <v-sheet class="py-8 pb-6 mt-4 rounded-lg">
        <v-sheet class="d-flex align-center justify-space-between">
          <v-sheet class="d-flex flex-column align-center gc-5">

            <v-form class="d-flex align-center" @submit.prevent="searchPet">
              <v-text-field width="380" v-model="petId" class="text-field text-body-2 rounded-circle"
                style="height: 40px" hide-details="auto" placeholder="Enter Pet ID (e.g., 179-188-F91)" color="grey1"
                type="text">
                <template v-slot:prepend-inner> <v-icon icon="$tb-search" size="20" /></template>
              </v-text-field>
              <v-btn color="primary" type="submit" :disabled="!((petId as string)?.length > 9) || loading === 'pet'"
                class="bg-primary text-white"
                style="height: 40px; border-top-left-radius: 0px !important; border-bottom-left-radius: 0px !important"
                rounded="lg">
                Search by Pet Id
              </v-btn>
            </v-form>
          </v-sheet>
        </v-sheet>
      </v-sheet>

      <!-- Initial Empty State -->
      <v-sheet v-if="!petFound && !hasSearched" class="d-flex flex-column align-center justify-center py-16 px-4" style="
          background: linear-gradient(135deg, #f8fafb 0%, #f4f6f8 100%);
          border-radius: 12px;
          min-height: 420px;
        ">
        <v-sheet class="d-flex flex-column align-center justify-center pa-8" style="
            max-width: 600px;
            width: 100%;
            border: 1px solid #dde7ee;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            background: rgba(255, 255, 255, 0.9);
          ">
          <div class="d-flex align-center justify-center mb-6" style="
              background: rgba(66, 117, 148, 0.08);
              width: 88px;
              height: 88px;
              border-radius: 50%;
            ">
            <v-icon icon="$tb-search" size="40" color="primary"></v-icon>
          </div>

          <h2 class="text-h5 mb-3 text-center text-grey1" style="font-weight: 600;">
            Welcome to Smoll Care
          </h2>
          <p class="text-body-1 text-grey2 text-center mb-8 font-weight-medium"
            style="max-width: 450px; line-height: 1.5">
            Search for a pet using their unique ID to access care details, benefits, and history.
          </p>

          <v-divider class="mb-6"
            style="width: 40px; border-color: rgba(66, 117, 148, 0.3); border-width: 2px"></v-divider>

          <v-sheet class="d-flex flex-column" style="max-width: 450px; width: 100%">
            <p class="text-body-2 text-grey2 text-center font-weight-medium">
              Pet IDs are typically in the format
              <span class="font-weight-bold text-grey1">XXX-XXX-XXX</span>
            </p>
          </v-sheet>
        </v-sheet>
      </v-sheet>

      <!-- No Results Found State -->
      <v-sheet v-else-if="!petFound && hasSearched && !loading"
        class="d-flex flex-column align-center justify-center py-16 px-4" style="
          background: linear-gradient(135deg, #f8fafb 0%, #f4f6f8 100%);
          border-radius: 12px;
          min-height: 420px;
        ">
        <v-sheet class="d-flex flex-column align-center justify-center pa-8" style="
            max-width: 600px;
            width: 100%;
            border: 1px solid #dde7ee;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            background: rgba(255, 255, 255, 0.9);
          ">
          <div class="d-flex align-center justify-center mb-6" style="
              background: rgba(73, 73, 73, 0.08);
              width: 88px;
              height: 88px;
              border-radius: 50%;
            ">
            <v-icon icon="$tb-exclamation-circle" size="40" color="grey1"></v-icon>
          </div>

          <h2 class="text-h5 mb-3 text-center text-grey1" style="font-weight: 600;">No Pet Found</h2>
          <p class="text-body-1 font-weight-medium text-grey2 text-center mb-6"
            style="max-width: 450px; line-height: 1.5">
            We couldn't find a pet with the ID
            <span class="text-grey1 font-weight-bold">"{{ router.currentRoute.value.query.petId }}"</span>. Please
            check the
            ID
            and try again.
          </p>

          <v-divider class="mb-6"
            style="width: 40px; border-color: rgba(73, 73, 73, 0.3); border-width: 2px"></v-divider>

          <p class="text-body-2 text-grey2 text-center font-weight-medium" style="max-width: 450px">
            If you believe this is an error, please contact support for assistance.
          </p>
        </v-sheet>
      </v-sheet>

      <v-sheet v-else-if="loading === 'pet'" class="d-flex justify-center align-center h-100 w-100">
        <v-progress-circular indeterminate color="primary" />
      </v-sheet>

      <v-sheet v-else class="pt-6 pb-11 d-flex flex-column gr-4 justify-space-between"
        style="border: 1px solid #d0d7dc;border-radius: 12px; ">
        <v-sheet class="d-flex gc-15 px-8 pb-3">
          <v-sheet class="d-flex align-center gc-3">
            <v-avatar color="grey2" style="height: 80px; width: 80px" :text="petDetails?.pet.name?.[0]"
              :image="petDetails?.pet.photos?.length ? petDetails.pet?.photos[0]?.url : undefined" />
            <v-sheet>
              <p class="text-h5" style="font-weight: 700">{{ petDetails?.pet.name }}</p>
              <p class="mt-1 text-grey2" style="font-size: 18px;font-weight: 600;">#{{ petDetails?.pet.careId }}</p>
            </v-sheet>
          </v-sheet>
          <v-sheet class="d-flex align-center gc-12">
            <v-sheet>
              <p class="text-body-2 text-grey2" style="font-weight: 600">Species</p>
              <p class="text-body-1 mt-1" style="font-weight: 600"> {{ formattedSpecies }}</p>
            </v-sheet>
            <v-sheet>
              <p class="text-body-2 text-grey2" style="font-weight: 600">Gender</p>
              <p class="text-body-1 mt-1" style="font-weight: 600">
                {{ formattedGender }}
              </p>
            </v-sheet>
            <v-sheet>
              <p class="text-body-2 text-grey2" style="font-weight: 600">Breed</p>
              <p class="text-body-1 mt-1" style="font-weight: 600">
                {{ petDetails?.pet.breed }}
              </p>
            </v-sheet>
            <v-sheet>
              <p class="text-body-2 text-grey2" style="font-weight: 600">Age</p>
              <p class="text-body-1 mt-1" style="font-weight: 600">
                {{ petDetails?.pet.age }} years
              </p>
            </v-sheet>
            <v-sheet>
              <p class="text-body-2 text-grey2" style="font-weight: 600">Weight</p>
              <p class="text-body-1 mt-1" style="font-weight: 600">
                {{ petDetails?.pet.weight }}Kg
              </p>
            </v-sheet>
            <v-sheet>
              <p class="text-body-2 text-grey2" style="font-weight: 600">Spayed/Neutered</p>
              <p class="text-body-1 mt-1" style="font-weight: 600">
                {{ petDetails?.pet.spayedOrNeutered ? 'Yes' : 'No' }}
              </p>
            </v-sheet>
          </v-sheet>
        </v-sheet>

        <v-divider />

        <v-sheet class="px-8">
          <div class=" pt-2 pb-4">
            <div class="d-flex justify-space-between align-center mb-6">
              <h2 class="text-h6" style="font-weight: 700;">Benefits</h2>
              <v-btn color="primary" class="text-capitalize" density='comfortable' style="font-weight: 500;"
                @click="showUpdateBenefitModal = true">
                Update
              </v-btn>
            </div>
            <div style=" padding-right: 10px ;overflow-y: scroll; max-height: calc(100vh - 505px);">
              <SmollcareBenefitIem v-for="(benefit, index) in petDetails?.benefits" :key="index" :benefit />
            </div>
          </div>
        </v-sheet>
      </v-sheet>
    </v-sheet>
  </v-sheet>

  <!-- Update Benefit Modal -->
  <v-dialog v-model="showUpdateBenefitModal" transition="slide-x-reverse-transition" width="auto" class="dialog">
    <UpdateBenefitsDrawer :benefitOptions="benefitOptions" :vetOptions="vetOptions" :loading="loading === 'benefits'"
      @close="showUpdateBenefitModal = false" @submit="submitUpdateBenefits" />
  </v-dialog>

</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import router from '@/router'
import type { LocationQueryValue } from 'vue-router'
import dayjs from 'dayjs'
import UpdateBenefitsDrawer from '@/components/drawer/UpdateBenefitsDrawer.vue'
import type { Pet, PetProfileDetails, UpdateBenefitsPayload } from '@/stores/types/pet'
import { useSmollcareStore } from '@/stores/smollcare'
import SmollcareBenefitIem from '@/components/app/smollcare/smollcareBenefitIem.vue'
import { toast } from 'vue3-toastify'
import { useVetStore } from '@/stores/vets'
import { storeToRefs } from 'pinia'

const petId = ref<string | LocationQueryValue | LocationQueryValue[]>(router.currentRoute.value.query.petId)
const loading = ref<'pet' | 'benefits' | null>(null)
const petFound = ref(false)
const hasSearched = ref(false)

const petDetails = ref<PetProfileDetails | null>(null)

const smollcareStore = useSmollcareStore()
const vetStore = useVetStore()
const { fetchVets } = vetStore
const { veterinarians } = storeToRefs(vetStore)

const vetOptions = computed(() => { return veterinarians.value?.map((vet) => ({ id: vet.id, title: vet.name })) || [] })

// Update Benefit Modal
const showUpdateBenefitModal = ref(false)

const formatText = (text: string | undefined | null) => {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
}

const formattedGender = computed(() => formatText(petDetails.value?.pet?.gender))
const formattedSpecies = computed(() => formatText(petDetails.value?.pet?.species))

const benefitOptions = computed(() => {
  if (!petDetails.value?.benefits) return []
  return petDetails.value?.benefits.map((benefit) => ({
    id: benefit.id,
    title: benefit.name,
    disabled: benefit.consumedUsageCount >= benefit.totalUsageCount
  })) || []
})

const getVets = async () => {
  try {
    loading.value = 'benefits'
    const fetchedVets = await fetchVets()
    veterinarians.value = fetchedVets
  } finally {
    loading.value = null
  }
}

const fetchPetById = async () => {
  try {
    loading.value = 'pet'
    const petData = await smollcareStore.fetchPetById(petId.value as string)
    if (petData) {
      petDetails.value = petData
      petFound.value = true
    } else {
      // Pet not found
      petFound.value = false
    }
  } catch (error) {
    petFound.value = false
  } finally {
    loading.value = null
  }
}

const searchPet = async () => {
  if (!petId.value) return

  hasSearched.value = true
  router.push({
    path: 'smoll-care',
    query: { petId: petId.value }
  })
  await fetchPetById()
}

const updateBenefits = async (payload: UpdateBenefitsPayload) => {
  try {
    loading.value = 'benefits'
    await smollcareStore.updateBenefits(payload)
  } finally {
    loading.value = null
    toast.success('Benefits update successfully!')
  }
}

const submitUpdateBenefits = async (payload: { benefits: { benefitId: number, note?: string, vet: string }[] }) => {
  await updateBenefits({ ...payload, petId: petDetails.value?.pet.id as string, })
  showUpdateBenefitModal.value = false
  await fetchPetById()
}


onMounted(async () => {
  if (petId.value) {
    hasSearched.value = true
    await fetchPetById()
  }
  if (!veterinarians.value?.length) {
    await getVets()
  }
})

</script>

<style lang="scss" scoped>
@import '@/assets/global.css';

.page-heading {
  font-size: 21px;
  font-weight: 500;
  line-height: 24px;
  color: #222222;
  font-family: 'CooperLtBT' !important;
}

.text-field {
  &:deep(.v-field) {
    height: inherit;
    background-color: #f4f6f8;
    /* border: none; */
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    font-weight: 500;
    color: #222;
  }

  &:deep(.v-input__control) {
    height: inherit !important;
  }

  &:deep(.v-field__prepend-inner) {
    height: 40px !important;
    padding: 0px;
    align-items: center !important;
  }

  &:deep(.v-field__field) {
    height: inherit;
  }

  &:deep(.v-field__input) {
    min-height: auto;
    padding-top: 8px;
    padding-left: 8px;
    padding-bottom: 8px;
    font-weight: 600;

    &::placeholder {
      color: #222 !important;
      font-weight: 600;
    }
  }
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.cursor-pointer {
  cursor: pointer;
}

.benefit-item {
  border-bottom: 1px solid #d6d6d6;
  padding-bottom: 1rem;
}

.benefit-item:last-child {
  border-bottom: none;
}

.tabs:deep(.v-slide-group__content) {
  gap: 18px;
}

.table {
  &:deep(td) {
    font-family: 'Hauora' !important;
    font-weight: 600 !important;
    font-size: 0.875rem;
  }



  &:deep(th) {
    font-weight: 700 !important;
    color: #494949 !important;
    font-size: 0.875rem;
  }
}

.read-only-checkbox {
  &:deep(.v-selection-control__input)::before {
    opacity: 0;
  }

  &:deep(input) {
    cursor: default;
  }
}
</style>
