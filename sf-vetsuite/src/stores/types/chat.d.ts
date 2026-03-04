import type { User } from '@sendbird/chat'
import type { BaseMessage } from '@sendbird/chat/message'
import type { SendBirdExtendedBaseMessage, UploadedFile } from './global'
import type { ZIMConversation, ZIMMediaMessage, ZIMMessage } from 'zego-zim-web'

export interface ConversationWith extends User {
  channelUrl: string
  hiddenState: string
  hasViewed: boolean
  lastMessage: null | SendBirdExtendedBaseMessage
  unreadMessageCount: number
  metaData: {
    playerId: string
  }
}

export interface State {
  conversations: Map<string, ZIMConversation>
  allMessages: Map<string, [] | ZIMMessage[]>
  activeUser: ZIMConversation | null
  newMessageCount: Map<string, number>
  replyMessage: null | ZIMMessage | ZIMMediaMessage
}

export interface Pet {
  id: string
  name: string
}

export interface MemberDetails {
  id: string
  name: string
  email: string | null
  phone: string | null
  country: string | null
  city: string | null
  address: string | null
  pets: Pet[]
  profileImg: UploadedFile | null
}
