<template>
  <v-sheet class="bg-white rounded-lg d-flex flex-column" width="450">
    <v-sheet
      class="py-3 px-6 text-h6 font-weight-bold d-flex justify-space-between"
      style="border-bottom: 1px solid #dde7ee"
    >
      <p>Are you sure?</p>
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
    <v-sheet class="d-flex flex-column pt-6 py-4 px-6 gr-8">
      <p class="text-body-1 font-weight-bold text-grey2">
        {{ text }}
      </p>
      <v-sheet class="d-flex gc-2 justify-end">
        <v-btn color="grey2" flat @click="$emit('close')">Close</v-btn>
        <v-btn
          :color="color ? color : '#E02A2A'"
          flat
          @click="handleCloseAll"
          :loading
          :disabled="loading"
          >{{ btnText }}
        </v-btn>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
defineProps<{
  text: string
  btnText: string
  color?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'closeAll'): void
}>()

const handleCloseAll = () => {
  emit('closeAll')
}
</script>

<style lang="scss" scoped></style>
