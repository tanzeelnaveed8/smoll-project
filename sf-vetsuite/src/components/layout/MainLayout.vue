<template>
  <v-layout>
    <template v-if="loading">
      <v-sheet class="d-flex justify-center align-center h-100 w-100">
        <v-progress-circular indeterminate color="primary" />
      </v-sheet>
    </template>

    <template v-else>
      <SideNav />
      <TopBar :title="title" />
      <v-main>
        <RouterView />
      </v-main>

      <Teleport to="body">
        <div id="mydiv" v-show="activeConsultationId && !$route.path.includes('/consultation')"
          class="draggable-container in-picture-video-call" ref="dragElement" :style="dragStyle"
          @mousedown="startDragging">
          <div class="draggable-header">
            <div class="h-100 w-100 position-absolute d-flex justify-center align-center overlay">
              <v-btn icon variant="plain" class="text-white" :to="`/consultation/${activeConsultationId}`">
                <v-icon icon="$tb-maximize" size="38" class="icon" />
              </v-btn>
            </div>
            <video id="in_picture_video_id" style="background-color: black;" autoplay width="400" height="225" />
          </div>
        </div>
      </Teleport>
    </template>
  </v-layout>
</template>

<script setup lang="ts">
import useMitt from '@/functions/useMitt'
import { useSound } from '@/functions/useSound'
import { useAuthStore } from '@/stores/auth'
import { useConsultationStore } from '@/stores/consultation'
import { useNotificationStore } from '@/stores/notification'
import { socket, SocketEventEnum } from '@/utils/socket'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { storeToRefs } from 'pinia'
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref, watch, reactive } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import TopBar from '../TopBar.vue'
import SideNav from '../sideNav/SideNav.vue'
import type { User } from '@/stores/types/auth'
import { useChatStore } from '@/stores/chat'
import { ZimHelper } from '@/utils/zim'
import * as Sentry from '@sentry/vue';


const title = computed(() => route.meta.title as string)

const router = useRouter()
const route = useRoute()
const { playSound } = useSound()
const { emitter } = useMitt()

const chatStore = useChatStore()
const consultationStore = useConsultationStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const { notificationIndicator } = storeToRefs(notificationStore)
const { user, initializationComplete, zegoToken } = storeToRefs(authStore)
const { activeUser, allMessages, conversations, newMessageCount } = storeToRefs(chatStore)
const { appointments, activeConsultationId } = storeToRefs(consultationStore)
const hasInititated = 'has initiated a consultation.'
const hasCancelled = 'has has cancelled the consultation.'

dayjs.extend(utc)

const loading = ref(false)
const startDate = computed(
  () => dayjs().set('hour', 0).utc().format('YYYY-MM-DDTHH:mm').split('+')[0] + 'Z'
)


const dragElement = ref<HTMLElement | null>(null)
const position = reactive({
  x: window.innerWidth - 420, // 400px width + 20px margin
  y: window.innerHeight - 245, // 225px height + 20px margin
})
const isDragging = ref(false)
const offset = reactive({ x: 0, y: 0 })

const dragStyle = computed(() => ({
  position: 'fixed' as const,
  top: `${position.y}px`,
  left: `${position.x}px`,
  height: '225px',
  width: '400px',
  zIndex: 3000
}))

const startDragging = (e: MouseEvent) => {
  isDragging.value = true
  offset.x = e.clientX - position.x
  offset.y = e.clientY - position.y

  window.addEventListener('mousemove', handleDragging)
  window.addEventListener('mouseup', stopDragging)
}

const handleDragging = (e: MouseEvent) => {
  if (!isDragging.value) return

  // Calculate new position
  let newX = e.clientX - offset.x
  let newY = e.clientY - offset.y

  // Add bounds checking
  const maxX = window.innerWidth - 400 // container width
  const maxY = window.innerHeight - 225 // container height

  // Constrain to viewport
  position.x = Math.min(Math.max(0, newX), maxX)
  position.y = Math.min(Math.max(0, newY), maxY)
}

const stopDragging = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', handleDragging)
  window.removeEventListener('mouseup', stopDragging)
}

onBeforeMount(async () => {
  initializationComplete.value = false

  try {
    loading.value = true
    if (!user.value) {
      await authStore.fetchUser()
    }
    if (user.value) {
      const { id, name, email } = user.value
      Sentry.setUser({ id, name, email });
    }

    dayjs.tz.setDefault(user.value!.timeZone)
    await initializeApp(user.value!)
  } catch (error) {
    router.replace('/login')
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  socket.removeAllListeners()
  socket.disconnect()
  window.removeEventListener('mousemove', handleDragging)
  window.removeEventListener('mouseup', stopDragging)
})

const getToken = () => {
  const _zegoToken = zegoToken.value
    ? zegoToken.value
    : localStorage.getItem('zegoToken')?.length
      ? localStorage.getItem('zegoToken')
      : null

  return _zegoToken
}

const saveToken = (token: string) => {
  localStorage.setItem('zegoToken', token)
  zegoToken.value = token
}

const initializeApp = async (user: User) => {
  socket.connect()

  zegoToken.value = getToken()

  try {
    await ZimHelper.init(user, zegoToken.value!)
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_TOKEN') {

      await authStore.refreshLoginToken()
      saveToken(authStore.zegoToken!)

      if (authStore.zegoToken) {
        await ZimHelper.init(user, authStore.zegoToken)
      } else {
        throw new Error('Failed to refresh token')
      }
    } else {
      throw error
    }
  }

  initCallListener(zegoToken.value!)

  initializationComplete.value = true

  //NOTIFICATIONS
  socket.on(SocketEventEnum.NOTIFICATION_CREATED, ({ userId, notification }) => {
    if (userId === user.id) {
      const existingMessage = newMessageCount.value.get('1')

      playSound('notif')
      notificationIndicator.value = true
      toast.info(notification.message)
      if (notification.message.includes(hasInititated)) {
        newMessageCount.value.set('1', existingMessage ? existingMessage + 1 : 1)
      } else if (notification.message.includes(hasCancelled)) {
        newMessageCount.value.set('1', existingMessage ? existingMessage - 1 : 0)
      }
    }
  })

  ZimHelper.zim.on('receivePeerMessage', async (zim, { messageList, fromConversationID }) => {
    playSound('notif')

    const msg = messageList[0]

    //IF fromConversation user is same as active user then clear unread message
    if (activeUser.value?.conversationID === fromConversationID) {
      newMessageCount.value.set(fromConversationID, 0)
    } else {
      //Handling unread message count
      const count = newMessageCount.value.get(fromConversationID) || 0
      newMessageCount.value.set(fromConversationID, count + 1)
    }
    //Find conversations
    const userExists = Array.from(conversations.value.values()).find(
      (convo) => convo.conversationID === fromConversationID
    )
    //If conversation does not exist then fetch conversation
    if (!userExists) {
      const { conversation } = await ZimHelper.zim.queryConversation(fromConversationID, 0)
      conversations.value.set(fromConversationID, conversation)
    }

    //Handling new messages
    const allMessagesArray = allMessages.value.get(fromConversationID) || []
    allMessages.value.set(fromConversationID, [...allMessagesArray, msg])


    // Moving the conversation to top
    const conversation = conversations.value.get(fromConversationID)
    if (conversation) {
      conversations.value.set(fromConversationID, conversation)

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

    // if (conversations.value.size) {
    //   const conversation = conversations.value.get(`${fromConversationID}`)
    //   if (conversation) conversations.value.set(fromConversationID, { ...conversation })
    // }
  })

  ZimHelper.zim.on('tokenWillExpire', async () => {
    console.log('expire')
    authStore.refreshLoginToken()
  })
}

const initCallListener = async (_zegoToken: string) => {
  ZimHelper.initCall(_zegoToken)

  emitter.on('inbox-details-drawer:CONNECT', async ({ consultationId }) => {
    consultationStore.initiateConsultation(consultationId)
    const consultation = await consultationStore.fetchConsultationDetails(consultationId)

    if (consultation) {
      router.push(`/consultation/${consultation.id}`)
    }
  })

  emitter.on('inbox-details-drawer:escalated', async ({ type }) => {
    await consultationStore.fetchConsultation(type)
    emitter.emit('inbox-view:CLOSE_DRAWER')
  })

  emitter.on('inbox-details-drawer:CASE_CLOSED', async ({ startTime, period }) => {
    appointments.value = []
    await consultationStore.fetchConsultationsCalendar(startTime ?? startDate.value, period)
  })
}
</script>

<style lang="scss" scoped>
.in-picture-video-call {


  .overlay {
    display: flex !important;
    position: absolute !important;
    z-index: 100;
    transition: all 0.3s;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.395);


    .v-btn {
      transition: all 0.1s;

      &:hover {
        color: rgb(176, 176, 176) !important;
      }
    }

  }

  &:hover {
    .overlay {
      opacity: 1;
    }
  }

}

.draggable-container {
  cursor: move;
  user-select: none;
}

.draggable-header {
  position: relative;
  cursor: move;
  width: 100%;
  height: 100%;
}
</style>