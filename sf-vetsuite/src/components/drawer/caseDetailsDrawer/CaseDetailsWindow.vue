<template>
  <v-sheet class="ma-8 mr-0 d-flex gr-8 flex-column" max-width="595">
    <v-sheet class="d-flex flex-column gr-5">
      <h5 class="text-body-1 font-weight-bold text-uppercase" style="line-height: 24px; color: black">
        MEMBER DETAILS
      </h5>
      <div style="font-weight: 600; max-width: 300px" class="d-flex justify-space-between">
        <span class="d-flex gc-2">
          <v-icon icon="$tb-user-circle" size="24" />
          <p>{{ caseDetails?.member ?? '-' }}</p>
        </span>

        <p>{{ caseDetails?.memberPhone ? caseDetails?.memberPhone : '-' }}</p>
      </div>
    </v-sheet>

    <v-sheet class="d-flex flex-column gr-6">
      <v-sheet class="pb-2" style="border-bottom: 1px solid #dde7ee">
        <h5 class="text-body-1 font-weight-bold text-uppercase" style="line-height: 24px; color: black">
          Pet Details
        </h5>
      </v-sheet>

      <v-sheet max-width="580" class="w-100 d-flex justify-space-between">
        <div class="w-100 pet-details--grid">
          <div class="d-flex flex-column" style="gap: 11px; font-weight: 600">
            <p class="text-grey2 font-weight-bold">
              Name: <span style="color: black">{{ caseDetails?.pet.name ?? '-' }}</span>
            </p>
            <p class="text-grey2 font-weight-bold">
              Gender:
              <span style="color: black">{{ caseDetails?.pet?.gender
                ? capitalizeFirst(caseDetails?.pet?.gender)
                : '-' }}</span>
            </p>
            <p class="text-grey2 font-weight-bold">
              Species:
              <span style="color: black">{{ caseDetails?.pet?.species
                ? capitalizeFirst(caseDetails?.pet?.species)
                : '-' }}</span>
            </p>
            <p class="text-grey2 font-weight-bold">
              Breed:
              <span style="color: black">{{ caseDetails?.pet.breed ?? '-' }}</span>
            </p>
          </div>
          <div class="d-flex flex-column" style="gap: 11px; font-weight: 600">
            <p class="text-grey2 font-weight-bold">
              Age: <span style="color: black">{{ caseDetails?.pet.age ?? '-' }}</span>
            </p>
            <p class="text-grey2 font-weight-bold">
              Weight:
              <span style="color: black">{{ caseDetails?.pet.weight ? caseDetails?.pet.weight + ' kg' : '-' }}</span>
            </p>
            <p class="text-grey2 font-weight-bold">
              Chip Number:
              <span style="color: black">{{
                caseDetails?.pet.chipNumber === 'undefined' || !caseDetails?.pet.chipNumber
                  ? '-'
                  : caseDetails?.pet.chipNumber
              }}</span>
            </p>
            <p class="text-grey2 font-weight-bold">
              Spayed/Neutered:
              <span style="color: black">{{
                caseDetails?.pet.spayedOrNeutered ? 'Yes' : 'No'
              }}</span>
            </p>
          </div>
        </div>
      </v-sheet>
    </v-sheet>
    <v-sheet class="d-flex flex-column gr-6">
      <v-sheet class="pb-2" style="border-bottom: 1px solid #dde7ee">
        <h5 class="text-body-1 font-weight-bold text-uppercase" style="line-height: 24px; color: black">
          Pre-Existing Conditions
        </h5>
      </v-sheet>
      <v-sheet>
        <p class="text-grey2" style="font-weight: 600">
          {{
            caseDetails?.pet.preExistingConditions ? caseDetails?.pet.preExistingConditions : '-'
          }}
        </p>
      </v-sheet>
    </v-sheet>
    <v-sheet class="d-flex flex-column gr-6">
      <v-sheet class="pb-2" style="border-bottom: 1px solid #dde7ee">
        <h5 class="text-body-1 font-weight-bold text-uppercase" style="line-height: 24px; color: black">
          Health History
        </h5>
      </v-sheet>
      <v-sheet class="d-flex flex-column gr-6">
        <HealthHistoryRow v-if="caseDetails?.pet.healthHistory.length"
          v-for="condition in caseDetails?.pet.healthHistory" :key="condition.id" :condition="condition" />
        <p v-else>-</p>
      </v-sheet>
    </v-sheet>

    <v-sheet class="d-flex flex-column gr-6">
      <v-sheet class="pb-2" style="border-bottom: 1px solid #dde7ee">
        <h5 class="text-body-1 font-weight-bold text-uppercase" style="line-height: 24px; color: black">
          Case Brief
        </h5>
      </v-sheet>
      <v-sheet>
        <p class="text-grey2" style="font-weight: 600">
          {{ caseDetails?.description ?? '-' }}
        </p>
      </v-sheet>
    </v-sheet>
    <v-sheet class="d-flex flex-column gr-6">
      <v-sheet class="pb-2" style="border-bottom: 1px solid #dde7ee">
        <h5 class="text-body-1 font-weight-bold text-uppercase" style="line-height: 24px; color: black">
          Conclusion
        </h5>
      </v-sheet>
      <v-sheet>
        <p class="text-grey2" style="font-weight: 600">{{ caseDetails?.vetNote || '-' }}</p>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script setup lang="ts">
import HealthHistoryRow from '@/components/partials/HealthHistoryRow.vue'
import type { Case } from '@/stores/types/case'
import { capitalizeFirst } from '@/utils/helpers';

const props = defineProps<{
  caseDetails?: Case | null
}>()
</script>

<style scoped lang="scss">
.pet-details--grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(10px, 234px));
  justify-content: space-between;
}
</style>
