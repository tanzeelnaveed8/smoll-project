<template>
  <v-sheet
    class="ma-8 d-flex flex-column gr-5 scroll-none"
    style="height: calc(100vh - 193px); overflow-y: scroll"
  >
    <p class="text-body-2 text-grey1 text-uppercase font-weight-bold" style="line-height: 24px">
      {{ title }}
    </p>
    <v-sheet class="d-flex flex-column gr-5 quotes-container" style="padding-bottom: 164px">
      <template v-for="(item, i) in caseDetails?.quote[0].services" :key="item.id">
        <!-- //if type is there then check if service is selected if type is not there then show all -->
        <v-sheet
          class="d-flex flex-column gr-4 quotation"
          v-if="type === 'submitted' || item.isSelected"
        >
          <v-sheet class="d-flex gc-6 font-weight-bold">
            <v-sheet class="d-flex w-100 flex-column gr-1 quote-detail-container">
              <div class="d-flex align-center">
                <span class="d-flex font-weight-bold">
                  <p class="mr-1">{{ i + 1 }}.</p>
                  <p>{{ item.name }}</p>
                </span>
              </div>
              <p class="text-body-2 text-grey2 quote-description" style="font-weight: 600">
                {{ item.description }}
              </p>
            </v-sheet>
            <v-sheet class="d-flex justify-space-between w-100" max-width="230">
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
              <p class="text-no-wrap">{{ item.price }} AED</p>
            </v-sheet>
          </v-sheet>
        </v-sheet>
      </template>
    </v-sheet>

    <!-- //FOOTER -->
    <footer
      class="d-flex flex-column gr-4 mt-auto mb-4 position-fixed bottom-0 bg-white total-breakdown"
      style="width: calc(100% - 64px)"
    >
      <v-sheet class="py-2 total-breakdown-container" style="border-bottom: 2px solid #989898">
        <p class="font-weight-bold" style="font-size: 18px">Total cost breakdown</p>
      </v-sheet>
      <v-sheet class="d-flex justify-space-between align-center pt-2 total-breakdown-main">
        <v-sheet
          class="d-flex w-100 justify-space-between"
          :style="type ? 'max-width: 40%' : 'max-width: 47%'"
        >
          <v-sheet>
            <p
              class="text-grey1 text-body-2 mb-1"
              style="font-weight: 600; line-height: 20px; white-space: nowrap"
            >
              Total estimate
            </p>
            <p class="font-weight-bold" :class="type ? 'text-h5' : 'text-h6'" style="color: black">
              AED {{ totalAstimate.toFixed(2) }}
            </p>
          </v-sheet>
          <v-sheet>
            <p
              class="text-grey1 text-body-2 mb-1 text-pdf"
              style="font-weight: 600; line-height: 20px; white-space: nowrap"
            >
              Platform fees
            </p>
            <p class="font-weight-bold" :class="type ? 'text-h5' : 'text-h6'" style="color: black">
              <template v-if="type"> AED {{ selectedServicesPlatformFees.toFixed(2) }} </template>

              <template v-else>
                <!-- IF MAX PRICE AND MIN PRICE IS SAME OR MIN PRICE IS 0 -->
                <template v-if="maxPrice === minPrice || !minPrice">
                  {{ maxPlatformFees.toFixed(2) }} AED
                </template>

                <template v-else>
                  AED {{ minPlatformFees.toFixed(2) }} ~ {{ maxPlatformFees.toFixed(2) }}
                </template>
              </template>
            </p>
          </v-sheet>
        </v-sheet>

        <v-sheet class="d-flex gc-6 pa-5 at-clinic-cost" min-width="200" rounded="xl">
          <v-sheet class="text-pdf-minimum">
            <p
              class="text-grey1 text-caption"
              style="font-weight: 600; line-height: 24px; white-space: nowrap"
            >
              <template v-if="type"> Customer will pay </template>
              <template v-else> Customer expects to pay atleast </template>
            </p>
            <p class="font-weight-bold" :class="type ? 'text-h5' : 'text-h6'" style="color: black">
              <template v-if="type">
                AED {{ (selectedServicesPrice - selectedServicesPlatformFees).toFixed(2) }}
              </template>
              <template v-else> AED {{ (minPrice - minPlatformFees).toFixed(2) }} </template>
            </p>
          </v-sheet>
          <v-sheet v-if="!type">
            <p
              class="text-grey1 text-caption text-pdf"
              style="font-weight: 600; line-height: 24px; white-space: nowrap"
            >
              Not more than
            </p>
            <p class="text-h6 font-weight-bold" style="color: black">
              AED {{ (maxPrice - maxPlatformFees).toFixed(2) }}
            </p>
          </v-sheet>
        </v-sheet>
      </v-sheet>
    </footer>
  </v-sheet>
</template>

<script lang="ts" setup>
import { CaseQuoteLabel, type CaseDetails } from '@/stores/types/case.d'
import { computed } from 'vue'

const props = defineProps<{
  caseDetails: CaseDetails | null
  type?: 'schedule' | 'booked' | 'submitted'
}>()

const title = computed(() => {
  if (props.type === 'schedule' || props.type === 'booked') {
    return 'Approved Quotation'
  }

  return 'Submitted Quotation'
})

const minPrice = computed(() => {
  let total = 0

  props.caseDetails?.quote[0].services.forEach((service) => {
    if (service.label === CaseQuoteLabel.ESSENTIAL || service.label === CaseQuoteLabel.CONTINGENT) {
      total += service.price || 0
    }
  })

  return total
})

const maxPrice = computed(() => {
  let total = 0

  props.caseDetails?.quote[0].services.forEach((service) => {
    total += service.price || 0
  })

  return total
})

const selectedServicesPrice = computed(() => {
  return (
    props.caseDetails?.quote[0].services.reduce((acc, service) => {
      if (service.isSelected) {
        return acc + service.price
      }

      return acc
    }, 0) ?? 0
  )
})

const selectedServicesPlatformFees = computed(() => {
  return selectedServicesPrice.value * 0.229 + 1
})

const minPlatformFees = computed(() => {
  return minPrice.value * 0.229 + 1
})

const maxPlatformFees = computed(() => {
  return maxPrice.value * 0.229 + 1
})

const totalAstimate = computed(() => {
  if (props.type !== 'submitted') {
    return selectedServicesPrice.value
  }

  return maxPrice.value
})
</script>

<style lang="scss" scoped>
.at-clinic-cost {
  background-color: #f1ecdf;
  position: relative;

  &::before {
    content: 'At clinic cost';
    position: absolute;
    background-color: #55b2ca;
    font-weight: 500;
    border-radius: 100px;
    color: #fff;
    max-width: 150px;
    text-align: center;
    padding: 4px 0px;
    width: 100%;
    top: 0px;
    transform: translateY(-50%);
  }
}
</style>
