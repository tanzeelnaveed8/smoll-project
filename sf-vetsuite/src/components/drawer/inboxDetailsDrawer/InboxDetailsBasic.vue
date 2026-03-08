<template>
  <v-sheet class="pa-7 pt-5 d-flex gr-6 flex-column scroll">
    <v-sheet
      v-if="type === 'scheduled' && consultation.status !== ConsultationStatusEnum.COMPLETED && consultation.scheduledAt"
    >
      <div class="d-flex gc-3 align-center">
        <span style="font-weight: 600" class="d-flex gc-2">
          <p class="font-weight-bold">Appointment On:</p>
          <p>{{ dayjs(consultation.scheduledAt).isValid() ? dayjs(consultation.scheduledAt).format('dddd, D MMMM YYYY') : '-' }}</p>
        </span>
        <v-chip
          v-if="dayjs(consultation.scheduledAt).isValid()"
          color="#10AFE1"
          class="text-body-1"
          rounded="lg"
          style="font-weight: 600; line-height: 24px"
          variant="flat"
        >
          {{ dayjs(consultation.scheduledAt).format('hh:mm A') }}
        </v-chip>
      </div>
    </v-sheet>
    <v-sheet class="d-flex gr-8 flex-column">
      <v-sheet class="d-flex flex-column gr-5">
        <h5
          class="text-body-1 font-weight-bold text-uppercase"
          style="line-height: 24px; color: black"
        >
          MEMBER DETAILS
        </h5>
        <div style="font-weight: 600; max-width: 100%" class="d-flex flex-column gr-2">
          <span class="d-flex gc-2 align-center flex-wrap">
            <v-icon icon="$tb-user-circle" size="24" />
            <p>{{ consultation?.member?.name ?? '-' }}</p>
            <a
              v-if="consultation?.member?.phone"
              :href="`tel:${consultation.member.phone}`"
              class="d-flex align-center gc-1 text-primary text-body-2"
              style="font-weight: 600; text-decoration: none"
            >
              <v-icon icon="$tb-call" size="18" />
              Call customer
            </a>
          </span>
          <p class="text-grey2">{{ consultation?.member?.phone ?? '-' }}</p>
          <p v-if="consultation?.member?.address" class="text-grey2 text-body-2">
            Address: {{ consultation.member.address }}
          </p>
        </div>
      </v-sheet>

      <v-sheet class="d-flex flex-column gr-6">
        <v-sheet class="pb-2" style="border-bottom: 1px solid #dde7ee">
          <h5
            class="text-body-1 font-weight-bold text-uppercase"
            style="line-height: 24px; color: black"
          >
            Pet Details
          </h5>
        </v-sheet>

        <v-sheet max-width="580" class="w-100 d-flex justidy-space-between">
          <div class="w-100 pet-details--grid">
            <div class="d-flex flex-column" style="gap: 11px; font-weight: 600">
              <p class="text-grey2 font-weight-bold">
                Name: <span style="color: black">{{ consultation.case.pet.name }}</span>
              </p>
              <p class="text-grey2 font-weight-bold">
                Gender: <span style="color: black">{{ consultation.case.pet.gender }}</span>
              </p>
              <p class="text-grey2 font-weight-bold">
                Species: <span style="color: black">{{ consultation.case.pet?.species ?? '-' }}</span>
              </p>
              <p class="text-grey2 font-weight-bold">
                Breed: <span style="color: black">{{ consultation.case.pet.breed }}</span>
              </p>
            </div>
            <div class="d-flex flex-column" style="gap: 11px; font-weight: 600">
              <p class="text-grey2 font-weight-bold">
                Age: <span style="color: black">{{ consultation.case.pet.age }}</span>
              </p>
              <p class="text-grey2 font-weight-bold">
                Weight: <span style="color: black">{{ consultation.case.pet.weight }} kg</span>
              </p>
              <p class="text-grey2 font-weight-bold">
                Chip Number:
                <span style="color: black">{{
                  consultation.case.pet.chipNumber === 'undefined' ||
                  !consultation.case.pet.chipNumber
                    ? '-'
                    : consultation.case.pet.chipNumber
                }}</span>
              </p>
              <p class="text-grey2 font-weight-bold">
                Spayed/Neutered:
                <span style="color: black">{{
                  consultation.case.pet.spayedOrNeutered ? 'Yes' : 'No'
                }}</span>
              </p>
            </div>
          </div>
        </v-sheet>
      </v-sheet>
      <v-sheet class="d-flex flex-column gr-6">
        <v-sheet class="pb-2" style="border-bottom: 1px solid #dde7ee">
          <h5
            class="text-body-1 font-weight-bold text-uppercase"
            style="line-height: 24px; color: black"
          >
            Pre-Existing Conditions
          </h5>
        </v-sheet>
        <v-sheet>
          <p class="text-grey2" style="font-weight: 600">
            {{
              consultation.case.pet.preExistingConditions
                ? consultation.case.pet.preExistingConditions
                : '-'
            }}
          </p>
        </v-sheet>
      </v-sheet>
      <v-sheet class="d-flex flex-column gr-6">
        <v-sheet class="pb-2" style="border-bottom: 1px solid #dde7ee">
          <h5
            class="text-body-1 font-weight-bold text-uppercase"
            style="line-height: 24px; color: black"
          >
            Health History
          </h5>
        </v-sheet>
        <v-sheet class="d-flex flex-column gr-6">
          <HealthHistoryRow
            v-if="consultation.case.pet.healthHistory.length"
            v-for="condition in consultation.case.pet.healthHistory"
            :key="condition.id"
            :condition="condition"
          />
          <p v-else>-</p>
        </v-sheet>
      </v-sheet>

      <v-sheet class="d-flex flex-column gr-6">
        <v-sheet class="pb-2" style="border-bottom: 1px solid #dde7ee">
          <h5
            class="text-body-1 font-weight-bold text-uppercase"
            style="line-height: 24px; color: black"
          >
            Case Brief
          </h5>
        </v-sheet>
        <v-sheet>
          <p class="text-grey2" style="font-weight: 600">
            {{ consultation.case.description ?? '-' }}
          </p>
        </v-sheet>
      </v-sheet>
      <!-- Service Checklist -->
      <v-sheet class="d-flex flex-column gr-4">
        <v-sheet class="pb-2 d-flex justify-space-between align-center" style="border-bottom: 1px solid #dde7ee">
          <h5
            class="text-body-1 font-weight-bold text-uppercase"
            style="line-height: 24px; color: black"
          >
            Services Checklist
          </h5>
          <v-btn size="small" variant="text" color="primary" @click="showAddService = !showAddService">
            + Add Service
          </v-btn>
        </v-sheet>
        <v-sheet v-if="showAddService" class="d-flex gc-2 mb-2">
          <v-text-field v-model="newServiceName" placeholder="Service name..." hide-details density="compact" />
          <v-btn color="primary" size="small" :disabled="!newServiceName" @click="handleAddService">Add</v-btn>
        </v-sheet>
        <v-sheet v-if="serviceChecklist.length > 0" class="d-flex flex-column gr-2">
          <v-card
            v-for="(item, i) in serviceChecklist"
            :key="i"
            flat
            class="pa-3 d-flex align-center gc-3"
            style="border: 1px solid #dde7ee; border-radius: 8px"
          >
            <v-checkbox
              v-model="item.checked"
              hide-details
              density="compact"
              color="primary"
              class="flex-grow-0"
              @change="handleChecklistUpdate"
            />
            <span style="font-weight: 600" :class="{ 'text-decoration-line-through text-grey2': item.checked }">
              {{ item.name }}
            </span>
          </v-card>
        </v-sheet>
        <p v-else class="text-grey2 font-weight-medium">No services in checklist</p>
      </v-sheet>

      <!-- Customer Not Reachable (prompt.md: label visit when customer not answering/not at home) -->
      <v-sheet v-if="consultation?.case != null" class="d-flex flex-column gr-2">
        <h5 class="text-body-1 font-weight-bold text-uppercase" style="line-height: 24px; color: black">Customer reachable</h5>
        <v-sheet v-if="!consultation.case.customerNotReachable">
          <v-btn
            color="warning"
            variant="outlined"
            :loading="markingNotReachable"
            @click="handleMarkNotReachable"
          >
            Customer Not Reachable
          </v-btn>
          <p class="text-caption text-grey2 mt-1">Use when the customer is not answering the phone or not at home.</p>
        </v-sheet>
        <v-chip v-else color="warning" variant="flat">
          Customer marked as not reachable
        </v-chip>
      </v-sheet>

      <v-sheet class="d-flex flex-column gr-4">
        <v-sheet class="pb-2" style="border-bottom: 1px solid #dde7ee">
          <h5
            class="text-body-1 font-weight-bold text-uppercase"
            style="line-height: 24px; color: black"
          >
            Shared Files
          </h5>
        </v-sheet>
        <v-sheet class="d-flex flex-column gr-3">
          <template v-if="consultation.case.assets.length > 0">
            <v-card
              v-for="(file, i) in consultation.case.assets"
              :key="i"
              color="#F4F6F8"
              flat
              class="pa-2 cursor-pointer"
              @click="handleDownloadFile(file.url)"
            >
              <span class="d-flex gc-2 align-center">
                <v-icon icon="$tb-paper-clip" size="20" />
                <p class="text-grey2" style="font-weight: 600">{{ file.filename }}</p>

                <v-icon class="ml-auto" icon="$tb-download" size="20" />
              </span>
            </v-card>
          </template>
          <p v-else class="text-grey2 font-weight-medium">No files shared</p>
        </v-sheet>

        <!-- Upload Photos -->
        <v-sheet class="mt-4">
          <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="$tb-upload"
            :loading="uploading"
            :disabled="uploading"
            @click="triggerFileInput"
          >
            Upload Photos
          </v-btn>
          <input
            ref="fileInputRef"
            type="file"
            multiple
            accept="image/*"
            style="display: none"
            @change="handleFileUpload"
          />
        </v-sheet>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import { ConsultationStatusEnum, type ConsultationDetail } from '@/stores/types/consultation.d'
import { useUploadStore } from '@/stores/upload'
import { useCaseStore } from '@/stores/case'
import dayjs from 'dayjs'
import { ref, watch } from 'vue'
import { toast } from 'vue3-toastify'

const props = defineProps<{
  type: 'instant' | 'scheduled'
  consultation: ConsultationDetail
}>()

const uploadStore = useUploadStore()
const caseStore = useCaseStore()
const uploading = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const markingNotReachable = ref(false)
const showAddService = ref(false)
const newServiceName = ref('')

function getChecklistFromCase(caseObj: { serviceChecklist?: { name: string; checked: boolean }[] } | null | undefined) {
  return Array.isArray(caseObj?.serviceChecklist) ? [...caseObj.serviceChecklist] : []
}

const serviceChecklist = ref<{ name: string; checked: boolean }[]>(getChecklistFromCase(props.consultation?.case))

watch(
  () => [props.consultation?.case?.id, props.consultation?.case?.serviceChecklist],
  () => {
    serviceChecklist.value = getChecklistFromCase(props.consultation?.case)
  },
  { deep: true }
)

const handleChecklistUpdate = async () => {
  try {
    await caseStore.updateServiceChecklist(props.consultation.case.id, serviceChecklist.value)
  } catch {
    toast.error('Failed to update checklist')
  }
}

const handleAddService = async () => {
  if (!newServiceName.value) return
  serviceChecklist.value.push({ name: newServiceName.value, checked: false })
  newServiceName.value = ''
  showAddService.value = false
  await handleChecklistUpdate()
}

const handleMarkNotReachable = async () => {
  try {
    markingNotReachable.value = true
    await caseStore.markCustomerNotReachable(props.consultation.case.id)
    props.consultation.case.customerNotReachable = true
    toast.success('Customer marked as not reachable')
  } catch {
    toast.error('Failed to mark customer as not reachable')
  } finally {
    markingNotReachable.value = false
  }
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  try {
    uploading.value = true
    const formData = new FormData()
    for (const file of input.files) {
      formData.append('files', file)
    }

    const uploadedFiles = await uploadStore.uploadFile(formData)
    await caseStore.addAssets(props.consultation.case.id, uploadedFiles)

    // Add to local assets list
    props.consultation.case.assets.push(...uploadedFiles)

    toast.success('Photos uploaded successfully')
  } catch {
    toast.error('Failed to upload photos')
  } finally {
    uploading.value = false
    input.value = ''
  }
}

const handleDownloadFile = (url: string) => {
  window.open(url, '_blank')
}
</script>

<style lang="scss" scoped>

.pet-details--grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(10px, 234px));
  justify-content: space-between;
}

.scroll {
  height: calc(100vh - 124px);
  overflow-y: scroll;
  margin: 4px;
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background: #e8e8e8;
  }
}
</style>
