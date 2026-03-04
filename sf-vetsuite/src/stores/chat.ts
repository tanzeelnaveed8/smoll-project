import { ZimHelper } from '@/utils/zim'
// import type { ApplicationUserListQueryParams, User } from '@sendbird/chat'
// import { GroupChannel } from '@sendbird/chat/groupChannel'
// import { type FileMessageCreateParams, type UserMessageCreateParams } from '@sendbird/chat/message'
// import type { GroupChannelListQueryParams } from 'node_modules/@sendbird/chat/cjs/groupChannel.cjs'
import { defineStore } from 'pinia'
import {
  type ZIMConversation,
  type ZIMConversationQueryConfig,
  type ZIMConversationTotalUnreadMessageCountQueryConfig,
  type ZIMMediaMessageBase,
  type ZIMMessage,
  type ZIMMessageBase,
  type ZIMMessageQueryConfig,
  type ZIMMessageSendNotification
} from 'zego-zim-web'
import type { State } from './types/chat'
import api from '@/utils/api'
import type { UploadedFile } from './types/global'

export const useChatStore = defineStore('ChatStore', {
  state: (): State => ({
    conversations: new Map<string, ZIMConversation>(),
    allMessages: new Map<string, ZIMMessage[] | []>(),
    activeUser: null,
    newMessageCount: new Map<string, number>(),
    replyMessage: null
  }),
  actions: {
    async getUsers() {
      const config: ZIMConversationQueryConfig = {
        // The conversation flag. If it is set to `null`, the flag is the latest conversation.
        nextConversation: undefined,
        // The number of conversations queried per page.
        count: 20
      }

      // Pull the conversation list.
      const { conversationList } = await ZimHelper.zim.queryConversationList(config)
      this.newMessageCount.set('0', 0)
      conversationList.forEach((convo: ZIMConversation) => {
        this.newMessageCount.set(convo.conversationID, convo.unreadMessageCount)
        this.conversations.set(`${convo.conversationID}`, convo)
      })

      return conversationList
    },

    async getMessages(conversation: ZIMConversation) {
      const config: ZIMMessageQueryConfig = {
        nextMessage: undefined, // Set nextMessage to null for the first retrieval
        count: 10,
        reverse: true
      }

      const conversationID = conversation.conversationID
      const conversationType = 0

      const { messageList } = await ZimHelper.zim.queryHistoryMessage(
        conversationID,
        conversationType,
        config
      )

      const messages = messageList || []
      this.allMessages.set(conversationID, messages)

      return messageList
    },

    async loadPreviousMessages(conversation: ZIMConversation) {
      const messages = this.allMessages.get(`${conversation?.conversationID}`) || []
      const lastMessage = messages[0]
      const config = {
        nextMessage: lastMessage,
        count: 10,
        reverse: true
      }
      const conversationID = conversation.conversationID
      const conversationType = 0
      const { messageList } = await ZimHelper.zim.queryHistoryMessage(
        conversationID,
        conversationType,
        config
      )
      const allMessages = [...messageList, ...messages]

      this.allMessages.set(`${conversation.conversationID}`, allMessages)
      return messageList
    },

    async sendMessage({
      conversation,
      messageText
    }: {
      conversation: ZIMConversation
      messageText: string
    }) {
      const toConversationID = conversation.conversationID
      const conversationType = 0
      const config = {
        priority: 1
      }

      const messageTextObj: ZIMMessageBase = {
        type: 1,
        message: messageText,
        extendedData: ''
      }
      const notification: ZIMMessageSendNotification = {
        onMessageAttached: function (message: any) {
          // todo: Loading
        },
        onMediaUploadingProgress: function (message: any) {}
      }

      const { message } = await ZimHelper.zim.sendMessage(
        messageTextObj,
        toConversationID,
        conversationType,
        config,
        notification
      )

      const receiverID = conversation.conversationID as string
      const allMessages = this.allMessages.get(receiverID) || []
      this.allMessages.set(receiverID, [...allMessages, message])

      return message
    },

    async sendMediaMessage(
      conversation: ZIMConversation,
      file: File,
      type: number,
      duration?: number
    ) {
      const toConversationID = conversation.conversationID
      const conversationType = 0
      const config = {
        priority: 1
      }

      let messageMediaObj: ZIMMediaMessageBase

      if (type === 13) {
        // Audio message
        messageMediaObj = {
          type,
          fileLocalPath: file,
          audioDuration: 10
        }
      } else {
        messageMediaObj = {
          type,
          fileLocalPath: file
        }
      }

      const { message } = await ZimHelper.zim.sendMediaMessage(
        messageMediaObj,
        toConversationID,
        conversationType,
        config
      )

      const receiverID = conversation.conversationID as string
      const allMessages = this.allMessages.get(receiverID) || []
      this.allMessages.set(receiverID, [...allMessages, message])

      return message
    },

    async sendReplyMessage(
      conversation: ZIMConversation,
      messageText: string,
      toOriginalMessage: ZIMMessage
    ) {
      const messageTextObj: ZIMMessageBase = {
        type: 1,
        message: messageText,
        extendedData: ''
      }

      const config = {
        priority: 1
      }

      const notification: ZIMMessageSendNotification = {
        onMessageAttached: function (message: any) {
          // todo: Loading
        },
        onMediaUploadingProgress: function (message: any) {}
      }

      const { message } = await ZimHelper.zim.replyMessage(
        messageTextObj,
        toOriginalMessage,
        config,
        notification
      )

      this.replyMessage = null

      const receiverID = conversation.conversationID as string
      const allMessages = this.allMessages.get(receiverID) || []
      this.allMessages.set(receiverID, [...allMessages, message])

      return message
    },

    async getUnreadMessagesCount() {
      const config: ZIMConversationTotalUnreadMessageCountQueryConfig = {
        marks: [],
        conversationTypes: [0]
      }

      const { unreadMessageCount } =
        await ZimHelper.zim.queryConversationTotalUnreadMessageCount(config)
      return unreadMessageCount
    },

    async markMessagesAsRead(conversation: ZIMConversation) {
      var conversationID = conversation.conversationID
      var conversationType = 0
      await ZimHelper.zim.clearConversationUnreadMessageCount(conversationID, conversationType)
    },

    async updateConversationFavorite(conversation: ZIMConversation, isPinned: boolean) {
      const conversationID = conversation.conversationID
      const conversationType = 0
      await ZimHelper.zim.updateConversationPinnedState(isPinned, conversationID, conversationType)
    },

    async fetchMemberDetails(id: string) {
      const response = await api.get(`vets/members/${id}`)
      return response.data
    },

    async createCase(
      memberId: string,
      petId: string,
      vetId: string,
      caseInfo: { description: string; assests?: UploadedFile[] }
    ) {
      const response = await api.post(`/vets/members/${memberId}/cases`, caseInfo, {
        params: { petId, vetId }
      })
      return response.data
    },
    async addPet(memberId: string, accountDetails: any) {
      await api.post(`/vets/members/${memberId}/pets`, accountDetails)
    }
  }
})
