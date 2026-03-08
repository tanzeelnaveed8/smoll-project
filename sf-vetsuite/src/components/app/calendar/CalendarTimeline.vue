<template>
  <div id="visualization" />

  <v-dialog v-model="modal" transition="slide-x-reverse-transition" width="auto" class="dialog">
    <InboxDetailsDrawer
      @close="modal = false"
      :type="'scheduled'"
      :consultation="consultationDetail!"
      :loading
      :period="selectedPeriod"
      :startTime="calendarStartDate"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import { onMounted, watch, computed, ref } from 'vue'

import { useConsultationStore } from '@/stores/consultation'

import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import * as vis from 'vis-timeline/standalone'
import dayjs from 'dayjs'

import { visTimelineGroups } from '@/constant'

import type { Consultation, ConsultationDetail } from '@/stores/types/consultation.d'
import InboxDetailsDrawer from '@/components/drawer/inboxDetailsDrawer/InboxDetailsDrawer.vue'
import utc from 'dayjs/plugin/utc'
import useMitt from '@/functions/useMitt'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'

dayjs.extend(utc)

const { emitter } = useMitt()

const props = defineProps<{
  consultations: Consultation[] | []
}>()

const emit = defineEmits<{
  (event: 'fetchNewConsultations', startTime: string): Promise<any>
  (event: 'setCalendarStartDate', startTime: string): void
}>()

const router = useRouter()

const modal = ref(false)

const consultationId = ref<string | null>(null)
const consultationDetail = ref<ConsultationDetail | null>(null)
const updatedTimlineGroups = computed(() => visTimelineGroups)
const loading = ref(false)

const { fetchConsultationDetails } = useConsultationStore()

const dataListConsultaion = computed(() => {
  return props.consultations?.map((data) => ({
    id: data.id,
    group: dayjs(data?.scheduledAt).format('hA'),
    start: dayjs(data.scheduledAt).local().hour(selectedPeriod.value === 'monthly' ? 12  : 3).format(),
    content: `${data.member.name} ${dayjs(data?.scheduledAt).format('hh:mmA')}`,
    status: data.status
  }))
})

const selectedPeriod = computed(() => {
  return (router.currentRoute.value.query.period as 'monthly' | 'weekly') || 'monthly';
})

const calendarStartDate = ref()

const calenderItemTemp = (item: any) => {
  return `<div>
            <span>${item.content}</span>
         </div>`
}

const loadingTimelineTemplate = () => {
  return `<div><div>`
}

let timeline: vis.Timeline | null = null; // Declare a variable to hold the timeline instance
const groups = new vis.DataSet(updatedTimlineGroups.value)
const items = new vis.DataSet()

const initializeTimeline = (period:'monthly' | 'weekly') => {
  const options = {
    orientation: 'top',
    stack: true,
    horizontalScroll: true,
    verticalScroll: true,
    zoomKey: 'ctrlKey',
    zoomMin: 1000 * 60 * 60 * 24 *  (period === 'monthly' ? 30 : 7),
    zoomMax: 1000 * 60 * 60 * 24 *  (period === 'monthly' ? 30 : 7),
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
    template: function (item: any, element: any, data: any) {
      element.className =
        item.status === 'completed'
          ? element.className + ' appointment-completed'
          : element.className
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
      consultationId.value = item.id
      modal.value = true
    }
  })

  timeline.on(
    'rangechange',
    useDebounceFn(({ start, end }) => {
      emit('setCalendarStartDate', dayjs(start).format('YYYY-MM-DDTHH:mm').split('+')[0] + 'Z')

      const startTimeUtc = dayjs(start).hour(12).format('YYYY-MM-DDTHH:mm').split('+')[0] + 'Z'
      calendarStartDate.value = startTimeUtc
      emit('fetchNewConsultations', startTimeUtc)
    }, 500)
  )

  return timeline
}

watch(
  () => props.consultations,
  (v) => {
    items.clear()
    items.update(dataListConsultaion.value)
  },
  { deep: true }
)

watch(consultationId, async (v) => {
  try {
    if (v) {
      loading.value = true
      const fetchedDetail = await fetchConsultationDetails(`${v}`)
      consultationDetail.value = fetchedDetail
    }
  } finally {
    loading.value = false
    consultationId.value = ''
  }
})

watch(selectedPeriod, () => {
    items.clear()
    items.update(dataListConsultaion.value)
    
    // Reinitialize the timeline only if it exists
    if (timeline) {
        timeline.destroy(); // Destroy the existing timeline instance
    }
    
    timeline = initializeTimeline(selectedPeriod.value as 'monthly' | 'weekly'); // Reinitialize the timeline
})

onMounted(() => {
  initializeTimeline(selectedPeriod.value as 'monthly' | 'weekly')
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

    .vis-foreground {
      left: 20px;
      overflow: visible;
      top: -17px !important;

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
        margin-top: -5px
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
    border-radius: 4px;
    color: #5f440f;
    background-color: #fdf2c4;
    overflow: hidden;
    max-width: 12.5%;
    & .vis-item-content {
      padding-top: 6px;
      padding-bottom: 6px;
      padding-left: 8px;
      padding-right: 12px;
      border-left: 4px solid #e6ac49;
    }

    & .vis-item-content div {
      display: flex;
      text-align: start;
      text-wrap: wrap;
      align-items: start;
    }

    & .vis-item-content span {
      display: flex;
      flex-direction: column;
      line-height: 22px;
      margin-right: 12px;
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

.appointment-completed {
  background-color: #e7e7e7;
  border-color: #999 !important;
  color: #222;
}
</style>

<style lang="scss" scoped>
.dialog:deep(.v-overlay__content) {
  right: 0;
}
</style>
