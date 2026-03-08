<template>
  <!-- //SENDER ID IS NOT SAME AS CONVERSATION ID THEN ADD CLASS "me"-->
  <v-sheet
    class="d-flex align-end justify-end gc-3 message"
    :class="msg?.senderUserID === conversation?.conversationID && 'me'"
    width="100%"
  >
    <div class="d-flex flex-column gr-2 align-end user-div">
      <div class="d-flex gc-3 align-center" :class="msg?.senderUserID === conversation?.conversationID && 'flex-row-reverse'" >
        <v-btn class="reply-btn align-self-center text-grey1" icon color="#f7f7f7" variant="flat" density="comfortable" @click="()=>handleReplyMessage(msg)">
          <v-icon icon="$tb-rewind-bakcward" flat ></v-icon>
          <v-tooltip
            activator="parent"
            location="top"
            open-delay="400"
          >
          Reply
          </v-tooltip>

        </v-btn>
        <v-sheet class="bubble">
          <v-sheet v-if="repliedInfo" class="d-flex align-center gc-3 pa-3 mb-3" color="#f2f2f2" style="box-shadow: 0px 0px 2px 2px #00000020;border-radius: 14px;">
            <v-avatar
              class="avatar font-weight-medium text-body-2 text-grey1"
              size="32"
              color="#d5d5d5"
              :image="repliedInfo?.senderUserID === activeUser?.conversationID ? activeUser?.conversationAvatarUrl : user?.profileImg?.url"
              :text="   
                repliedInfo?.senderUserID === activeUser?.conversationID ? activeUser?.conversationName.slice(0, 2).toUpperCase()
                  : user?.name.slice(0, 2).toUpperCase()
              "
            />
                <!-- IF MESSAGE IS TEXT -->
                <p v-if="repliedInfo?.messageInfo?.type === 1" class="text-grey2 font-weight-medium pr-4" style="max-width: 488px;text-wrap: wrap;word-wrap: break-word;">{{truncateString(repliedInfo?.messageInfo?.message, 96)}}</p>
        
                <!-- IF MESSAGE IS AN IMAGE -->
                <v-sheet v-if="repliedInfo?.messageInfo?.type === 11" class="d-flex justify-space-between align-center text-grey2 gc-10 w-100">
                    <span class="mr-auto" ><v-icon icon="$tb-image" size="18" class="mr-1" /> Image</span>
                    <img :src="repliedInfo?.messageInfo?.fileDownloadUrl" alt="image" height="42" width="42" class="rounded">
                </v-sheet>
          
                <!-- IF MESSAGE IS A FILE -->
                <v-sheet v-if="repliedInfo?.messageInfo?.type === 12" class="d-flex justify-space-between align-center text-grey2 w-100">
                    <span class="mr-auto" ><v-icon icon="$tb-file" size="18" class="mr-1" /> {{ repliedInfo.messageInfo.fileName.length > 14 
                          ? `${truncateString(repliedInfo?.messageInfo?.fileName, 14)}${repliedInfo?.messageInfo?.fileName?.split('.').pop()}`
                          : repliedInfo?.messageInfo?.fileName 
                      }}</span>
                </v-sheet>

                <!-- IF MESSAGE IS AN AUDIO -->
                <v-sheet v-if="repliedInfo?.messageInfo?.type === 13" class="d-flex justify-space-between align-center text-grey2 w-100">
                    <span class="mr-auto" ><v-icon icon="$tb-microphone" size="18" class="mr-1" />Voice Message</span>
                </v-sheet>

      </v-sheet> 

        <p v-if="msg?.type === 1" class="text-grey2" style="word-break: break-all; font-weight: 600">
          {{ msg?.message }}
        </p>

        <v-card
          v-else
          flat
          class="overflow-hidden"
          target="_blank"
          :href="(msg as ZIMMediaMessage)?.fileDownloadUrl"
          style="border-radius: 12px; background-color: transparent"
          :hover="false"
          elevation="0"
          max-width="278"
          max-height="268"
        >
          <v-img
            v-if="msg?.type === 11"
            :src="(msg as ZIMMediaMessage)?.fileDownloadUrl"
            :lazy-src="(msg as ZIMMediaMessage)?.fileDownloadUrl"
            width="278"
            min-height="120"
            cover
          >
            <template #placeholder>
              <v-sheet class="h-100 d-flex justify-center align-center">
                <v-progress-circular indeterminate color="primary" />
              </v-sheet>
            </template>
          </v-img>

          <v-sheet v-else-if="msg.type === 13" class="d-flex align-center">
            <audio
              :src="(msg as ZIMMediaMessage)?.fileDownloadUrl"
              controls
              class="audio-message"
            ></audio>
          </v-sheet>

          <v-sheet color="transparent" v-else flat class="d-flex align-center justify-center">
            <v-sheet>
              <v-icon size="20" icon="$tb-paper-clip" />
              <span class="ml-1 text-body-1 text-grey2" style="font-weight: 600">{{
                msg?.fileName?.length > 18 ?
                `${truncateString(msg?.fileName, 18)}${msg?.fileName.split('.').pop()}` : msg?.fileName
              }}</span>
            </v-sheet>
          </v-sheet>
        </v-card>
      </v-sheet>
      </div>
      
      <span
        :key="reRenderKey"
        class="text-body-2 text-grey2 font-weight-medium"
        style="line-height: 24px"
      >
        {{ dayjs(msg.timestamp).fromNow() }}
      </span>
    </div>
    <v-avatar
      class="mb-8 avatar font-weight-medium text-body-2 text-grey1"
      size="32"
      :image="
        msg.senderUserID === user?.id ? user?.profileImg?.url : conversation?.conversationAvatarUrl
      "
      color="#d5d5d5"
      :text="
        !conversation?.conversationAvatarUrl
          ? conversation?.conversationName.slice(0, 2).toUpperCase()
          : user?.name.slice(0, 2).toUpperCase()
      "
    />
  </v-sheet>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import { formatDuration, truncateString } from '@/utils/helpers'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, onUnmounted } from 'vue'
import { onMounted, ref } from 'vue'
import {
  ZIMMessageType,
  type ZIMAudioMessage,
  type ZIMConversation,
  type ZIMMediaMessage,
  type ZIMMessage
} from 'zego-zim-web'

const props = defineProps<{
  msg: ZIMMessage | ZIMMediaMessage
  conversation: ZIMConversation | null
}>()
const { user } = storeToRefs(useAuthStore())
const { replyMessage } = storeToRefs(useChatStore())

const interval = ref()
const reRenderKey = ref(0)

const {activeUser} = storeToRefs(useChatStore())

const repliedInfo =  computed(()=> props.msg?.senderUserID === props.conversation?.conversationID ?  props.msg?.extendedData && JSON.parse(props.msg?.extendedData)?.repliedInfo : props.msg?.repliedInfo )

const handleReplyMessage = (msg:ZIMMessage | ZIMMediaMessage)=>{
 replyMessage.value = msg
}

onMounted(() => {
  interval.value = setInterval(() => {
    reRenderKey.value++
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval.value)
})
</script>

<style scoped>
.name {
  text-decoration: underline;
  &:hover {
    color: white !important;
    cursor: pointer;
  }
}

.me {
  justify-content: flex-start;
  flex-direction: row-reverse;

  & .user-div {
    align-items: flex-start !important;
  }

  .bubble {
    background-color: #f3f4f5 !important;
    align-items: flex-start;
  }

  .avatar {
    background-color: #87e3ff80 !important;
  }

  .audio-message {
    &::-webkit-media-controls-panel {
      background-color: #f3f4f5 !important;
    }
  }
}

.reply-btn{
    opacity: 0;
}

.bubble {
  border-radius: 20px;
  padding: 12px;
  max-width: 278px;
  width: fit-content;
  background-color: #cbe8f1;

  &:deep(.v-card__overlay) {
    background-color: transparent !important;
  }

}

.audio-message {
  height: 36px;
  width: 254px;
  &::-webkit-media-controls-panel {
    padding: 0px;
    background-color: #cbe8f1;
  }
}

.message{
  transition: all 0.2s;
  &:hover .reply-btn{
    opacity:  1;
  }
}
</style>
