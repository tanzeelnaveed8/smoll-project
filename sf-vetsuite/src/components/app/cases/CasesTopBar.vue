<template>
  <v-sheet class="d-flex align-center justify-space-between">
    <v-sheet class="d-flex align-center gc-3">
      <h3 class="page-heading">Case Details</h3>
      <v-text-field
        width="380"
        v-model="search"
        class="text-field text-body-2 rounded-circle"
        style="height: 40px"
        hide-details="auto"
        placeholder="Search by Name"
        color="grey1"
        type="text"
      >
        <template v-slot:prepend-inner> <v-icon icon="$tb-search" size="20" /></template>
      </v-text-field>
      <v-btn
        @click="$emit('refetchCases')"
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
    <v-sheet class="d-flex gc-3 align-center">
      <p style="font-weight: 600; font-size: 14px; line-height: 24px">Showing</p>
      <v-select
        v-model="rows"
        class="text-body-2 select text-grey1"
        density="compact"
        :menu-props="{ offset: '12px' }"
        :list-props="{ style: 'border: 1px solid #D0D7DC' }"
        hide-details="auto"
        placeholder="Rows"
        :items="[
          { title: '10 Rows', value: 10 },
          { title: '15 Rows', value: 15 },
          { title: '20 Rows', value: 20 }
        ]"
      >
        <template #item="{ item, props, index }">
          <v-list-item
            class="px-2 py-2 select-item"
            min-height="auto"
            :value="item"
            activable
            v-bind="props"
            :style="`border-top:${index !== 0 && '1px solid #D0D7DC'}`"
          >
            <v-icon v-if="item.value === rows" icon="$tb-check" size="20" />
          </v-list-item>
        </template>
      </v-select>
    </v-sheet>
  </v-sheet>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{loading:boolean}>()

const router = useRouter()

const search = ref(router.currentRoute.value.query.search)
const rows = ref(Number(router.currentRoute.value.query.rows ?? 10))



watch(
  search,
  useDebounceFn(() => {
    router.push({
      path: 'cases',
      query: { ...router.currentRoute.value.query, search: search.value, page: 1 }
    })
  }, 500)
)

watch(rows, () => {
  router.push({
    path: 'cases',
    query: { ...router.currentRoute.value.query, rows: rows.value, page: 1 }
  })
})
</script>

<style scoped lang="scss">
.page-heading {
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
}

.text-field {
  &:deep(.v-field) {
    height: inherit;
    background-color: #f4f6f8;
    border-radius: 50px;
    border: none !important;
    font-weight: 500;
  }

  &:deep(.v-input__control) {
    height: inherit !important;
  }

  &:deep(.v-field__prepend-inner) {
    height: 40px !important;
    padding: 0px;
    align-items: center !important;
  }

  &:deep(.v-field__field) {
    height: inherit;
  }

  &:deep(.v-field__input) {
    min-height: auto;
    padding-top: 8px;
    padding-left: 8px;
    padding-bottom: 8px;
    font-weight: 600;

    &::placeholder {
      color: #222 !important;
      font-weight: 600;
    }
  }
}

.select {
  &:deep(.v-field) {
    background-color: #ededed70;
    border-color: #e1e1e2;
    color: #222;
    padding-right: 8px;
  }
  &:deep(.v-field__input) {
    padding: 4px 0px 4px 8px !important;
  }

  &:deep(.v-select__selection-text) {
    font-size: 14px;
    line-height: 20px;
    overflow: visible;
    font-weight: 600;
  }

  &:deep(.v-input__control) {
    height: 32px;
  }

  &:deep(.v-field__input) > input {
    font-size: 14px;
    line-height: 20px;
  }

  &:deep(.v-field__append-inner) {
    padding-top: 4px;
  }

  &:deep(.v-icon) {
    margin: 0px;
  }

  &:deep(.icon) {
    height: 18px;
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
</style>
