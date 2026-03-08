<template>
  <v-sheet class="d-flex flex-column">
    <v-sheet width="100%" class="d-flex flex-column">
      <v-sheet width="100%" height="100%" position="relative" class="d-flex justify-center align-center"
        style="border-radius: 12px; border: 1px dashed #a0aeb8; overflow: hidden" :class="[
          actionLoading ? 'cursor-default' : 'cursor-pointer',
          isDragging ? 'drag-over' : ''
        ]" @click="!actionLoading && fileInput.click()" @dragover.prevent="isDragging = true"
        @dragenter.prevent="isDragging = true" @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop">
        <v-sheet v-if="actionLoading === 'file'" class="loading-overlay">
          <v-progress-circular indeterminate />
        </v-sheet>

        <v-sheet class="py-4 px-6 d-flex justify-center flex-column align-center">
          <v-icon icon="$tb-cloud-upload" color="grey2" />
          <v-sheet position="relative" style="margin-top: 2px" class="text-primary text-center">
            <input type="file" ref="fileInput" style="display: none" @change="handleImagePreview($event, 'file')" />
            <v-btn flat height="auto" min-height="auto" style="letter-spacing: 0px; font-weight: 600" variant="plain"
              color="grey1" class="text-body-1 opacity-100 w-full" :disabled="actionLoading !== ''">
              Upload a File
            </v-btn>
            <p class="text-caption text-center text-grey2 mt-2" style="max-width: 152px; font-weight: 500">
              Click to browse, or drag & drop a file here
            </p>
          </v-sheet>
        </v-sheet>
      </v-sheet>
      <v-sheet v-if="files?.length" class="mt-6" max-height="110"
        :style="{ overflowY: files.length > 4 ? 'scroll' : 'hidden' }">
        <v-chip-group column class="pa-0 uploaded-file-container pb-1 w-full" selected-class="bg-white">
          <v-chip v-for="(file, i) in files" :key="i + 'a'" variant="outlined" class="uploaded-file py-5 rounded-xl"
            prepend-icon="$tb-file">
            <a :href="file?.url" target="_blank" style="text-decoration: none; color: inherit">
              {{ shortenFileName(file?.filename, 13) }}
            </a>
            <v-btn color="grey1" variant="text" class="ml-auto mx-0 h-auto" width="auto" icon="$tb-x"
              @click.stop="handleRemoveFile($event, file)" />
          </v-chip>
        </v-chip-group>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import type { UploadedFile } from '@/stores/types/global'
import { useUploadStore } from '@/stores/upload'
import { shortenFileName } from '@/utils/helpers';
import { ref, watch, watchEffect, type Ref } from 'vue'
import { toast } from 'vue3-toastify';

const emit = defineEmits<{
  (
    event: 'updateDoc',
    doc: { documents: UploadedFile[] | []; }
  ): void
}>()

const props = defineProps<{
  formDetails?: { documents: UploadedFile[] | [] } | any
}>()

const uploadStore = useUploadStore()

const files = ref<UploadedFile[]>([])
const actionLoading = ref('')
const fileInput = ref<Ref | null>(null)
const isDragging = ref(false)


const handleImagePreview = async (e: any, type: 'file') => {
  const file = e.target.files[0]
  if (!file) return
  const bodyFormData = new FormData()
  bodyFormData.append('files', file)

  const sameFileExist = files.value.find((exFile) => exFile.filename === file.name)

  if (sameFileExist) {
    toast.error("File exists!")
    e.target.value = ''
    return;
  }

  if (type === 'file') await updateFiles(bodyFormData)

  e.target.value = ''


}

const handleDrop = async (ev: DragEvent) => {
  isDragging.value = false

  if (!ev.dataTransfer?.files.length) return

  const file = ev.dataTransfer.files[0]
  const bodyFormData = new FormData()
  bodyFormData.append('files', file)

  await updateFiles(bodyFormData)
}

const handleRemoveFile = (e: MouseEvent, item: UploadedFile) => {
  const updatedFiles = files.value.filter((file) => file.filename !== item.filename)
  files.value = [...updatedFiles]
}

const getUploadedFile = async (bodyFormData: FormData, loadingType: string) => {
  try {
    actionLoading.value = loadingType
    return await uploadStore.uploadFile(bodyFormData)
  } finally {
    actionLoading.value = ''
  }
}


const updateFiles = async (bodyFormData: FormData) => {
  const res = await getUploadedFile(bodyFormData, 'file');
  if (res && res.length) {
    files.value = [...files.value, ...res];
  }
}

const handleDragLeave = (event: DragEvent) => {
  if (!(event.currentTarget as Node)?.contains(event.relatedTarget as Node | null)) {
    isDragging.value = false
  }
}

watchEffect(() => {
  files.value = props.formDetails?.documents ?? []
})

watch([files], () => {
  emit('updateDoc', { documents: files.value })
})
</script>

<style lang="scss" scoped>
.uploaded-file-container {
  &:deep(.v-slide-group__content) {
    // flex-direction: column;
    flex-wrap: wrap;
    gap: 4px;
  }
}

.uploaded-file {
  // padding: 0px 16px;
  // margin: 0px;
  // height: 44px;
  border-color: #494949;
  // color: #222;
  // border-radius: 8px;
  // width: 99.9%;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;

  &:deep(.v-chip__prepend) {
    margin-right: 4px;
  }

  &:deep(.v-chip__content) {
    gap: 8px
  }

  &:deep(.v-icon) {
    width: 20px;
    height: 20px;
    margin-inline: 0px;
  }
}

.loading-overlay {
  position: absolute;
  max-width: 546px;
  height: 196px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #22222228;
}

.drag-over {
  border: 1px dashed #007bff !important;
  background-color: rgba(0, 123, 255, 0.05);
}
</style>
