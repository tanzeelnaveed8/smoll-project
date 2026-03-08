<template>
  <v-sheet width="100%" height="100%" class="d-flex align-center justify-center">
    <!-- When user is selected -->
    <v-sheet width="100%" height="100%">
      <v-sheet class="d-flex justify-space-between align-center px-8 py-3">
        <v-sheet class="d-flex align-center gc-2">
          <v-avatar size="40" :image="conversation?.conversationAvatarUrl" color="#87e3ff80" class="text-grey1"
            style="font-weight: 600" :text="conversation?.conversationName?.slice(0, 2).toUpperCase()" />
          <v-sheet class="d-flex flex-fill flex-column justify-space-between">
            <p class="text-no-wrap" style="font-weight: 600">
              {{ conversation?.conversationName }}
            </p>
            <!-- <p v-if="user?.connectionStatus === 'online'" class="text-caption is-online">
              {{ user?.connectionStatus === 'online' ? 'Online' : 'Offline' }}
            </p> -->
          </v-sheet>
        </v-sheet>
        <!-- 
        <v-menu offset="10" scroll-strategy="close" location="bottom right">
          <template v-slot:activator="{ props }">
            <v-btn
              v-push
              icon="$tb-dots-vertical"
              flat
              height="32"
              width="32"
              density="compact"
              class="text-grey1 ml-3"
              color="transparent"
              v-bind="props"
            />
          </template>
<v-list style="border: 1px solid #d5d5d5" elevation="4">
  <v-list-item v-for="(item, index) in menuList" :key="index" :value="item.value" class="text-body-1 px-3 menu-item"
    height="44" min-height="auto" style="font-weight: 600" :style="index && 'border-top: 1px solid #d5d5d5'"
    @click="item.action">
    <v-icon :icon="item.icon" class="mr-2" size="18"></v-icon>
    <p>{{ item.title }}</p>
  </v-list-item>
</v-list>
</v-menu> -->
        <!-- <v-tooltip :text="archiveBtn ? 'Unarchive' : 'Archive'" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              :icon="archiveBtn ? '$tb-archive-filled' : '$tb-archive'"
              color="transparent"
              v-bind="props"
              flat
              width="32"
              height="32"
              class="text-grey1"
              @click="handleArchive"
            >
            </v-btn>
          </template>
        </v-tooltip> -->
      </v-sheet>

      <v-divider color="#2C2B35" />

      <v-sheet class="d-flex justify-center" style="height: calc(100% - 64px)">
        <v-sheet class="d-flex flex-column flex-fill align-center justify-end position-relative" width="100%">
          <v-sheet ref="chatBoxRef" class="chat-box" style="overflow-y: scroll; min-height: calc(100vh -380px)"
            width="100%">
            <v-sheet class="px-6 d-flex pt-6 flex-column gr-6 align-start">
              <v-btn v-push v-if="messages?.length && hasPrevMessages" color="rgb(135, 135, 135)" flat type="button"
                height="36" class="text-body-2 text-grey2 font-weight-medium my-16 align-self-center text-white"
                @click="handleLoadEarlierMessages">Load earlier messages</v-btn>

              <ChatMainMsg v-for="(msg, i) in messages" :key="i" :msg :conversation />
              <AttachmentIsLoading v-if="attachmentIsLoading" />
            </v-sheet>
          </v-sheet>

          <v-btn v-if="!isAtBottom && isNewMessage" @click="handleNewMessage" class="position-absolute pr-2"
            elevation="5" style="right: 36px; bottom:164px">
            <span>
              New Message
            </span>
            <v-icon icon="$tb-arrow-narrow-down" size="24" />
          </v-btn>

          <ChatMainEditor style="margin-top: 8px" v-model="msgContent" v-model:attachments="attachments"
            :isTyping="isTyping" @submit="
              (msg, attachments, duration) => emit('sendMessage', msg, attachments, duration)
            " />
        </v-sheet>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script setup lang="ts">
import ChatMainEditor from './ChatMainEditor.vue'
import { computed, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import ChatMainMsg from './ChatMainMsg.vue'

import type { VSheet } from 'vuetify/components'
import { nextTick } from 'vue'
import type { ZIMAudioMessage, ZIMConversation, ZIMMediaMessage, ZIMMessage } from 'zego-zim-web'
import AttachmentIsLoading from '@/components/partials/AttachmentIsLoading.vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'

const props = defineProps<{
  isTyping: boolean
  conversation: ZIMConversation | null
  messages: ZIMMessage[] | ZIMMediaMessage[] | ZIMAudioMessage[] | [] | undefined
  hasPrevMessages: boolean
  attachmentIsLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'sendMessage', msg: string, attachments: FileList | null, duration?: number): Promise<void>
  (e: 'LoadEarlierMessages'): Promise<ZIMMessage[] | undefined>
  (e: 'sendTypingStatus', isTyping: boolean): void
  (e: 'handleArchiveChat', toggleArchive: boolean): void
}>()

const isArchived = ref(false)
const isLoadPrevious = ref(false)

// const menuList = computed(() => [
// {
//   title: `${isArchived.value ? 'Unarchive' : 'Archive'}`,
//   value: 'archive',
//   icon: '$tb-archive',
//   action: ''
// },
// ])

const attachments = ref<FileList>(new DataTransfer().files)
const chatBoxRef = ref<VSheet | null>(null)
const msgContent = ref('')

const scrollHeight = ref(0)
const prevScrollPosition = ref(0)
const isAtBottom = ref(true)
const isNewMessage = ref(false)

const typingTimeoutRef = ref()

const { user } = storeToRefs(useAuthStore())
const { activeUser } = storeToRefs(useChatStore())

const scrollToBottom = () => {
  if (chatBoxRef.value) {
    chatBoxRef.value.$el.scrollTop = chatBoxRef.value.$el.scrollHeight
  }
}

//HANDLES LOAD PREVIOUS MESSAGES
const handleLoadEarlierMessages = async () => {
  prevScrollPosition.value = chatBoxRef.value?.$el.scrollTop
  isLoadPrevious.value = true
  emit('LoadEarlierMessages')

}

const handleNewMessage = () => {
  isNewMessage.value = false
  scrollToBottom()
}

watch(
  () => props.messages,
  async () => {
    await nextTick()
    //If user clicks on the load previous messages then scroll to previous scroll position
    if (isLoadPrevious.value) {
      isLoadPrevious.value = false
      if (chatBoxRef.value)
        chatBoxRef.value.$el.scrollTop = prevScrollPosition.value
      return
    }

    //Scrolling to bottom every time new message is added to messages array
    if (!isAtBottom.value && [...props.messages].pop().senderUserID !== user.value?.id) {
      isNewMessage.value = true
    } else {
      isNewMessage.value = false
      scrollToBottom()
    }
  },
  { deep: true }
)

//WHEN USER TYPES
watch(msgContent, (v) => {
  if (v.length > 0) {
    // Start typing
    emit('sendTypingStatus', true)

    // Clear existing timeout (if any)
    if (typingTimeoutRef.value) {
      clearTimeout(typingTimeoutRef.value)
    }
    // Set a new timeout
    typingTimeoutRef.value = setTimeout(() => {
      emit('sendTypingStatus', false)
    }, 1000) // End typing after 5 seconds of inactivity
  }
})

//ARCHIVE
// const handleArchive = () => {
//   isArchived.value = !isArchived.value
//   emit('handleArchiveChat', isArchived.value)
// }

// watchEffect(() => {
// if (props.conversation?.isPinned === HiddenState.HIDDEN_PREVENT_AUTO_UNHIDE) {
//   archiveBtn.value = true
// } else {
//   archiveBtn.value = false
// }
// })

const handleScroll = () => {
  const scrollTop = chatBoxRef.value?.$el.scrollTop ?? 0
  isAtBottom.value = scrollTop <= 0 && scrollTop >= -100
  if (isAtBottom.value) {
    if (!isNewMessage.value) return
    isNewMessage.value = false
  }
}

watch(activeUser, () => {
  isNewMessage.value = false
  scrollToBottom()
}, { deep: true })

onMounted(async () => {
  const el = chatBoxRef.value?.$el
  if (el) {
    el.addEventListener('scroll', handleScroll)
    await nextTick()
    scrollToBottom()
  }
})

onBeforeUnmount(() => {
  const el = chatBoxRef.value?.$el
  if (el) {
    el.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style lang="scss" scoped>
.chat-box {
  display: flex;
  flex-direction: column-reverse;
  /* Add this line */

  &::-webkit-scrollbar {
    display: none;
  }
}

.is-online {
  color: #00bf50;
  font-weight: 600;
}

.menu-item {
  &:deep(.v-list-item__content) {
    display: flex;
    align-items: center;
  }
}
</style>
