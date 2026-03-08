<template>
  <v-sheet class="d-flex justify-space-between px-8">
    <v-sheet class="d-flex align-center gc-2">
      <h3 style="font-size: 20px; line-height: 24px">{{ date.format('DD MMMM YYYY') }}</h3>

      <v-chip
        rounded="lg"
        class="text-body-1 text-grey1 px-2 rounded-lg chip"
        variant="flat"
        style="
          font-weight: 600;
          line-height: 24px;
          letter-spacing: 0px;
          border: 1px solid #e1e1e2;
          background-color: #ededed;
        "
        text="Today"
      />
      <v-btn
        @click="handleRefetch"
        v-push
        flat
        icon="$tb-reload"
        density="compact"
        class="text-grey1"
        color="transparent "
        style="margin: 0px"
        :loading
      />
    </v-sheet>
    <v-select
    v-model="period"
          class="text-body-2 select period-select ml-4 mr-4"
          style="height: 32px"
          max-width="120"
          density="compact"
          :menu-props="{ offset: '12px' }"
          :list-props="{ style: 'border:1px solid #D0D7DC;color:#222' }"
          hide-details="auto"
          placeholder="Period"
          :items="[{ title: 'Monthly',value:'monthly' }, { title: 'Weekly',value:'weekly' }]"
        >
          <template #item="{ item, props, index }">
            <v-list-item
              class="px-3 py-2 text-grey1 select-item"
              min-height="auto"
              :value="item"
              activable
              v-bind="props"
              :style="`border-top:${index !== 0 && '1px solid #D0D7DC'}`"
            >
              <!-- <v-icon v-if="item.title === status" icon="$tb-check" size="20" /> -->
            </v-list-item>
          </template>
    </v-select>
  </v-sheet>
</template>

<script lang="ts" setup>
import useMitt from '@/functions/useMitt'
import dayjs from 'dayjs'
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const date = dayjs()
defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (event: 'refetchConsultations'): void
}>()

// const { emitter } = useMitt()
const router = useRouter()
const period = ref(router.currentRoute.value.query.period || 'monthly')


const handleRefetch = () => {
  emit('refetchConsultations')
}

watch(period ,()=>{
  router.push({
    path:'calendar',
    query:{...router.currentRoute.value.query, period:period.value }
  })
})
</script>

<style scoped lang="scss">
.select {
  &:deep(.v-field) {
    background-color: #ededed;
    font-weight: 600;
    border-color: #e1e1e2;
    padding-right: 8px;
  }

  &:deep(.v-field__input) {
    padding: 6px 0px 6px 12px !important;
  }

  &:deep(.v-select__selection-text) {
    font-size: 14px;
    line-height: 20px;
    overflow: visible;
  }

  &:deep(.v-input__control) {
    height: 32px;
  }

  &:deep(.v-field__input) > input {
    font-size: 14px;
    line-height: 20px;
  }
}

.select-item {
  &:deep(.v-list-item__content) {
    display: flex;
    justify-content: space-between;
  }

  &:deep(.v-list-item-title) {
    font-size: 14px !important;
    font-weight: 600;
  }
}

.period-select{
  &:deep(.v-field){
    border-color: #e1e1a1;
    background-color: #ededed;
  }
}
</style>
