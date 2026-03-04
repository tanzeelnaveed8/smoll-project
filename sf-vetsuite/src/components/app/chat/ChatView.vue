<template>
  <v-sheet class="px-0 d-flex py-0" color="#F8FAFB" style="max-width: 100%; height: calc(100vh - 123px)">
    <v-sheet v-if="!allConversations.length && !loading" width="100%" height="100%" color="white"
      class="d-flex justify-center align-center text-center">
      <v-sheet class="mb-8" width="100%">
        <h1 style="text-wrap: nowrap">No messages yet</h1>
        <p class="text-grey2 mt-2">You will see your messages with smoll member here</p>
      </v-sheet>
    </v-sheet>

    <template v-else>
      <v-sheet width="27.56%" color="white">
        <ChatInbox :loading :allConversations="filteredConversations" v-model:update="searchKeyword"
          v-model:select="activeConvo" @update="searchKeyword = $event" @handleFavoriteChat="handleFavoriteChat" />
      </v-sheet>
      <v-divider vertical color="#2C2B35" />
      <v-sheet class="d-flex flex-column justify-center" width="42.73%" color="white">
        <v-sheet v-if="!loading && !activeConvo" class="text-center" width="100%">
          <h1 style="text-wrap: nowrap">No messages yet</h1>
          <p class="text-grey2 mt-2">You will see your messages with smoll member here</p>
        </v-sheet>
        <ChatMain v-else-if="!loading" :conversation="activeConvo" :isTyping="isTyping"
          :messages="allMessages.get(`${activeConvo?.conversationID}`)" :hasPrevMessages="hasPrevMessages"
          @sendMessage="(msg, attachments, duration) => sendMessage(msg, attachments, duration)"
          @sendTypingStatus="sendTypingStatus" @load-earlier-messages="loadEarlierMessages"
          @handleArchiveChat="handleArchiveChat($event)" :attachmentIsLoading="attachmentIsLoading" />
      </v-sheet>
      <v-divider vertical color="#2C2B35" />
      <MembersDetails :memberDetails :memberDetailsLoading @refetchMember="fetchMemberDetails" />
    </template>
  </v-sheet>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import ChatInbox from './ChatInbox/ChatInbox.vue'
import ChatMain from './ChatMain/ChatMain.vue'
import { useChatStore } from '@/stores/chat'
import { storeToRefs } from 'pinia'
import type { ZIMConversation } from 'zego-zim-web'
import { useNotificationStore } from '@/stores/notification'
import { ZimHelper } from '@/utils/zim'
import { useAuthStore } from '@/stores/auth'
import MembersDetails from './MemberDetails/MembersDetails.vue'
import type { MemberDetails } from '@/stores/types/chat'

const allConversations = ref<ZIMConversation[] | []>([])
const chatStore = useChatStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const { user } = storeToRefs(authStore)
const { conversations, allMessages, activeUser, newMessageCount, replyMessage } = storeToRefs(chatStore)

const activeConvo = ref<ZIMConversation | null>(null)
const playerIdMap = ref<Record<string, string>>({})
// const activeChannel = ref<GroupChannel | null>(null)

const searchKeyword = ref<string | null>(null)

const isTyping = ref(false)
const loading = ref(false)
const hasPrevMessages = ref(true)
const attachmentIsLoading = ref(false)
const memberDetails = ref<MemberDetails | null>(null)
const memberDetailsLoading = ref(false)

const filteredConversations = computed(() => {
  const keyword = searchKeyword.value?.toLowerCase();
  return new Map(
    [...conversations.value].filter(([key, conv]) =>
      conv.conversationName.toLowerCase().includes(keyword ?? '')
    )
  );
});


watch(activeConvo, async (v) => {
  if (v && !playerIdMap.value[v.conversationID]) {
    const extendedData = await ZimHelper.getUserExtendedData(v.conversationID)

    if (typeof extendedData === 'string' && extendedData.length) {
      const { playerId } = JSON.parse(extendedData)

      playerIdMap.value[v.conversationID] = playerId
    }
  }
})

const getUsers = async (searchBy?: string) => {
  try {
    loading.value = true
    const users: ZIMConversation[] = await chatStore.getUsers()

    allConversations.value = users
  } finally {
    loading.value = false
  }
}

const loadEarlierMessages = async () => {
  if (activeConvo.value) {
    const prevMessages = await chatStore.loadPreviousMessages(activeConvo.value)
    hasPrevMessages.value = prevMessages.length > 0
  }
}

// SEND TYPING INDICATOR
const sendTypingStatus = async (isTyping: boolean) => {
  if (isTyping) {
    // activeChannel.value?.startTyping()
  } else {
    // activeChannel.value?.endTyping()
  }
}

// //SEND MESSAGE
const sendMessage = async (msgContent: string, attachments: FileList | null, duration?: number) => {
  const msg = msgContent.trim()

  //SENDING MEDIA MESSAGE
  if (attachments && attachments.length && activeConvo.value && !replyMessage.value) {
    attachmentIsLoading.value = true
    const type = attachments[0].type.split('/')[0]

    const typeVal = type === 'image' ? 11 : type === 'audio' ? 13 : 12

    await chatStore.sendMediaMessage(activeConvo.value, attachments[0], typeVal, duration)
    attachmentIsLoading.value = false
  }
  // //SENDING TEXT MESSAGE
  if (msg && activeConvo.value && !replyMessage.value) {
    await chatStore.sendMessage({
      conversation: activeConvo.value,
      messageText: msg
    })
    newMessageCount.value.set(activeConvo.value.conversationID, 0)
  }

  //SEND REPLY MESSAGE
  if (msg && activeConvo.value && replyMessage.value) {
    await chatStore.sendReplyMessage(
      activeConvo.value,
      msg,
      replyMessage.value
    )
    newMessageCount.value.set(activeConvo.value.conversationID, 0)
  }

  if (activeConvo.value) {
    const playerId = playerIdMap.value[activeConvo.value.conversationID]

    if (playerId) {
      let notificationMessage = msg

      if (attachments?.length) {
        notificationMessage = '📎 Sent an attachment'
      }

      if (attachments?.[0]?.type.includes('audio')) {
        notificationMessage = '🎧 Sent an audio message'
      }

      notificationStore.sendNotification({
        playerId,
        heading: '🐾 ' + user.value?.name ?? 'New Message 🐾',
        message:
          notificationMessage.slice(0, 100) + (notificationMessage.length > 100 ? '...' : ''),
        meta: {
          notificationType: 'chat',
          expertId: user.value?.id,
          expertName: user.value?.name
        }
      })
    }

    //Moving the conversation to top
    const conversation = conversations.value.get(activeConvo.value.conversationID)
    if (conversation) {
      conversations.value.set(activeConvo.value.conversationID, conversation)

      const allConvos = Array.from(conversations.value.entries())

      const favorites = allConvos.filter(([, convo]) => convo.isPinned)
      const others = allConvos
        .filter(([, convo]) => !convo.isPinned)
        .sort((a, b) => {
          const lastMsgA = allMessages.value.get(a[0])?.slice(-1)[0]?.timestamp || 0
          const lastMsgB = allMessages.value.get(b[0])?.slice(-1)[0]?.timestamp || 0
          return lastMsgB - lastMsgA
        })

      conversations.value = new Map([...favorites, ...others])
    }
  }


}

//ARCHIVE CHAT
const handleArchiveChat = async (toggleArchive: boolean) => {
  // const params = {
  //   hidePreviousMessages: false,
  //   allowAutoUnhide: false
  // }
  // if (activeUser.value && activeChannel.value) {
  //   if (toggleArchive) {
  //     //When toggleArchive is true
  //     const res = await activeChannel.value.hide(params)
  //     activeUser.value = {
  //       ...activeUser.value,
  //       hiddenState: res.hiddenState
  //     }
  //   } else {
  //     const res = await activeChannel.value.unhide()
  //     activeUser.value = {
  //       ...activeUser.value,
  //       hiddenState: res.hiddenState
  //     }
  //   }
  //   conversations.value.set(activeUser.value.userId, activeUser.value)
  //   conversations.value = new Map([...conversations.value])
  // }
}

const handleFavoriteChat = async (conversationID: string, toggleFavoriteChat: boolean) => {
  //Get conversation by id
  const conversation = conversations.value.get(conversationID) as ZIMConversation

  //update isPinned status
  await chatStore.updateConversationFavorite(conversation, toggleFavoriteChat)

  //update conversation state
  conversations.value.set(conversation.conversationID, {
    ...conversation,
    isPinned: toggleFavoriteChat
  })
  conversations.value = new Map([...conversations.value])
}

const fetchMemberDetails = async (id: string) => {
  try {
    memberDetailsLoading.value = true
    const member = await chatStore.fetchMemberDetails(id) as any
    memberDetails.value = member
    console.log(member)
  } catch (err) {
    memberDetails.value = null
  } finally {
    memberDetailsLoading.value = false
  }
}

watch(activeConvo, async () => {
  replyMessage.value = null
  activeUser.value = activeConvo.value

  if (activeConvo.value) {

    if (!allMessages.value.get(`${activeConvo.value?.conversationID}`)) {
      await chatStore.getMessages(activeConvo.value as ZIMConversation)

      activeConvo.value = {
        ...activeConvo.value
      }
    }

    //MARKING MESSAGES AS READ OF ACTIVE CHANNEL
    await chatStore.markMessagesAsRead(activeConvo.value)
    newMessageCount.value.set(activeConvo.value.conversationID, 0)

    await fetchMemberDetails(activeConvo.value.conversationID)
  }
})

onMounted(async () => {
  //   //Fetching Users
  await getUsers()

  //   ///Getting First User
  const firstConversation = conversations.value.values().next().value

  if (firstConversation) {
    //Fetching Messages
    loading.value = true
    const request = await chatStore.getMessages(firstConversation)

    //Marking those messages as read
    await chatStore.markMessagesAsRead(firstConversation)

    newMessageCount.value.set(firstConversation.conversationID, 0)

    //Updating the active conversation
    activeConvo.value = firstConversation

    loading.value = false
  }
  //   //Typing listener
  //   SendBirdHelper.sendbird.groupChannel.addGroupChannelHandler(typingListner, channelHandler)
})

onUnmounted(() => {
  activeUser.value = null
  // SendBirdHelper.sendbird.groupChannel.removeGroupChannelHandler(typingListner)
})
</script>
