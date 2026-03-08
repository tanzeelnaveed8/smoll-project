<template>
  <v-sheet class="px-3 py-4" width="250">
    <v-form
      class="d-flex flex-column gr-3"
      ref="formRef"
      v-model="isFormValid"
      @submit.prevent="handleFormSubmit"
    >
      <v-combobox
        v-model="filter.country"
        :hide-details="true"
        placeholder="Country"
        item-title="name"
        :items="country"
        return-object
        :menu-props="{ maxWidth: 200 }"
      />
      <v-combobox
        :hide-details="true"
        :disabled="!filter.country"
        placeholder="City"
        :items="city"
        item-title="name"
        item-value="name"
        :menu-props="{ maxWidth: 200 }"
        v-model="filter.city"
      />

      <div class="d-flex mt-1 gc-2">
        <v-btn type="submit" :disabled="!filter.country || !filter.city">Apply</v-btn>
        <v-btn color="#d5d5d5" flat @click="clearFilter">Reset</v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>

<script lang="ts" setup>
import { Country, City } from 'country-state-city'
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  defaultValue: {
    country: string | null
    city: string | null
  }
}>()

const emit = defineEmits<{
  (event: 'setFilter', payload: { country: string | null; city: string | null }): void
}>()

const formRef = ref()
const isFormValid = ref(false)

const filter = ref<{
  country: any
  city: any
}>({
  country: null,
  city: null
})

const country = computed(() => Country.getAllCountries())

const city = computed(() => {
  if (filter.value.country) {
    return City.getCitiesOfCountry((filter.value.country as { isoCode: string })?.isoCode)
  }
  return []
})

const handleFormSubmit = () => {
  const { country, city } = filter.value
  if (!country || !city) return
  emit('setFilter', { country: filter.value.country?.name, city: filter.value.city?.name })
}

const clearFilter = () => {
  filter.value = { country: null, city: null }
  emit('setFilter', { country: null, city: null })
}

onMounted(() => {
  filter.value = props.defaultValue
})
</script>
