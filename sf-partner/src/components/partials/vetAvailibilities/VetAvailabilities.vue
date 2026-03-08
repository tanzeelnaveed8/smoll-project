<template>
  <v-sheet class="availabilities-scroll">
    <v-sheet class="d-flex flex-column gr-6">
      <ManageAppointment
        v-for="item in updatedDefaulValue"
        :key="item.id"
        :availabilityItem="item"
        @handleAvailabilitySchedule="handleAvailabilitySchedule"
      />
    </v-sheet>
  </v-sheet>
</template>
<script lang="ts" setup>
import { defaultAvailabilities } from '@/constant'
import type { AvailabilityItem, UpdateAvailabilitiesPayload } from '@/stores/types/availabilities'
import { computed, ref, watch, watchEffect } from 'vue'
import ManageAppointment from './ManageAppointment.vue'
import { convertTimeToUtc, convertTimeToLocal } from '@/utils/helpers';

const props = defineProps<{
  defaultValue?: AvailabilityItem[]
}>()

const emit = defineEmits<{
  (event: 'updateAvailability', payload: { availabilities: UpdateAvailabilitiesPayload }): void
}>()

const isInitializing = ref(true)

const updatedDefaulValue = computed(() => {
  if (props.defaultValue?.length) {
    return (props.defaultValue as []).sort(
      (a: AvailabilityItem, b: AvailabilityItem) => +a.id - +b.id
    )
  } else {
    return defaultAvailabilities
  }
})


const availabiltySchedule = ref<UpdateAvailabilitiesPayload>({
  availability: {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: []
  }
})

const handleAvailabilitySchedule = (item: {
  day: string
  availabilities: { from: string; to: string }[]
}) => {
  availabiltySchedule.value = {
    availability: { ...availabiltySchedule.value.availability, [item.day]: item.availabilities }
  }
}

watch(
  () => availabiltySchedule.value,
  (v) => {

    const availabilitiesPayload = Object.entries(v.availability).reduce(
      (acc, [day, slots]) => ({
        ...acc,
        [day]: slots.map(slot => ({
          from: convertTimeToUtc(slot.from),
          to: convertTimeToUtc(slot.to)
        }))
      }),
      {} as { [key: string]: { from: string; to: string }[] }
    )

  
    emit('updateAvailability', { availabilities: { availability: availabilitiesPayload } })
  },
  { deep: true }
)

watchEffect(() => {
  if (props.defaultValue) {
    isInitializing.value = true
    const sortedValue = (props.defaultValue as []).sort(
      (a: AvailabilityItem, b: AvailabilityItem) => +a.id - +b.id
    )

    const availabilities = sortedValue.reduce((acc, item: AvailabilityItem) => {
      const localIntervals = item.intervals.map(interval => ({
        from: convertTimeToLocal(interval.from),
        to: convertTimeToLocal(interval.to)
      }));
      return { ...acc, [item.dayOfWeek]: localIntervals }
    }, {})
    
    availabiltySchedule.value = { availability: { ...availabilities } }
  }
})

</script>

<style lang="scss" scoped>
.availabilities-scroll{
  overflow-y: scroll;
  height: calc(100vh - 230px);
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
