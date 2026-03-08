<template>
    <v-sheet height="100%" width="29.71%" color="white">
        <!-- HEADER -->
        <v-sheet class="d-flex px-4 py-4 align-center position-relative">
            <v-btn v-if="viewingPetProfile" v-push icon="$tb-arrow-left" flat height="32" width="32" density="compact"
                class="text-grey1 position-absolute" color="transparent" style="left: 16px;"
                @click="viewingPetProfile = false" />
            <p style="font-weight: 600; line-height: 32px; text-align: center; width: 100%;font-size: 18px;">
                {{ viewingPetProfile ? 'Pet Profile' : 'Member Details' }}
            </p>
        </v-sheet>
        <v-divider color="#2C2B35"></v-divider>

        <!-- MAIN -->
        <template v-if="memberDetailsLoading">
            <v-sheet class="d-flex justify-center align-center h-100 w-100 pb-24" style="padding-bottom: 150px;">
                <v-progress-circular indeterminate color="primary" />
            </v-sheet>
        </template>
        <template v-else>
            <v-sheet v-if="!memberDetails" class="d-flex justify-center align-center h-100 w-100 pb-24"
                style="padding-bottom: 150px;">
                <p class="font-weight-medium d-flex align-center" style="font-size: 18px;color:#d13232">
                    <v-icon color="#d13232" class="mr-2" icon="$tb-alert-circle" />
                    Unable to fetch member details
                </p>
            </v-sheet>
            <v-sheet v-else class="scroll-none" style="overflow-y: scroll;height:calc(100vh - 183px);">
                <v-sheet v-if="!viewingPetProfile" class="d-flex flex-column ga-4 pa-6">
                    <v-sheet class="d-flex flex-column ga-4" style="font-weight: 600;">
                        <v-sheet class="d-flex align-center ga-4">
                            <v-avatar :image="memberDetails?.profileImg?.url" size="80" color="#87e3ff80"
                                style="border: 1px solid #e6e6e6;"
                                :text="(memberDetails?.name || 'ER').slice(0, 2).toUpperCase()" />
                            <p class="text-h6 font-weight-bold">{{ memberDetails?.name || '-' }}</p>
                        </v-sheet>
                        <div class="d-flex flex-column ga-4 ml-2">
                            <v-sheet>
                                <span style="font-size: 14px; font-weight: 900;">Phone number</span>
                                <p class="mt-1 text-grey2" style="font-weight: 600;">{{ memberDetails?.phone || "-" }}
                                </p>
                            </v-sheet>
                            <v-sheet>
                                <span style="font-size: 14px; font-weight: 900;">Email Address</span>
                                <p class="mt-1 text-grey2" style="font-weight: 600;">{{ memberDetails?.email || "-" }}
                                </p>
                            </v-sheet>
                            <v-sheet>
                                <span style="font-size: 14px; font-weight: 900;">Address</span>
                                <p class="mt-1 text-grey2" style="font-weight: 600;">{{ [memberDetails?.address,
                                memberDetails?.city, memberDetails?.country]
                                    .filter(Boolean)
                                    .join(' ') || '-' }}</p>
                            </v-sheet>
                        </div>
                    </v-sheet>
                    <v-divider color="#2C2B35"></v-divider>
                    <v-sheet class="d-flex flex-column gr-6">
                        <v-sheet class="d-flex flex-column gr-2">
                            <v-sheet class="d-flex justify-space-between align-center w-full">
                                <h5 class="text-body-1 text-grey1" style="font-weight: 800;font-size: 18px;">
                                    {{ memberDetails?.name || '-' }}'s Pets
                                </h5>
                                <v-btn variant="text" @click="addPetDrawer = true" rounded="lg" class="px-2"><v-icon
                                        icon="$tb-plus" />Add
                                    Pet</v-btn>
                            </v-sheet>
                            <v-data-table :headers="headers" :items="memberDetails?.pets" :items-per-page="-1"
                                class="pets-container" hide-default-footer item-value="id"
                                style="border: 1px solid #d0d7dc; border-radius: 12px" @click:row="handleOpenPetProfile"
                                :hover="true">
                                <template #item.name="{ item }">
                                    <p>{{ truncateString(item.name, 6) }}</p>
                                </template>
                                <template #item.id="{ item }">
                                    <p>{{ truncateString(item.id, 7) }}</p>
                                </template>
                                <template #item.species="{ item }">
                                    <p>{{ capitalizeFirst(item.species) }}</p>
                                </template>
                                <template #item.actions="{ item }">
                                    <v-btn icon v-bind="props" variant="plain"
                                        @click.stop="() => handleCreateCase(item)">
                                        <v-icon icon="$tb-square-arrow-up" />
                                        <v-tooltip activator="parent" location="top"
                                            open-delay="200">Escalate</v-tooltip>
                                    </v-btn>

                                </template>
                            </v-data-table>
                        </v-sheet>
                    </v-sheet>
                    <v-sheet>
                    </v-sheet>
                </v-sheet>

                <!-- Pet Profile View -->
                <v-sheet v-else class="pa-6">
                    <v-sheet class="d-flex flex-column ga-5">
                        <v-sheet class="d-flex align-center ga-4">
                            <v-avatar size="80" color="#87e3ff80" :image="selectedPet?.photos?.[0]?.url || undefined" />
                            <div>
                                <div class="d-flex align-center ga-2">
                                    <p class="text-h6 font-weight-bold mb-0">
                                        {{ selectedPet?.name || '-' }}
                                    </p>
                                    <v-chip variant="flat" v-if="selectedPet?.subscription?.status === 'Active'"
                                        color="#56b686" text-color="white" size="small" class="ml-1"
                                        style="letter-spacing: 1px;">
                                        Active
                                    </v-chip>
                                </div>
                                <p class="mt-1 text-grey2" style="font-weight: 600;">
                                    {{ selectedPet?.id || '-' }}
                                </p>
                            </div>
                        </v-sheet>
                        <v-sheet>
                            <!-- Tabs -->
                            <v-tabs v-model="activeTabPetDetails" class="tabs  text-grey2" height="auto"
                                style="padding-top: 14px; border-bottom: 1px solid #dde7ee">
                                <template v-for="tab in petTabs" :key="tab.value">
                                    <v-tab v-if="tab.show" :value="tab.value"
                                        style="line-height: 24px; font-weight: 600" class="px-2 pb-3 text-body-1"
                                        min-width="auto" height="auto">
                                        {{ tab.label }}
                                    </v-tab>
                                </template>
                            </v-tabs>

                            <!-- Tab Content -->
                            <v-window v-model="activeTabPetDetails" class="mt-4">
                                <!-- Pet Details Tab -->
                                <v-window-item value="pet-details">
                                    <v-row>
                                        <v-col cols="12" sm="6" v-for="(label, key) in petDetails" :key="key">
                                            <v-sheet>
                                                <span style="font-size: 16px; font-weight: 900;">{{ label }}</span>
                                                <p class="mt-1 text-grey2" style="font-weight: 600; font-size: 18px;">
                                                    {{ getPetValue(key) }}
                                                </p>
                                            </v-sheet>
                                        </v-col>
                                    </v-row>
                                </v-window-item>

                                <!-- Services Availed Tab -->
                                <v-window-item value="services-availed">
                                    <div>
                                        <div class="d-flex justify-space-between mb-2">
                                            <p class="text-grey2  pl-2" style="font-weight: 600;">Services Availed</p>
                                            <p class="text-grey2 "
                                                style="font-weight: 600;max-width: 106px; width: 100%;">Sessions</p>
                                        </div>
                                        <v-expansion-panels class="expansion-panels"
                                            v-if="selectedPet?.benefitUsageSummary">
                                            <v-expansion-panel v-for="service in selectedPet?.benefitUsageSummary"
                                                :key="service.id">
                                                <v-expansion-panel-title v-slot="{ expanded }">
                                                    <div class="d-flex justify-space-between align-center w-100">
                                                        <!-- Left: Chevron + Service Name -->
                                                        <div class="d-flex align-center gap-2">
                                                            <v-icon size="20" class="mr-1"
                                                                :icon="expanded ? '$tb-chevron-down' : '$tb-chevron-right'" />
                                                            <div class="font-weight-bold">{{ service.name }}</div>
                                                        </div>

                                                        <!-- Right: Dots for usage -->
                                                        <div class="d-flex align-center gc-1"
                                                            style="max-width: 102px; width: 100%;">
                                                            <v-icon
                                                                :icon="n <= service.consumedUsageCount ? `$tb-circle-check-filled` : `$tb-circle-check`"
                                                                v-for="n in service.totalUsageCount" :key="n"
                                                                :color="n <= service.consumedUsageCount ? '#56b686' : '#494949'" />
                                                        </div>
                                                    </div>
                                                </v-expansion-panel-title>

                                                <v-expansion-panel-text>
                                                    <div v-if="service.history?.length"
                                                        v-for="(clinic, index) in service.history" :key="index"
                                                        class="mb-4">
                                                        <p class="text-grey2 mb-1 "
                                                            style="font-size: 14px;font-weight: 700;">
                                                            Service
                                                            Provided by
                                                        </p>
                                                        <div class="d-flex justify-space-between align-center mb-1">
                                                            <p class="text-body-1" style="font-weight: 800">{{
                                                                clinic.clinicName }}</p>
                                                            <span style="font-weight: 600;">{{
                                                                dayjs(clinic.createdAt).format('DD-MM-YYYY')
                                                            }}</span>
                                                        </div>
                                                        <p class="mb-1 " style="font-size: 14px;font-weight: 600;">
                                                            {{ clinic.note || 'No note added' }}
                                                        </p>
                                                        <p style="font-weight: 600;font-size: 14px;">Vet name: {{
                                                            clinic.vet
                                                            || '' }}</p>
                                                        <v-divider class="mt-3"
                                                            v-if="index < service.history.length - 1" />
                                                    </div>
                                                    <div v-else>
                                                        <p>No service usage history available.</p>
                                                    </div>
                                                </v-expansion-panel-text>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                        <p v-else>No service usage history available.</p>
                                    </div>
                                </v-window-item>
                            </v-window>
                        </v-sheet>
                    </v-sheet>
                </v-sheet>
            </v-sheet>

        </template>
    </v-sheet>
    <v-dialog v-model="addPetDrawer" transition="slide-x-reverse-transition" width="auto" class="dialog">
        <AddPetDrawer @close="addPetDrawer = false" @submit="submitPet" :isLoading="addPetLoading" />
    </v-dialog>
    <v-dialog v-model="caseDrawer" transition="slide-x-reverse-transition" width="auto" class="dialog">
        <CaseDetailsDrawer class="dialog" @close="caseDrawer = false" :caseDetails="caseDetails"
            :loading="caseLoading" />
    </v-dialog>
    <DescriptionModal ref="descriptionModal" />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import AddPetDrawer from '@/components/drawer/addPetDrawer/AddPetDrawer.vue';
import type { MemberDetails } from '@/stores/types/chat';
import { capitalizeFirst, truncateString } from '@/utils/helpers';
import { useChatStore } from '@/stores/chat';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import DescriptionModal from '@/components/modal/DescriptionModal.vue';
import InboxDetailsDrawer from '@/components/drawer/inboxDetailsDrawer/InboxDetailsDrawer.vue';
import { useCaseStore } from '@/stores/case';
import CaseDetailsDrawer from '@/components/drawer/caseDetailsDrawer/CaseDetailsDrawer.vue';
import type { Pet } from '@/stores/types/pet';
import type { UploadedFile } from '@/stores/types/global';
import dayjs from 'dayjs';

const emit = defineEmits<{
    (event: 'refetchMember', memberId: string): void
}>()

const props = defineProps<{
    memberDetailsLoading: boolean
    memberDetails: MemberDetails | null
}>()

const headers = ref([
    { title: 'Name', key: 'name' },
    { title: 'ID', key: 'id' },
    { title: 'Species', key: 'species' },
    { title: 'Age', key: 'age' },
    { title: '', key: 'actions', sortable: false }
])

const petTabs = computed(() => [
    {
        label: 'Pet Details',
        value: 'pet-details',
        show: true
    },
    {
        label: 'Services Availed',
        value: 'services-availed',
        show: selectedPet.value?.subscription?.status === 'Active'
    },
])
const selectedPet = ref<Pet | null>(null);
const viewingPetProfile = ref(false);
const addPetDrawer = ref(false)
const chatStore = useChatStore()
const caseStore = useCaseStore()
const { user } = storeToRefs(useAuthStore())

const caseDetails = ref(null)
const caseDrawer = ref(false)
const caseLoading = ref(false)
const descriptionModal = ref()

const addPetLoading = ref(false)

const activeTabPetDetails = ref('details')



function handleOpenPetProfile(event: Event, row: any) {
    selectedPet.value = row.item
    viewingPetProfile.value = true
}

const petDetails = {
    breed: 'Breed',
    species: 'Species',
    age: 'Age',
    gender: 'Gender',
    weight: 'Weight',
    spayedOrNeutered: 'Spayed/Neutered',
    preExistingConditions: 'Pre-existing Conditions',
    isDeceased: 'Deceased',
    chipNumber: 'Chip Number',
    dob: 'Date of Birth',
};

function getPetValue(key: string) {
    const value = selectedPet.value?.[key];

    switch (key) {
        case 'spayedOrNeutered':
        case 'isDeceased':
            return value === true ? 'Yes' : value === false ? 'No' : '-';
        case 'dob':
            return value ? new Date(value).toLocaleDateString() : '-';
        case 'weight':
            return value != null ? `${value} kg` : '-';
        case 'age':
            return value !== null ? value : '-';
        case 'gender':
        case 'species': return capitalizeFirst(value)
        default:
            return value || '-';
    }
}

const createCase = async (petId: string, caseInfo: { description: string, assets?: UploadedFile[] }) => {
    try {
        caseLoading.value = true
        const consultation = await chatStore.createCase(props.memberDetails?.id || '', petId, user.value?.id || '', caseInfo)
        const fetchedCase = await caseStore.fetchCaseDetails(consultation.id)
        caseDetails.value = fetchedCase
    } catch (err) {
        caseDrawer.value = false
    } finally {
        caseLoading.value = false
    }
}

const handleCreateCase = async (pet: any) => {
    const caseInfo = await descriptionModal.value.open()
    if (caseInfo === null) return


    caseDrawer.value = true
    createCase(pet.id, caseInfo)
}

const addPet = async (accountDetails: any) => {
    try {
        addPetLoading.value = true
        await chatStore.addPet(props.memberDetails?.id || '', accountDetails)
    } finally {
        addPetLoading.value = false

    }
}

const submitPet = async (petAccount: any) => {
    await addPet(petAccount)
    emit('refetchMember', props.memberDetails?.id || '')
    addPetDrawer.value = false
}

watch(() => props.memberDetails, () => {
    selectedPet.value = null
    viewingPetProfile.value = false
})

watch(() => selectedPet.value, () => {
    activeTabPetDetails.value = 'pet-details'
})

</script>

<style lang="scss" scoped>
@import '@/assets/global.css';

.pets-container:deep(.v-data-table-header__content) {
    font-weight: 600;
    color: #494949;
}

.dialog:deep(.v-overlay__content) {
    right: 0;
}

.tabs:deep(.v-slide-group__content) {
    gap: 16px;
}

.tabs:deep(.v-tab-item--selected) {
    color: #222222 !important;
}

.tabs:deep(.v-tab__slider) {
    color: #427594;
    height: 4px;
}

.expansion-panels {
    &:deep(.v-expansion-panel__shadow) {
        display: none !important;
    }

    &:deep(.v-expansion-panel-title) {
        padding-right: 4px;
        padding-left: 4px;
    }

    &:deep(.v-expansion-panel-title__icon) {
        display: none;
    }
}
</style>