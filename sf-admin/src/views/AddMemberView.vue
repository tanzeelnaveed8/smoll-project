<template>
  <v-sheet class="d-flex justify-center w-100">
    <div class="px-6 py-6 d-flex flex-column gr-6 align-start" style="max-width: 1140px">
      <v-btn variant="plain" color="grey2" prepend-icon="$tb-arrow-left" class="px-0 btn-back" to="/members">
        Back
      </v-btn>
      <v-sheet class="d-flex flex-column gr-6 w-100" style="max-width: 560px">
        <FormHeader title="Add New Customer" about="Fill in the details to add a new customer." />
        <v-form ref="form" @submit.prevent="handleSubmit">
          <v-sheet class="d-flex flex-column gr-3">
            <v-sheet>
              <p style="font-weight: 600" class="text-body-1">Name</p>
              <v-text-field v-model="formData.name" type="text" hide-details="auto" class="text-field mt-2 text-grey1" placeholder="Name" :rules="[v => !!v || 'Name is required']" />
            </v-sheet>
            <v-sheet>
              <p style="font-weight: 600" class="text-body-1">Email address</p>
              <v-text-field v-model="formData.email" type="email" hide-details="auto" class="text-field mt-2 text-grey1" placeholder="Email address" />
            </v-sheet>
            <v-sheet>
              <p style="font-weight: 600" class="text-body-1">Phone</p>
              <v-text-field v-model="formData.phone" type="text" hide-details="auto" class="text-field mt-2 text-grey1" placeholder="+971XXXXXXXXX" />
            </v-sheet>
            <v-sheet>
              <p style="font-weight: 600" class="text-body-1">Flat/Villa No</p>
              <v-text-field v-model="formData.villa" type="text" hide-details="auto" class="text-field mt-2 text-grey1" placeholder="Flat/Villa No" />
            </v-sheet>
            <v-sheet>
              <p style="font-weight: 600" class="text-body-1">Street Address</p>
              <v-text-field v-model="formData.address" type="text" hide-details="auto" class="text-field mt-2 text-grey1" placeholder="Street Address" />
            </v-sheet>
            <v-sheet>
              <p style="font-weight: 600" class="text-body-1">City</p>
              <v-text-field v-model="formData.city" type="text" hide-details="auto" class="text-field mt-2 text-grey1" placeholder="City" />
            </v-sheet>
            <v-sheet>
              <p style="font-weight: 600" class="text-body-1">Country</p>
              <v-text-field v-model="formData.country" type="text" hide-details="auto" class="text-field mt-2 text-grey1" placeholder="Country" />
            </v-sheet>
          </v-sheet>
          <v-sheet class="d-flex gc-3 justify-end mt-6">
            <v-btn variant="outlined" to="/members">Cancel</v-btn>
            <v-btn color="grey1" type="submit" :loading="saving">Add Customer</v-btn>
          </v-sheet>
        </v-form>
      </v-sheet>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import FormHeader from '@/components/partials/formUi/FormHeader.vue'
import { useMemberStore } from '@/stores/member'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const memberStore = useMemberStore()
const router = useRouter()
const saving = ref(false)

const formData = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  villa: '',
  city: '',
  country: ''
})

const handleSubmit = async () => {
  if (!formData.value.name) return
  try {
    saving.value = true
    await memberStore.addMember(formData.value)
    toast.success('Customer added successfully')
    router.push('/members')
  } finally {
    saving.value = false
  }
}
</script>

<style>
.btn-back {
  &:hover {
    color: #222 !important;
  }
}
</style>
