<template>
  <v-sheet
    class="d-flex justify-center w-100 scroll-none"
    max-width="auto"
    style="height: calc(100vh - 207px); overflow-y: scroll"
  >
    <v-sheet class="mx-8 d-flex flex-column gr-8 w-100" max-width="912">
      <h4 class="text-body-1 font-weight-bold" style="line-height: 24px">Profile & Security</h4>
      <v-sheet class="d-flex gc-6 w-100">
        <ProfileDetails />
        <v-divider
          vertical
          color="#DDE7EE"
          class="opacity-100"
          style="height: 355px; align-self: center"
        />
        <ProfileChangePassword />
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import ProfileDetails from './ProfileDetails.vue'
import ProfileChangePassword from './ProfileChangePassword.vue'
</script>

<style lang="scss">
@import '@/assets/global.css';
</style>
