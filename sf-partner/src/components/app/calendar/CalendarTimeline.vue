<template>
  <div id="visualization" />
  <v-dialog v-model="drawer" transition="slide-x-reverse-transition" width="auto" class="dialog">
    <CaseDetailsDrawer
      :caseDetails="caseDetails?.details ?? null"
      :actionLoading="loading"
      @close="drawer = false"
      type="schedule"
      :appointment="{
        id: caseDetails?.appointmentId as string,
        scheduledAt: caseDetails?.scheduledAt as string
      }"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { onMounted, watch, computed, ref } from 'vue'

import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import * as vis from 'vis-timeline/standalone'
import dayjs from 'dayjs'

import { visTimelineGroups } from '@/constant'

import utc from 'dayjs/plugin/utc'
import useMitt from '@/functions/useMitt'
import { useCaseStore } from '@/stores/case'
import type { CaseDetails } from '@/stores/types/case'
import type { Appointment } from '@/stores/appointments'
import CaseDetailsDrawer from '@/components/drawer/caseDetailsDrawer/CaseDetailsDrawer.vue'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import type { Period } from '@/stores/types/global'

dayjs.extend(utc)

const props = defineProps<{
  appointments: Appointment[] | []
}>()

const emit = defineEmits<{
  (event: 'fetchNewConsultations', startTime: string): Promise<any>
  (event: 'setCalendarStartDate', startTime: string): void
}>()

const drawer = ref(false)

const caseId = ref<string | null>(null)
const caseDetails = ref<{
  details: CaseDetails
  scheduledAt: string
  appointmentId: string
} | null>(null)
const updatedTimlineGroups = computed(() => visTimelineGroups)
const loading = ref(false)

const { fetchCaseDetails } = useCaseStore()

const router = useRouter()

const selectedPeriod = computed(()=>router.currentRoute.value.query.period || 'monthly') 

const dataListAppointments = computed(() => {
  return props.appointments?.map((data) => ({
    id: data.id,
    caseId: data.caseId,
    group: dayjs(data?.scheduledAt).format('hA'),
    start: dayjs(data.scheduledAt).local().hour(selectedPeriod.value === 'monthly' ? 12  : 3).format(),
    content: `${data.member} ${dayjs(data?.scheduledAt).format('hh:mmA')}`,
    labelColor:data.labelColor,
    status:dayjs(data.scheduledAt) < dayjs() ? 'completed' : 'pending'
  }))
})

const calenderItemTemp = (item: any) => {
  return ` <div >
            <span>${item.content}</span>
         </div>`
}

const loadingTimelineTemplate = () => {
  return `<div><div>`
}

const groups = new vis.DataSet(updatedTimlineGroups.value)
const items = new vis.DataSet<vis.DataItem>()

let timeline: vis.Timeline | null = null; // Declare a variable to hold the timeline instance

const initializeTimeline = (period:Period) => {
  const options = {
        orientation: 'top',
        stack: true,
        horizontalScroll: true,
        verticalScroll: true,
        zoomKey: 'ctrlKey',
        zoomMin: 1000 * 60 * 60 * 24 * (period === 'monthly' ? 30 : 7),
        zoomMax: 1000 * 60 * 60 * 24 * (period === 'monthly' ? 30 : 7),
        showCurrentTime: false,
        height: '100%',
        start: new Date((period === 'monthly' ? 15 : 3) * (1000 * 3600 * 24) + Date.now()).setHours(14, 0),
        end: new Date(1000 * 60 * 60 * 24 + new Date().valueOf()),
        editable: false,
        timeAxis: { scale: period === 'monthly' ? 'day' : 'weekday', step: 1 },
        type: 'box',
        align: 'left',
        loadingScreenTemplate: function () {
            return loadingTimelineTemplate()
        },
        margin: {
            item: 30,
            axis: 10
        },
        template: function (item: any, element: HTMLElement, data: any) {
            if (item.status === 'pending') {
                element.style.backgroundColor = `#fff`
                element.style.color = '#000'
                element.style.border = '1px solid #c6c6c6'
                element.style.borderLeft = `8px solid ${item.labelColor}`
            }
            return calenderItemTemp(item)
        },
        format: {
            minorLabels: {
                weekday: 'ddd DD'
            }
        }
    }
  const container = document.getElementById('visualization') as HTMLElement
  timeline = new vis.Timeline(container, items, groups, options as vis.TimelineOptions)

  timeline.on('click', function (properties) {
    if (properties.item) {
      const item: any = items.get(properties.item)
      caseId.value = item.caseId
    }
  })

  timeline.on(
    'rangechange',
    useDebounceFn(({ start, end }) => {
      emit('setCalendarStartDate', dayjs(start).format('YYYY-MM-DDTHH:mm').split('+')[0] + 'Z')

      const startTimeUtc = dayjs(start).hour(12).format('YYYY-MM-DDTHH:mm').split('+')[0] + 'Z'
      emit('fetchNewConsultations', startTimeUtc)
    }, 300)
  )

  return timeline
}

watch(
  () => props.appointments,
  (v) => {
    items.clear()
    items.update(dataListAppointments.value)
  },
  { deep: true }
)

watch(selectedPeriod, () => {
    items.clear()
    items.update(dataListAppointments.value)
    
    // Reinitialize the timeline only if it exists
    if (timeline) {
        timeline.destroy(); // Destroy the existing timeline instance
    }
    
    timeline = initializeTimeline(selectedPeriod.value as Period); // Reinitialize the timeline
})

watch(caseId, async (v) => {
  try {
    if (v) {
      loading.value = true
      drawer.value = true
      const appointment = props.appointments.find((item) => item.caseId === v)
      const fetchedDetail = await fetchCaseDetails(`${v}`)
      caseDetails.value = {
        details: fetchedDetail,
        scheduledAt: `${appointment?.scheduledAt}`,
        appointmentId: `${appointment?.id}`
      }
    }
  } finally {
    loading.value = false
    caseId.value = ''
  }
})

onMounted(() => {
  initializeTimeline(selectedPeriod.value as Period)
})
</script>

<style lang="scss">
#visualization {
  width: auto;
  height: 100%;
  max-height: 1550px;
  background-color: #fff;
  color: #d5d5d5;

  .vis-loading-screen {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    & > div {
      width: 32px;
      height: 32px;
      border: 5px solid #e0e0e0;
      border-bottom-color: #427594;
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 0.6s linear infinite;
    }

    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }

  & .vis-timeline {
    border: none;
  }

  //VIS VERTICAL TIME AXIS
  & .vis-time-axis .vis-grid.vis-minor {
    border-color: #dde7ee;
  }
  & .vis-background .vis-minor {
    translate: 0px 10px;
  }

  & .vis-vertical {
    .vis-major {
      translate: 0px 0px !important;
      border-color: #bdc5cbc1;
    }
  }

  //VIS CENTER
  & .vis-center {
    width: 100% !important;
    left: 73px !important;
    top: 53px !important;
    border-color: #dde7ee;

    .vis-foreground .vis-group {
      border-color: #dde7ee;
    }

    .vis-shadow {
      box-shadow: none !important;
    }
  }

  //VIS LEFT
  & .vis-left {
    width: 73px;
    top: 53px !important;
    border-color: #dde7ee !important ;
    &::-webkit-scrollbar {
      display: none !important;
    }

    .vis-labelset {
      overflow: auto;

      & .vis-label {
        color: #78848c;
        font-size: 12px;
        font-weight: 600;
        line-height: 16px;
        text-align: end;
        border-bottom: none !important;

        .vis-inner {
          height: 62px;
          padding-top: 0px !important;
        }
      }
    }
  }

  //VIS TOP
  & .vis-top {
    border: none !important;
    left: 73px !important;
    overflow: hidden;
    top: -17px !important;


    .vis-foreground {
      left: 20px;
      overflow: visible;

      .vis-minor {
        padding: 0px;
        padding-bottom: 8px !important;
        bottom: 0px !important;
        translate: 0px -43px;
        text-align: center;
        font-weight: 600;
        line-height: 20px;
      }

      .vis-major {
        color: #343434 !important;
        font-size: 16px;
        font-weight: 700;
        line-height: 20px;
        padding-top: 20px;
        padding-left: 12px;
        margin-top: -5px;
        // visibility: hidden;
      }
    }
  }

  //VIS TODAY
  & .vis-today {
    color: #10afe1 !important;
  }

  // VIS ITEM
  & .vis-item {
    cursor: pointer;
    border: none;
    background-color: transparent;
    overflow: hidden;
    border-radius: 6px;
    max-width: 12.5%;
    box-shadow: 1px 1px 4px #00000010;


    & .vis-item-content {
    padding: 0px;
    border: 1px solid #999;
    border-radius: inherit;
    color: #222;
    background-color: #e7e7e7;
    border-left-width: 8px;
    }

    & .vis-item-content div {
      // border-radius: 4px;
      padding-top: 4px;
      padding-bottom: 4px;
      padding-left: 8px;
      padding-right: 12px;
      // display: flex;
      // text-align: start;
      // text-wrap: wrap;
      // align-items: start;
    }

    & .vis-item-content span {
      display: flex;
      flex-direction: column;
    }
    & .vis-item-content span span {
      color: #818087;
    }
    & .vis-item-content span p {
      margin: 0px;
      color: #d5d5d5;
    }
  }
}

</style>

<style lang="scss" scoped>
.dialog:deep(.v-overlay__content) {
  right: 0;
}
</style>
