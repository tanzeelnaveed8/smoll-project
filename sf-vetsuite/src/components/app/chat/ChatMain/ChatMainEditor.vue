<template>
  <v-sheet :class="{ 'has-attachments': attachments?.length }"
    class="editor d-flex px-8 py-6 flex-column w-100 bg-white" style="position: relative" width="100%">
    <!-- Typing Indicator -->
    <div v-if="isTyping" style="position: absolute; top: -20px; left: 47px">
      <Vue3Lottie class="ml-0" :animationData="typingAnimation" :height="50" :width="50" />
    </div>

    <!-- attachments -->
    <v-sheet v-if="attachments?.length" class="pb-2">
      <v-chip v-for="(a, i) in attachments" :key="i" closable @click:close="handleRemoveAttachment" close-icon="$tb-x"
        class="text-body-1 py-4" style="background-color: #f0f4f8; font-weight: 600">
        <template v-if="a && (a as File).name?.length > 10">
          {{ truncateString((a as File).name, 10) + (a as File).name.split('.').pop() }}
        </template>
        <template v-else>
          {{ (a as File).name }}
        </template>
      </v-chip>
    </v-sheet>

    <!-- RECORDING -->
    <v-sheet class="pb-2 recorder" v-if="isRecording">
      <v-card class="pa-2 d-flex align-center gc-3 px-3" max-width="350" width="fit-content" height="50" elevation="0"
        style="border: 1px solid #bac5cd; border-radius: 20px">
        <v-btn v-push icon="$tb-trash" density="compact" color="transparent" style="margin: 0px" flat class="text-grey2"
          @click="handleDeleteRecording" />
        <v-sheet>
          <!-- WHILE RECORDING -->
          <v-sheet v-if="togglePauseRecording" class="d-flex align-center gc-3" width="244">
            <div class="isRecording" />
            <div class="duration">{{ minute }} : {{ seconds }}</div>
            <div class="waveform">
              <div class="waveform-bar" v-for="n in 23" :key="n"></div>
            </div>
          </v-sheet>

          <!-- WHEN RECORDING PAUSE-->
          <v-sheet v-else class="d-flex align-center">
            <audio v-if="recordedAudioUrl" :src="recordedAudioUrl" controls class="audio-message"></audio>
          </v-sheet>
        </v-sheet>

        <v-btn v-push :icon="togglePauseRecording ? '$tb-player-pause' : '$tb-player-play'" density="compact"
          color="transparent" style="margin: 0px" flat class="text-grey2" @click="handlePauseRecording" />
      </v-card>
    </v-sheet>

    <!-- WHEN REPLY TO A MESSAGE -->
    <v-sheet v-if="replyMessage" class="px-5 py-4 mb-2 d-flex align-center justify-space-between gc-4" color="#f3f3f3"
      style="border-radius: 20px;">
      <v-sheet class="d-flex align-center gc-3 w-100">
        <v-avatar class="avatar font-weight-medium text-body-2 text-grey1" size="32" color="#d5d5d5"
          :image="replyMessage.senderUserID === activeUser?.conversationID ? activeUser.conversationAvatarUrl : user?.profileImg.url"
          :text="replyMessage.senderUserID === activeUser?.conversationID ? activeUser?.conversationName.slice(0, 2).toUpperCase()
            : user?.name.slice(0, 2).toUpperCase()
            " />
        <!-- IF MESSAGE IS TEXT -->
        <p v-if="replyMessage.type === 1" class="text-grey2 font-weight-medium"
          style="max-width: 488px;text-wrap: wrap;word-wrap: break-word;">{{ truncateString(replyMessage.message, 96) }}
        </p>

        <!-- IF MESSAGE IS AN IMAGE -->
        <v-sheet v-if="replyMessage.type === 11" class="d-flex justify-space-between align-center text-grey2 w-100">
          <span class="mr-auto"><v-icon icon="$tb-image" size="18" class="mr-1" /> Image</span>
          <img :src="replyMessage.fileDownloadUrl" alt="image" height="42" width="42" class="rounded">
        </v-sheet>

        <!-- IF MESSAGE IS A FILE -->
        <v-sheet v-if="replyMessage.type === 12" class="d-flex justify-space-between align-center text-grey2 w-100">
          <span class="mr-auto"><v-icon icon="$tb-file" size="18" class="mr-1" /> {{ replyMessage.fileName.length > 50
            ? `${truncateString(replyMessage.fileName, 50)}${replyMessage?.fileName.split('.').pop()}`
            : replyMessage.fileName
          }}</span>
        </v-sheet>

        <!-- IF MESSAGE IS AN AUDIO -->
        <v-sheet v-if="replyMessage.type === 13" class="d-flex justify-space-between align-center text-grey2 w-100">
          <span class="mr-auto"><v-icon icon="$tb-microphone" size="18" class="mr-1" />{{
            formatDuration(replyMessage.audioDuration as number) }}</span>
        </v-sheet>
      </v-sheet>
      <v-btn icon density="compact" variant="text" color="grey1"><v-icon icon="$tb-x"
          @click="replyMessage = null"></v-icon></v-btn>
    </v-sheet>

    <!-- Chat Main -->
    <v-sheet class="py-3 px-5 d-flex flex-column" style="border: 1px solid #bac5cd; border-radius: 20px">
      <EditorContent :editor="editor" ref="editorRef" />
      <v-sheet class="actions d-flex">
        <v-sheet class="d-flex justify-between w-100">
          <v-sheet id="extension-buttons" class="d-flex align-center justify-start">
            <v-sheet class="position-relative">
              <div v-if="showEmojiMenu" class="position-fixed top-0 left-0"
                style="height: 100vh;width: 100vw;z-index: 1000;" @click="showEmojiMenu = false">
              </div>
              <EmojiPicker v-if="showEmojiMenu" class="position-absolute light rounded-xl picker"
                @select="handleAddEmoji" />
              <v-btn v-push class="icon-btn ml-auto mr-3" icon density="compact" variant="text" size="small"
                color="grey2" style="margin-bottom: 2px;" @click="showEmojiMenu = !showEmojiMenu"
                :disabled="loading || isRecording" :loading>
                <v-icon size="20" icon="$tb-mood-smile"></v-icon>
              </v-btn>
            </v-sheet>

            <v-file-input ref="fileInputRef" class="d-none" type="file" accept="image/*,video/*"
              @change="handleFileUpload" />
            <v-btn v-push class="icon-btn ml-auto mr-3" icon density="compact" variant="text" size="small" color="grey2"
              @click="handleExtensionClick('attachment')" :disabled="loading || isRecording" :loading>
              <v-icon size="20" icon="$tb-paper-clip"></v-icon>
            </v-btn>

            <!-- <v-btn
              v-push
              class="icon-btn ml-auto mr-3"
              icon
              density="compact"
              variant="text"
              size="small"
              color="grey2"
              @click="handleExtensionClick('microphone')"
              :disabled="loading || isRecording || extensionLoaderMap.audio"
              :loading="extensionLoaderMap.audio"
            >
              <v-icon size="21" icon="$tb-microphone"></v-icon>
            </v-btn> -->
          </v-sheet>

          <v-btn v-push flat type="submit" height="36" class="text-body-2 px-3 ml-auto" @click="handleSubmit"
            :disabled="!isRecording && (loading || disableSendButton)">
            Send

            <v-tooltip activator="parent" open-delay="400">
              Ctrl/Cmd + Enter
            </v-tooltip>
          </v-btn>
        </v-sheet>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import HardBreak from '@tiptap/extension-hard-break'
import { computed, ref, toRef, watch } from 'vue'
import Image from '@tiptap/extension-image'
import typingAnimation from '@/assets/lottie/typingAnimation.json'
import { Vue3Lottie } from 'vue3-lottie'
import { toast } from 'vue3-toastify'
import { AudioRecorder, formatDuration, truncateString } from '@/utils/helpers'

import EmojiPicker from 'vue3-emoji-picker'

import 'vue3-emoji-picker/css'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'
import { useAuthStore } from '@/stores/auth'

type Extension = 'bold' | 'italic' | 'attachment' | 'microphone'

const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100 MB

const props = defineProps<{
  attachments?: FileList | null
  isTyping?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', content: string): void
  (e: 'update:attachments', attachment: FileList | null): void
  (e: 'submit', message: string, attachments: FileList | null, duration?: number): void
}>()

const { user } = storeToRefs(useAuthStore())
const { replyMessage, activeUser } = storeToRefs(useChatStore())

const fileInputRef = ref<HTMLInputElement>()
const disableSendButton = ref(true)
const loading = ref(false)
const time = ref(0)

const recorder = new AudioRecorder()
const isRecording = ref(false)
const togglePauseRecording = ref(true)
const interval = ref()
const recordedAudioUrl = ref<null | string>(null)
const extensionLoaderMap = ref<Record<string, boolean>>({
  audio: false
})

const showEmojiMenu = ref(false);

const minute = computed(() => {
  return String(Math.floor(time.value / 60)).padStart(2, '0')
})
const seconds = computed(() => {
  return String(Math.floor(time.value % 60)).padStart(2, '0')
})

const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Image,
    HardBreak.extend({
      addKeyboardShortcuts() {
        return {
          'Cmd-Enter': () => {
            if (loading.value) return false

            handleSubmit()
            return true
          },
          'Ctrl-Enter': () => {
            if (loading.value) return false

            handleSubmit()
            return true
          }
        }
      }
    }),
    Placeholder.configure({
      placeholder: 'Write a Message'
    })
  ],
  onUpdate({ editor }) {
    const content = editor.getText()
    emit('update:modelValue', content)
    if (!disableSendButton.value && content) return
    disableSendButton.value = content ? false : true
  }
})

async function handleSubmit() {
  const recordingDuration = isRecording.value ? time.value : undefined
  await sendRecording()
  disableSendButton.value = true

  emit('submit', editor.value?.getText() || '', props.attachments || null, recordingDuration)
  emit('update:modelValue', '')
  emit('update:attachments', null)

  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  editor.value?.commands.clearContent()
}

const handleAddEmoji = (emoji: any) => {
  const emojiCharacter = String.fromCodePoint(parseInt(emoji.u, 16));
  editor.value?.chain().focus().insertContent(emojiCharacter).run();
  showEmojiMenu.value = false
}

const handleFileUpload = async () => {
  if (isRecording.value) return
  const files = fileInputRef.value?.files

  if (!files?.length) return

  const file = files[0]
  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')
  const maxSize = isImage ? MAX_IMAGE_SIZE : isVideo ? MAX_VIDEO_SIZE : 0

  if (file.size > maxSize) {
    // Show error message to user
    toast.error(`File size exceeds the maximum limit of ${maxSize / (1024 * 1024)} MB`)
    return
  }

  emit('update:attachments', files)
}

const handleRemoveAttachment = () => {
  emit('update:attachments', null)
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const resetRecordingState = () => {
  isRecording.value = false
  togglePauseRecording.value = true
  recordedAudioUrl.value = null
  recorder.deleteRecording()
}

const handleStartRecording = async () => {
  try {
    extensionLoaderMap.value.audio = true

    await recorder.startRecording()

    isRecording.value = true
  } finally {
    extensionLoaderMap.value.audio = false
  }
}

const handlePauseRecording = async () => {
  if (togglePauseRecording.value) {
    const recordedURl = await recorder.pauseRecording()
    recordedAudioUrl.value = recordedURl
  } else {
    recorder.resumeRecording()
  }
  togglePauseRecording.value = !togglePauseRecording.value
}

const handleDeleteRecording = () => {
  isRecording.value = false
  togglePauseRecording.value = true
  recordedAudioUrl.value = null
  recorder.deleteRecording()
}

async function sendRecording() {
  if (isRecording.value) {
    const { file, duration } = await recorder.stopRecording()

    const fileList = new DataTransfer()
    fileList.items.add(file)

    time.value = duration

    emit('update:attachments', fileList.files)
    resetRecordingState()
  }
}

const handleExtensionClick = (extension: Extension) => {
  switch (extension) {
    case 'bold': {
      editor.value?.chain().focus().toggleBold().run()
      break
    }
    case 'italic': {
      editor.value?.chain().focus().toggleItalic().run()
      break
    }
    case 'attachment': {
      fileInputRef.value?.click()
      break
    }
    case 'microphone': {
      // Show voice recording modal or start recording
      handleStartRecording()

      break
    }
  }
}

watch([isRecording, togglePauseRecording], (newValue) => {
  //WHEN RECORDING START AND RECORDING IS NOT PAUSED
  if (newValue[0] && togglePauseRecording.value) {
    interval.value = setInterval(() => {
      time.value++
    }, 1000)
  } else {
    if (interval !== null) {
      clearInterval(interval.value)
      interval.value = null
    }
    //WHEN RECORDING IS NOT PAUSED
    if (togglePauseRecording.value) time.value = 0
  }
})

watch(
  () => props.attachments,
  (v) => {
    disableSendButton.value = v?.length ? false : true
  }
)

watch(() => replyMessage.value, (v) => {
  if (v && editor.value) {
    editor.value.commands.focus()
  }
})
</script>

<style scoped lang="scss">
.editor {
  & :deep(.ProseMirror) {
    max-height: 125px;
    min-height: 48px;
    outline: none;
    overflow-y: auto;

    // &.has-attachments :deep(.ProseMirror) {
    //   min-height: calc(125px - 30px);
    //   max-height: calc(125px - 30px);
    // }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  & :deep(p.is-editor-empty:first-child::before) {
    color: #818087;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  & .actions {
    .icon-btn {
      margin-right: 2px;

      &.v-btn--active,
      &:hover {
        color: #222 !important;
      }
    }
  }
}

.recorder {
  animation: slide-up 0.3s ease-out;
}

@keyframes slide-up {
  from {
    transform: translateY(23%);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.isRecording {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background-color: rgb(221, 34, 34);
  animation: blink infinite 0.9s;
}

@keyframes blink {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.duration {
  width: 55px;
  font-weight: 500;
}

#extension-buttons {
  :deep(.v-progress-circular) {
    width: 1rem;
    height: 1rem;
  }
}

.audio-message {
  height: 36px;
  width: 244px;

  &::-webkit-media-controls-panel {
    padding: 0px;
    background-color: #fff;
  }
}

.waveform {
  display: flex;
  align-items: center;
  height: 20px;
  margin-left: -6px;
}

.waveform-bar {
  width: 3px;
  margin: 0 2px;
  border-radius: 400px;
  background-color: #656565;
  animation: waveform-animation 1s ease-in-out infinite;

  @for $i from 1 through 23 {
    &:nth-child(#{$i}) {
      height: #{random(15) + 5}px;
      animation-delay: #{$i * 0.1}s;
    }
  }
}

@keyframes waveform-animation {

  0%,
  100% {
    transform: scaleY(0.5);
  }

  50% {
    transform: scaleY(1);
  }
}

.picker {
  border-radius: 12px !important;
  left: -5px;
  top: -330px;
  z-index: 10000;
}
</style>
