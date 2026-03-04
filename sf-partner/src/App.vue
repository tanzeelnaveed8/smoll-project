<template>
  <v-app>
    <template v-if="loading">
      <v-sheet class="d-flex justify-center align-center h-100">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-sheet>
    </template>
    <template v-else>
      <RouterView />
    </template>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import * as Sentry from "@sentry/vue";


dayjs.extend(timezone)

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const loading = ref(true)
const { user, initializationComplete } = storeToRefs(authStore)

onMounted(async () => {
  if (!user.value && route.path !== '/login') {
    initializationComplete.value = false

    try {
      loading.value = true
      await authStore.fetchUser()
      if(user.value){
        const {id , name , email} = user.value
        Sentry.setUser({id,name,email});
      }
      initializationComplete.value = true
    } catch (err) {
      router.replace('/login')
    } finally {
      loading.value = false
    }
  }
})
</script>

<style scoped></style>
