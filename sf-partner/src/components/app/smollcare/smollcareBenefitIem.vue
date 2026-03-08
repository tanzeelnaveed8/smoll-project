<template>
    <div class="benefit-item mb-4">
        <div class="d-flex justify-space-between align-start">
            <div class="d-flex flex-grow-1 cursor-pointer" @click="expanded = !expanded">
                <div class="ml-1">
                    <v-icon color="grey2" size="20" :icon="expanded ? '$tb-minus' : '$tb-plus'"
                        class="mr-2 cursor-pointer" />
                </div>

                <div class="d-flex flex-column gr-4 flex-grow-1">
                    <div class="d-flex align-center gc-2">
                        <span class="" style="color: black; font-weight: 600;line-height: 24px;font-size: 18px;">{{
                            benefit.name
                            }}</span>
                    </div>


                    <template v-if="expanded">
                        <div v-if="benefit.history.length" class="d-flex flex-column gr-4">
                            <div v-for="(history, i) in benefit.history" :key="i" class="d-flex flex-column gr-3">
                                <div>
                                    <div class="text-grey1 " style="font-weight: 600;">
                                        <span style="color: black;">{{ history.clinicName }}</span> - {{
                                            dayjs(history.createdAt).format('DD MMMM YYYY') }}
                                    </div>
                                    <div v-if="history.note" class="text-grey2"
                                        style="max-width: 600px;line-height: 20px;">
                                        {{ history.note }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p v-else class=" text-grey2" style="font-weight: 500;">Not yet availed.</p>
                    </template>
                </div>
            </div>

            <div class="d-flex">
                <v-tooltip :text="`${benefit?.consumedUsageCount} out of ${benefit.totalUsageCount} benefit availed`"
                    location="bottom">
                    <template v-slot:activator="{ props }">
                        <div class="d-flex gap-2 read-only-checkbox" v-bind="props">
                            <v-checkbox class="readonly-checkbox" v-for="i in benefit.totalUsageCount" :key="i"
                                :model-value="benefit?.consumedUsageCount >= i" hide-details density="compact"
                                color="#02de32" readonly />
                        </div>
                    </template>
                </v-tooltip>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Benefit } from '@/stores/types/pet';
import dayjs from 'dayjs';
import { ref } from 'vue';

defineProps<{
    benefit: Benefit
}>()

const expanded = ref(false)

</script>

<style lang="scss" scoped>
.benefit-item {
    border-bottom: 1px solid #d6d6d6;
    padding-bottom: 1rem;
}

.benefit-item:last-child {
    border-bottom: none;
}

.readonly-checkbox {
    &:deep(.v-selection-control__input input) {
        cursor: default;
    }

    &:deep(.v-selection-control__input::before) {
        opacity: 0;
    }
}
</style>