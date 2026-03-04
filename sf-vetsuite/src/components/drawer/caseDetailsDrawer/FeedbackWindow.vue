<template>
  <v-sheet class="ma-8 d-flex flex-column gr-8">
    <v-sheet class="d-flex flex-column gr-3">
      <p class="text-body-2 font-weight-bold text-uppercase" style="line-height: 24px">
        Feedback given by customer
      </p>
      <v-sheet class="d-flex gc-4">
        <v-icon
          v-for="(n, i) in 5"
          :key="n"
          color="#10AFE1"
          :icon="i < Number(caseDetails?.feedback.rating) ? '$tb-star-filled' : '$tb-star'"
          size="32"
        />
      </v-sheet>
    </v-sheet>
    <v-sheet
      v-if="caseDetails?.feedback?.comment"
      rounded="lg"
      class="py-3 px-8"
      style="border: 1px solid #dde7ee"
    >
      <p class="text-grey2" style="font-weight: 600">
        {{ caseDetails?.feedback?.comment }}
      </p>
    </v-sheet>
  </v-sheet>
</template>
<script lang="ts" setup>
import type { Case } from '@/stores/types/case'

const props = defineProps<{
  caseDetails: Case | null
}>()
</script>
