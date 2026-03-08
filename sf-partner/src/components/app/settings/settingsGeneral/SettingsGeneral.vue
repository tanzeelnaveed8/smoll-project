<template>
  <v-sheet
    class="d-flex justify-center w-100 pt-10"
    max-width="auto"
    style="height: calc(100vh - 60px); overflow-y: scroll"
  >
    <v-sheet class="mx-8 d-flex flex-column gr-8 w-100 pb-10" max-width="912">
      <h4 class="text-body-1 font-weight-bold" style="line-height: 24px">Profile & Security</h4>
      <v-sheet class="d-flex gc-6 w-100 pb-10">
        <ProfileDetails />
        <v-divider
          vertical
          color="#DDE7EE"
          class="opacity-100"
          style="height: 355px; align-self: center"
        />
        <v-sheet class="pa-8 d-flex flex-column gr-8 w-100">
          <ProfileChangePassword />
          <v-divider
          :vertical="false"
          color="#DDE7EE"
          class="opacity-100"
          style=" align-self: start;width: 82%;"
        />
        <UploadClinicImage />
        </v-sheet>
       
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import ProfileChangePassword from './ProfileChangePassword.vue'
import ProfileDetails from './ProfileDetails.vue'
import UploadClinicImage from './UploadClinicImage.vue';
</script>

<style lang="scss">
@import '@/assets/global.css';
</style>
