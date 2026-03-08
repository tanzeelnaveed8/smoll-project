<template>
  <v-app>
    <RouterView />
  </v-app>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import { RouterView } from 'vue-router'

dayjs.extend(timezone)
</script>

<style scoped></style>
