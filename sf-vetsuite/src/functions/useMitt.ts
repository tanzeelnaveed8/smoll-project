import mitt from 'mitt'

type Events = {
  'inbox-details-drawer:CONNECT': { consultationId: string }
  'inbox-view:CLOSE_DRAWER': void
  'inbox-details-drawer:escalated': { type: 'instant' | 'scheduled' | 'all' }
  'inbox-details-drawer:CASE_CLOSED': { startTime?: string; period?: 'weekly' | 'monthly' }
  'refetch-upcoming-appointment': void
  'refetch-cases': void
}

const emitter = mitt<Events>()

const useMitt = () => {
  return {
    emitter
  }
}

export default useMitt
