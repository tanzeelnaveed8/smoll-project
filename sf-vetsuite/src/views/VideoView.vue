<template>
  <div class="video-call position-relative">
    <div>
      <video v-show="videoEnabled" id="local_video_element_id" class="position-absolute right-0" width="300" autoplay
        muted />

      <v-sheet v-if="!videoEnabled" class="position-absolute right-0 d-flex align-center justify-center" width="300"
        height="170" color="#151515">
        <v-avatar size="96" color="grey2">
          <v-icon icon="$tb-user" size="44"></v-icon>
        </v-avatar>
      </v-sheet>
    </div>

    <video id="remote_video_element_id" class="w-100" style="background-color: #000; height: 90vh" autoplay></video>

    <v-sheet v-if="!remoteVideoEnabled" class="position-absolute d-flex align-center justify-center"
      style="top: 0; left: 0; right: 0; bottom: 0">
      <v-icon icon="$tb-video-off" size="64" color="white"></v-icon>
    </v-sheet>

    <template v-if="loading">
      <v-sheet class="d-flex justify-center align-center h-100 w-100" style="position: absolute; top: 0">
        <v-progress-circular indeterminate color="primary" />
      </v-sheet>
    </template>

    <template v-else>
      <div class="controls position-absolute w-100 d-flex justify-center" style="bottom: 20px">
        <v-sheet class="py-3 px-3 d-flex gc-4" style="background-color: rgba(24, 24, 24); border-radius: 99px">
          <v-btn @click="handleMinimize" variant="text" color="#fff" icon>
            <v-tooltip activator="parent" location="top" open-delay="100">Click to Minimize Video call</v-tooltip>
            <v-icon size="32" icon="$tb-arrow-diagonal-minimize-2" />
          </v-btn>
          <v-btn @click="toggleAudio" variant="text" color="#fff" icon>
            <v-tooltip activator="parent" location="top" open-delay="100">Turn {{ audioEnabled ? 'off' : 'on' }}
              mic</v-tooltip>
            <v-icon size="32" :icon="audioEnabled ? '$tb-microphone' : '$tb-microphone-off'" />
          </v-btn>
          <v-btn @click="toggleVideo" variant="text" color="#fff" icon>
            <v-tooltip activator="parent" location="top" open-delay="100">Turn {{ audioEnabled ? 'off' : 'on' }}
              video</v-tooltip>
            <v-icon size="32" :icon="videoEnabled ? '$tb-video' : '$tb-video-off'" />
          </v-btn>
          <v-btn @click="handleCallEnded" icon color="#F43350">
            <v-tooltip activator="parent" location="top" open-delay="100">Leave call</v-tooltip>
            <v-icon size="32" icon="$tb-x" />
          </v-btn>
        </v-sheet>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useConsultationStore } from '@/stores/consultation'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ZimHelper } from '@/utils/zim'

const route = useRoute()
const router = useRouter()
const consultationStore = useConsultationStore()
const authStore = useAuthStore()

const { user, initializationComplete, zegoToken } = storeToRefs(authStore)
const { consultationDetailMap, activeConsultationId, remoteStream, audioEnabled, videoEnabled } = storeToRefs(consultationStore)

const loading = ref(true)

const localStreamRef = ref<MediaStream | null>(null)


const consultationId = computed(() => route.params.consultationId as string)

const MESSAGE_TIMEOUT = 30000;
const lastMessageReceivedTime = ref<number | null>(null);
const messageTimeout = ref<NodeJS.Timeout | null>(null);

const resetMessageTimer = () => {
  // Clear any existing timeout
  if (messageTimeout.value) {
    clearTimeout(messageTimeout.value);
  }
  // Set a new timeout to end the call after the specified period
  messageTimeout.value = setTimeout(() => {
    console.log('No message received, ending call...');
    handleCallEnded();
  }, MESSAGE_TIMEOUT);

  // Update last message received time (you can use this for debugging/logging purposes)
  lastMessageReceivedTime.value = Date.now();
};

const setupMessageListener = () => {
  ZimHelper.zg.on('IMRecvCustomCommand', (fromUserID, content) => {
    resetMessageTimer()
  });
};

const videoConstants = computed(
  () =>
    user.value && {
      userId: user.value.id,
      roomId: user.value.id,
      localStreamId: new Date().getTime().toString(),
      accessToken: zegoToken.value
    }
)

const toggleAudio = () => {
  if (localStreamRef.value) {
    audioEnabled.value = !audioEnabled.value
    ZimHelper.zg.mutePublishStreamAudio(localStreamRef.value, !audioEnabled.value)
  }
}
const toggleVideo = () => {
  if (localStreamRef.value) {
    videoEnabled.value = !videoEnabled.value

    ZimHelper.zg.mutePublishStreamVideo(localStreamRef.value, !videoEnabled.value)
  }
}

const remoteVideoEnabled = ref(true)

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  e.preventDefault();
  sessionStorage.setItem('reloaded', 'true');
};

onMounted(async () => {
  if (sessionStorage.getItem('reloaded') === 'true') {
    handleMinimize()
    return;
  }

  if (
    !consultationId.value ||
    !user.value ||
    !initializationComplete.value ||
    !videoConstants.value
  )
    return



  window.addEventListener('beforeunload', handleBeforeUnload);

  const userID = videoConstants.value.userId
  const roomID = videoConstants.value.roomId
  const accessToken = videoConstants.value.accessToken as string

  const consultation = await consultationStore.fetchConsultationDetails(
    consultationId.value as string
  )



  // Set up event handlers
  ZimHelper.zg.on('roomStreamUpdate', async (_, updateType, streamList, __) => {

    if (updateType === 'ADD') {
      const _remoteStream = await ZimHelper.zg.startPlayingStream(streamList[0].streamID)
      const remoteView = document.getElementById('remote_video_element_id') as HTMLVideoElement
      const inPictureVideo = document.getElementById('in_picture_video_id') as HTMLVideoElement

      remoteView.srcObject = _remoteStream
      inPictureVideo.srcObject = _remoteStream

      remoteStream.value = _remoteStream

      remoteVideoEnabled.value = true

    } else if (updateType === 'DELETE') {
      handleCallEnded()
    }
  })

  // Add this new event listener
  ZimHelper.zg.on('remoteCameraStatusUpdate', (streamID, state) => {

    if (streamID !== videoConstants.value?.localStreamId) {
      remoteVideoEnabled.value = state === 'OPEN'
    }
  })

  // Log into the room
  try {

    loading.value = true

    if (!activeConsultationId.value) {

      activeConsultationId.value = consultationId.value

      await ZimHelper.zg.loginRoom(
        roomID,
        accessToken,
        { userID, userName: user.value?.name },
        {
          userUpdate: true
        }
      )

      consultationStore.initiateConsultationCall(
        consultationId.value! as string,
        roomID,
        consultation.member.id
      )
    } else {

      const remoteView = document.getElementById('remote_video_element_id') as HTMLVideoElement
      const inPictureVideo = document.getElementById('in_picture_video_id') as HTMLVideoElement

      remoteView.srcObject = remoteStream.value
      inPictureVideo.srcObject = remoteStream.value
    }

    // Start publishing local stream
    const localStream = await ZimHelper.zg.createStream()

    const localView = document.getElementById('local_video_element_id') as HTMLVideoElement

    localStreamRef.value = localStream
    localView.srcObject = localStream

    if (!audioEnabled.value) {
      ZimHelper.zg.mutePublishStreamAudio(localStream, true)
    }
    if (!videoEnabled.value) {
      ZimHelper.zg.mutePublishStreamVideo(localStream, true)
    }


    ZimHelper.zg.startPublishingStream(videoConstants.value.localStreamId, localStream)

    // Initialize message listener
    setupMessageListener();

    // Start the timer when the component is mounted
    resetMessageTimer();

  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

const handleCallEnded = async () => {

  loading.value = true

  if (videoConstants.value?.localStreamId) {
    ZimHelper.zg.stopPublishingStream(videoConstants.value?.localStreamId)
    ZimHelper.zg.stopPlayingStream(videoConstants.value?.localStreamId)
  }

  ZimHelper.zg.logoutRoom(videoConstants.value?.roomId)
  ZimHelper.zg.off('roomStreamUpdate')
  ZimHelper.zg.off('remoteCameraStatusUpdate')

  // Stop local stream tracks
  if (localStreamRef.value) {
    localStreamRef.value.getTracks().forEach((track) => track.stop())
  }

  await consultationStore.endConsultation(consultationId.value || `${activeConsultationId.value}`)

  activeConsultationId.value = null

  audioEnabled.value = true
  videoEnabled.value = true

  loading.value = false
  router.push(`/inbox?tab=instant`)
}


const handleMinimize = () => {
  router.push('/inbox?tab=instant')
}

onUnmounted(async () => {
  // await handleCallEnded()
  window.removeEventListener('beforeunload', handleBeforeUnload);
  sessionStorage.setItem('reloaded', 'false')

  // Remove the message listener to avoid memory leaks
  ZimHelper.zg.off('IMRecvCustomCommand', setupMessageListener);

  // Clear the timeout if it's still active
  if (messageTimeout.value) {
    clearTimeout(messageTimeout.value);
  }
})
</script>

<style scoped lang="scss">
.action-btn {
  &:deep(.v-btn__prepend) {
    margin: 0px;
  }
}
</style>
