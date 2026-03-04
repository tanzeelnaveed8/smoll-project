<template>
  <v-sheet>
    <SettingsGeneral />
  </v-sheet>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SettingsGeneral from '@/components/app/settings/settingsGeneral/SettingsGeneral.vue'

const tab = ref('general')
const tabs = [
  {
    label: 'General',
    value: 'general'
  },
  {
    label: 'Veterinarians',
    value: 'veterinarians'
  },
  {
    label: 'Services',
    value: 'services'
  }
]
</script>

<style scoped lang="scss"></style>
