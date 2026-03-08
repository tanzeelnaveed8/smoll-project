<template>
  <v-form
    class="w-100 d-flex flex-column gr-6"
    ref="formRef"
    v-model="isFormValid"
    validate-on="blur"
    @submit.prevent="handleFormSubmit"
  >
    <v-sheet v-if="account" class="d-flex flex-column gr-6" max-width="311">
      <v-sheet class="position-relative" style="width: fit-content">
        <input type="file" class="d-none" ref="fileInput" @change="handleFileInputChange" />
        <v-avatar
          color="#d5d5d5"
          size="72"
          class="text-grey2"
          icon="$tb-user"
          style="font-size: 24px"
          :image="account?.profileImg?.url"
          :loading="profileImgLoading"
        />
        <v-btn
          v-push
          @click="handleAddThumbnailBtn"
          icon="$tb-edit-circle"
          size="32"
          flat
          color="#f4f6f8"
          class="pa-1 rounded-circle position-absolute"
          style="bottom: 8px; right: -8px"
        />
      </v-sheet>
      <v-sheet class="d-flex flex-column gr-4">
        <v-sheet>
          <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">Name</p>
          <v-text-field
            v-model="account.name"
            type="text"
            :disabled="actionLoading"
            hide-details="auto"
            class="text-field mt-1 text-grey2"
            placeholder="Name"
            :rules="rules.name"
          />
        </v-sheet>
        <v-sheet>
          <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">Phone</p>
          <v-text-field
            disabled
            v-model="account.phone"
            type="string"
            hide-details="auto"
            class="text-field mt-1 text-grey1 text-field-phone text-field_num"
            placeholder="Phone number"
            :rules="rules.phone"
          >
            <template v-slot:prepend>
              <v-select
                v-model="callingCode"
                width="70"
                hide-details="auto"
                class="num-prefix-select w-100"
                :items="countryCallingCode"
              />
            </template>
          </v-text-field>
        </v-sheet>

        <v-sheet>
          <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
            Email address
          </p>
          <v-text-field
            disabled
            v-model="account.email"
            type="email"
            hide-details="auto"
            class="text-field mt-1 text-grey2"
            placeholder="Enter email"
          />
        </v-sheet>
        <v-sheet>
          <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
            Designation
          </p>
          <v-text-field
            :disabled="actionLoading"
            v-model="account.designation"
            type="text"
            hide-details="auto"
            class="text-field mt-1 text-grey2"
            placeholder="Designation"
            :rules="rules.designation"
          />
        </v-sheet>
        <v-sheet>
          <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">Address</p>
          <v-text-field
            :disabled="actionLoading"
            v-model="account.address"
            type="text"
            hide-details="auto"
            class="text-field mt-1"
            placeholder="Address"
            :rules="rules.address"
          />
        </v-sheet>
        <v-sheet>
          <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">Country</p>
          <v-select
            v-model="account.country"
            menu-icon="$tb-chevron-down"
            :disabled="actionLoading"
            hide-details="auto"
            placeholder="Select country"
            class="mt-2 select"
            :menu-props="{ maxWidth: '311px' }"
            item-title="name"
            :items="getCountryDataList()"
            :rules="rules.country"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :value="item.value.code">{{
                item.value.name
              }}</v-list-item>
            </template>
          </v-select>
        </v-sheet>
        <v-sheet>
          <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">Timezone</p>
          <v-select
            v-model="account.timeZone"
            :disabled="actionLoading"
            menu-icon="$tb-chevron-down"
            hide-details="auto"
            placeholder="Select timezone"
            class="mt-2 select"
            :items="timezone"
            :rules="rules.timeZone"
          ></v-select>
        </v-sheet>
        <v-sheet>
          <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">About</p>
          <v-textarea
            :disabled="actionLoading"
            v-model="account.about"
            hide-details="auto"
            class="text-field mt-1 text-grey2"
            placeholder="About"
            no-resize
            rows="2"
          />
        </v-sheet>
      </v-sheet>
    </v-sheet>
    <v-btn
      v-push
      :disabled="disableBtn"
      class="align-self-start px-3"
      style="letter-spacing: 0px; line-height: 24px"
      :loading="actionLoading"
      type="submit"
      >Save Changes</v-btn
    >
  </v-form>
</template>

<script lang="ts" setup>
import { ref, watch, watchEffect, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { getCountryDataList, languages } from 'countries-list'

import { useAuthStore } from '@/stores/auth'
import { useUploadStore } from '@/stores/upload'

import { timezone } from '@/constant'
import type { User } from '@/stores/types/auth'
import { toast } from 'vue3-toastify'

const formRef = ref()
const actionLoading = ref(false)
const profileImgLoading = ref(false)
const isFormValid = ref(true)
const disableBtn = ref(true)
const isMounted = ref(true)

const uploadStore = useUploadStore()
const authStore = useAuthStore()

const { user } = storeToRefs(authStore)
const account = ref<User | null>(user.value ?? null)

const callingCode = ref('+1')
const fileInput = ref<Ref | null>(null)

const countryCallingCode = getCountryDataList().map((item) => `+${item.phone[0]}`)


const rules = ref({
  email: [
    (v: string) =>
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v) || 'Please enter a valid email address.'
  ],
  phone: [(v: string) => /^\d{10}$/.test(v) || 'Please enter a valid phone number.'],
  name: [(v: string) => v?.length > 0 || 'Name is required.'],
  designation: [(v: string) => v?.length > 0 || 'Designation is required.'],
  address: [(v: string) => v?.length > 0 || 'Address is required.'],
  country: [(v: string) => v?.length > 0 || 'Country is required.'],
  timeZone: [(v: string) => v?.length > 0 || 'Timezone is required.'],
})

const updateProfile = async () => {
  try {
    actionLoading.value = true

    await authStore.updateUser({
      ...account.value,
      phone: `${callingCode.value}${account.value?.phone}`
    })
    toast.success('Profile updated!')
    disableBtn.value = true
  } finally {
    actionLoading.value = false
  }
}

const handleAddThumbnailBtn = () => {
  fileInput.value.click()
}

const updateProfileImage = async (bodyFormData: FormData) => {
  profileImgLoading.value = true

  const formattedProfile = await uploadStore.uploadFile(bodyFormData)

  if (account.value) {
    account.value = { ...account.value, profileImg: formattedProfile[0] }
  }

  await authStore.updateUser({ profileImg: formattedProfile[0] })
  profileImgLoading.value = false
}

const handleFileInputChange = async (e: any) => {
  const file = e.target.files[0]
  if (!file) return
  const bodyFormData = new FormData()
  bodyFormData.append('files', file)
  await updateProfileImage(bodyFormData)
}

const handleFormSubmit = async () => {
  if (!isFormValid.value) return
  await updateProfile()
}

watchEffect(() => {
  const phoneNumber = user.value?.phone
  const trimmedPhoneValue = phoneNumber?.slice(-10)
  callingCode.value = phoneNumber?.slice(0, -10) as string

  if (user.value) {
    isMounted.value = false
    account.value = { ...user.value, phone: trimmedPhoneValue as string }
  }
})

watch(
  () => account,
  () => {
    if (!isMounted.value) disableBtn.value = false
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.text-field {
  &:deep(.v-field) {
    font-weight: 600;
    color: #494949;
  }
  &:deep(.v-input__prepend) {
    margin: 0px;
    padding-top: 0px !important;
  }
}

.select {
  &:deep(.v-field) {
    font-weight: 600;
    color: #494949;
  }
}

.num-prefix-select {
  &:deep(.v-field) {
    padding-right: 8px;
    border-top-right-radius: 0px;
    border-top-left-radius: 8px !important;

    border-right: none;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 8px !important;

    background-color: white;
  }
  &:deep(.v-field__input) {
    padding-left: 12px;
    padding-right: 2px !important;
    font-weight: 600;
    color: #494949;
  }
}
.text-field-phone:deep(.v-field) {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  font-weight: 600;
  color: #494949;
}

.text-field_num:deep(.v-field__input) {
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

.language-select{
  &:deep(.v-field__clearable){
 color: #494949;
  }

  &:deep(.v-field__input){
   gap: 8px;
  }
}
</style>
