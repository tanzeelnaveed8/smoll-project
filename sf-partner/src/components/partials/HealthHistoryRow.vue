<template>
  <v-sheet class="d-flex gc-3 align-start">
    <v-btn
      variant="text"
      height="auto"
      width="auto"
      class="text-grey2 rounded-lg mt-1"
      icon
      @click="showMore = !showMore"
    >
      <v-icon :icon="showMore ? '$tb-minus' : '$tb-plus'" size="20" />
    </v-btn>
    <v-sheet class="d-flex flex-column gr-1 text-grey2 w-100">
      <div class="d-flex w-100 justify-space-between">
        <p class="text-grey1" style="font-weight: 600">
          {{ condition.name }}
        </p>
        <p class="text-body-2" style="font-weight: 600">
          {{ dayjs(condition.date).format('DD/MM/YYYY') }}
        </p>
      </div>
      <template v-if="showMore">
        <p class="font-weight-medium" :class="condition.documents.length && ' mb-3'">
          {{ condition.description ? condition.description : '-' }}
        </p>
        <v-sheet v-if="condition.documents.length" class="d-flex flex-column gr-2" >
          <v-card
            v-for="(file, i) in condition.documents"
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
      </template>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { ref } from 'vue'

defineProps<{
  condition: {
    name: string
    date: string
    description: string
    documents: {
      url: string
      filename: string
    }[]
  }
}>()

const showMore = ref(false)

const handleDownloadFile = (url: string) => {
  window.open(url, '_blank')
}
</script>
