<template>
  <v-sheet>
    <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
      Add specialities
    </p>

    <v-select
      v-model="selectedSpecialities"
      :items="specialities"
      item-title="name"
      return-object
      placeholder="Select Specialities"
      hide-details="auto"
      :menu-props="{ offset: '10px' }"
      @update:modelValue="$emit('updateAccount', selectedSpecialities)"
      hide-selected
      multiple
      class="mt-1"
    >
      <template v-slot:selection="{ item }">
        <v-chip>
          <span>{{ item.raw.name }}</span>
        </v-chip>
      </template>
    </v-select>
  </v-sheet>
</template>

<script lang="ts" setup>
import { useServicesStore } from '@/stores/services'
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  specialities: { id: string; name: string }[]
}>()

const specialities = ref<{ id: string; name: string }[] | []>([])

const selectedSpecialities = ref(props.specialities)

const serviceStore = useServicesStore()

const getSpecialities = async () => {
  const data = await serviceStore.getSpecialities()
  specialities.value = data.map((item: any) => ({ id: `${item.id}`, name: item.name }))
}

onMounted(async () => {
  getSpecialities()
})
</script>

<style lang="scss" scoped></style>
