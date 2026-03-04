<template>
  <v-sheet
    class="pa-8 d-flex flex-column gr-8 scroll-none"
    style="overflow-y: scroll; height: fit-content;width: 48% !important;"
  >
    <v-sheet class="d-flex flex-column gr-6">
      <!-- HEADER -->
      <v-sheet>
        <h3 class="text-h5 font-weight-bold">Start building a quotation</h3>
        <p class="mt-3 font-weight-medium">
          Add single, one-time items or products from your product catalogue to this invoice.
        </p>
      </v-sheet>
      <!-- INPUT -->
      <v-form
        ref="formRef"
        v-model="formIsValid"
        validate-on="blur"
        @submit.prevent="handleAddService"
      >
        <v-sheet class="d-flex flex-column gr-2">
          <v-sheet>
            <p style="line-height: 24px" class="font-weight-bold text-body-2 text-grey2">
              Select Service
            </p>
            <v-select
              v-model="service.service"
              hide-details="auto"
              placeholder="Service"
              :disabled="isLoading"
              class="mt-1"
              return-object
              :menu-props="{ offset: '10px' }"
              :items="servicesListAll ?? []"
              :rules="rules.service"
            />
          </v-sheet>
          <v-sheet>
            <p style="line-height: 24px" class="font-weight-bold text-body-2 text-grey2">
              Select Label
            </p>
            <v-select
              v-model="service.label"
              hide-details="auto"
              placeholder="Label"
              class="mt-1"
              :disabled="isLoading"
              :menu-props="{ offset: '10px' }"
              :items="labels"
              :rules="rules.label"
            />
          </v-sheet>
        </v-sheet>
        <v-sheet class="d-flex align-center mt-6">
          <v-btn
            variant="outlined"
            type="submit"
            class="px-2 text-body-1"
            style="font-weight: 600; line-height: 24px"
            :disabled="isLoading"
            color="grey1"
          >
            <template #prepend>
              <v-icon icon="$tb-plus" style="margin-right: -4px" />
            </template>
            Add to quotation
          </v-btn>
          <p v-if="serviceExist" class="ml-3 font-weight-bold" style="color: #e02a2a">
            (Service already exists.)
          </p>
        </v-sheet>
      </v-form>
      <!-- LIST -->
      <v-list
        v-if="selectedServiceList.length"
        class="d-flex flex-column gr-4 editable-service-list"
      >
        <v-sheet v-for="(item, i) in selectedServiceList" class="d-flex gc-5 pa-0 text-body-1">
          <v-sheet class="d-flex justify-space-between w-100 font-weight-bold align-center">
            <div class="d-flex align-center">
              <span class="d-flex font-weight-bold">
                <p class="mr-1">{{ i + 1 }}.</p>
                <p style="max-width: 200px">{{ item.title }}</p>
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
            <p class="text-no-wrap">{{ item.price }} AED</p>
          </v-sheet>
          <v-btn
            @click="removeService($event, item)"
            variant="plain"
            icon="$tb-x"
            :disabled="isLoading"
            class="pa-0 text-grey1"
            height="auto"
            min-height="auto"
            min-width="auto"
            width="auto"
          />
        </v-sheet>
      </v-list>
    </v-sheet>
    <v-divider color="#DDE7EE" class="opacity-100" />
    <v-sheet class="d-flex flex-column gr-4">
      <h3 class="text-h5 font-weight-bold">Add Note</h3>
      <v-textarea
        hide-details="auto"
        v-model="note"
        :disabled="isLoading"
        no-resize
        row-height="24"
        rows="6"
        placeholder="Note"
        :rules="[(v: string) => v?.length > 0 || 'Note is required.']"
      />
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import { CaseQuoteLabel, type CaseDetails } from '@/stores/types/case.d'
import type { Service } from '@/stores/types/global'
import { computed, ref, watch, watchEffect } from 'vue'

const props = defineProps<{
  servicesList: Service[] | null
  loading: boolean
  caseDetails: CaseDetails | null
}>()

const formRef = ref()
const formIsValid = ref(false)

const emit = defineEmits<{
  (event: 'updateEscalationDetails', services: any): void
}>()

const isLoading = computed(() => props.loading)

const rules = {
  service: [(v: any) => Boolean(v) || 'Please select service.'],
  label: [(v: string) => Boolean(v) || 'Please select label.']
}

const serviceExist = ref(false)

const service = ref<{ service: any | null; label: string | null }>({
  service: null,
  label: null
})

const servicesListAll = ref([])

const defaultSelectedServiceList = computed(() => {
  const updatedServices = props?.caseDetails?.quote[0]?.services.map((service) => ({
    ...service,
    title: service.name
  }))
  return updatedServices ?? []
})

const defaultNote = computed(() => props?.caseDetails?.quote[0]?.note ?? '')

const selectedServiceList = ref<any[]>(defaultSelectedServiceList.value)
const note = ref(defaultNote.value)

const labels = [
  { title: 'Essential', value: CaseQuoteLabel.ESSENTIAL },
  { title: 'Contingent', value: CaseQuoteLabel.CONTINGENT },
  { title: 'Recommended', value: CaseQuoteLabel.RECOMMENDED }
]

const handleAddService = () => {
  if (!formIsValid.value) return
  const serviceExists = selectedServiceList.value.findIndex(
    (item) => item.id == service.value.service.id
  )

  if (!(serviceExists + 1)) {
    //Service doesnt exist
    selectedServiceList.value = [
      ...selectedServiceList.value,
      { ...service.value.service, label: service.value.label }
    ]
    formRef.value.reset()
    serviceExist.value = false
    emit('updateEscalationDetails', { services: selectedServiceList.value, note: note.value })
  } else {
    //service exist
    serviceExist.value = true
  }
}

const removeService = (event: Event, item: any) => {
  const filteredList = selectedServiceList.value.filter((listItem) => listItem.id !== item.id)
  selectedServiceList.value = filteredList
  emit('updateEscalationDetails', { services: selectedServiceList.value, note: note.value })
}

watch(note, () => {
  emit('updateEscalationDetails', { services: selectedServiceList.value, note: note.value })
})

watchEffect(() => {
  servicesListAll.value = props.servicesList as []
})
</script>

<style lang="scss" scoped>
@import '@/assets/global.css';

.editable-service-list {
  overflow-y: scroll;
  height: 9vh;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background: #e8e8e8;
  }
}
</style>
