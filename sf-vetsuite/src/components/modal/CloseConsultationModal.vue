<template>
  <v-sheet
    width="600"
    class="align-self-center"
    flat
    style="border: 1px solid #d0d7dc; border-radius: 12px; background-color: white"
  >
    <v-sheet
      class="d-flex justify-space-between align-center px-6 py-4"
      style="border-bottom: 1px solid #e0e0e0"
    >
      <h3 class="text-h6" style="line-height: 24px; font-weight: 700">Close Case</h3>

      <v-btn
        height="auto"
        width="auto"
        min-width="auto"
        type="button"
        @click="$emit('close')"
        flat
        class="px-0 text-grey2"
        color="transparent"
      >
        <v-icon icon="$tb-x" size="24" />
      </v-btn>
    </v-sheet>
    <v-sheet class="px-6 pt-4 pb-6">
      <v-form
        ref="formRef"
        v-model="formIsValid"
        @submit.prevent="handleFormSubmit"
        class="d-flex flex-column gr-6"
      >
        <v-sheet class="d-flex flex-column gr-2">
          <h3 class="text-body-1 font-weight-bold text-grey2">Notes</h3>
          <v-textarea
            hide-details="auto"
            v-model="note"
            no-resize
            row-height="24"
            rows="6"
            :disabled="loading"
            placeholder="Write something..."
            :rules="[(v: string) => v?.length > 0 || 'Reason is required.']"
          />
        </v-sheet>
        <v-btn class="align-self-end" flat type="submit" :disabled="loading" :loading>Submit</v-btn>
      </v-form>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import useMitt from '@/functions/useMitt'
import { useCaseStore } from '@/stores/case'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

const props = defineProps<{
  caseId: string
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit'): void
}>()

const loading = ref(false)

const { closeCase } = useCaseStore()

const formRef = ref()
const note = ref('')
const formIsValid = ref(false)

const sendCloseCase = async (id: string, payload: { note: string }) => {
  try {
    loading.value = true
    await closeCase(id, payload)
  } finally {
    loading.value = false
  }
}

const handleFormSubmit = async () => {
  if (!formIsValid.value) return
  await sendCloseCase(props.caseId, { note: note.value })
  emit('submit')
}
</script>

<style lang="scss" scoped></style>
