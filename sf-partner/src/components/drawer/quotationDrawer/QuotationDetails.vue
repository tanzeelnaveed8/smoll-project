<template>
  <v-sheet style="height: fit-content;width: 52% !important;">
    <v-sheet class="pa-8 d-flex flex-column gr-11 h-100">
      <!-- //HEADER -->
      <v-sheet class="d-flex gr-6 flex-column">
        <v-sheet class="d-flex justify-space-between w-100">
          <p class="text-grey2 text-uppercase font-weight-bold">Basic Details</p>
          <p style="font-weight: 600">
            Date: {{ dayjs(caseDetails?.createdAt).format('DD MMM YYYY') }}
          </p>
        </v-sheet>
        <v-sheet class="d-flex gc-4">
          <v-sheet class="d-flex flex-column gr-5 w-100">
            <p class="font-weight-bold">Customer name:</p>
            <span class="d-flex gc-2">
              <v-icon icon="$tb-user-circle" />
              <p style="font-weight: 600">{{ caseDetails?.member }}</p>
            </span>
          </v-sheet>
          <v-sheet class="d-flex flex-column gr-5 w-100">
            <p class="font-weight-bold">Escalted by:</p>
            <span class="d-flex gc-2">
              <v-icon icon="$tb-user-circle" />
              <p style="font-weight: 600">{{ caseDetails?.vet }}</p>
            </span>
          </v-sheet>
        </v-sheet>
      </v-sheet>

      <!-- //INFO -->
      <v-sheet class="d-flex flex-column gr-6">
        <v-sheet class="pb-2" style="border-bottom: 1px solid #dde7ee">
          <p class="text-grey2 font-weight-bold text-uppercase">Expert Note</p>
        </v-sheet>
        <v-sheet>
          <p class="text-grey2" style="font-weight: 600">
            {{ caseDetails?.vetNote }}
          </p>
        </v-sheet>
      </v-sheet>

      <!-- //SERVICES -->
      <v-sheet class="d-flex flex-column gr-6 h-100">
        <v-sheet class="pb-2" style="border-bottom: 1px solid #dde7ee">
          <p class="text-grey2 font-weight-bold text-uppercase">Services included</p>
        </v-sheet>
        <p v-if="!escalationDetails?.services?.length" class="text-grey2">-</p>
        <v-sheet v-else class="d-flex flex-column gr-6 services-section">
          <v-sheet
            v-for="(item, i) in escalationDetails?.services"
            :key="item.id"
            class="d-flex gc-6 font-weight-bold"
          >
            <v-sheet class="d-flex w-100 flex-column gr-1">
              <div class="d-flex align-center">
                <span class="d-flex font-weight-bold">
                  <p class="mr-1">{{ i + 1 }}.</p>
                  <p style="max-width: 230px">{{ item.title }}</p>
                </span>
                <v-chip
                  class="ml-1"
                  :color="
                    item.label === 'Essential'
                      ? '#E7F3F7'
                      : item.label === 'Recommended'
                        ? '#10AFE1'
                        : '#FFC400'
                  "
                  variant="flat"
                  :text="item.label"
                  style="height: 28px; font-weight: 600"
                />
              </div>
              <p class="text-body-2 text-grey2" style="font-weight: 600">
                {{ item.description }}
              </p>
            </v-sheet>

            <p class="text-no-wrap">{{ item.price }} AED</p>
          </v-sheet>
        </v-sheet>
      </v-sheet>
    </v-sheet>
    <!-- FOOTER -->
    <v-sheet class="drawer-footer quotation-footer">
      <p class="quotaion-footer-heading">Quotation Value</p>
      <v-divider class="w-100 mb-2" />
      <v-sheet class="d-flex w-100">
        <v-sheet class="d-flex gc-6 font-weight-bold">
          <span class="d-flex flex-column gc-1 align-start">
            <p class="text-caption font-weight-medium" style="line-height: 24px">Min</p>
            <p>{{ minPrice ? minPrice : 0 }} AED</p>
          </span>
          <span class="d-flex flex-column gc-1 align-start">
            <p class="text-caption font-weight-medium" style="line-height: 24px">Max</p>
            <p>{{ maxPrice ? maxPrice : 0 }} AED</p>
          </span>
          <span class="d-flex flex-column gc-1 align-start">
            <p class="text-caption font-weight-medium" style="line-height: 24px">
              Platform fees
            </p>
            <template v-if="!maxPrice">
            <p>0 AED</p>
            </template>
            <template v-else>
              <p v-if="maxPrice === minPrice || !minPrice">
              {{platformFees.max.toFixed(2)}} AED
            </p>
            <p v-else>{{platformFees.min.toFixed(2) + ' ~ ' + platformFees.max.toFixed(2)}} AED</p>
            </template> 
        
          </span>
        </v-sheet>
        <v-btn
          class="px-3 ml-auto"
          flat
          :loading
          :disabled="
            !escalationDetails?.services?.length || !escalationDetails.note || loading || disable
          "
          @click="$emit('submit')"
        >
          {{ caseDetails.quote.length ? 'Update' : 'Submit to client' }}</v-btn
        >
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import { CaseQuoteLabel, type CaseDetails } from '@/stores/types/case.d'
import { truncateString } from '@/utils/helpers'
import dayjs from 'dayjs'
import { computed } from 'vue'

const props = defineProps<{
  escalationDetails: { services: any[]; note: string } | null
  caseDetails: CaseDetails
  loading: boolean
  disable: boolean
}>()

const emit = defineEmits<{
  (event: 'submit'): void
}>()

const minPrice = computed(() => {
  return props.escalationDetails?.services.length
    ? props.escalationDetails?.services
        .map(
          (item) =>
            (item.label === CaseQuoteLabel.ESSENTIAL || item.label === CaseQuoteLabel.CONTINGENT) &&
            item.price
        )
        .reduce((a, b) => a + b)
    : 0
})

const maxPrice = computed(() => {
  return props.escalationDetails?.services.length
    ? props.escalationDetails?.services.map((item) => item.price).reduce((a, b) => a + b)
    : 0
})

const platformFees = computed(() => ({min:(minPrice.value * 0.229) + 1 ,max:(maxPrice.value * 0.229) + 1}))
</script>

<style lang="scss" scoped>
@import '@/assets/global.css';

.services-section {
  overflow-y: scroll;
  height: calc(100vh - 545px);
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background: #e8e8e8;
  }
}

.quotation-footer {
  width: inherit !important;
  flex-direction: column;
  border-top: none !important;
  align-items: start;
}

.quotaion-footer-heading {
  font-weight: 600;
  font-size: 18px;
  line-height: 32px;
}
</style>
