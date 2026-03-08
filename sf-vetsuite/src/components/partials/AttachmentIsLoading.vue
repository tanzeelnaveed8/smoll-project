<template>
  <v-sheet class="d-flex align-end justify-end gc-3" width="100%">
    <div class="d-flex flex-column gr-2 align-end user-div">
      <v-card
        flat
        class="overflow-hidden d-flex justify-center align-center"
        style="border-radius: 20px"
        color="#CBE8F1"
        :hover="false"
        elevation="0"
        min-width="278"
        min-height="64"
      >
        <v-sheet class="h-100 d-flex justify-center align-center">
          <v-progress-circular indeterminate color="primary" size="24" />
        </v-sheet>
      </v-card>

      <span class="text-body-2 text-grey2 font-weight-medium" style="line-height: 24px">
        {{ dayjs().fromNow() }}
      </span>
    </div>
    <v-avatar
      class="mb-8 avatar font-weight-medium text-body-2 text-grey1"
      size="32"
      :image="user?.profileImg?.url"
      color="#d5d5d5"
      :text="user?.name.slice(0, 2).toUpperCase()"
    />
  </v-sheet>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'

const { user } = storeToRefs(useAuthStore())
</script>

<style scoped>
.bubble {
  border-radius: 20px;
  padding: 12px;
  max-width: 278px;
  width: fit-content;
}
</style>
