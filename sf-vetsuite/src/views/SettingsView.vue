<template>
  <v-sheet>
    <v-tabs
      v-model="tab"
      class="tabs px-8 text-grey2"
      height="auto"
      style="padding-top: 18px; border-bottom: 1px solid #dde7ee"
    >
      <v-tab
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        style="line-height: 24px; font-weight: 600"
        class="py-2 px-3 pb-4 text-body-1"
        min-width="auto"
        height="auto"
        >{{ tab.label }}</v-tab
      >
    </v-tabs>
    <v-tabs-window v-model="tab" class="py-10">
      <v-tabs-window-item value="general"> <SettingsGeneral /> </v-tabs-window-item>
      <v-tabs-window-item value="appointmentSettings">
        <SettingsAppointment />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SettingsGeneral from '@/components/app/settings/settingsGeneral/SettingsGeneral.vue'
import SettingsAppointment from '@/components/app/settings/settingsAppoinment/SettingsAppointment.vue'

const tab = ref('general')
const tabs = [
  {
    label: 'General',
    value: 'general'
  },
  {
    label: 'Appointment settings',
    value: 'appointmentSettings'
  }
]
</script>

<style scoped lang="scss">
.tabs:deep(.v-slide-group__content) {
  gap: 16px;
}
.tabs:deep(.v-tab-item--selected) {
  color: #222222 !important;
}

.tabs:deep(.v-tab__slider) {
  color: #427594;
  height: 4px;
}
</style>
