<template>
    <v-dialog v-model="visible" width="auto">
        <v-sheet width="600" class="align-self-center" elevation="1" flat
            style="border: 1px solid #d0d7dc; border-radius: 12px; background-color: white">
            <v-sheet class="d-flex justify-space-between align-center px-6 py-4"
                style="border-bottom: 1px solid #e0e0e0">
                <h3 class="text-h6" style="line-height: 24px; font-weight: 700">Case Details</h3>

                <v-btn height="auto" width="auto" min-width="auto" type="button" @click="cancel" flat
                    class="px-0 text-grey2" color="transparent">
                    <v-icon icon="$tb-x" size="24" />
                </v-btn>
            </v-sheet>
            <v-sheet class="px-6 pt-4 pb-6">
                <v-form ref="formRef" v-model="formIsValid" @submit.prevent="submit" class="d-flex flex-column gr-6">
                    <v-sheet class="d-flex flex-column gr-2">
                        <h3 class="text-body-1  text-grey2" style="font-weight: 600;">Provide a summary of the pet's
                            case
                            details
                            here.</h3>
                        <v-textarea hide-details="auto" v-model="caseDetails.description" no-resize row-height="24"
                            rows="5" placeholder="Write something..."
                            :rules="[(v: string) => v?.length > 0 || 'Description is required.']" />
                    </v-sheet>
                    <v-sheet class="d-flex flex-column gr-2">
                        <h3 class="text-body-1 text-grey2" style="font-weight: 600;">Attach documents</h3>
                        <UploadDoc @updateDoc="handleUpdateDoc" />
                    </v-sheet>
                    <v-btn class="align-self-end" flat type="submit" :disabled="!caseDetails.description">Submit</v-btn>
                </v-form>
            </v-sheet>
        </v-sheet>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import UploadDoc from '../UploadDoc.vue'
import type { UploadedFile } from '@/stores/types/global'

const visible = ref(false)
const caseDetails = ref<{ description: string, assets?: null | UploadedFile[] }>({ description: '' })
let resolver: ((val: { description: string, assets?: UploadedFile[] | null } | null) => void) | null = null
const formIsValid = ref()

const open = () => {
    visible.value = true
    caseDetails.value = { description: '' }
    return new Promise<{ description: string, assets?: UploadedFile[] | null } | null>((resolve) => {
        resolver = resolve
    })
}

const cancel = () => {
    visible.value = false
    resolver?.(null)
}

const handleUpdateDoc = ({ documents }: { documents: UploadedFile[] }) => {
    caseDetails.value = { ...caseDetails.value, assets: documents }
}
const submit = () => {
    visible.value = false
    resolver?.(caseDetails.value)
}

defineExpose({ open })
</script>

<style lang="scss" scoped></style>