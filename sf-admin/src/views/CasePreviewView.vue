<template>
  <v-sheet class="h-100 w-100">
    <template v-if="actionLoading">
      <v-sheet class="d-flex justify-center align-center h-100">
        <v-progress-circular indeterminate color="primary" />
      </v-sheet>
    </template>
    <div
      v-else
      class="px-6 pt-6 align-start pb-10"
      style="display: grid; grid-template-columns: 60px 1fr"
    >
      <v-btn variant="plain" color="grey2" prepend-icon="$tb-arrow-left" class="px-0" to="/cases">
        Back
      </v-btn>

      <v-sheet max-width="800" class="w-100" style="justify-self: center">
        <v-sheet class="d-flex flex-column gr-3">
          <CaseDetails :caseDetails="caseDetails!" />
          <v-sheet height="504" class="rounded-lg pb-6" style="border: 1px solid #d0d7dc">
            <v-sheet class="px-5" style="padding-top: 15px; border-bottom: 1px solid #d0d7dc">
              <v-tabs v-model="tab" class="tabs text-grey2" height="auto" color="grey1">
                <v-tab
                  v-for="(tab, i) in tabs"
                  :key="i"
                  :value="tab.value"
                  style="line-height: 18px"
                  class="pa-1 pb-2"
                  min-width="auto"
                  height="auto"
                >
                  {{ tab.title }}
                </v-tab>
              </v-tabs>
            </v-sheet>
            <v-sheet>
              <v-tabs-window v-model="tab" class="pt-8">
                <!-- TAB CASE DETAILS -->
                <v-tabs-window-item value="caseBrief" class="px-5">
                  <v-sheet
                    color="#f7f7f7"
                    max-width="760"
                    height="400"
                    class="rounded-lg px-5 py-6 text-grey2"
                    style="border: 1px solid #d0d7dc; font-weight: 500"
                  >
                    {{ caseDetails?.description }}
                  </v-sheet>
                </v-tabs-window-item>

                <!-- TAB CASE INFO -->
                <v-tabs-window-item value="caseInfo" class="px-5">
                  <v-sheet
                    max-width="760"
                    height="400"
                    class="rounded-lg text-grey2 overflow-y-auto custom-scroll"
                  >
                    <div class="d-flex flex-column gr-8">
                      <v-sheet class="d-flex flex-column gr-3">
                        <h5
                          class="text-body-1 font-weight-bold text-uppercase"
                          style="line-height: 24px; color: black"
                        >
                          MEMBER DETAILS
                        </h5>
                        <div style="font-weight: 600; max-width: 400px" class="d-flex justify-space-between">
                          <span class="d-flex gc-2">
                            <v-icon icon="$tb-user-circle" size="24" />
                            <p>{{ caseDetails?.member?.name ?? '-' }}</p>
                          </span>

                          <p>{{ caseDetails?.member.phone ? caseDetails?.member.phone : '-' }}</p>
                        </div>
                      </v-sheet>
                      <v-sheet class="d-flex flex-column gr-3">
                        <h5
                          class="text-body-1 font-weight-bold text-uppercase"
                          style="line-height: 24px; color: black"
                        >
                          ASSIGNED EXPERT
                        </h5>
                        <div style="font-weight: 600; max-width: 400px" class="d-flex justify-space-between">
                          <div class="d-flex gc-2 align-center">
                            <v-icon icon="$tb-user-circle" size="24" />
                            <div class="d-flex flex-column gr-1">
                             <p >{{ caseDetails?.assignedVet?.name ?? '-'}}</p>
                             <p class="text-caption"> {{ caseDetails?.assignedVet.designation ?? '-' }}</p>
                            </div>
                        </div>
                          <p>{{ caseDetails?.assignedVet.phone ?? '-' }}</p>
                        </div>
                      </v-sheet>
                  
                      <v-sheet class="d-flex flex-column gr-3">
                        <h5
                          class="text-body-1 font-weight-bold text-uppercase"
                          style="line-height: 24px; color: black"
                        >
                          EXPERT NOTE
                        </h5>
                        <div style="font-weight: 600; max-width: 400px" class="d-flex justify-space-between">
                          <p>{{ caseDetails?.vetNote ?? '-'}}</p>
                        </div>
                      </v-sheet>
                      <v-divider />
                      <v-sheet class="d-flex flex-column gr-3">
                        <h5
                          class="text-body-1 font-weight-bold text-uppercase"
                          style="line-height: 24px; color: black"
                        >
                          ESCALATION DETAILS
                        </h5>
                        <div style="font-weight: 600; max-width: 700px" class="d-flex justify-space-between flex-wrap">
                          <p class="text-grey2 font-weight-bold">
                            Is Escalated: <span style="color: black">{{caseDetails?.isEscalated ? 'Yes' : 'No' }}</span>
                          </p>
                          <p class="text-grey2 font-weight-bold">
                            Direct Escalation:
                            <span style="color: black">{{  caseDetails?.isDirectEscalated ? 'Yes' : 'No' }}</span>
                          </p>
                          <p class="text-grey2 font-weight-bold">
                           Emergency: <span style="color: black">{{  caseDetails?.isDirectEscalated ? 'Yes' : 'No' }}</span>
                          </p>
                        </div>
                      </v-sheet>

                      <template v-if="caseDetails?.partnerBooking">
                      <v-divider />
                      <v-sheet  class="d-flex flex-column gr-3">
                        <h5
                          class="text-body-1 font-weight-bold text-uppercase"
                          style="line-height: 24px; color: black"
                        >
                          QUOTE SUBMISSION
                        </h5>
                        <div style="font-weight: 600; max-width: 700px" class="d-flex flex-column gr-2">
                          <p v-if="caseDetails?.partnerBooking?.scheduledAt">Submission Date: {{ new Date(caseDetails?.partnerBooking?.scheduledAt).toLocaleDateString('en-IN') }}</p>
                          <div class="d-flex flex-column">
                            <table class="w-100">
                              <thead>
                                <tr>
                                  <th class="text-grey1 font-weight-bold" style="font-size: 18px; text-align: left; font-weight: 600; width: 74%;">Service</th>
                                  <th class="text-grey1 font-weight-bold" style="font-size: 18px; text-align: center; font-weight: 600; width: 16%;">Quantity</th>
                                  <th class="text-grey1 font-weight-bold" style="font-size: 18px; text-align: left; font-weight: 600; width: 10%;">Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="service in caseDetails?.partnerBooking?.services" :key="service.id">
                                  <td class="text-grey1" style="font-size: 16px; font-weight: 600; width: 74%;">
                                    {{ service.name }}
                                  </td>
                                  <td class="text-grey1 text-center" style="font-size: 16px; font-weight: 600; width: 16%;">{{ service.quantity ?? 1 }}</td>
                                  <td class="font-weight-bold text-grey1" style="font-size: 16px; width: 10%;">
                                    {{ service.price + ` AED` }}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </v-sheet>
                    </template>
                    </div>
                  </v-sheet>
                </v-tabs-window-item>

                <!-- TAB SHARED FILES -->
                <v-tabs-window-item value="sharedFiles" class="px-5 text-center">
                  <p v-if="!caseDetails?.pet.photos?.length" class="pt-6 text-grey2">
                    No shared files...
                  </p>
                  <v-sheet v-else class="cases-shared-files">
                    <v-img
                      v-for="(file, i) in caseDetails?.pet.photos"
                      :key="i"
                      :src="file.url"
                      cover
                      color="#F7F7F7"
                      class="rounded"
                    />
                  </v-sheet>
                </v-tabs-window-item>
                <v-tabs-window-item value="sessionRecording" class="px-5 text-center">
                  <p class="mt-4 font-weight-medium">No Video Session found.</p>
                </v-tabs-window-item>
                
              </v-tabs-window>
            </v-sheet>
          </v-sheet>
        </v-sheet>
      </v-sheet>
    </div>
  </v-sheet>
</template>

<script lang="ts" setup>
import CaseDetails from '@/components/app/casePreview/CaseDetails.vue'
import { useCaseStore } from '@/stores/case'
import type { CaseDetail } from '@/stores/types/cases'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const tab = ref('caseBrief')
const route = useRoute()
const caseDetails = ref<CaseDetail | null>()
const actionLoading = ref(false)

const caseStore = useCaseStore()

const tabs = [
  { title: 'Case Brief', value: 'caseBrief' },
  { title: 'Case Info', value: 'caseInfo' },
  { title: 'Shared Files', value: 'sharedFiles' },
  { title: 'Session Recording', value: 'sessionRecording' },
]

const getCaseDetails = async () => {
  try {
    const id = route.params.caseId as string
    actionLoading.value = true
    const data = await caseStore.fetchCaseDetails(id)
    caseDetails.value = data
  } finally {
    actionLoading.value = false
  }
}

onMounted(() => {
  getCaseDetails()
})
</script>

<style scoped lang="scss">
.chip:deep(.v-chip__content) {
  display: block;
}

.tabs:deep(.v-slide-group__content) {
  gap: 16px;
}

.cases-shared-files {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 164px);
  gap: 16px;
}

.custom-scroll{
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background: #e8e8e8;
  }
}
</style>
