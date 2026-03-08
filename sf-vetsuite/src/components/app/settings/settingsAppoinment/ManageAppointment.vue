<template>
  <v-sheet class="d-flex w-100 align-start" style="gap: 35px" min-height="36">
    <!-- <v-skeleton-loader v-if="!availabilityItem" class="w-100 loader" type="list-item" /> -->

    <v-sheet max-width="172" class="w-100 d-flex justify-space-between align-center">
      <p class="text-grey2" style="font-weight: 600">
        {{
          (availabilityItem?.dayOfWeek[0]?.toUpperCase() as string) +
          availabilityItem?.dayOfWeek?.slice(1, 3)
        }}
      </p>
      <label class="switch">
        <input type="checkbox" v-model="isAvailable" />
        <span class="slider round"></span>
      </label>
    </v-sheet>
    <v-sheet v-if="!isAvailable" class="align-self-center">
      <p class="text-body2" style="font-weight: 600; color: #78848c; line-height: 24px">
        Unavailable
      </p>
    </v-sheet>
    <v-sheet v-if="isAvailable" class="d-flex gc-5 align-start">
      <v-sheet class="d-flex flex-column gr-4">
        <v-sheet v-for="(item, i) in availableHours" :key="i" class="d-flex gc-5 align-center">
          <v-sheet class="d-flex gc-5 align-center">
            <v-select
              hide-details="auto"
              v-model="item.from"
              density="compact"
              class="select text-grey2"
              width="109"
              placeholder="Time"
              :menu-props="{ offset: '8px' }"
              :items="getFromHours(i)"
            />
            <span class="text-grey1">to</span>
            <v-select
              v-model="item.to"
              hide-details="auto"
              density="compact"
              class="select text-grey2"
              placeholder="Time"
              width="109"
              style="letter-spacing: 0px"
              :menu-props="{ offset: '8px' }"
              :items="getToHours(i, item.from)"
            />
          </v-sheet>
          <v-btn
            v-push
            icon="$tb-circle-minus"
            variant="text"
            color="grey2"
            class="px-0"
            height="24"
            width="auto"
            @click.prevent="removeAvailableHours(i)"
          />
        </v-sheet>
      </v-sheet>

      <v-sheet class="d-flex align-center relative" style="height: 36px">
        <v-tooltip
        v-if="addHoursBtnDisabled"
        activator="parent"
        location="top"
        >
        Cannot add more time slots
        </v-tooltip>
        <v-btn
          v-push
          icon="$tb-circle-plus"
          variant="text"
          color="grey1"
          class="px-0"
          height="24"
          width="auto"
          :disabled="addHoursBtnDisabled"
          @click.prevent="addAvailableHours"
        />
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch, type PropType } from 'vue'
// import { VSkeletonLoader } from 'vuetify/components/VSkeletonLoader'
import { hours } from '@/constant'
import type { AvailabilityItem } from '@/stores/types/availabilities'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { convertTimeToLocal } from '@/utils/helpers'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

dayjs.extend(utc)

const props = defineProps({
  availabilityItem: Object as PropType<AvailabilityItem>
})

const emit = defineEmits<{
  (
    event: 'handleAvailabilitySchedule',
    payload: { day: string; availabilities: { from: string; to: string }[] }
  ): void
}>()

const authStore = useAuthStore()

const { user } = storeToRefs(authStore)

const isAvailable = ref(false)

const computedAvailabilityItemHour = computed<{ from: string; to: string }[] | undefined>(() => {
  return props.availabilityItem?.intervals.map((item) => {
    return {
      from: convertTimeToLocal(item.from),
      to: convertTimeToLocal(item.to)
    }
  })
})

const availableHours = ref<{ from: string; to: string }[] | undefined>(
  computedAvailabilityItemHour.value
)

const currentTime = () => getFromHours(availableHours.value?.length ?? 0 - 1)[0]

const addHoursBtnDisabled = computed(()=> availableHours.value?.[availableHours.value.length - 1]?.to === '23:00')

const addAvailableHours = () => {
  if(addHoursBtnDisabled.value) return
  availableHours.value = [...(availableHours.value as []), { from: currentTime() , to: '23:00' }]
}

const removeAvailableHours = (i: number) => {
  if (availableHours.value?.length === 1) isAvailable.value = false
  availableHours.value = availableHours.value?.filter((item, index) => index !== i)
}

watch(isAvailable, () => {
  if (isAvailable.value && availableHours.value?.length === 0) {
    availableHours.value = [{ from: '00:00', to: '23:00' }]
  }
  if (!isAvailable.value) {
    availableHours.value = []
  }
})

watch(
  availableHours,
  (newValue, oldValue) => {
    // Check if an item was added (length increased)

    if (newValue && oldValue && newValue.length > oldValue.length) {
      return // Skip emitting if an item was added
    }

    emit('handleAvailabilitySchedule', {
      day: props.availabilityItem?.dayOfWeek as string,
      availabilities: newValue as { from: string; to: string }[]
    })
  },
  { deep: true }
)

onMounted(() => {
  isAvailable.value = props.availabilityItem?.intervals.length !== 0
  emit('handleAvailabilitySchedule', {
    day: props.availabilityItem?.dayOfWeek as string,
    availabilities: availableHours.value as { from: string; to: string }[]
  })
})

const getFromHours = (index: number) => {
  if (index === 0) return hours.slice(0,-1);
  const previousTo = availableHours.value?.[index - 1]?.to;
  if (!previousTo) return hours.slice(0,-1);
  
  const previousToIndex = hours.findIndex(hour => hour === previousTo);
  return hours.slice(previousToIndex,-1);
}

const getToHours = (index: number, from: string) => {
  if (!from) return hours;
  const fromIndex = hours.findIndex(hour => hour === from);
  return hours.slice(fromIndex + 1);
}
</script>

<style lang="scss" scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 51px;
  height: 31px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #78788029;
  -webkit-transition: 0.2s;
  transition: 0.2s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 25px;
  width: 25px;
  left: 4px;
  bottom: 3.3px;
  background-color: white;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.4);
  -webkit-transition: 0.2s;
  transition: 0.2s;
}

input:checked + .slider {
  background-color: #10afe1;
}

input:focus + .slider {
  box-shadow: 0 0 1px #10afe1;
}

input:checked + .slider:before {
  -webkit-transform: translateX(18px);
  -ms-transform: translateX(18px);
  transform: translateX(18px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 38px;
}

.slider.round:before {
  border-radius: 50%;
}

.select {
  &:deep(.v-field) {
    font-weight: 600;
    border-color: #e1e1e2;
    padding-right: 8px;
  }

  &:deep(.v-field__input) {
    padding: 8px 0px 8px 8px !important;

    & .v-select__selection-text {
      color: #494949;
    }
  }

  &:deep(.v-select__selection-text) {
    font-size: 14px;
    line-height: 20px;
    overflow: visible;
  }

  &:deep(.v-input__control) {
    height: 36px;
  }

  &:deep(.v-field__input) > input {
    font-size: 14px;
    line-height: 20px;
  }
}

.loader {
  &:deep(.v-skeleton-loader__text) {
    height: 36px;
  }
}
</style>
