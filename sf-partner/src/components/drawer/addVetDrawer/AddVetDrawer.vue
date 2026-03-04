<template>
  <v-sheet
    height="100vh"
    width="571"
    color="#fff"
    style="transform-origin: right; overflow: hidden"
  >
    <!-- //TOP -->
    <v-sheet>
      <v-sheet class="d-flex justify-space-between align-center gc-6" style="padding: 14px 32px">
        <h4 style="font-size: 18px; line-height: 24px">Add Vet</h4>

        <v-btn
          class="text-grey1"
          icon="$tb-x"
          width="auto"
          height="auto"
          flat
          color="transparent"
          @click="$emit('close')"
        />
      </v-sheet>
      <!-- //MAIN -->
      <v-stepper flat v-model="currentStep" class="stepper">
        <template #default="{ prev, next }">
          <v-stepper-header class="stepper-header">
            <template v-for="(item, n) in steps" :key="`${n}-step`">
              <v-stepper-item
                class="stepper-header-item"
                style="line-height: 20px"
                selected-class="active"
                :step="`Step ${n + 1}`"
                :title="item.title"
                :value="n + 1"
              />
            </template>
          </v-stepper-header>

          <v-stepper-window class="ma-0">
            <v-stepper-window-item :value="1">
              <StepperItemBasicDetails @submit="handleSubmit(next, $event)" />
            </v-stepper-window-item>

            <v-stepper-window-item :value="2">
              <StepperItemAvailability :loading :disabled @addVet="emitAddVet" @prevStep="emitPrevStep(prev)" />
            </v-stepper-window-item>
          </v-stepper-window>
        </template>
      </v-stepper>
    </v-sheet>
  </v-sheet>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import StepperItemBasicDetails from './StepperItemBasicDetails.vue'
import StepperItemAvailability from './stepperitemAvailability/StepperItemAvailability.vue'
import type { VetDetails, Veterinarians } from '@/stores/types/vet'
import { useVetStore } from '@/stores/vets'
import { toast } from 'vue3-toastify'
import useMitt from '@/functions/useMitt'

const emit = defineEmits<{
  (event: 'close'): void
}>()

const vetDetails = ref<VetDetails | null>(null)
const loading = ref(false)
const disabled = ref(false)

const vetStore = useVetStore()

const currentStep = ref(1)
const steps = ref([{ title: 'Basic Details' }, { title: 'Availability' }])

const handleSubmit = (next: () => void, data?: any) => {
  vetDetails.value = { ...vetDetails.value, ...data }
  next()
}

const { emitter } = useMitt()

const addVet = async (data: VetDetails) => {
  try {
    loading.value = true
    const vet = await vetStore.addVets(data)
    return vet
    disabled.value = true
  } finally {
    loading.value = false
  }
}

const emitAddVet = async (details: any) => {
  vetDetails.value = { ...vetDetails.value, ...details }
  const vet: Veterinarians = await addVet(vetDetails.value as VetDetails)
  emitter.emit('manage-service-drawer:update_vet', { payload: vet })
  emit('close')
  toast.success('Vet added successfully!')
}

const emitPrevStep  = (prev : () => void) => {
   prev()
}




</script>

<style lang="scss" scoped>
.stepper-header {
  overflow: hidden;
  box-shadow: none !important;
  border-bottom: 1px solid #e5edf2;
  justify-content: start;
  gap: 32px;
  padding: 0px 32px;
}

.stepper-header-item {
  padding: 4px 4px 12px 4px;
  color: #494949;
  font-size: 14px;
  font-weight: 700;
  position: relative;
  opacity: 1 !important;

  &:deep(.v-avatar) {
    background-color: #494949 !important;
    width: 16px !important;
    height: 16px !important;
    margin-right: 4px !important;
  }
  &:deep(.v-stepper-item__title) {
    line-height: 20px;
  }
}

.active {
  &::after {
    content: '';
    height: 2px;
    width: 100%;
    bottom: 0px;
    position: absolute;
    background-color: #10afe1;
  }
  &:deep(.v-avatar) {
    background-color: #10afe1 !important;
  }
}
</style>
