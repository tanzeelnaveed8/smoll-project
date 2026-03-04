<template>
  <v-sheet class="ma-8 d-flex flex-column gr-5">
    <p class="text-body-2 text-grey1 text-uppercase font-weight-bold" style="line-height: 24px">
      Submitted Quotation
    </p>
    <v-sheet class="d-flex flex-column gr-10">
      <v-sheet v-for="quote in quotes" :key="quote.id" class="d-flex flex-column gr-10">
        <v-sheet class="d-flex justify-space-between">
          <v-sheet class="d-flex align-center gc-4" max-width="350">
            <v-avatar :image="quote.partner.clinicImg?.url" icon="$tb-heart-handshake" size="68" />
            <v-sheet>
              <v-sheet class="d-flex gc-2">
                <p class="text-grey1" style="font-size: 18px; font-weight: 600">
                  {{ quote.partner.name }}
                </p>
                <v-chip
                  v-if="quote.partner.isSelected"
                  density="compact"
                  color="primary"
                  variant="flat"
                >
                  Selected
                </v-chip>
              </v-sheet>

              <p class="text-grey2 mt-1 partner-note">
                Note:
                {{ truncateString(quote.note, 64) }}
              </p>
            </v-sheet>
          </v-sheet>
          <v-sheet class="d-flex gc-12" style="line-height: 24px">
            <v-sheet class="text-center">
              <p class="text-body-1 text-grey1" style="font-weight: 700">Min</p>
              <p class="mt-2 price">{{ getMinPrice(quote.services) }} AED</p>
            </v-sheet>
            <v-sheet class="text-center">
              <p class="text-body-1 text-grey1" style="font-weight: 700">Max</p>
              <p class="mt-2 price">{{ getMaxPrice(quote.services) }} AED</p>
            </v-sheet>
          </v-sheet>
        </v-sheet>
        <!-- SERVICES -->
        <v-sheet class="d-flex flex-column gr-4 ml-2">
          <v-sheet
            class="d-flex flex-column gr-4"
            v-for="(item, i) in quote.services"
            :key="item.id"
          >
            <v-sheet class="d-flex justify-space-between font-weight-bold">
              <v-sheet class="d-flex w-100 flex-column gr-2" max-width="70%">
                <div class="d-flex align-center">
                  <span class="d-flex font-weight-bold">
                    <p class="mr-1">{{ i + 1 }}.</p>
                    <v-sheet class="d-flex gc-2">
                      <p>
                        {{ item.name }}
                      </p>

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

                      <!-- If service is selected -->
                      <span v-if="item.isSelected">
                        <v-icon :icon="'$tb-check'" color="grey1"> </v-icon>
                        <v-tooltip activator="parent" location="top">Member's selected</v-tooltip>
                      </span>
                    </v-sheet>
                  </span>
                </div>
                <p class="text-body-2 text-grey2" style="font-weight: 600">
                  {{ item.description }}
                </p>
              </v-sheet>
              <v-sheet class="d-flex justify-space-between" max-width="230">
                <p class="text-no-wrap">{{ item.price }} AED</p>
              </v-sheet>
            </v-sheet>
          </v-sheet>
        </v-sheet>
        <v-divider color="#D0D7DC" class="opacity-100" />
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import type { Quote } from '@/stores/types/case'
import { truncateString } from '@/utils/helpers'
import { computed } from 'vue'

const props = defineProps<{
  quotes: Quote[]
}>()

const getMinPrice = (services: any[]) => {
  return services
    .map((item) =>
      (item.label === 'Essential' || item.label === 'Contigent') && item.price ? item.price : 0
    )
    .reduce((a, b) => a + b, 0)
}

const getMaxPrice = (services: any[]) => {
  return services.map((item) => Number(item.price)).reduce((a, b) => a + b)
}
</script>

<style lang="scss" scoped>
.partner-note {
  font-size: 14px;
  word-break: break-all;
  letter-spacing: 0.4px;
  font-weight: 600;
}

.price {
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
  color: #427594;
}
</style>
