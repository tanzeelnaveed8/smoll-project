<template>
    <v-sheet class="overflow-hidden" height="100vh" width="571" color="#fff" style="transform-origin: right;">
        <v-sheet class="d-flex justify-space-between align-center gc-6"
            style="border-bottom: 1px solid #dde7ee; padding: 14px 32px">
            <h4 style="font-size: 18px; line-height: 24px">Add Pet</h4>
            <v-btn v-push class="text-grey1" icon="$tb-x" width="auto" height="auto" flat color="transparent"
                @click="emit('close')" />
        </v-sheet>
        <v-form v-model="formIsValid" @submit.prevent="handleFormSubmit" class="position-relative"
            style="height: calc(100vh - 78px);overflow-y: scroll;">
            <div class="d-flex flex-column gr-6 pa-8 pb-12">
                <div class="profile-container">
                    <v-sheet class="d-flex flex-column gr-4">
                        <!-- //FORM HEADER -->
                        <v-sheet class="d-flex flex-column gr-4">
                            <v-sheet class="d-flex gc-1">
                                <v-sheet class="position-relative pt-2 pb-3 pl-1"
                                    style="width: fit-content; margin-right: 14px">
                                    <input type="file" accept="image/*" class="d-none" ref="fileInput"
                                        @change="handleAddThumbnail" />
                                    <v-avatar color="#d5d5d5" size="72" class="text-grey2"
                                        :image="account.photos?.length && account.photos[0].url" icon="$tb-user"
                                        style="font-size: 24px" />
                                    <v-btn @click="handleFileInputChange" icon="$tb-edit-circle" size="32"
                                        :disabled="isLoading" flat color="#f4f6f8"
                                        class="pa-1 rounded-circle position-absolute"
                                        style="bottom: 14px; right: -12px" />
                                </v-sheet>
                                <v-sheet class="d-flex flex-column gr-1 align-start justify-center">
                                    <p class="font-weight-bold">Profile Picture</p>
                                    <v-btn variant="plain" :disabled="isLoading" class="px-0 text-body-1 justify-start"
                                        style="line-height: 24px; font-weight: 600; text-indent: 0px"
                                        @click="handleFileInputChange">Upload</v-btn>
                                    <p class="text-body-2 text-grey2 font-weight-medium">Min, 200x200px, .PNG or .JPG
                                    </p>
                                </v-sheet>
                            </v-sheet>
                            <v-divider color="#D0D7DC" class="opacity-100" />
                        </v-sheet>
                        <!-- //MAIN -->
                        <v-sheet class="d-flex flex-wrap gr-4 scrollable-form">
                            <v-sheet class="d-flex gc-4 w-100">
                                <v-sheet class="w-100">
                                    <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
                                        Name
                                    </p>
                                    <v-text-field v-model="account.name" type="text" :disabled="isLoading"
                                        hide-details="auto" class="text-field mt-1 text-grey2" placeholder="Pet's Name"
                                        :rules="rules.name" />
                                </v-sheet>
                            </v-sheet>
                            <v-sheet class="d-flex w-100 gc-4">

                                <v-sheet class="flex-fill">
                                    <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
                                        Select Gender
                                    </p>
                                    <v-select v-model="account.gender" menu-icon="$tb-chevron-down"
                                        :menu-props="{ offset: '10px' }" :disabled="isLoading" hide-details="auto"
                                        placeholder="Select gender" class="select mt-1" item-title="title"
                                        :items="genders" :rules="rules.gender">
                                        <template v-slot:item="{ props, item }">
                                            <v-list-item v-bind="props" :value="item.value.code">{{
                                                item.value.name
                                            }}</v-list-item>
                                        </template>
                                    </v-select>
                                </v-sheet>
                                <v-sheet class="flex-fill">
                                    <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
                                        Select Species
                                    </p>
                                    <v-select v-model="account.species" menu-icon="$tb-chevron-down"
                                        :menu-props="{ offset: '10px' }" :disabled="isLoading" hide-details="auto"
                                        placeholder="Select species" class="select mt-1" item-title="title"
                                        :items="species" :rules="rules.species">
                                        <template v-slot:item="{ props, item }">
                                            <v-list-item v-bind="props" :value="item.value.code">{{
                                                item.value.name
                                            }}</v-list-item>
                                        </template>
                                    </v-select>
                                </v-sheet>
                            </v-sheet>
                            <v-sheet class="d-flex w-100 gc-4">

                                <v-sheet style="flex: 1;">
                                    <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
                                        Select Breed
                                    </p>
                                    <v-select v-model="account.breed" menu-icon="$tb-chevron-down"
                                        :menu-props="{ offset: '10px' }" :disabled="isLoading || !account.species"
                                        hide-details="auto" placeholder="Select breed" class="select mt-1"
                                        item-title="title" :items="updatedBreed" :rules="rules.breed">
                                        <template v-slot:item="{ props, item }">
                                            <v-list-item v-bind="props" :value="item.value.code">{{
                                                item.value.name
                                                }}</v-list-item>
                                        </template>
                                    </v-select>
                                </v-sheet>
                                <v-sheet style="flex: 1;">
                                    <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
                                        Spayed/Neutered
                                    </p>
                                    <v-select v-model="account.spayedOrNeutered" menu-icon="$tb-chevron-down"
                                        :menu-props="{ offset: '10px' }" :disabled="isLoading" hide-details="auto"
                                        placeholder="Select" class="select mt-1" item-title="title" :items="isSpayed"
                                        :rules="rules.spayedOrNeutered">
                                        <template v-slot:item="{ props, item }">
                                            <v-list-item v-bind="props" :value="item.value.code">{{
                                                item.value.name
                                            }}</v-list-item>
                                        </template>
                                    </v-select>
                                </v-sheet>
                            </v-sheet>
                            <v-sheet class="d-flex gc-4 w-100">
                                <v-sheet class="w-100">
                                    <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
                                        Date of birth
                                    </p>
                                    <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition"
                                        offset-y>
                                        <template #activator="{ props }">
                                            <v-text-field v-model="account.dob" :disabled="isLoading" v-bind="props"
                                                hide-details="auto" placeholder="Select date" readonly
                                                :rules="rules.dob" />
                                        </template>

                                        <v-date-picker v-model="datePickerModel" @update:model-value="formatDate"
                                            :max="new Date().toISOString().substr(0, 10)" color="#427594" />
                                    </v-menu>
                                </v-sheet>
                            </v-sheet>
                            <v-sheet class="d-flex gc-4 w-100">
                                <v-sheet class="w-100">
                                    <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
                                        Chip number (Optional)
                                    </p>
                                    <v-text-field v-model="account.chipNumber" type="text" :disabled="isLoading"
                                        hide-details="auto" class="text-field mt-1 text-grey2"
                                        placeholder="Chip number" />
                                </v-sheet>
                            </v-sheet>
                            <v-sheet class="d-flex gc-4 w-100">
                                <v-sheet class="w-100">
                                    <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
                                        Weight (Optional)
                                    </p>
                                    <v-text-field v-model.number="account.weight" type="number" :disabled="isLoading"
                                        hide-details="auto" class="text-field mt-1 text-grey2 weight-input"
                                        placeholder="Weight" :rules="rules.weight" />
                                </v-sheet>
                            </v-sheet>
                            <v-sheet class="w-100">
                                <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
                                    Any pre-existing conditions (Optional)
                                </p>
                                <v-textarea v-model="account.preExistingConditions" :disabled="isLoading"
                                    hide-details="auto" class="text-field mt-1 text-grey2"
                                    placeholder="Any pre-existing conditions" no-resize rows="2" />
                            </v-sheet>
                        </v-sheet>
                    </v-sheet>
                </div>
            </div>
            <v-sheet class="drawer-footer w-100">
                <v-btn class="px-3 ml-auto" flat type="submit" :loading="isLoading"
                    :disabled="!formIsValid || isLoading">Add</v-btn>
            </v-sheet>
        </v-form>
    </v-sheet>
</template>

<script lang="ts" setup>
import { breed } from '@/constant';
import type { UploadedFile } from '@/stores/types/global';
import { useUploadStore } from '@/stores/upload';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';

interface PetAccount {
    name: string | null;
    gender: string | null
    species: string | null
    breed: string | null
    dob: string | null,
    age: number | null
    spayedOrNeutered: boolean | null
    chipNumber: string | null
    weight: number | null
    preExistingConditions: string | null
    photos: UploadedFile[] | null
}

const emit = defineEmits<{
    (event: 'close'): void
    (event: 'submit', PetAccount: PetAccount): void
}>()

const props = defineProps<{
    isLoading?: boolean
}>()
const formIsValid = ref()
const fileInput = ref()
const menu = ref(false)
const datePickerModel = ref<Date | string>(new Date())
const uploadStore = useUploadStore()



const account = ref<PetAccount>({
    name: null,
    gender: null,
    species: null,
    breed: null,
    dob: null,
    age: null,
    spayedOrNeutered: null,
    chipNumber: null,
    weight: null,
    preExistingConditions: null,
    photos: []
})

const rules = ref({
    name: [(v: string) => v?.trim().length > 0 || 'Name required.',
    (v: string) => !/\d/.test(v) || 'Name cannot contain numbers.',
    (v: string) => /^[A-Za-z\s]+$/.test(v) || 'Name cannot contain special characters.',
    (v: string) =>
        /^[A-Za-z\s]+$/.test(v) && !/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu.test(v) ||
        'Name cannot contain special characters or emojis.'
    ],
    gender: [(v: string) => v?.trim().length > 0 || 'Gender required.'],
    species: [(v: string) => v?.trim().length > 0 || 'Species required.'],
    breed: [(v: string) => v?.trim().length > 0 || 'Breed required.'],
    spayedOrNeutered: [(v: boolean) => typeof v === 'boolean' || 'Spayed Or Neutered required.'],
    dob: [(v: string) => v?.trim().length > 0 || 'Date of birth required.'],
    weight: [(v: number) => !isNaN(Number(v)) || 'Weight must be a number']
})

const handleFormSubmit = () => {
    emit('submit', account.value)
}

const genders = [{ title: 'Male', value: 'male' }, { title: 'Female', value: 'female' }]
const species = [{ title: 'Dog', value: 'dog' }, { title: 'Cat', value: 'cat' }]
const updatedBreed = computed(() => {
    //@ts-ignore
    return account.value.species ? breed[account.value?.species] : []
})
const isSpayed = [{ title: 'Yes', value: true }, { title: 'No', value: false }]

const updateProfileImage = async (bodyFormData: FormData) => {
    const formattedProfile = await uploadStore.uploadFile(bodyFormData)

    if (account.value) {
        account.value = { ...account.value, photos: [formattedProfile[0]] }
    }
}

const handleAddThumbnail = async (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    const bodyFormData = new FormData()
    bodyFormData.append('files', file)
    await updateProfileImage(bodyFormData)
}
const handleFileInputChange = () => {
    fileInput.value.click()
}
const formatDate = (val: string | Date) => {
    datePickerModel.value = val
    account.value.dob = dayjs(val).format('YYYY-MM-DD')

    const today = dayjs()
    const birthDate = dayjs(val)
    const age = today.diff(birthDate, 'year')
    account.value.age = age

    menu.value = false
}

</script>

<style lang="scss" scoped>
.weight-input:deep(input[type="number"]::-webkit-outer-spin-button),
.weight-input:deep(input[type="number"]::-webkit-inner-spin-button) {
    -webkit-appearance: none;
    margin: 0;
}
</style>