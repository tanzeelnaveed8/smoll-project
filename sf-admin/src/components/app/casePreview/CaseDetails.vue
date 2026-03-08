<template>
  <v-sheet class="rounded-lg px-5 pt-6 pb-11 d-flex justify-space-between" style="border: 1px solid #d0d7dc">
    <v-sheet class="d-flex flex-column gr-4">
      <v-sheet>
        <h1 style="font-family: 'cooper'" class="text-h4 font-weight-regular text-grey1">
          {{ caseDetails?.id }}
        </h1>
        <p class="mt-2">Case number</p>
      </v-sheet>
      <v-sheet class="d-flex gc-8">
        <v-sheet class="d-flex align-center gc-3">
          <v-avatar
            color="grey2"
            style="height: 52px; width: 49px"
            :image="caseDetails?.pet?.photos[0]?.url"
          />
          <v-sheet>
            <p class="text-body-1" style="font-weight: 600">{{ caseDetails?.pet?.name }}</p>
            <v-btn
              variant="plain"
              class="mt-1 px-0 text-primary opacity-100"
              flat
              @click="dialog = true"
              min-height="auto"
              height="auto"
              min-width="auto"
              color="transparent"
              >Profile</v-btn
            >
          </v-sheet>
        </v-sheet>
        <v-sheet>
          <p class="text-caption text-grey2" style="font-weight: 600">Age</p>
          <p class="text-body-1 mt-1" style="font-weight: 600">{{ caseDetails?.pet?.age }} years</p>
        </v-sheet>
        <v-sheet>
          <p class="text-caption text-grey2" style="font-weight: 600">Gender</p>
          <p class="text-body-1 mt-1" style="font-weight: 600">{{ caseDetails?.pet?.gender }}</p>
        </v-sheet>
        <v-sheet>
          <p class="text-caption text-grey2" style="font-weight: 600">Date</p>
          <p class="text-body-1 mt-1" style="font-weight: 600">
            {{ dayjs(caseDetails?.pet?.createdAt).format('DD.MM.YYYY') }}
          </p>
        </v-sheet>
        <v-sheet>
          <p class="text-caption text-grey2" style="font-weight: 600">Time</p>
          <p class="text-body-1 mt-1" style="font-weight: 600">
            {{ dayjs(caseDetails?.pet?.createdAt).format('hh:mm A') }}
          </p>
        </v-sheet>
      </v-sheet>
    </v-sheet>
    <v-chip
      class="text-caption chip text-grey2 font-weight-medium"
      density="compact"
      color="#f7f7f7"
      style="letter-spacing: 0px !important; line-height: 20px"
      >{{ getCaseStatusData(caseDetails?.status).label }}</v-chip
    >
  </v-sheet>
  <!-- //PET DETAIL MODAL -->
  <v-dialog v-model="dialog">
    <PetProfileModal :petDetails="caseDetails?.pet" @closeDialog="dialog = false" />
  </v-dialog>
</template>

<script lang="ts" setup>
import PetProfileModal from '@/components/modal/PetProfileModal.vue'
import type { CaseDetail } from '@/stores/types/cases'
import { getCaseStatusData } from '@/util/helpers'
import dayjs from 'dayjs'
import { ref } from 'vue'

const props = defineProps<{
  caseDetails: CaseDetail
}>()

const dialog = ref(false)
</script>
