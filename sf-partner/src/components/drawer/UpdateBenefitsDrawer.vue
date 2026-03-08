<template>
    <v-sheet height="100vh" width="571" color="#fff" style="transform-origin: right" class="position-relative">
        <!-- //TOP -->
        <v-sheet class="d-flex justify-space-between align-center gc-6"
            style="border-bottom: 1px solid #dde7ee; padding: 14px 32px">
            <h4 style="font-size: 18px; line-height: 24px">Update</h4>

            <v-btn class="text-grey1" icon="$tb-x" width="auto" height="auto" flat color="transparent"
                @click="$emit('close')" />
        </v-sheet>

        <v-sheet class="d-flex flex-column justify-space-between pb-12">
            <!-- Benefits List -->
            <v-sheet class="pa-8 d-flex flex-column gr-6">
                <v-sheet class="mb-3">
                    <h3 class="text-h5 font-weight-bold">
                        Update Benefits
                    </h3>
                </v-sheet>

                <!-- Add Benefit Form -->
                <v-form ref="formRef" v-model="isFormValid" validate-on="blur" @submit.prevent="handleFormSubmit"
                    class="d-flex flex-column gr-6">
                    <v-sheet>
                        <p style="line-height: 24px" class="text-body-2 text-grey2 font-weight-bold">Benefit</p>
                        <v-select v-model="form.benefit" menu-icon="$tb-chevron-down" :menu-props="{ offset: '10px' }"
                            :disabled="loading" hide-details="auto" placeholder="Select Benefit" class="select mt-1"
                            return-object item-title="title" :items="benefitOptions" :rules="rules.benefit">
                            <template v-slot:item="{ props, item }">
                                <v-list-item v-bind="props" :value="item.value.id" :disabled="item.raw.disabled">{{
                                    item.value.name
                                    }} </v-list-item>
                            </template>
                        </v-select>
                    </v-sheet>
                    <v-sheet>
                        <p style="line-height: 24px" class="text-body-2 text-grey2 font-weight-bold">Note</p>
                        <v-textarea hide-details="auto" v-model="form.note" :disabled="loading" no-resize
                            row-height="24" rows="4" placeholder="Note" class="mt-1" />
                    </v-sheet>
                    <v-sheet>
                        <p style="line-height: 24px" class="text-body-2 text-grey2 font-weight-bold">Administered By</p>
                        <v-select v-model="form.vet" menu-icon="$tb-chevron-down" :menu-props="{ offset: '10px' }"
                            :disabled="loading" hide-details="auto" placeholder="Select Vet" class="select mt-1"
                            return-object item-title="title" :items="vetOptions" :rules="rules.vet">
                            <template v-slot:item="{ props, item }">
                                <v-list-item v-bind="props" :value="item.value.id" :disabled="item.raw.disabled">{{
                                    item.value.name
                                    }} </v-list-item>
                            </template>
                        </v-select>
                    </v-sheet>
                    <v-sheet class="d-flex justify-end">
                        <v-btn variant="plain" class="px-0" flat type="submit" :disabled="loading">
                            <v-icon icon="$tb-plus" /> Add Benefit</v-btn>
                    </v-sheet>
                </v-form>

                <v-divider></v-divider>

                <!-- Benefits Cards -->
                <v-sheet class="d-flex flex-column gr-4">
                    <h4 class="text-h6 font-weight-bold">Added Benefits</h4>
                    <v-sheet v-if="benefits.length" v-for="(benefit, index) in benefits" :key="index"
                        class="benefit-card pa-4 py-3 d-flex justify-space-between gc-5 align-center w-full">
                        <v-sheet class="d-flex flex-column">
                            <v-sheet class="d-flex align-center gc-3">
                                <h5 class="font-weight-bold" style="font-size: 18px;">{{ benefit.title }}</h5>
                                <p class="text-grey2" style="font-weight: 600;">
                                    {{ dayjs().format('DD MMMM YYYY') }}
                                </p>
                            </v-sheet>
                            <p class="text-body-2 text-grey2 font-weight-medium">{{ benefit.note }}</p>
                            <div class="d-flex mt-1">
                                <p class="text-body-2 text-grey1 font-weight-medium">Administered by: </p>
                                <p class="text-body-2 text-grey2 font-weight-medium"> {{ benefit.vet }}
                                </p>
                            </div>

                        </v-sheet>

                        <v-btn density="compact" icon="$tb-trash" variant="text" color="grey1"
                            @click="removeBenefit(index)" />
                    </v-sheet>
                    <p v-else class="text-grey2" style="font-weight: 600;">
                        Please Add benefit.
                    </p>
                </v-sheet>
                <v-sheet class="drawer-footer">
                    <v-btn @click="handleUpdateBenefits" class="px-3 ml-auto" flat :loading="loading"
                        :disabled="loading || !benefits.length">
                        Submit</v-btn>
                </v-sheet>
            </v-sheet>
        </v-sheet>
    </v-sheet>
</template>

<script lang="ts" setup>
import type { UpdateBenefitsPayload } from '@/stores/types/pet';
import dayjs from 'dayjs';
import { ref } from 'vue';

interface Benefit {
    id: number;
    title: string;
    note: string;
    vet: string
}

const props = defineProps<{
    loading: boolean,
    benefitOptions: { id: string, title: string, disabled: boolean }[]
    vetOptions: { id: string, title: string }[]
}>()

const emit = defineEmits<{
    (event: 'close'): void
    (event: 'submit', payload: { benefits: { benefitId: number; note?: string, vet: string }[] }): void
}>()

const benefits = ref<Benefit[]>([]);

const form = ref<{
    benefit: { title: string, id: number } | null;
    note: string | null;
    vet: { title: string, id: number } | null;

}>({
    benefit: null,
    note: null,
    vet: null
});

const rules = ref({
    benefit: [(v: { title: string, id: number }) => v?.title?.length > 0 || 'Benefit is required.', (v: { title: string; id: number } | null) =>
        !benefits.value.some(b => b.id === v?.id) || 'This benefit has already been added.',],
    vet: [(v: { title: string, id: number }) => v.title.length > 0 || 'Vet is required.'],

})

const isFormValid = ref(false);
const formRef = ref()

const handleFormSubmit = () => {
    if (!isFormValid.value) return

    benefits.value.push({
        note: form.value?.note as string,
        id: form.value?.benefit?.id as number,
        title: form.value.benefit?.title as string,
        vet: form.value.vet?.title as string
    });

    formRef.value.reset()
};

const removeBenefit = (index: number) => {
    benefits.value.splice(index, 1);
};

const handleUpdateBenefits = () => {
    if (!benefits.value.length) return
    emit('submit', { benefits: benefits.value.map((benefit) => ({ benefitId: benefit.id, note: benefit.note, vet: benefit.vet })) })
}

</script>

<style lang="scss" scoped>
@import '@/assets/global.css';

.benefit-card {
    background-color: #fbfbfb;
    border-radius: 8px;
    border: 1px solid #d0d7dc;
}
</style>