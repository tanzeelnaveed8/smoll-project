<template>
  <v-sheet class="ma-8 text-center">
    <p v-if="!caseDetails?.assets.length" style="font-weight: 600" class="py-12">
      No shared files...
    </p>
    <v-sheet class="d-flex flex-column gr-3" v-else>
      <v-card
        v-for="(file, i) in caseDetails.assets"
        :key="i"
        color="#F4F6F8"
        flat
        class="pa-2 cursor-pointer"
        @click="handleDownloadFile(file.url)"
      >
        <span class="d-flex gc-2 align-center">
          <v-icon icon="$tb-paper-clip" size="20" />
          <p class="text-grey2" style="font-weight: 600">{{ file.filename }}</p>
          <v-icon class="ml-auto" icon="$tb-download" size="20" />
        </span>
      </v-card>
    </v-sheet>
  </v-sheet>
</template>

<script setup lang="ts">
import type { CaseDetails } from '@/stores/types/case'

const props = defineProps<{
  caseDetails: CaseDetails | null
}>()

const handleDownloadFile = (url: string) => {
  window.open(url, '_blank')
}
</script>
