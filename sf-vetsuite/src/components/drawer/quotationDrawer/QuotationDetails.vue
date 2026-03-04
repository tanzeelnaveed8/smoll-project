<template>
  <v-sheet style="height: fit-content;width: 52% !important;">
    <v-sheet class="pa-8 d-flex flex-column gr-11 h-100">
      <!-- //HEADER -->
      <v-sheet class="d-flex gr-6 flex-column">
        <v-sheet class="d-flex justify-space-between w-100">
          <p class="text-grey2 text-uppercase font-weight-bold">Basic Details</p>
          <p style="font-weight: 600">
            Date: {{ dayjs($props.case?.createdAt).format('DD MMM, YYYY') }}
          </p>
        </v-sheet>
        <v-sheet class="d-flex gc-4">
          <v-sheet class="d-flex flex-column gr-5 w-100">
            <p class="font-weight-bold">Customer name:</p>
            <span class="d-flex gc-2">
              <v-icon icon="$tb-user-circle" />
              <p style="font-weight: 600">{{ member.name }}</p>
            </span>
          </v-sheet>
          <v-sheet v-if="!isEmergency" class="d-flex flex-column gr-5 w-100">
            <p class="font-weight-bold">Vet name:</p>
            <span class="d-flex gc-2">
              <v-icon icon="$tb-user-circle" />
              <p style="font-weight: 600">{{ directBookingProps?.partnerVet?.name}}</p>
            </span>
          </v-sheet>
        </v-sheet>
        <p v-if="!isEmergency" class="text-grey2" style="font-weight: 600"><span class="font-weight-bold pr-1 text-grey1">Scheduled At:</span>{{dayjs(directBookingProps?.scheduledAt).format('hh:mm A, DD MMM YYYY')}}</p>
      </v-sheet>

      <!-- //SERVICES -->
      <v-sheet class="d-flex flex-column gr-6 h-100">
        <v-sheet class="pb-2" style="border-bottom: 1px solid #dde7ee">
          <p class="text-grey2 font-weight-bold text-uppercase">Services included</p>
        </v-sheet>
        <p v-if="!services?.length" class="text-grey2 font-weight-medium">No service added.</p>
        <v-sheet v-else class="d-flex flex-column gr-6 services-section">
          <v-sheet
            v-for="(item, i) in services"
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
      <v-sheet class="d-flex w-100 align-center">
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
            !services?.length || loading || disable
          "
          @click="$emit('submit')"
        >
          Submit to Client
        </v-btn>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import { CaseQuoteLabel } from '@/stores/types/case.d';
import type { Case } from '@/stores/types/case';
import dayjs from 'dayjs'
import { computed } from 'vue'
import type { Service } from '@/stores/types/global';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import type { Member } from '@/stores/types/member';

interface ServiceDetails extends Service {
  label: string
}

const props = defineProps<{
  services: ServiceDetails[] | null
  case: Case | null
  loading: boolean
  disable: boolean
  directBookingProps?:{
    partnerVet: null | {id:string,name:string} ;
    scheduledAt: string;
  }
  isEmergency:boolean
  member:Member
}>()

const emit = defineEmits<{
  (event: 'submit'): void
}>()

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const minPrice = computed(() => {
  let minVal = 0
   props.services?.forEach((item)=>{
    if(item.label === CaseQuoteLabel.ESSENTIAL || item.label === CaseQuoteLabel.CONTINGENT) minVal+=item.price
   })
   return minVal
})

const maxPrice = computed(() => {
  let maxVal = 0
   props.services?.forEach((item)=>maxVal+=item.price)
   return maxVal
})

const platformFees = computed(() => ({min:(Number(minPrice.value) * 0.229) + 1 ,max:(Number(maxPrice.value) * 0.229) + 1}))
</script>

<style lang="scss" scoped>
@import '@/assets/global.css';

.services-section {
  overflow-y: scroll;
  min-height: 100px;
  height: calc(100vh - 430px);
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
  width: 620px !important;
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
