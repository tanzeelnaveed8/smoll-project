<template>
    <v-card class="main-container" width="722">

        <!-- DRAWER HEADER  -->
        <v-sheet class="d-flex justify-space-between align-center gc-6"
            style="border-bottom: 1px solid #dde7ee; padding: 14px 32px">
            <v-sheet class="d-flex gc-8 align-center">
                <h4 style="font-size: 18px; line-height: 24px">Select Vet & Time</h4>
            </v-sheet>

            <v-btn class="text-grey1" icon="$tb-x" width="auto" height="auto" flat color="transparent"
                @click="$emit('close')" />
        </v-sheet>

        <!-- DRAWER MAIN -->
        <v-form v-model="isFormValid" @submit.prevent="handleFormSubmit">
            <v-sheet class="d-flex flex-column gr-6 px-8 py-7">
                <v-sheet class="d-flex justify-space-between">
                    <v-sheet class="flex-1 w-100">
                        <p style="line-height: 24px; font-size:18px" class=" mb-3 text-grey1 font-weight-bold">
                            Select Vet
                        </p>
                        <v-combobox max-width="313" hide-details="auto" placeholder="Select Vet" :items="vets"
                            item-title="name" return-object :menu-props="{ maxWidth: 200 }"
                            v-model="appointmentScheduleForm.selectedVet" :rules="rules.selectedVet" />
                    </v-sheet>
                    <v-sheet class="flex-1 w-100 input-date">
                        <p style="line-height: 24px; font-size:18px" class=" mb-3 text-grey1 font-weight-bold">
                            Select Date
                        </p>

                        <v-date-input v-model="appointmentScheduleForm.date" :rules="rules.date" hide-actions
                            color="primary" prepend-icon="" prepend-inner-icon="$tb-calendar-event-filled"
                            hide-details="auto" placeholder="Select a date" max-width="368"
                            :allowed-dates="allowedDates" format="fullDate" />
                    </v-sheet>
                </v-sheet>

                <v-sheet>
                    <p style="line-height: 24px; font-size:18px" class=" mb-3 text-grey1 font-weight-bold">
                        Availability
                    </p>
                    <v-sheet v-if="appointmentScheduleForm.selectedVet && appointmentScheduleForm.date"
                        class="d-flex flex-column gr-3">
                        <v-chip-group v-model:model-value="selectedShift"
                            selected-class="selected-btn-shift selected-btn" column class="">
                            <v-chip size="x-large" variant="outlined" v-push style=" "
                                class="specialty-btn shift-btn  text-grey1 text-body-1" v-for="shift in shifts"
                                :value="shift">{{ shift }}
                            </v-chip>
                        </v-chip-group>

                        <v-skeleton-loader v-if="loading" class="slot-loader d-flex ga-5" width="100%"
                            type="chip@4"></v-skeleton-loader>
                        <v-chip-group v-else v-model:model-value="appointmentScheduleForm.selectedTime"
                            selected-class="selected-btn" column class="specialty-btn-container">
                            <v-chip v-if="slots[selectedShift]?.length" variant="outlined" v-push
                                class=" w-100 specialty-btn pa-5 text-body-1 rounded-lg justify-center"
                                v-for="slot in slots[selectedShift]" :value="slot">
                                {{ formatTime(slot) }}
                            </v-chip>
                            <p v-else class="font-weight-medium" style="font-size: 18px;">No available slots.</p>
                        </v-chip-group>

                    </v-sheet>
                    <p v-else class="text-grey2 font-weight-medium mt-1" style="font-size: 18px;">
                        Please select a vet and date.
                    </p>
                </v-sheet>
            </v-sheet>

            <v-sheet class="continue-btn-container">
                <v-btn v-push type="submit" :disabled="isSubmitDisabled">
                    Create Quotation
                </v-btn>
            </v-sheet>
        </v-form>
    </v-card>

    <!-- QUOTATION DRAWER -->
    <v-dialog v-model="quotationDrawer" transition="slide-x-reverse-transition" width="auto" class="dialog">
        <QuotationDrawer :case="case" :member :drawer-props="quotationDrawerProps" :is-emergency="false"
            :directBookingProps="directBookingProps" @close="quotationDrawer = false" @submit="() => {
                $emit('close')
                emitter.emit('refetch-cases')
            }" />
    </v-dialog>

</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import QuotationDrawer from '../quotationDrawer/QuotationDrawer.vue';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import type { Case } from '@/stores/types/case';
import { usePartnerStore } from '@/stores/partner';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import type { Member } from '@/stores/types/member';
import useMitt from '@/functions/useMitt';
dayjs.extend(isSameOrAfter);

interface AppointmentScheduleFormType {
    selectedVet: { id: string, name: string } | null
    date: string | null
    selectedTime: { from: string, to: string } | null
}

const props = defineProps<{
    case: Case
    quotationDrawerProps: {
        partnerId: string
        note: string
        actionLoading: boolean
    }
    vets: { id: string, name: string }[]
    member: Member
}>()

const partnerStore = usePartnerStore()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { emitter } = useMitt()

const quotationDrawer = ref(false)

const appointmentScheduleForm = ref<AppointmentScheduleFormType>({
    selectedVet: null,
    date: null,
    selectedTime: null
})

const rules = ref({
    selectedVet: [(v: any) => !!v || 'Vet must be selected.'],
    date: [(v: any) => !!v || 'Date must be selected.'],
    selectedTime: [(v: any) => !!v || 'Time must be selected.']
})

const loading = ref(false)
const isFormValid = ref(false)


const formatScheduleDate = (selectedDate: string, selectedTime: { from: string, to: string } | null) => {
    const date = dayjs(selectedDate).format("YYYY-MM-DD");

    const scheduleAt = dayjs(
        date.toString() +
        "T" +
        dayjs(`${date}T${selectedTime?.from}Z`).format("HH:mm")
    )
        .utc()
        .format();

    console.log(scheduleAt)

    return scheduleAt;
}

const directBookingProps = computed(() => ({
    partnerVet: appointmentScheduleForm.value.selectedVet,
    scheduledAt: formatScheduleDate(appointmentScheduleForm.value.date || '', appointmentScheduleForm.value.selectedTime)
}))

const isSubmitDisabled = computed(() =>
    !appointmentScheduleForm.value.selectedVet ||
    !appointmentScheduleForm.value.date ||
    !appointmentScheduleForm.value.selectedTime
)

const shifts = ['Morning', "Noon", "Evening"]
const selectedShift = ref('Morning')

const availability = ref<{ intervals: { from: string, to: string }[] } | null>(null)
const slots = ref<{ [key: string]: { from: string, to: string }[] | null }>({ Morning: null, Noon: null, Evening: null })

const allowedDates = (date: any) => {
    return dayjs(date).isSameOrAfter(dayjs().startOf('day'))
}

const formatTime = (slot: { from: string, to: string }) => {
    const fromTime = dayjs(`2025-01-21T${slot.from}Z`).format("hh:mm A");
    const toTime = dayjs(`2025-01-21T${slot.to}Z`).format("hh:mm A");
    return `${fromTime} - ${toTime}`
}

const handleFormSubmit = () => {
    if (!isFormValid.value) return;
    quotationDrawer.value = true
}

const fetchVetAvailibilities = async (partnerId: string, vetId: string, date?: string) => {
    try {
        loading.value = true
        const availabilities = await partnerStore.fetchPartnerVetAvailibility(partnerId, vetId, date)
        console.log(availabilities, "TEST~")
        availability.value = availabilities[0]
    } finally {
        loading.value = false
    }
}

const handleDateSelect = () => {
    const getHour = (time: string) => {
        const dateTime = dayjs(`2025-01-21T${time}Z`);
        return dateTime.hour();
    };
    const morningTimings = availability.value?.intervals.filter(
        (item) => getHour(item.from) < 12
    );
    const noonTimings = availability.value?.intervals.filter((item) => {
        const time = getHour(item.from);
        if (time > 12 && time < 17) {
            return item;
        }
    });
    const eveningTimings = availability.value?.intervals.filter(
        (item) => getHour(item.from) > 17
    );

    if (morningTimings && morningTimings.length > 0) {
        selectedShift.value = "Morning"
    } else if (noonTimings && noonTimings.length > 0) {
        selectedShift.value = "Noon"
    } else if (eveningTimings && eveningTimings.length > 0) {
        selectedShift.value = "Evening"
    }

    slots.value = {
        Morning: morningTimings || null,
        Noon: noonTimings || null,
        Evening: eveningTimings || null,
    }
}

watch([() => appointmentScheduleForm.value.selectedVet, () => appointmentScheduleForm.value.date], async ([vet, date]) => {
    appointmentScheduleForm.value.selectedTime = null
    if (vet && date) {
        const formattedDate = new Date(date).toDateString()
        await fetchVetAvailibilities(props.quotationDrawerProps.partnerId, vet.id, formattedDate)
        handleDateSelect()
    }
})

watch(() => selectedShift.value, () => {
    appointmentScheduleForm.value.selectedTime = null
})

</script>

<style lang="scss" scoped>
.dialog:deep(.v-overlay__content) {
    right: 0;
}

.main-container {
    position: relative;
    padding-bottom: 80px;
    height: 100vh;
}

.specialty-btn-container {

    &:deep(.v-slide-group__content) {
        gap: 6px;
    }
}

.specialty-btn {
    color: #494949;
    border: 1px solid #a0aeb8;
    font-weight: 600;
    line-height: 24px;
    max-width: 200px;
    padding: 20px 12px !important;
}

.selected-btn {
    background-color: #427594 !important;
    color: white !important;
    border-color: #a0aeb8 !important;
}

.shift-btn {
    border-color: #222;
}

.selected-btn-shift {
    background-color: #494949 !important;
    border-color: #4d4d4d !important;

}

.continue-btn-container {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 12px 32px;
    background: #fff;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #dde7ee;
}


.input-date .v-input {
    &:deep(.v-field) {
        background-color: white !important;
    }
}

.slot-loader {
    &:deep(.v-skeleton-loader__chip) {
        margin: 0px;
        border-radius: 8px;
        max-width: 200px;
        width: 100%;
        height: 42px;
    }
}
</style>