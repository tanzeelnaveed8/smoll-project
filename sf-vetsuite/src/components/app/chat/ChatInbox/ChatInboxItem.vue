<template>
  <!-- //When loading is true -->
  <v-skeleton-loader v-if="loading" type="list-item-avatar-three-line" style="height: 108px" />

  <v-sheet v-else v-push class="d-flex gc-4 w-100" style="cursor: pointer">
    <!-- :class="conversation?.connectionStatus === 'online' && 'is-online'" -->
    <div>
      <!-- {{ conversation }} -->
      <v-avatar
        size="40"
        color="#87e3ff80"
        :image="conversation?.conversationAvatarUrl"
        class="text-grey1"
        style="font-weight: 600"
        :text="conversation?.conversationName?.slice(0, 2).toUpperCase()"
      />
    </div>

    <v-sheet class="d-flex flex-column gr-3 w-100 justify-space-between">
      <v-sheet>
        <p class="font-weight-bold">
          {{ conversation?.conversationName }}
        </p>
        <!-- <span
          v-if="conversation?.lastMessage?.customType !== 'text'"
          class="text-grey2 mt-1 d-flex align-end"
        >
          <v-icon size="20" class="mr-1" :icon="`$tb-${conversation?.lastMessage?.customType}`" />
          <p class="list-message" style="line-height: 20px">
            {{ capitalizeFirstLetter(`${conversation?.lastMessage?.customType}`) }}
          </p>
        </span> -->
        <!-- v-else -->
        <p class="text-grey2 mt-1 list-message">
          <template v-if="lastMessage?.type === 1">
            {{ lastMessage?.message }}
          </template>
          <template v-else>
            <span class="d-flex" style="line-height: 20px">
              <template v-if="lastMessage?.type === 11">
                <v-icon size="20" class="mr-1" :icon="`$tb-image`" />
                <p>Image</p>
              </template>

              <template v-else-if="lastMessage?.type === 13">
                <v-icon size="20" class="mr-1" :icon="`$tb-microphone`" />
                <p>Audio</p>
              </template>
              <template v-else>
                <v-icon size="20" class="mr-1" :icon="`$tb-file`" />
                <p>File</p>
              </template>
            </span>
          </template>
        </p>
      </v-sheet>
      <div class="d-flex justify-space-between text-grey2 align-center w-100">
        <span
          v-if="lastMessage?.timestamp"
          :key="reRenderKey"
          class="text-body-2 font-weight-medium"
        >
          {{ dayjs(lastMessage?.timestamp).fromNow() }}
        </span>
      </div>
    </v-sheet>
    <v-sheet class="d-flex flex-column align-center justify-space-between">
      <v-btn
        icon
        flat
        density="compact"
        height="auto"
        width="auto"
        style="margin: 0px; background-color: transparent !important"
        :style="`color:${isFavorite ? '#b0881b' : '#424242'} !important`"
        @click.stop="handleFavorite"
      >
        <v-icon :icon="isFavorite ? '$tb-star-filled' : '$tb-star'" size="20" />
      </v-btn>
      <div v-if="unreadMessageCount" class="unread-message-count">
        {{ unreadMessageCount }}
      </div>
    </v-sheet>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeMount, computed, watchEffect, onUnmounted } from 'vue'
import { VSkeletonLoader } from 'vuetify/components/VSkeletonLoader'

import dayjs from 'dayjs'
import { useChatStore } from '@/stores/chat'
import type { ConversationWith } from '@/stores/types/chat'
import { storeToRefs } from 'pinia'
import type { ZIMConversation } from 'zego-zim-web'

const props = defineProps<{
  conversation?: ZIMConversation
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'handleFavorite', toggleFavorite: boolean): void
}>()

const reRenderKey = ref(0)
const interval = ref()
const chatStore = useChatStore()
const { newMessageCount } = storeToRefs(chatStore)
const isFavorite = ref()

const unreadMessageCount = computed(() => {
  if (props.conversation) {
    return newMessageCount.value.get(props.conversation?.conversationID)
  }

  return 0
})

const lastMessage = computed(() => {
  const messages = chatStore.allMessages.get(`${props.conversation?.conversationID}`)
  const lastMessageDetails = messages && messages.length > 0 ? messages[messages.length - 1] : null

  return lastMessageDetails
    ? {
        message: lastMessageDetails.message,
        timestamp: lastMessageDetails.timestamp,
        type: lastMessageDetails.type
      }
    : props.conversation?.lastMessage
})

const handleFavorite = () => {
  isFavorite.value = !isFavorite.value
  emit('handleFavorite', isFavorite.value)
}
// const user = computed(() => props.conversation?.getConversationWith())

// const preview = computed(() => {
//   if (lastMessage.value.type === 'text') {
//     return (lastMessage.value as TextMessage).getText()
//   }
// })

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

watchEffect(() => {
  isFavorite.value = props.conversation?.isPinned
})

onMounted(() => {
  interval.value = setInterval(() => {
    reRenderKey.value++
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval.value)
})
</script>

<style lang="scss" scoped>
.loader {
  :deep(.v-skeleton-loader__avatar) {
    margin-right: 0;
  }
}

.list-message {
  line-height: 18px;
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.is-online {
  position: relative;
  height: fit-content;
  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    bottom: 2px;
    right: 0px;
    background-color: #00bf50;
    border-radius: 50%;
  }
}
</style>
