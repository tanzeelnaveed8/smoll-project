<template>
  <v-sheet class="d-flex justify-center w-100 h-100">
    <v-sheet class="w-100 pa-6" max-width="800">
      <v-btn variant="plain" color="grey2" prepend-icon="$tb-arrow-left" class="px-0 mb-4" to="/visits">
        Back
      </v-btn>
      <h2 class="text-h5 font-weight-bold mb-6">Create New Visit</h2>
      <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
        <v-sheet class="d-flex flex-column gr-4">
          <v-autocomplete
            v-model="form.memberId"
            label="Customer"
            :items="members"
            item-title="name"
            item-value="id"
            :loading="loadingMembers"
            :rules="[required]"
            @update:search="searchMembers"
          />

          <v-autocomplete
            v-model="form.petId"
            label="Pet"
            :items="pets"
            item-title="name"
            item-value="id"
            :disabled="!form.memberId"
            :loading="loadingPets"
            :rules="[required]"
          />

          <v-autocomplete
            v-model="form.vetId"
            label="Assigned Veterinarian"
            :items="vets"
            item-title="name"
            item-value="id"
            :loading="loadingVets"
            :rules="[required]"
          />

          <v-textarea
            v-model="form.description"
            label="Visit Description"
            rows="4"
            :rules="[required]"
          />

          <v-btn type="submit" color="grey1" class="align-self-end" :loading="submitting" :disabled="!isFormValid">
            Create Visit
          </v-btn>
        </v-sheet>
      </v-form>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import { useCaseStore } from '@/stores/case'
import { useMemberStore } from '@/stores/member'
import { useVeterniansStore } from '@/stores/veternians'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const router = useRouter()
const caseStore = useCaseStore()
const memberStore = useMemberStore()
const vetStore = useVeterniansStore()

const formRef = ref()
const isFormValid = ref(false)
const submitting = ref(false)
const loadingMembers = ref(false)
const loadingPets = ref(false)
const loadingVets = ref(false)

const members = ref<any[]>([])
const pets = ref<any[]>([])
const vets = ref<any[]>([])

const form = ref({
  memberId: '',
  petId: '',
  vetId: '',
  description: ''
})

const required = (v: string) => !!v || 'This field is required'

const searchMembers = async (search: string) => {
  if (!search || search.length < 2) return
  try {
    loadingMembers.value = true
    const data = await memberStore.fetchMembers(search)
    members.value = data.data
  } finally {
    loadingMembers.value = false
  }
}

const fetchPets = async (memberId: string) => {
  try {
    loadingPets.value = true
    const data = await memberStore.fetchMembersDetails(memberId)
    pets.value = data.pets ?? []
  } finally {
    loadingPets.value = false
  }
}

const fetchVets = async () => {
  try {
    loadingVets.value = true
    const data = await vetStore.fetchVets(false)
    vets.value = data.data
  } finally {
    loadingVets.value = false
  }
}

watch(() => form.value.memberId, (newVal) => {
  if (newVal) {
    form.value.petId = ''
    fetchPets(newVal)
  }
})

const handleSubmit = async () => {
  if (!isFormValid.value) return
  try {
    submitting.value = true
    await caseStore.createCase(form.value)
    toast.success('Visit created successfully')
    router.push('/visits')
  } catch {
    toast.error('Failed to create visit')
  } finally {
    submitting.value = false
  }
}

const loadInitialMembers = async () => {
  try {
    loadingMembers.value = true
    const data = await memberStore.fetchMembers()
    members.value = data.data
  } finally {
    loadingMembers.value = false
  }
}

onMounted(() => {
  fetchVets()
  loadInitialMembers()
})
</script>
