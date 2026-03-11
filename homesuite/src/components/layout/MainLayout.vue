<template>
  <v-layout>
    <template v-if="loading">
      <v-sheet class="d-flex justify-center align-center h-100 w-100">
        <v-progress-circular indeterminate color="primary" />
      </v-sheet>
    </template>

    <template v-else>
      <v-main class="main-content">
        <RouterView />
      </v-main>
      <AppBottomNav />
    </template>
  </v-layout>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { computed, onBeforeMount, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import AppBottomNav from './AppBottomNav.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const loading = ref(false)

onBeforeMount(async () => {
  try {
    loading.value = true
    if (!user.value) {
      await authStore.fetchUser()
    }
    authStore.initializationComplete = true
  } catch {
    router.replace('/login')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.main-content {
  padding-bottom: 64px !important;
}
</style>
