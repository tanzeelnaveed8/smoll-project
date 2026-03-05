<template>
  <v-sheet class="pa-7 pt-5 d-flex gr-6 flex-column scroll">
    <v-sheet
      v-if="type === 'scheduled' && consultation.status !== ConsultationStatusEnum.COMPLETED"
    >
      <div class="d-flex gc-3 align-center">
        <span style="font-weight: 600" class="d-flex gc-2">
          <p class="font-weight-bold">Appointment On:</p>
          <p>{{ dayjs(consultation.scheduledAt).format('dddd, D MMMM YYYY') }}</p>
        </span>
        <v-chip
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
        <div style="font-weight: 600; max-width: 300px" class="d-flex justify-space-between">
          <span class="d-flex gc-2">
            <v-icon icon="$tb-user-circle" size="24" />
            <p>{{ consultation?.member?.name ?? '-' }}</p>
          </span>

          <p>{{ consultation?.member?.phone ?? '-' }}</p>
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
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import { ConsultationStatusEnum, type ConsultationDetail } from '@/stores/types/consultation.d'
import dayjs from 'dayjs'

const props = defineProps<{
  type: 'instant' | 'scheduled'
  consultation: ConsultationDetail
}>()

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
