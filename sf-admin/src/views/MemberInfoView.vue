<template>
  <v-sheet class="d-flex justify-center w-100" style="height: 100%; justify-content: space-between">
    <template v-if="actionLoading">
      <v-sheet class="d-flex justify-center align-center h-100">
        <v-progress-circular indeterminate color="primary" />
      </v-sheet>
    </template>
    <div v-else class="px-6 py-6 d-flex flex-column gr-6 align-start" style="max-width: 1140px">
      <v-btn variant="plain" color="grey2" prepend-icon="$tb-arrow-left" class="px-0 btn-back" to="/members">
        Back
      </v-btn>
      <v-sheet class="d-flex gc-12 w-100">
        <v-sheet class="d-flex flex-column gr-6 w-100">
          <FormHeader title="Members Information" about=" Edit members and their pets. View detailed profiles, including pet information and
              history. You can also deactivate accounts as needed." />
          <MemberForm :memberDetails />
        </v-sheet>
        <v-sheet class="w-100 d-flex flex-column gr-8">
          <MembersPet :memberDetails="memberDetails!" />
        </v-sheet>
      </v-sheet>
    </div>
  </v-sheet>
</template>

<script lang="ts" setup>
import MemberForm from '@/components/app/members/MemberForm.vue'
import MembersPet from '@/components/app/members/MembersPet.vue'
import FormHeader from '@/components/partials/formUi/FormHeader.vue'
import { useMemberStore } from '@/stores/member'
import type { Member } from '@/stores/types/member'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const memberDetails = ref<Member | null>(null)
const actionLoading = ref(false)
const memberStore = useMemberStore()
const route = useRoute()

const getMemberDetails = async () => {
  try {
    const id = route.params.memberId as string
    actionLoading.value = true
    const data = await memberStore.fetchMembersDetails(id)
    memberDetails.value = data
  } finally {
    actionLoading.value = false
  }
}

onMounted(() => getMemberDetails())
</script>

<style>
.btn-back {
  &:hover {
    color: #222 !important;
  }
}
</style>
