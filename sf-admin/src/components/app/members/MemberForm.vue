<template>
  <v-sheet class="d-flex flex-column gr-6">
    <v-avatar
      color="#d5d5d5"
      class="text-grey2"
      size="72"
      :image="memberDetails?.profileImg?.url"
      icon="$tb-user"
    />
    <v-sheet class="d-flex flex-column gr-3">
      <v-sheet>
        <p style="font-weight: 600" class="text-body-1">Name</p>
        <v-text-field
          readonly
          :value="memberDetails?.name"
          type="text"
          hide-details="auto"
          class="text-field mt-2 text-grey1"
          placeholder="Name"
        />
      </v-sheet>
      <v-sheet>
        <p style="font-weight: 600" class="text-body-1">Flat/Villa No</p>
        <v-text-field
          readonly
          :value="memberDetails?.villa"
          type="text"
          hide-details="auto"
          class="text-field mt-2 text-grey1"
          placeholder="Address"
        />
      </v-sheet>
      <v-sheet>
        <p style="font-weight: 600" class="text-body-1">Street Address</p>
        <v-text-field
          readonly
          :value="memberDetails?.address"
          type="text"
          hide-details="auto"
          class="text-field mt-2 text-grey1"
          placeholder="Address"
        />
      </v-sheet>
      <v-sheet>
        <p style="font-weight: 600" class="text-body-1">City</p>
        <v-text-field
          readonly
          :value="memberDetails?.city"
          type="text"
          hide-details="auto"
          class="text-field mt-2 text-grey1"
          placeholder="Address"
        />
      </v-sheet>
      <v-sheet>
        <p style="font-weight: 600" class="text-body-1">Country</p>
        <v-text-field
          readonly
          :value="memberDetails?.country"
          type="text"
          hide-details="auto"
          class="text-field mt-2 text-grey1"
          placeholder="Address"
        />
      </v-sheet>
      <v-sheet>
        <p style="font-weight: 600" class="text-body-1">Phone</p>
        <v-text-field
          readonly
          :value="memberDetails?.phone"
          type="text"
          hide-details="auto"
          class="text-field mt-2 text-grey1"
          placeholder="Phone number"
        />
      </v-sheet>

      <v-sheet>
        <p style="font-weight: 600" class="text-body-1">Email address</p>
        <v-text-field
          readonly
          :value="memberDetails?.email"
          type="email"
          hide-details="auto"
          class="text-field mt-2 text-grey1"
          placeholder="Email address"
          append-inner-icon="$tb-mail"
        />
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts" setup>
import type { Member } from '@/stores/types/member'

const props = defineProps<{
  memberDetails: Member | null
}>()
</script>

<style lang="scss" scoped>
.text-field:deep(.v-input__prepend) {
  margin: 0px;
}

.num-prefix-select {
  &:deep(.v-field) {
    border-top-right-radius: 0px;
    border-top-left-radius: 8px !important;

    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 8px !important;

    background-color: white;
  }
  &:deep(.v-field__input) {
    padding-right: 2px !important;
  }
}
.text-field-phone:deep(.v-field) {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}

.dob-select-month:deep(.v-field) {
  border-radius: 0px;
}

.dob-field-year:deep(.v-field) {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}
</style>
