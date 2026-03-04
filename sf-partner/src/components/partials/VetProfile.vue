<template>
  <v-sheet class="d-flex flex-column gr-6" height="680">
    <!-- //FORM HEADER -->
    <v-sheet class="d-flex flex-column gr-1 pb-2">
      <v-sheet class="d-flex gc-1">
        <v-sheet
          class="position-relative pt-2 pb-3 pl-1"
          style="width: fit-content; margin-right: 14px"
        >
          <input type="file" class="d-none" ref="fileInput" @change="handleAddThumbnailBtn" />
          <v-avatar
            color="#d5d5d5"
            size="72"
            class="text-grey2"
            :image="account.profileImg?.url"
            icon="$tb-user"
            style="font-size: 24px"
          />
          <v-btn
            @click="handleFileInputChange"
            icon="$tb-edit-circle"
            size="32"
            :disabled="disable"
            flat
            color="#f4f6f8"
            class="pa-1 rounded-circle position-absolute"
            style="bottom: 14px; right: -12px"
          />
        </v-sheet>
        <v-sheet class="d-flex flex-column gr-1 align-start justify-center">
          <p class="font-weight-bold">Profile Picture</p>
          <v-btn
            variant="plain"
            :disabled="disable"
            class="px-0 text-body-1 justify-start"
            style="line-height: 24px; font-weight: 600; text-indent: 0px"
            @click="handleFileInputChange"
            >Upload</v-btn
          >
          <p class="text-body-2 text-grey2 font-weight-medium">Min, 200x200px, .PNG or .JPG</p>
        </v-sheet>
      </v-sheet>
      <v-divider color="#D0D7DC" class="opacity-100" />
    </v-sheet>
    <!-- //MAIN -->
    <v-sheet class="d-flex flex-column gr-4 scrollable-form" >
      <v-sheet class="d-flex gc-4 w-100">
        <v-sheet class="w-100">
          <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
            First name
          </p>
          <v-text-field
            v-model="account.firstName"
            type="text"
            :disabled="disable"
            hide-details="auto"
            class="text-field mt-1 text-grey2"
            placeholder="First name"
            :rules="rules.firstName"
          />
        </v-sheet>
        <v-sheet class="w-100">
          <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
            Last name
          </p>
          <v-text-field
            v-model="account.lastName"
            type="text"
            :disabled="disable"
            hide-details="auto"
            class="text-field mt-1 text-grey2"
            placeholder="Last name"
          />
        </v-sheet>
      </v-sheet>
      <v-sheet>
        <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
          Email address
        </p>
        <v-text-field
          :disabled="disable"
          v-model="account.email"
          type="email"
          :rules="rules.email"
          hide-details="auto"
          class="text-field mt-1 text-grey2"
          placeholder="Enter email"
        />
      </v-sheet>
      <v-sheet>
        <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">Phone</p>
        <v-text-field
          v-model="account.phone"
          type="string"
          :disabled="disable"
          hide-details="auto"
          class="text-field mt-1 text-grey1 text-field-num"
          placeholder="Phone number"
          :rules="rules.phone"
        />
      </v-sheet>
      <v-sheet>
        <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
          Years of experience
        </p>
        <v-text-field
          v-model.number="account.yearsOfExperience"
          type="number"
          :disabled="disable"
          hide-details="auto"
          class="text-field mt-1 text-grey2 text-field-num"
          placeholder="Years of experience"
          :rules="rules.yearOfExp"
        />
      </v-sheet>
      <v-sheet>
        <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
          Designation
        </p>
        <v-text-field
          v-model="account.designation"
          type="text"
          :disabled="disable"
          hide-details="auto"
          class="text-field mt-1 text-grey2"
          placeholder="Designation"
          :rules="rules.designation"
        />
      </v-sheet>
      <v-sheet>
        <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
          About
        </p>
        <v-textarea
          v-model="account.about"
          :disabled="disable"
          hide-details="auto"
          class="text-field mt-1 text-grey2"
          placeholder="About"
          no-resize
          rows="2"
        />
      </v-sheet>
      <v-sheet class="align-self-start">
        <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
          Label
        </p>
        <div class="color-picker" @click="handleColorPickerClick">
          <input v-model="account.labelColor" type="color" ref="colorInput"  />
          <p class="font-weight-bold">{{account.labelColor}}</p>
        </div>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useUploadStore } from '@/stores/upload'
import type { UploadedFile } from '@/stores/types/global'
import type { VetDetails } from '@/stores/types/vet'

const props = defineProps<{
  disable?: boolean
  vetDetails?: VetDetails
}>()

const emit = defineEmits<{
  (
    event: 'updateVetDetails',
    details: {
      name: string
      designation: string
      phone: string
      email: string 
      profileImg: UploadedFile | null
      yearsOfExperience: number
      labelColor:string
      about:string | null
    }
  ): void
}>()

const defaultValue = computed(() => ({
  firstName: props?.vetDetails?.name.split(' ')[0],
  lastName: props?.vetDetails?.name.split(' ')[1],
  ...props?.vetDetails
}))

const account = ref<VetDetails | any>({
  profileImg: null,
  email: '',
  phone: '',
  designation: '',
  labelColor:'#000000',
  yearsOfExperience: undefined,
  ...defaultValue.value
})
const fileInput = ref()
const uploadStore = useUploadStore()

const colorInput = ref<HTMLInputElement>()

const rules = ref({
  email: [
    (v: string) =>
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v?.trim()) || 'Please enter a valid email address.'
  ],
  phone: [
    (v: string) => /^\+?\d{11,13}$/.test(v) || 'Please enter a valid phone number.',
    (v: string) => v.includes('+') || 'Add + with country code at the beginning'
  ],
  firstName: [(v: string) => v?.trim().length > 0 || 'First name required.'],
  yearOfExp: [(v: number) => v > 0 || 'Please enter a valid years of experience'],
  designation: [(v: string) => v?.trim().length > 0 || 'Designation required.']
})



const handleFileInputChange = () => {
  fileInput.value.click()
}

const handleColorPickerClick = () =>{
 colorInput.value?.click()
}



const updateProfileImage = async (bodyFormData: FormData) => {
  const formattedProfile = await uploadStore.uploadFile(bodyFormData)

  if (account.value) {
    account.value = { ...account.value, profileImg: formattedProfile[0] }
  }
}

const handleAddThumbnailBtn = async (e: any) => {
  const file = e.target.files[0]
  if (!file) return
  const bodyFormData = new FormData()
  bodyFormData.append('files', file)
  await updateProfileImage(bodyFormData)
}

watch(
  () => account.value,
  (newAccount, oldAccount) => {
      emit('updateVetDetails', {
        name: `${newAccount.firstName} ${newAccount.lastName}`,
        phone: newAccount.phone,
        profileImg: newAccount.profileImg,
        yearsOfExperience: newAccount.yearsOfExperience,
        email: newAccount.email,
        designation: newAccount.designation,
        labelColor:newAccount.labelColor,
        about:newAccount.about
      })
  },
  { deep: true }
)
</script>
<style lang="scss" scoped>
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

.text-field-num {
  &:deep(.v-field__input) {
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}

.selected-item {
  &:deep(.v-list-item-title) {
    font-weight: 600;
  }
}

.color-picker{
  display: flex;
  align-items: center;
  margin-top: 4px;
  border: 1px solid #a0aeb8;
  border-radius: 8px;
  padding: 1px;
  padding-right: 10px;
  padding-left: 2px;
  column-gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover{
    border-color: #4096ff;
  }


  & input{
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 40px;
  height: 40px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  
  &::-webkit-color-swatch {
  border-radius: 5px;
  border: 1px solid #bababa;
  }

  &::-moz-color-swatch {
  border-radius: 5px;
  border: none;
  }

  }
}

.scrollable-form{
  overflow-y: scroll;
  padding-right: 8px;

  
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background: #e8e8e8;
  }
}

</style>
