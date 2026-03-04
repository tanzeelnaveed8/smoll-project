<template>
  <v-form
    v-model="formIsValid"
    @submit.prevent="handleFormSubmit"
    class="position-relative"
    style="height: calc(100vh - 78px)"
  >
    <div class="d-flex flex-column gr-6 pa-8 pb-12">
      <v-sheet>
        <h4 class="font-weight-bold" style="font-size: 24px; line-height: 24px">Add a new Vet</h4>
        <p class="mt-3 font-weight-medium">
          Expand your clinic's expertise by adding a new vet. Easily input their details to keep
          your team growing and ready to provide exceptional care.
        </p>
      </v-sheet>
      <div class="profile-container">
        <VetProfile :disable="false" @updateVetDetails="vetDetails = $event" />
      </div>
    </div>
    <v-sheet class="drawer-footer w-100">
      <v-btn class="px-3 ml-auto" flat type="submit" :disabled="!formIsValid">Next</v-btn>
    </v-sheet>
  </v-form>
</template>

<script lang="ts" setup>
import VetProfile from '@/components/partials/VetProfile.vue'
import type { UploadedFile } from '@/stores/types/global'
import { ref } from 'vue'

interface VetDetails {
  name: string
  designation: string
  phone: string
  email: string
  profileImg: UploadedFile | null
  yearsOfExperience: number
  labelColor:string
}

const emit = defineEmits<{
  (event: 'submit', data: VetDetails): void
}>()

const vetDetails = ref<VetDetails | null>()

const formIsValid = ref(false)

const handleFormSubmit = () => {
  if (!formIsValid.value) return
  
  

  emit('submit', vetDetails.value as VetDetails)
}
</script>

<style lang="scss" >
@import '@/assets/global.css';

.profile-container{
  .scrollable-form{
  height: calc(100vh - 480px) !important;
  }
}
</style>
